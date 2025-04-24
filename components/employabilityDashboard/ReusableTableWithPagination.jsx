import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import taptapImage from '../../public/img/tap.png'; // Default image

const ReusableTable = ({ columns, data, rowsPerPage }) => {

  console.log('cols',columns);
  console.log('data',data);
  console.log('rowsPerPage', rowsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div>
      <div className="scrollable">
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.accessor}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index}>
                <td className="name-cell" style={{ marginRight: "10px" }}>
                  {/* {console.log(row.image)} */}
                  {/* Check if row.image is a valid URL string or object */}
                  {row.image && typeof row.image === "string" && row.image.trim() !== "" ? (
                    <img
                      src={row.image} // Use the string URL
                      alt={row.first_name} // Use `first_name` for alt text
                      style={{ width: "30px", height: "30px", marginRight: "8px", borderRadius: "20px" }}
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = taptapImage; // Set default image on error
                      }}
                    />
                  ) : (
                    <div style={{ width: "30px", height: "30px", marginRight: "8px", borderRadius: "20px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#e0e0e0" }}>
                      <FontAwesomeIcon icon={faUser} style={{ color: "#7962bd", fontSize: "20px" }} />
                    </div>
                  )}
                  {row.first_name} {/* Assuming the name is stored in the `first_name` key */}
                </td>

                {columns.slice(1).map((column) => (
                  <td key={column.accessor}>{row[column.accessor]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-container">
            <button
              className="prev-button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>

            <div className="pagination-numbers-container">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`${i + 1 === currentPage ? "current" : ""} pagination-button`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              className="next-button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReusableTable;
