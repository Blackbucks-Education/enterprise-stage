"use client";

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Image from 'next/image';
import './StudentTable.css'; // Import CSS for shimmer effect

const StudentTable = () => {
  const [studentTableData, setStudentTableData] = useState([]);
  const [studentCurrentPage, setStudentCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const studentRowsPerPage = 10;
  const [internshipId, setInternshipId] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const defaultTopStudentsData = [];

  // Get internship ID from URL parameters after component mounts
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    setInternshipId(id);
  }, []);

  useEffect(() => {
    // Fetch student data only if internshipId is assigned
    if (internshipId) {
      fetchStudentData(internshipId);
    }
  }, [internshipId]);

  const fetchStudentData = async (internshipId) => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const response = await fetch(`/api/internship_overview/top_students/${internshipId}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      let data = await response.json();
      console.log(data);
      if (data.length === 0) {
        data = defaultTopStudentsData;
        document.getElementById("section4").style.opacity = "0.5";
        document.getElementById("downloadBtn").style.display = "none";
      }
      setStudentTableData(data);
      setTotalPages(Math.ceil(data.length / studentRowsPerPage));
    } catch (error) {
      console.error('Error fetching student data:', error);
      setStudentTableData(defaultTopStudentsData);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  const renderStudentTable = () => {
    const start = (studentCurrentPage - 1) * studentRowsPerPage;
    const end = start + studentRowsPerPage;
    const pageData = studentTableData.slice(start, end);

    return pageData.map((student, index) => (
      <tr key={index}>
        <td className="name-cell">
          <div className="user-icon">
            <Image src="/img/user.png" height={12} width={12} />
          </div>
          {student.name}
        </td>
        <td>{student.email}</td>
        <td>{student.phone}</td>
        <td>{student.regno}</td>
        <td>{student.average_score}%</td>
      </tr>
    ));
  };

  const updateStudentPaginationControls = () => {
    let startPage = Math.max(studentCurrentPage - 3, 1);
    let endPage = Math.min(studentCurrentPage + 3, totalPages);

    if (endPage - startPage < 6) {
      if (startPage === 1) {
        endPage = Math.min(startPage + 6, totalPages);
      } else if (endPage === totalPages) {
        startPage = Math.max(endPage - 6, 1);
      }
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
      <span
        key={page}
        style={{
          fontWeight: page === studentCurrentPage ? 'bold' : 'normal',
          backgroundColor: page === studentCurrentPage ? '#7962BD' : '#D3FB52',
          color: page === studentCurrentPage ? '#fff' : '#000',
        }}
        onClick={() => goToStudentPage(page)}
      >
        {page}
      </span>
    ));
  };

  const goToStudentPage = (page) => {
    setStudentCurrentPage(page);
  };

  const studentPrevPage = () => {
    if (studentCurrentPage > 1) setStudentCurrentPage(studentCurrentPage - 1);
  };

  const studentNextPage = () => {
    if (studentCurrentPage < totalPages) setStudentCurrentPage(studentCurrentPage + 1);
  };

  const downloadTableAsExcel = (tableId, filename, allData) => {
    const completeTable = document.createElement('table');
    const headerRow = document.createElement('tr');
    const table = document.getElementById(tableId);
    const headerCells = table.querySelectorAll('th');

    headerCells.forEach(cell => {
      const th = document.createElement('th');
      th.innerText = cell.innerText;
      headerRow.appendChild(th);
    });
    completeTable.appendChild(headerRow);

    allData.forEach(rowData => {
      const row = document.createElement('tr');
      rowData.forEach(cellData => {
        const cell = document.createElement('td');
        cell.innerText = cellData;
        row.appendChild(cell);
      });
      completeTable.appendChild(row);
    });

    const workbook = XLSX.utils.table_to_book(completeTable, { sheet: "Sheet1" });
    XLSX.writeFile(workbook, filename);
  };

  // Sample allData to download
  const allData = studentTableData.map(student => [
    student.name, student.email, student.phone, student.regno, student.average_score,
  ]);

  return (
    <div className="section4" id="section4">
      

      {loading ? ( // Show shimmer effect when loading
        <div className="shimmer-loader">
          <div className="shimmer-row">
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
          </div>
          <div className="shimmer-row">
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
          </div>
          <div className="shimmer-row">
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
          </div>
          <div className="shimmer-row">
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
          </div>
          <div className="shimmer-row">
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
            <div className="shimmer-cell"></div>
          </div>
        </div>
      ) : (
      <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h2 className="f16 font600">Overall Top Students</h2>
        <div className="download-data-div" id="downloadBtn">
          <a
            href="#"
            className="download-btn"
            onClick={() => downloadTableAsExcel('student-table', 'Top_Students.xlsx', allData)}
            style={{
              display: "inline-block",
              height: '42px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#fff',
              backgroundColor: '#7962bd',
              textDecoration: 'none',
              borderRadius: '50px',
              boxShadow: '0 8px 8px rgba(193, 153, 250, 0.3)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            Download
          </a>
        </div>
      </div>
        <table id="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Registration Number</th>
              <th>Average Score</th>
            </tr>
          </thead>
          <tbody id="student-table-body">
            {renderStudentTable()}
          </tbody>
        </table>

        <div className="pagination" id="sattendance-pagination-controls">
        <button id="sattendancePrevPage" onClick={studentPrevPage}>Previous</button>
        <div id="sattendancePageNumbers">
          {updateStudentPaginationControls()}
        </div>
        <button id="sattendanceNextPage" onClick={studentNextPage}>Next</button>
      </div>
      </>
      )}

      
    </div>
  );
};

export default StudentTable;
