"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Table from "../../components/white-table";
import "../../public/css/shimmer.css"; // Import the shimmer CSS
import ButtonGroup from "../../components/ui/buttons_filter";
import CustomSlider from "../../components/ui/range-slider";
import FetchableCheckboxGroup from "../../components/ui/checkbox-filter";
import { fetchFilterOptions, fetchDataAndPopulateTable } from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { utils, writeFile } from "xlsx"; // Import xlsx functions
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */
import "./studentResults.css";
import "../../public/css/emp_students_results.css";

const StudentResults = () => {
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

  // Fetch filter options on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const filterOptionsResponse = await fetchFilterOptions();
        setFilterOptions(filterOptionsResponse);
        await handleFetchData(); // Initial data fetch
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  // Fetch table data whenever selectedFilters change
  useEffect(() => {
    handleFetchData();
  }, [selectedFilters]);

  const handleFetchData = async () => {
    setLoading(true);
    try {
      const queryParams = getQueryParams();
      console.log("Query Params:", queryParams); // Debugging log
      const data = await fetchDataAndPopulateTable(queryParams);
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
      console.log("Selected Filters Updated:", updatedFilters); // Log the updated filters
      return updatedFilters;
    });
  };
  

  const handleEmployabilityBandChange = (value, checked) => {
    setSelectedFilters((prev) => {
      const newValues = checked
        ? [...prev.empBand, value]
        : prev.empBand.filter((item) => item !== value);
      const updatedFilters = { ...prev, empBand: newValues };
      console.log("Selected Employability Bands Updated:", updatedFilters); // Log the updated filters
      return updatedFilters;
    });
  };


  const handleBestEmployabilityBandChange = (value, checked) => {
    setSelectedFilters((prev) => {
      const newValues = checked
        ? [...prev.empBestBand, value]
        : prev.empBestBand.filter((item) => item !== value);
      const updatedFilters = { ...prev, empBestBand: newValues };
      console.log("Selected Best Employability Bands Updated:", updatedFilters); // Log the updated filters
      return updatedFilters;
    });
  };


  const handleSliderChange = (event) => {
    const { name, value } = event.target;
    setSelectedFilters((prev) => ({
      ...prev,
      [name === "10th" ? "tenthPercentage" : name === "12th" ? "twelfthPercentage" : "gradPercentage"]: value
    }));
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
<div className="hr"></div>
<CustomSlider
  name="12th"
  value={selectedFilters.twelfthPercentage}
  handleSliderChange={handleSliderChange}
/>
<div className="hr"></div>
<CustomSlider
  name="Graduation"
  value={selectedFilters.gradPercentage}
  handleSliderChange={handleSliderChange}
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
                        apiEndpoint="/api/emp_results_with_filters/filters/employabilityBands"
                        selectedFilters={selectedFilters.empBand}
                        onFilterChange={handleEmployabilityBandChange}
                      />
                      <div className="hr"></div>
                      <FetchableCheckboxGroup
                        title="Best Employability Bands"
                        name="empBestBand"
                        apiEndpoint="/api/emp_results_with_filters/filters/possibleEmployabilityBands"
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
