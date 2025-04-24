"use client";
import React, { useEffect, useState } from "react";
import Skeleton from "./ShimmerTable"; // Import Skeleton

const FilterTable = () => {
  const [filters, setFilters] = useState({
    degrees: [],
    branches: [],
    years: [],
  });

  const [selectedFilters, setSelectedFilters] = useState({
    degree: [],
    branch: [],
    year: [],
  });

  const [empBandCounts, setEmpBandCounts] = useState({});
  const [bestBandCounts, setBestBandCounts] = useState({});
  const [showMoreDegrees, setShowMoreDegrees] = useState(false);
  const [showMoreBranches, setShowMoreBranches] = useState(false);
  const [showMoreYears, setShowMoreYears] = useState(false);
  const [loading, setLoading] = useState(true); // State to track loading

  const defaultEmployabilityData = {
    emp_band_counts: {},
    best_band_counts: {},
    filters: {
      degrees: ["B.Tech", "M.Tech"],
      branches: ["CSE", "ECE"],
      years: ["2021", "2022"],
    },
  };

  // Fetch the initial data
  const fetchData = async () => {
    try {
      setLoading(true); // Start loading
      const response = await fetch("/api/emp_band_filters/emp_band_data");
      const data = await response.json();

      if (data.length === 0) {
        setEmpBandCounts(defaultEmployabilityData.emp_band_counts);
        setBestBandCounts(defaultEmployabilityData.best_band_counts);
        setFilters(defaultEmployabilityData.filters);
      } else {
        setFilters(data.filters);
        updateData();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setEmpBandCounts(defaultEmployabilityData.emp_band_counts);
      setBestBandCounts(defaultEmployabilityData.best_band_counts);
      setFilters(defaultEmployabilityData.filters);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Update data based on selected filters
  const updateData = async () => {
    const { degree, branch, year } = selectedFilters;

    try {
      setLoading(true); // Start loading
      const response = await fetch(
        `/api/emp_band_filters/emp_band_data?degree=${degree.join(
          ","
        )}&branch=${branch.join(",")}&year=${year.join(",")}`
      );

      const data = await response.json();
      setEmpBandCounts(data.emp_band_counts);
      setBestBandCounts(data.best_band_counts);
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Handle checkbox changes and update selected filters state
  const handleCheckboxChange = (filterName, value) => {
    setSelectedFilters((prevFilters) => {
      const updatedValues = prevFilters[filterName].includes(value)
        ? prevFilters[filterName].filter((item) => item !== value)
        : [...prevFilters[filterName], value];

      return { ...prevFilters, [filterName]: updatedValues };
    });
  };

  // Render filter options
  const renderFilterOptions = (filter = [], type, showMore) => {
    const filteredOptions = filter.filter(Boolean); // Filter out null/undefined/empty values

    return filteredOptions.map((option, index) => (
      <div
        key={option}
        className={`checkbox-item ${index >= 2 && !showMore ? "notshow" : ""}`}
      >
        <input
          type="checkbox"
          value={option}
          name={`${type}-filter`}
          id={`${type}-${option}`}
          onChange={() => handleCheckboxChange(type, option)}
        />
        <label htmlFor={`${type}-${option}`}>{option}</label>
      </div>
    ));
  };

  // Update table rows
  const updateTable = () => {
    const bandGrades = ["A++", "A+", "A", "B", "C", "F"];
    const lpaRange = [
      "12+ Lpa",
      "9-12 Lpa",
      "7-9 Lpa",
      "5-7 Lpa",
      "3-5 Lpa",
      "<3 Lpa",
    ];
    const suggestiveTrainings = [
      "MERN Stack and Data Structures and Algorithms",
      "Full Stack Development Using Python and DSA",
      "Data Structures and Algorithms",
      "Python and SQL",
      "Power BI / Tableau / CRM",
      "Power BI / Tableau / CRM",
    ];

    return Object.keys(empBandCounts).map((band, index) => (
      <tr key={band}>
        <td style={{ fontWeight: "bold" }}>{bandGrades[index] || band}</td>
        <td>{empBandCounts[band]}</td>
        <td>{bestBandCounts[band]}</td>
        <td>{lpaRange[index]}</td>
        <td>{suggestiveTrainings[index]}</td>
      </tr>
    ));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (
      selectedFilters.degree.length ||
      selectedFilters.branch.length ||
      selectedFilters.year.length
    ) {
      updateData();
    }
  }, [selectedFilters]);

  return (
    <div className="section3_3">
      <div className="section3_3_1">
        <div className="section3_3_1_degree">
          <h3>DEGREE</h3>
          <div className="checkbox-container">
            <div id="degree-filter">
              {renderFilterOptions(filters.degrees, "degree", showMoreDegrees)}
            </div>
            <span
              className="show-more"
              onClick={() => setShowMoreDegrees(!showMoreDegrees)}
            >
              {showMoreDegrees ? "Show Less" : "Show More"}
            </span>
          </div>
        </div>

        <div className="section3_3_1_branch">
          <h3>BRANCH</h3>
          <div className="checkbox-container">
            <div id="branch-filter">
              {renderFilterOptions(filters.branches, "branch", showMoreBranches)}
            </div>
            <span
              className="show-more"
              onClick={() => setShowMoreBranches(!showMoreBranches)}
            >
              {showMoreBranches ? "Show Less" : "Show More"}
            </span>
          </div>
        </div>

        <div className="section3_3_1_year">
          <h3>YEAR</h3>
          <div className="checkbox-container">
            <div id="year-filter">
              {renderFilterOptions(filters.years, "year", showMoreYears)}
            </div>
            <span
              className="show-more"
              onClick={() => setShowMoreYears(!showMoreYears)}
            >
              {showMoreYears ? "Show Less" : "Show More"}
            </span>
          </div>
        </div>
      </div>

      <div className="section3_3_2">
        {loading ? ( // Show skeleton table when loading
          <Skeleton count={5} height={30} rows='5' cols='5' /> // Skeleton for the table rows
        ) : (
          <table className="custom-table" id="data-table">
            <thead>
              <tr>
                <th>Band</th>
                <th>Employability Count</th>
                <th>Best Possible Count</th>
                <th>Band Description</th>
                <th>Suggestive Trainings</th>
              </tr>
            </thead>
            <tbody>{updateTable()}</tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FilterTable;
