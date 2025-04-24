// ShimmerTable.js
import React from "react";
import "../../app/employbilityMonthlyReport/monthreport.css"; // Import the CSS styles

const ShimmerTable = ({ rows = 10, columns = 5 }) => {
  return (
    <div className="monthlyReportTable shimmer-wrapper">
      <table className="shimmer-table">
        <thead>
          <tr>
            <th className="shimmer-cell">
              <div className="shimmer"></div>
            </th>
            {Array.from({ length: columns - 1 }).map((_, colIdx) => (
              <th key={colIdx} className="shimmer-cell">
                <div className="shimmer"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              <td className="shimmer-cell">
                <div className="shimmer"></div>
              </td>
              {Array.from({ length: columns - 1 }).map((_, colIdx) => (
                <td key={colIdx} className="shimmer-cell">
                  <div className="shimmer"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShimmerTable;
