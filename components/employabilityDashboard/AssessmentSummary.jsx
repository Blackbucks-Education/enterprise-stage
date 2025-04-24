"use client";

import React, { useState, useEffect } from "react";
import AssessmentSummaryLeftSection from "./AssessmentSummaryLeftSection";
import AssessmentSummaryRightSection from "./AssessmentSummaryRightSection";
import FilterTable from "./FilterTable";

// Shimmer component to simulate loading placeholders
const Shimmer = ({ width, height }) => (
  <div
    style={{
      width: width || "100%",
      height: height || "20px",
      background: "#f6f7f8",
      position: "relative",
      overflow: "hidden",
      marginBottom: "10px",
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundImage:
          "linear-gradient(90deg, #f6f7f8 25%, #edeef1 50%, #f6f7f8 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
  </div>
);

const AssessmentSummary = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating loading time (2 seconds)
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        className="assessment-summary-bg-cont"
        style={{
          border: "1px solid rgb(0, 0, 0, 0.2)",
          padding: "20px",
          position: "relative",
        }}
      >
        {/* Entire shimmer UI */}
        {loading ? (
          <>
            {/* Shimmer for the header */}
            <Shimmer width="50%" height="30px" />
            {/* Shimmer for the description */}
            <Shimmer width="80%" height="20px" />
            <Shimmer width="90%" height="20px" />
            <Shimmer width="60%" height="20px" />

            {/* Shimmer for the left and right sections */}
            <div style={{ display: "flex", flexDirection: "row", gap: "30px", marginTop: "20px" }}>
              <div style={{ width: "45%" }}>
                <Shimmer width="100%" height="250px" />
              </div>
              <div style={{ width: "55%" }}>
                <Shimmer width="100%" height="250px" />
              </div>
            </div>

            {/* Shimmer for the filter table */}
            <Shimmer width="100%" height="200px" style={{ marginTop: "30px" }} />
          </>
        ) : (
          <>
            <h1>ASSESSMENT SUMMARY</h1>
            <p>
              This section presents the collective performance of the batch,
              identifies areas for improvement, estimates the distribution of
              salaries among students, and recommends trainings based on
              individual performance.
            </p>

            <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
              <div
                className="assessment-bg-left-part section3_2_1"
                style={{ width: "40%" }}
              >
                <AssessmentSummaryLeftSection />
              </div>
              <div className="assessment-bg-right-part" style={{ width: "55%" }}>
                <AssessmentSummaryRightSection />
              </div>
            </div>

            <FilterTable />
          </>
        )}
      </div>
    </>
  );
};

export default AssessmentSummary;
