"use client";

import React, { useState, useEffect } from "react";

const InternshipDomainSummary = () => {
  const [tableData, setTableData] = useState([]);
  const [noDataMessage, setNoDataMessage] = useState(false);
  const [internshipId, setInternshipId] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Get internship ID from URL parameters after component mounts
    const id = new URLSearchParams(window.location.search).get("id");
    setInternshipId(id);
  }, []);

  useEffect(() => {
    if (internshipId) {
      // Fetch the data when the component mounts
      fetch(`/api/internship_overview/table_details/${internshipId}`)
        .then((response) => response.json())
        .then((data) => {
          setLoading(false); // Set loading to false once data is fetched
          if (data.length === 0) {
            setNoDataMessage(true);
          } else {
            setTableData(data);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching details:", error);
        });
    }
  }, [internshipId]);

  const previousHeaders = [
    { text: "Live Session Conducted", field: "live_session_count", background: "rgba(255, 145, 77, 0.5)" },
    { text: "Assessment Conducted", field: "assessment_count", background: "rgba(255, 145, 77, 0.5)" },
    { text: "Daily Tests", field: "daily_tests", background: "rgba(0, 182, 155, 0.3)" },
    { text: "Grand Tests", field: "grand_tests", background: "rgba(0, 182, 155, 0.3)" },
    { text: "Employability Tests", field: "mets", background: "rgba(0, 182, 155, 0.3)" },
    { text: "Assignments", field: "assignments", background: "rgba(48, 148, 240, 0.4)" },
  ];

  // Inline styles for shimmer effect
  const shimmerAnimation = {
    animation: "shimmer 1.5s infinite linear",
    background: "linear-gradient(to right, #f6f7f8 0%, #e0e0e0 20%, #f6f7f8 40%, #f6f7f8 100%)",
    backgroundSize: "1000px 100%",
  };

  const shimmerKeyframes = `@keyframes shimmer {
    0% { background-position: -100px 0; }
    100% { background-position: 100px 0; }
  }`;

  const shimmerStyle = {
    height: "20px",
    background: "#f6f7f8",
    borderRadius: "4px",
    margin: "10px 0",
    ...shimmerAnimation,
  };

  const shimmerHeaderStyle = {
    ...shimmerStyle,
    width: "100px",
    margin: "0 auto",
  };

  const shimmerTextStyle = {
    ...shimmerStyle,
    width: "150px",
    margin: "0 auto",
  };

  // Shimmer component for placeholder rows
  const ShimmerRow = () => (
    <tr>
      <td>
        <div style={shimmerTextStyle}></div>
      </td>
      {[1, 2, 3, 4].map((_, index) => (
        <td key={index}>
          <div style={shimmerStyle}></div>
        </td>
      ))}
    </tr>
  );

  if (noDataMessage) {
    return (
      <div
        style={{
          border: "1px solid black",
          borderRadius: "10px",
          padding: "20px",
          textAlign: "center",
          margin: "20px",
        }}
      >
        No data available
      </div>
    );
  }

  return (
    <div className="section3">
      {/* Injecting the shimmer keyframes directly into the page */}
      <style>{shimmerKeyframes}</style>

      {!loading && (
        <h2 className="f16 font600" style={{ marginBottom: "20px" }}>
          Internship Domain Wise Summary
        </h2>
      )}

      <table id="table-details">
        <thead>
          <tr>
            <th></th>
            {loading
              ? [1, 2, 3, 4].map((_, index) => (
                  <th key={index}>
                    <div style={shimmerHeaderStyle}></div>
                  </th>
                ))
              : tableData.map((row) => <th key={row.id}>{row.title}</th>)}
          </tr>
        </thead>
        <tbody>
          {loading
            ? previousHeaders.map((_, index) => <ShimmerRow key={index} />)
            : previousHeaders.map((header, index) => (
                <tr key={index}>
                  <td>
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        background: `${header.background}`,
                        padding: "5px 10px",
                        borderRadius: "5px",
                      }}
                    >
                      {header.text}
                    </span>
                  </td>
                  {tableData.map((row) => (
                    <td key={row.id}>{row[header.field]}</td>
                  ))}
                </tr>
              ))}
          {!loading && (
            <tr>
              <td></td>
              {tableData.map((row, index) => (
                <td key={index}>
                  <button
                    onClick={() =>
                      (window.location.href = `internshipDomainReport?domain_id=${row.id}`)
                    }
                  >
                    View Report
                  </button>
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InternshipDomainSummary;
