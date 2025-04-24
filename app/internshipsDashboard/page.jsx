"use client";
import React, { useEffect, useState } from "react";
import InternshipCard from "../../components/internshipsDashboard/internshipCard"; // Import the InternshipCard component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'; // Import the icon
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */
import "./internshipsDashboard.css";

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch(`api/internship_listing/internships`);
        const data = await response.json();
        setInternships(data);
      } catch (error) {
        console.error("Error fetching internships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  const viewReport = (internshipId) => {
    window.location.href = `internshipReport?id=${internshipId}`;
  };

  return (
    <div className="css1" >
      <div className="main-container" style={{minHeight:"85vh"}}>
        <div className="roww marginr" style={{ margin: "20px" }}>
          <img
            src="/img/internshipgrey.png"
            alt="internship icon"
            style={{ width: "14px", height: "14px", marginRight: "5px" }}
          />
          <p className="grey f14 marginr">
            Internships{" "}
            {/* <i className="fa-solid fa-chevron-right f10 marginl grey"></i> */}
            <FontAwesomeIcon icon={faChevronRight} className="f10 marginl grey" size="2x"/>

          </p>
          <p className="f14">Active Internships</p>
        </div>

        {/* <div className="topnav">
          <a href="/internshipDashboard" className="active" style={{ padding: "10px" }}>
            <div className="roww" style={{ marginRight: "20px" }}>
              <img
                src="/img/active_trainings.png"
                alt="active_trainings"
                style={{ marginRight: "5px" }}
              />
              <p>Active Internships</p>
            </div>
          </a>

          <a href="#Completed_trainings" style={{ padding: "10px" }}>
            <div className="roww">
              <img
                src="/img/completed_trainings.png"
                alt="completed_trainings"
                style={{ marginRight: "5px" }}
              />
              <p>Completed Internships</p>
            </div>
          </a>
        </div> */}

        <div id="internships">
          {loading ? (
            <div className="shimmer-container">
              {Array.from({ length: 3 }).map((_, index) => (
                <div className="shimmer" key={index}></div>
              ))}
            </div>
          ) : internships.length === 0 ? (
            <div id="overlay" style={overlayStyle}>
              <div id="popup" style={popupStyle}>
                <span
                  id="closePopup"
                  style={closePopupStyle}
                  onClick={() => {
                    // Handle close popup logic here
                    // You might redirect to a different page or just close the popup
                  }}
                >
                  &times;
                </span>
                <p>
                  You are not currently enrolled in any internships. This is a
                  sample Internship report.
                </p>
              </div>
            </div>
          ) : (
            internships.map((internship) => (
              <InternshipCard
                key={internship.id}
                internship={internship}
                onViewReport={viewReport}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Styles for the overlay and popup
const overlayStyle = {
  position: "fixed",
  left: "0",
  top: "0",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: "999",
};

const popupStyle = {
  position: "fixed",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "20px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  zIndex: "1000",
  width: "300px",
  textAlign: "center",
  borderRadius: "10px",
};

const closePopupStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  cursor: "pointer",
};

export default Internships;
