// components/BandCountsTable.jsx
"use client";

import React from 'react';

const BandCountsTable = ({ bandCounts, selectedOptions }) => {
  return (
    <div className="tableContainer">
      <h2>Employability Band Counts</h2>
      <table>
        <thead>
          <tr>
            <th>Hackathon</th>
            <th>A++</th>
            <th>A+</th>
            <th>A</th>
            <th>B</th>
            <th>C</th>
            <th>F</th>
            <th>A++ (Possible)</th>
            <th>A+ (Possible)</th>
            <th>A (Possible)</th>
            <th>B (Possible)</th>
            <th>C (Possible)</th>
            <th>F (Possible)</th>
          </tr>
        </thead>
        <tbody>
          {bandCounts.map((band, index) => {
            const selectedOption = selectedOptions[index];
            return selectedOption ? (
              <tr key={index}>
                <td>{selectedOption.label}</td>
                <td>{band.count_a_plus_plus}</td>
                <td>{band.count_a_plus}</td>
                <td>{band.count_a}</td>
                <td>{band.count_b}</td>
                <td>{band.count_c}</td>
                <td>{band.count_f}</td>
                <td>{band.count_a_plus_plus_possible}</td>
                <td>{band.count_a_plus_possible}</td>
                <td>{band.count_a_possible}</td>
                <td>{band.count_b_possible}</td>
                <td>{band.count_c_possible}</td>
                <td>{band.count_f_possible}</td>
              </tr>
            ) : null;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BandCountsTable;
