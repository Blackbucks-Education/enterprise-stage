"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Table from "../../components/white-table";
import "../../public/css/shimmer.css"; // Import the shimmer CSS
import ButtonGroup from "../../components/ui/buttons_filter";
import CustomSlider from "../../components/ui/range-slider";
import FetchableCheckboxGroup from "../../components/ui/checkbox-filter";
import { fetchFilterOptions, fetchDataAndPopulateTable } from "../services/assessmentSResultsApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { utils, writeFile } from "xlsx"; // Import xlsx functions
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */
import "../../app/employabilityStudentsResults/studentResults.css";
import "../../public/css/emp_students_results.css";

const StudentResults = () => {
  const [hackathonId, setHackathonId] = useState(null); // State for hackathon ID
  const [hackathonTitle, setHackathonTitle] = useState("Loading..."); // State for hackathon title

  const [filterOptions, setFilterOptions] = useState({
    degrees: [],
    branches: [],
    years: [],
    employabilityBands: [],
    bestEmployabilityBands: [],
  });

  const [selectedFilters, setSelectedFilters] = useState({
    degree: [],
    branch: [],
    year: [],
    empBand: [],
    empBestBand: [],
    tenthPercentage: 0,
    twelfthPercentage: 0,
    gradPercentage: 0,
  });

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  
  // Fetch hackathon title based on the URL ID
  useEffect(() => {
    const fetchHackathonTitle = async () => {
      try {
        const id = getHackathonIdFromUrl(); // Get hackathon ID from URL
        setHackathonId(id); // Set hackathon ID to state

        if (id) {
          const response = await fetch(`/api/employability_assessments/hackathon/${id}`);
          const data = await response.json();
          if (response.ok) {
            setHackathonTitle(data.title || "Hackathon Title Not Found");
          } else {
            setHackathonTitle("Failed to load hackathon title");
          }
        } else {
          setHackathonTitle("Hackathon ID not found in URL");
        }
      } catch (error) {
        setHackathonTitle("Error loading hackathon title");
      }
    };

    fetchHackathonTitle();
  }, []);

  // Fetch filter options on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = getHackathonIdFromUrl(); // Get hackathon ID from URL
        setHackathonId(id); // Set hackathon ID to state

        if (id) {
          const filterOptionsResponse = await fetchFilterOptions(id); // Pass hackathonId
          setFilterOptions(filterOptionsResponse);
          await handleFetchData(id); // Initial data fetch
        } else {
          console.error("Hackathon ID not found in the URL");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  // Fetch table data whenever selectedFilters change
  useEffect(() => {
    if (hackathonId) {
      handleFetchData(hackathonId);
    }
  }, [selectedFilters, hackathonId]); // Include hackathonId in dependencies

  const handleFetchData = async (hackathonId) => {
    setLoading(true);
    try {
      const queryParams = getQueryParams();
      const data = await fetchDataAndPopulateTable(hackathonId, queryParams); // Pass hackathonId
      setTableData(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getQueryParams = () => {
    const params = new URLSearchParams();

    Object.keys(selectedFilters).forEach((key) => {
      const value = selectedFilters[key];

      if (Array.isArray(value) && value.length > 0) {
        const filteredValues = value.filter(v => v); // Removes null or undefined
        if (filteredValues.length > 0) {
          params.append(key, filteredValues.join(","));
        }
      } else if (typeof value === 'number' && value > 0) {
        params.append(key, value);
      } else if (typeof value === 'string' && value) {
        params.append(key, value);
      }
    });

    return `?${params.toString()}`;
  };

  const handleFilterChange = (selectedOptions, name) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev, [name]: selectedOptions };
      return updatedFilters;
    });
  };

  // Handle changes for employability band filtering
  const handleEmployabilityBandChange = (value, checked) => {
    setSelectedFilters((prev) => {
      const newValues = checked
        ? [...prev.empBand, value]
        : prev.empBand.filter((item) => item !== value);
      return { ...prev, empBand: newValues };
    });
  };

  // Handle changes for best employability band filtering
  const handleBestEmployabilityBandChange = (value, checked) => {
    setSelectedFilters((prev) => {
      const newValues = checked
        ? [...prev.empBestBand, value]
        : prev.empBestBand.filter((item) => item !== value);
      return { ...prev, empBestBand: newValues };
    });
  };

  const handleSliderChange = (event) => {
    const { name, value } = event.target;
    setSelectedFilters((prev) => ({
      ...prev,
      [name === "10th" ? "tenthPercentage" : name === "12th" ? "twelfthPercentage" : "gradPercentage"]: value
    }));
  };

  const getHackathonIdFromUrl = () => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("id"); // Retrieve 'id' from URL params
    }
    return null;
  };

  const downloadTableAsExcel = () => {
    // Convert table data into worksheet format
    const ws = utils.json_to_sheet(tableData);

    // Create a new workbook and add the worksheet
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "StudentResults");

    // Trigger download of the Excel file
    writeFile(wb, "StudentResults.xlsx");
  };

  return (
    <div className="css1">
      <div className="main-container">
        <div className="roww marginr">
          <img
            src="/img/empgrey.png"
            alt="internship icon"
            style={{ width: "12px", height: "12px", marginRight: "5px" }}
          />
          <Link
            href="/employabilityReport"
            style={{ textDecoration: "none", display: "flex", alignItems: "center" }}
          >
            <p className="grey f14 marginr">Employability Dashboard</p>
            <FontAwesomeIcon icon={faChevronRight} className="f10 grey marginr" />
          </Link>
          <Link
            href="/assessmentDashboard"
            style={{ textDecoration: "none", display: "flex", alignItems: "center" }}
          >
            <p className="grey f14 marginr">Employability Assessments</p>
            <FontAwesomeIcon icon={faChevronRight} className="f10 grey marginr" />
          </Link>
          <Link href={`/assessmentReport?id=${hackathonId}`} id="domain-link" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <p className="grey f14 marginr" id="domain-title">{hackathonTitle}</p>
            <FontAwesomeIcon icon={faChevronRight} className="f10 grey" />
          </Link>

          <p className="f14" style={{ margin: "10px" }}>Student Results</p>
        </div>
        <div className="usercontainer">
          <div className="usercard">
            <div className="usercard-header">
              <h2 className="f600 f20">Filters</h2>
              <button className="custom-button" onClick={downloadTableAsExcel} type="button">
                <span className="button__text">Download</span>
              </button>
            </div>

            <p className="f500 f16 margin">EDUCATIONAL DETAILS</p>
            <div className="userinnercard">
              <div className="frame">
                <div className="left-frame">
                  <form>
                    <div className="educationDetails">
                      <CustomSlider
                        name="10th"
                        value={selectedFilters.tenthPercentage}
                        handleSliderChange={handleSliderChange}
                      />
                      <div className="hr"  style={{ padding: "4px" }}></div>
                      <CustomSlider
                        name="12th"
                        value={selectedFilters.twelfthPercentage}
                        handleSliderChange={handleSliderChange}
                      />

                      <div className="hr"  style={{ padding: "4px" }}></div>
                      <CustomSlider
                        name="Graduation"
                        value={selectedFilters.gradPercentage}
                        handleSliderChange={handleSliderChange}
                        style={{ paddingTop: "2px" }}
                      />

                      <div className="hr"></div>
                      <p className="f550">DEGREE</p>
                      <ButtonGroup
                        options={filterOptions.degrees.filter(degree => degree)} // Filter out null values
                        name="degree"
                        handleChange={handleFilterChange}
                      />
                      <div className="hr"></div>
                      <p className="f550">BRANCH</p>
                      <ButtonGroup
                        options={filterOptions.branches.filter(branch => branch)} // Filter out null values
                        name="branch"
                        handleChange={handleFilterChange}
                      />
                      <div className="hr"></div>
                      <p className="f550">YEAR OF PASSING</p>
                      <ButtonGroup
                        options={filterOptions.years.filter(year => year)} // Filter out null values
                        name="year"
                        handleChange={handleFilterChange}
                      />
                    </div>
                  </form>

                  <p className="f500 f16 margin">EMPLOYABILITY SECTION</p>
                  <form>
                    <div className="employabilityDetails">
                      <FetchableCheckboxGroup
                        title="Employability Bands"
                        name="empBand"
                        apiEndpoint={`/api/assessment_student_results/filters/employabilityBands/${hackathonId}`} // Pass hackathonId
                        selectedFilters={selectedFilters.empBand}
                        onFilterChange={handleEmployabilityBandChange}
                      />

                      <div className="hr"></div>
                      <FetchableCheckboxGroup
                        title="Best Employability Bands"
                        name="empBestBand"
                        apiEndpoint={`/api/assessment_student_results/filters/possibleEmployabilityBands/${hackathonId}`} // Pass hackathonId
                        options={filterOptions.bestEmployabilityBands.filter(band => band)} // Filter out null values
                        selectedFilters={selectedFilters.empBestBand}
                        onFilterChange={handleBestEmployabilityBandChange}
                      />
                    </div>
                  </form>
                </div>
                <div className="right-frame">
                  <div className="table-container">
                    {loading ? (
                      // Shimmer UI to show while loading
                      <table className="shimmer-table">
                        <thead>
                          <tr>
                            {Array.from({ length: 5 }).map((_, index) => (
                              <th key={index}>
                                <div className="shimmer-wrapper">
                                  <div className="shimmer" />
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from({ length: 20 }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                              {Array.from({ length: 20 }).map((_, colIndex) => (
                                <td key={colIndex}>
                                  <div className="shimmer-wrapper">
                                    <div className="shimmer" />
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      // Display the table when data is loaded
                      <Table tableData={tableData} loading={loading} />
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResults;
