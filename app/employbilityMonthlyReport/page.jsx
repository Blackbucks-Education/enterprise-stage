"use client"; // This is important for client components
import React, { Suspense, useEffect, useState } from "react";
import Loading from "./loading"; // Import your loading component
import "./monthreport.css";
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'; // Import individual icons
import ShimmerTable from "../../components/ui/shimmerTable";


const MonthlyReport = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state


  const defaultMonthlyReport = [
    // Default data structure goes here
  ];
 
    useEffect(() => {
      fetch("/api/emp_monthly_report/month_wise_progress")
        .then((response) => response.json())
        .then((data) => {
          if (data.length === 0) {
            handleDisplayData(defaultMonthlyReport); // Use default data if none is fetched
          } else {
            handleDisplayData(data); // Use the fetched data
          }
          setLoading(false); // Set loading to false when data is fetched
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setError("Error fetching data");
          handleDisplayData(defaultMonthlyReport);
          setLoading(false); // Set loading to false on error
        });
    }, []);

  const handleDisplayData = (reportData) => {
    const headers = Object.keys(reportData[0]);
    const transposedData = headers.map((header) => [
      header,
      ...reportData.map((row) => row[header]),
    ]);
    setData(transposedData);
  };

  if (error) return <div>{error}</div>;

  const hardcodedFirstColumn = [
    "Student Count",
    "Average Employability Scores",
    "Average Aptitude Scores",
    "Average English Scores",
    "Average Coding Scores",
    "Band A Count",
    "Band B Count",
    "Band C Count",
    "Band D Count",
    "Band F Count",
  ];

  return (
  
       <div className="css1">
      <div className="main-container">
        <div className="roww marginr">
          <img
            src="img/empgrey.png"
            alt="internship icon"
            style={{ width: "14px", height: "14px", marginRight: "5px" }}
          />
          <a href="/employabilityReport" style={{ textDecoration: "none", display:"flex" , alignItems:'center' }}>
            <p className="grey f14 marginr">
              Employability Dashboard
            </p>
            <FontAwesomeIcon
                   icon={faChevronRight}
                     style={{ fontSize: '14px' }}  // Set a proper size
                      className="f10 marginr grey"
                       size="sm"
                    />

          </a>
          <p className="f14">Monthly Report</p>
        </div>

        <div className="section3">
          <h2 className="f16 font600">Month Wise Summary</h2>
          {loading ? (
            <ShimmerTable rows={10} columns={data[0]?.length || 6} />
          ) : (
          <Suspense fallback={<Loading />}>
          <div className="monthlyReportTable">
          <table>
            <thead>
              <tr>
                <th></th>
                {data[0] && data[0].slice(1).map((header, idx) => (
                  <th key={idx}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>
                    <span
                      className={
                        rowIndex % 3 === 0
                          ? "table-orange"
                          : rowIndex % 3 === 1
                          ? "table-blue"
                          : "table-green"
                      }
                    >
                      {hardcodedFirstColumn[rowIndex]}
                    </span>
                  </td>
                  {row.slice(1).map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          </Suspense>
          )}
        </div>
      </div>
    </div>

   
  );
};

export default MonthlyReport;
