import React, { useState, useEffect } from "react";
import "./StudentTable.css";


const StudentTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("api/internship_2025/student_details");
      if (!response.ok) {
        throw new Error("Failed to fetch student data");
      }
      const data = await response.json();
      setStudents(data.students);
      setIsLoading(false);
    } catch (err) {
      setError("Error fetching student data. Please try again later.");
      setIsLoading(false);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = students.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(students.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    const delta = 2;
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    let pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const handleDownload = () => {
    // Use fetch to send the request to the server
    fetch("api/internship_2025/download_student_details", {
      method: "GET",
      credentials: "include", // Ensures cookies are sent with the request for session authentication
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to download file");
        }
        return response.blob();
      })
      .then((blob) => {
        // Create a link element, set the download URL, and click it programmatically
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "student_details.csv"; // Default file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        alert("Failed to download file.");
      });
    }

    return (
    <div className="table-container">
    <div className="heading">
      <h2>Students</h2>
      <button className="download-btn" onClick={handleDownload}>Download</button>
      </div>
      <hr />
      <br />
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Avatar</th>
              <th>First Name</th>
              <th>Email</th>
              <th>Total Score</th>
              <th>Aptitude</th>
              <th>English</th>
              <th>Coding</th>
              <th>Employability Band</th>
              <th>Possible Employability Band</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((student, index) => (
              <tr key={index}>
                <td className="avatar">{student.name.charAt(0)}</td>
                <td className="name">{student.name}</td>
                <td className="email">{student.email}</td>
                <td className="name">{student.total_score}</td>
                <td>{student.aptitude}</td>
                <td>{student.english}</td>
                <td>{student.coding}</td>
                <td>
                  <span className={`badge ${student.employability_band}`}>
                    {student.employability_band}
                  </span>
                </td>
                <td>
                  <span className={`badge ${student.possible_employability_band}`}>
                    {student.possible_employability_band}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {currentPage > 1 && (
          <>
            <button onClick={() => handlePageChange(1)}>1</button>
            {currentPage > 3 && <span className="ellipsis">...</span>}
          </>
        )}

        {getVisiblePages().map((page) => (
          <button
            key={page}
            className={currentPage === page ? "active" : ""}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages - 2 && (
          <span className="ellipsis">...</span>
        )}

        {currentPage < totalPages && (
          <button onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentTable;
