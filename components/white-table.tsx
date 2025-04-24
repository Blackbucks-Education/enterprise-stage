import React from "react";

const headerMapping = {
  name: "Name",
  email: "Email",
  roll_number: "Roll Number",
  yop: "YOP",
  btechdegree: "Degree",
  btechbranch: "Branch",
  total_score: "Total Score",
  aptitude: "Aptitude",
  coding: "Coding",
  english: "English",
  employability_band: "Employability Band",
  possible_employability_band: "Best Employability Band",
  profile_score: "Profile Score",
  github_id: "GitHub ID",
  linkedin_id: "LinkedIn ID",
  hacker_rank_id: "HackerRank ID",
  leet_code_id: "LeetCode ID",
  tenth_cgpa: "10th %",
  twelfth_cgpa: "12th %",
  btech_cgpa: "B.Tech %",
  codingscore: "Coding Score",
  codingaccuracy: "Coding Accuracy %",
  javascore: "Java Score",
  javaaccuracy: "Java Accuracy %",
  pythonscore: "Python Score",
  pythonaccuracy: "Python Accuracy %",
  cscore: "C Score",
  caccuracy: "C Accuracy %",
  cppscore: "C++ Score",
  cppaccuracy: "C++ Accuracy %",
  sqlscore: "SQL Score",
  sqlaccuracy: "SQL Accuracy %",
  comment: "Comment",
  aptitude_improvement_suggestions: "Aptitude Improvement Suggestions",
  technical_improvement_suggestions: "Technical Improvement Suggestions",
  english_improvement_suggestions: "English Improvement Suggestions",
};

const defaultMessages = {
  coding: "NA",
  codingscore: "NA",
  codingaccuracy: "NA",
  javascore: "NA",
  javaaccuracy: "NA",
  pythonscore: "NA",
  pythonaccuracy: "NA",
  cscore: "NA",
  caccuracy: "NA",
  cppscore: "NA",
  cppaccuracy: "NA",
  sqlscore: "NA",
  sqlaccuracy: "NA",
  // Add more defaults as needed
};

const Table = ({ tableData, loading }) => {
  console.log("Table Data:", tableData); // Debugging line

  const columnCount =
    Array.isArray(tableData) && tableData.length > 0
      ? Object.keys(tableData[0]).filter((header) => header !== "id" && header !== "college_id").length
      : 0;

  return (
    <table>
      <thead>
        <tr>
          {tableData.length > 0 &&
            Object.keys(tableData[0])
              .filter((header) => header !== "id" && header !== "college_id") // Skip "id" column
              .map((header) => (
                <th key={header}>
                  {headerMapping[header] || header.toUpperCase()}
                </th>
              ))}
        </tr>
      </thead>
      <tbody>
        {tableData.length === 0 ? (
          // Show message when no data is available after loading
          <tr>
            <td colSpan={columnCount} style={{ textAlign: "center" }}>
              No data available
            </td>
          </tr>
        ) : (
          tableData.map((row, index) => (
            <tr key={index}>
              {Object.entries(row)
                .filter(([key]) => key !== "id" && key !== "college_id") // Skip "id" column
                .map(([key, value]) => (
                  <td
                    key={key}
                    className={
                      key === "comment" ||
                      key === "aptitude_improvement_suggestions" ||
                      key === "technical_improvement_suggestions" ||
                      key === "english_improvement_suggestions"
                        ? "table-comment-cell"
                        : ""
                    }
                    style={
                      key === "comment" ||
                      key === "aptitude_improvement_suggestions" ||
                      key === "technical_improvement_suggestions" ||
                      key === "english_improvement_suggestions"
                        ? { minWidth: "300px", wordWrap: "break-word", whiteSpace: "normal" }
                        : {}
                    }
                  >
                    {/* Check for specific fields to display links */}
                    {key === "name" ? (
                      <a
                        href={`/employabilityStudentReport?name=${encodeURIComponent(row[key])}&email=${encodeURIComponent(row.email)}`}
                      >
                        {String(value)}
                      </a>
                    ) : key === "github_id" && value ? (
                      <a 
                        href={typeof value === "string" ? value : "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                    ) : key === "linkedin_id" && value ? (
                      <a 
                        href={typeof value === "string" ? value : "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    ) : key === "hacker_rank_id" && value ? (
                      <a 
                        href={typeof value === "string" ? value : "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        HackerRank
                      </a>
                    ) : key === "leet_code_id" && value ? (
                      <a 
                        href={typeof value === "string" ? value : "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        LeetCode
                      </a>
                    ) : value === null || value === undefined ? (
                      defaultMessages[key] || "NA"
                    ) : (
                      String(value)
                    )}
                  </td>
                ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default Table;
