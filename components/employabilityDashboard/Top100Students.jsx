"use client";

import React, { useEffect, useState } from "react";
import ReusableTableWithPagination from "./ReusableTableWithPagination";
import SkeletonTable from "./ShimmerTable"; // Import the SkeletonTable component

const Top100Students = () => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { label: "Name", accessor: "first_name" },
    { label: "Email", accessor: "email" },
    { label: "Marks", accessor: "total_score" },
    { label: "Aptitude", accessor: "aptitude" },
    { label: "English", accessor: "english" },
    { label: "Coding", accessor: "coding" },
    { label: "Emp Band", accessor: "employability_band" },
    { label: "Best Possible Band", accessor: "possible_employability_band" },
    {
      label: "Aptitude Improvement Sugg",
      accessor: "aptitude_improvement_suggestions",
    },
    {
      label: "English Improvement Sugg",
      accessor: "english_improvement_suggestions",
    },
    {
      label: "Coding Improvement Sugg",
      accessor: "technical_improvement_suggestions",
    },
  ];

  useEffect(() => {
    const fetchStudentResults = async () => {
      try {
        const response = await fetch("api/emp_student_results/top100");
        const result = await response.json();
        setStudentData(result.length ? result : defaultTop100Students);
      } catch (error) {
        console.error("Error fetching student results:", error);
        setStudentData(defaultTop100Students);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentResults();
  }, []);

  const defaultTop100Students = [
    {
      first_name: "John Doe",
      email: "john@example.com",
      total_score: 85,
      aptitude: 90,
      english: 80,
      coding: 95,
      employability_band: "A",
      possible_employability_band: "A+",
      aptitude_improvement_suggestions: "Work on problem-solving speed",
      english_improvement_suggestions: "Improve vocabulary",
      technical_improvement_suggestions: "Enhance coding efficiency",
    },
    // Add more sample data here
  ];

  return (
    <div className="section6">
      <div className="card_s6">
        {loading ? (
          // Show skeleton table while data is being fetched
          <SkeletonTable columns='10' rows='10' /> // Show skeleton for 10 rows
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "-40px",
              }}
            >
              <div
                style={{
                  paddingLeft: "30px",
                  paddingBottom: "0",
                  fontWeight: "bold",
                  position: "sticky",
                }}
              >
                <p className="f22">TOP 100 - Employability</p>
              </div>
              <div className="selection-container">
                <a className="view-report" href="employabilityStudentsResults">
                  View Student Results
                </a>
              </div>
            </div>

            <ReusableTableWithPagination
              columns={columns}
              data={studentData}
              rowsPerPage={10}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Top100Students;
