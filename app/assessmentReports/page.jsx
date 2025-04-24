"use client";
import React, { useState, useEffect } from "react";
import styles from "./AssessmentDashboard.module.css"; // Assuming you're using CSS Modules
import '@fortawesome/fontawesome-free/css/all.css';

const defaultAssessmentReport = [
  {
    id: 163,
    title: "Profiling Test - Blackbucks Group",
    count: "502",
    start_date: "2021-09-10T18:30:00.000Z",
    end_date: "2023-11-29T18:30:00.000Z",
    average_emp_score: "23",
  },
  {
    id: 341,
    title: "APSCHE - Profiling Test - B.Tech - 3rd Years",
    count: "76",
    start_date: "2023-01-30T18:30:00.000Z",
    end_date: "2026-07-28T18:30:00.000Z",
    average_emp_score: "22",
  },
  // Other entries...
];

const EmployabilityDashboard = () => {
  const [internshipsData, setInternshipsData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "title", direction: "asc" });

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const response = await fetch("api/employability_assessments/");
      const data = await response.json();
      setInternshipsData(data.length ? data : defaultAssessmentReport);
    } catch (error) {
      console.error("Error fetching internships:", error);
      setInternshipsData(defaultAssessmentReport);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format the date in dd/mm/yyyy format
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(new Date(dateString));
  };

  // Sorting logic
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const sortedData = [...internshipsData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Filter data based on the search input
  const filteredData = sortedData.filter((item) =>
    item.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="css1">
      <div className="container">
        <div className={styles.mainContainer}>
          <div className={`${styles.roww} ${styles.marginr}`} style={{ margin: "20px" }}>
            <img
              src="img/empgrey.png"
              alt="internship icon"
              style={{ width: "14px", height: "14px", marginRight: "5px" }}
            />
            <a href="employabilityReport" style={{ textDecoration: "none" }}>
              <p className={`${styles.grey} ${styles.f14} ${styles.marginr}`}>
                Employability Dashboard{" "}
                <i className="fa-solid fa-chevron-right f10 marginl grey"></i>
              </p>
            </a>
            <a href="assessmentDashboard" style={{ textDecoration: "none" }}>
              <p className={styles.f14}>Employability Assessments</p>
            </a>
          </div>

          <div className={styles.searchContainer}>
            <div className={styles.searchBarWrapper} id="searchInput1">
              <i className={`fas fa-search ${styles.searchIcon}`}></i>
              <input
                type="text"
                id="searchInput"
                placeholder="Search"
                onChange={(e) => setSearchInput(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.container} id="tabledata">
            {loading ? (
              <div className={styles.shimmerContainer}>
                {[...Array(5)].map((_, index) => (
                  <div key={index} className={styles.shimmerRow}>
                    <div className={styles.shimmerCell}></div>
                    <div className={styles.shimmerCell}></div>
                    <div className={styles.shimmerCell}></div>
                    <div className={styles.shimmerCell}></div>
                    <div className={styles.shimmerCell}></div>
                    <div className={styles.shimmerCell}></div>
                  </div>
                ))}
              </div>
            ) : (
              <table className={styles.table}>
                <thead className={styles.tableHead}>
                  <tr>
                    <th className={styles.tableHeader}></th>
                    <th className={`${styles.leftAlign} ${styles.tableHeader}`}>
                      Assessment Title{" "}
                      
                      <span onClick={() => handleSort("title")} style={{ cursor: "pointer"}}>
                        <i className="fas fa-chevron-up" style={{ opacity: sortConfig.key === "title" && sortConfig.direction === "asc" ? 1 : 0.5 }}></i>
                        <i className="fas fa-chevron-down" style={{ opacity: sortConfig.key === "title" && sortConfig.direction === "desc" ? 1 : 0.5 }}></i>
                      </span>
                    </th>
                    <th className={`${styles.centerAlign} ${styles.tableHeader}`}>
                      Test Takers Count{" "}
                      <span onClick={() => handleSort("count")} style={{ cursor: "pointer" }}>
                        <i className="fas fa-chevron-up" style={{ opacity: sortConfig.key === "count" && sortConfig.direction === "asc" ? 1 : 0.5 }}></i>
                        <i className="fas fa-chevron-down" style={{ opacity: sortConfig.key === "count" && sortConfig.direction === "desc" ? 1 : 0.5 }}></i>
                      </span>
                    </th>
                    <th className={`${styles.centerAlign} ${styles.tableHeader}`}>
                      Start Date
                    </th>
                    <th className={`${styles.centerAlign} ${styles.tableHeader}`}>
                      End Date
                    </th>
                    <th className={`${styles.centerAlign} ${styles.tableHeader}`}>
                      Average Employability Score{" "}
                      <span onClick={() => handleSort("average_emp_score")} style={{ cursor: "pointer" }}>
                        <i className="fas fa-chevron-up" style={{ opacity: sortConfig.key === "average_emp_score" && sortConfig.direction === "asc" ? 1 : 0.5 }}></i>
                        <i className="fas fa-chevron-down" style={{ opacity: sortConfig.key === "average_emp_score" && sortConfig.direction === "desc" ? 1 : 0.5 }}></i>
                      </span>
                    </th>
                    <th className={`${styles.centerAlign} ${styles.tableHeader}`}>
                      Report Link
                    </th>
                  </tr>
                </thead>

                <tbody id="tableBody">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No Assessments Available
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((internship) => (
                      <tr key={internship.id} className={styles.tableRow}>
                        <td className={`${styles.leftAlign} ${styles.tableCell}`}>
                          <span className={styles.circle}></span>
                        </td>
                        <td className={`${styles.leftAlign} ${styles.tableCell}`}>
                          {internship.title}
                        </td>
                        <td className={`${styles.centerAlign} ${styles.tableCell}`}>
                          {internship.count}
                        </td>
                        <td className={`${styles.centerAlign} ${styles.tableCell}`}>
                          {formatDate(internship.start_date)}
                        </td>
                        <td className={`${styles.centerAlign} ${styles.tableCell}`}>
                          {formatDate(internship.end_date)}
                        </td>
                        <td className={`${styles.centerAlign} ${styles.tableCell}`}>
                          {internship.average_emp_score}%
                        </td>
                        <td className={`${styles.centerAlign} ${styles.tableCell}`}>
                          <a href={`assessmentReport?id=${internship.id}`} className={styles.view}>
                            View Report
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployabilityDashboard;
