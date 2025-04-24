"use client";
import React, { useEffect, useState } from "react";
import "../public/css/nav_log.css"; // Assuming you have a CSS file for styling

const Sidebar = () => {
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    // Get the current pathname
    const path = window.location.pathname;
    setActivePath(path);
  }, []);

  // Define a mapping for inner pages related to sidebar items
  const routeMappings = {
    "/myDashboard": [
      "/myDashboard",
      "/myDashboard/overview",
      "/myDashboard/stats",
    ],
    "/employabilityReport": [
      "/employabilityReport",
      "/employabilityReport",
      "/studentResults",
    ],
    "/jobsDashboard": [
      "/jobsDashboard",
      "/jobsDashboard/applications",
      "/jobsDashboard/reports",
    ],
    "/assessments": ["https://admin.hackathon.blackbucks.me"], // External link, modify as needed
    "/createAndManageCourse": [
      "https://admin.hackathon.blackbucks.me/createAndManageCourse/",
    ],
    "/lessonPlan": ["https://admin.hackathon.blackbucks.me/lessonPlan/"],
    "/trainingsDashboard": [
      "/trainingsDashboard",
      "/trainingsDashboard/sessions",
      "/trainingsDashboard/reports",
    ],
    "/internshipsDashboard": [
      "/internshipsDashboard",
      "/internshipReport",
    ],
    "/vpl": ["https://admin.hackathon.blackbucks.me/createAndManageLabTest/"], // External link, modify as needed
  };

  const isActive = (basePath) => {
    return (
      routeMappings[basePath]?.some((route) => activePath === route) ||
      activePath.startsWith(basePath)
    );
  };

  return (
    <div className="sidebar" style={{ height: "100vh" }}>
      <a
        className="logo"
        style={{ textAlign: "center", alignItems: "center", padding: "5px" }}
      >
        <img
          src="img/sidebar logo.png"
          alt="Logo"
          style={{ width: "58px", maxWidth: "100%", height: "90px" }}
        />
      </a>
      <a
        href="/myDashboard"
        style={{
          backgroundColor: isActive("/myDashboard") ? "#88eb4c" : "transparent",
        }}
      >
        <div
          className={`menu-item ${isActive("/myDashboard") ? "active" : ""}`}
        >
          <img
            src={
              isActive("/myDashboard") ? "img/dash.png" : "img/dash_white.png"
            }
            alt="dash"
            style={{ maxWidth: "22px", height: "22px" }}
          />
          <span style={{ color: isActive("/myDashboard") ? "black" : "white" }}>
            Dashboard
          </span>
        </div>
      </a>
      <a
        href="/employabilityReport"
        style={{
          backgroundColor: isActive("/employabilityReport")
            ? "#88eb4c"
            : "transparent",
        }}
      >
        <div
          className={`menu-item ${
            isActive("/employabilityReport") ? "active" : ""
          }`}
        >
          <img
            src={
              isActive("/employabilityReport")
                ? "img/emp_black.png"
                : "img/emp.png"
            }
            alt="employability"
            style={{ maxWidth: "18px", height: "20px" }}
          />
          <span
            style={{
              color: isActive("/employabilityReport") ? "black" : "white",
            }}
          >
            Employability
          </span>
        </div>
      </a>
      <a
        href="https://admin.hackathon.blackbucks.me"
        className={`menu-item ${isActive("/assessments") ? "active" : ""}`}
      >
        <img
          alt="Assessment icon"
          src="img/assessment.png"
          style={{ maxWidth: "19px", height: "19.5px" }}
        />
        <span>Assessments</span>
      </a>
      <a
        href="/jobsDashboard"
        style={{
          backgroundColor: isActive("/jobsDashboard")
            ? "#88eb4c"
            : "transparent",
        }}
      >
        <div
          className={`menu-item ${isActive("/jobsDashboard") ? "active" : ""}`}
        >
          <img
            src="img/jobs.png"
            alt="jobs"
            style={{ maxWidth: "20px", height: "21px" }}
          />
          <span>Jobs</span>
        </div>
      </a>
      <a
        href="https://admin.hackathon.blackbucks.me/createAndManageCourse/"
        className={`menu-item ${
          isActive("/createAndManageCourse") ? "active" : ""
        }`}
      >
        <img
          alt="course icon"
          src="img/course.png"
          style={{ maxWidth: "19px", height: "20px" }}
        />
        <span>Course</span>
      </a>
      <a
        href="https://admin.hackathon.blackbucks.me/lessonPlan/"
        className={`menu-item ${isActive("/lessonPlan") ? "active" : ""}`}
      >
        <img
          alt="lessonplan icon"
          src="img/lessonplan.png"
          style={{ maxWidth: "23px", height: "18px" }}
        />
        <span>Lesson Plan</span>
      </a>
      <a
        href="/trainingsDashboard"
        style={{
          backgroundColor: isActive("/trainingsDashboard")
            ? "#88eb4c"
            : "transparent",
        }}
      >
        <div
          className={`menu-item ${
            isActive("/trainingsDashboard") ? "active" : ""
          }`}
        >
          <img
            src="img/trainings.png"
            alt="trainings"
            style={{ maxWidth: "27px", height: "21px" }}
          />
          <span>Trainings</span>
        </div>
      </a>
      <a
        href="/internshipsDashboard"
        style={{
          backgroundColor: isActive("/internshipsDashboard")
            ? "#88eb4c"
            : "transparent",
        }}
      >
        <div
          className={`menu-item ${
            isActive("/internshipsDashboard") ? "active" : ""
          }`}
        >
          <img
            src={
              isActive("/internshipsDashboard")
                ? "img/internship_icon.png"
                : "img/internship_white.png"
            }
            alt="manage"
            style={{ width: "20px", height: "auto" }}
          />
          <span
            style={{
              color: isActive("/internshipsDashboard") ? "black" : "white",
            }}
          >
            Internships
          </span>
        </div>
      </a>
      <a
        href="https://admin.hackathon.blackbucks.me/createAndManageLabTest/"
        className={`menu-item ${isActive("/vpl") ? "active" : ""}`}
      >
        <img
          alt="vpl icon"
          src="img/vpl.png"
          style={{ maxWidth: "19px", height: "17px" }}
        />
        <span>VPL</span>
      </a>
    </div>
  );
};

export default Sidebar;