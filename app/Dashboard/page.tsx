"use client"

import type React from "react"
import { useEffect, useState } from "react"
import "./internshipdashboard.css"
import { FaUniversity, FaUser, FaDownload } from "react-icons/fa"
import StudentTable from "./top100students"
import StatsContainer from "../../components/StatsContainer"

interface YearWiseCount {
  year_range: string
  count_per_year: number
}

interface ApiResponse {
  college_id: string
  year_wise_count: YearWiseCount[]
}

interface Internship {
  internship_id: string
  interested_stream: string
  participants: {
    name: string
    email: string
    phone: string
    college_name: string
    roll_number: string
    degree: string
    branch: string
  }[]
}

const Dashboard: React.FC = () => {
  const [collegeName, setCollegeName] = useState("") // State to store the college name

  const [studentsByYear, setStudentsByYear] = useState<YearWiseCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [studentsByBranch, setStudentsByBranch] = useState([])
  const [internshipData, setInternshipData] = useState<Internship[]>([])

  const [showAll, setShowAll] = useState(false)
  const [showAllbranches, setShowAllbranches] = useState(false)

  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // Fetch the college name on component mount
    const fetchCollegeName = async () => {
      try {
        const response = await fetch("api/internship_2025/college_name", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for authenticated requests
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setCollegeName(data.college_name) // Set the fetched college name
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch college name:", error)
        setError("Failed to load college name.")
        setIsLoading(false)
      }
    }

    fetchCollegeName()
  }, [])

  useEffect(() => {
    const fetchStudentsByYear = async () => {
      try {
        const response = await fetch("/api/internship_2025/year_wise_count")
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        const data: ApiResponse = await response.json()
        setStudentsByYear(data.year_wise_count)
        setIsLoading(false)
      } catch (err) {
        setError("Error fetching data. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchStudentsByYear()
  }, [])

  useEffect(() => {
    const fetchDegreeWiseCount = async () => {
      try {
        const response = await fetch("/api/internship_2025/degree_branch_wise_count")
        if (!response.ok) {
          throw new Error("Failed to fetch degree branch wise count")
        }
        const data = await response.json()
        setStudentsByBranch(
          data.degree_branch_wise_count.map((item) => ({
            branch: item.degree_branch_name,
            count: item.count,
          })),
        )
      } catch (err) {
        console.error("Error fetching degree branch wise count:", err)
      }
    }

    fetchDegreeWiseCount()
  }, [])

  const totalStudents = studentsByYear.reduce((sum, segment) => sum + segment.count_per_year, 0)

  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"]
  const donutSegments = studentsByYear.map((segment, index) => ({
    ...segment,
    percentage: (segment.count_per_year / totalStudents) * 100,
    color: colors[index % colors.length],
  }))

  let cumulativePercentage = 0
  const chartBackground = donutSegments
    .map((segment) => {
      const start = cumulativePercentage
      const end = start + segment.percentage
      cumulativePercentage = end
      return `${segment.color} ${start}% ${end}%`
    })
    .join(", ")

  // Calculate percentage for each branch
  const branchPercentages = studentsByBranch.map((item) => ({
    ...item,
    percentage: ((item.count / totalStudents) * 100).toFixed(1),
  }))

  useEffect(() => {
    console.log("Donut Segments:", donutSegments)
    console.log("Branch Percentages:", branchPercentages)
  }, [donutSegments, branchPercentages])

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch("/api/internship_2025/streamwise_students_data")
        if (response.ok) {
          const data = await response.json()
          setInternshipData(data)
        } else {
          console.error("Failed to fetch internship data")
        }
      } catch (error) {
        console.error("Error fetching internship data:", error)
      }
    }

    fetchInternships()
  }, [])

  const handleScroll = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    event.preventDefault() // Prevent the default anchor behavior
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleViewReport = (internship: Internship) => {
    setSelectedInternship(internship)
    setShowPopup(true)
  }

  const closePopup = () => {
    setShowPopup(false)
    setSelectedInternship(null)
  }

  const handleDownload = () => {
    if (selectedInternship) {
      const headers = ["Name", "Email", "Phone", "College", "Roll Number", "Degree", "Branch"]
      const csvData = [
        headers.join(","),
        ...selectedInternship.participants.map((p) =>
          [p.name, p.email, p.phone, p.college_name, p.roll_number, p.degree, p.branch].join(","),
        ),
      ].join("\n")

      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `${selectedInternship.interested_stream}_participants.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }

  return (
    <div className="css1">
      <div className="main-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="logo-section">
            <FaUniversity className="college-icon" />
            <h1 className="college-name">{collegeName}</h1>
          </div>
          <nav className="dashboard-nav">
            <a href="#analytics" onClick={(e) => handleScroll(e, "analytics")}>
              Analytics
            </a>
            <a href="#overview" onClick={(e) => handleScroll(e, "overview")}>
              Overview
            </a>
            <a href="#internships" onClick={(e) => handleScroll(e, "internships")}>
              Internships
            </a>
            <a href="#students" onClick={(e) => handleScroll(e, "students")}>
              Students
            </a>
          </nav>
        </header>

        {/* Stats Section */}
        <div id="analytics">
          <StatsContainer />
        </div>

        {/* Students Overview */}
        <div className="dashboard-container" id="overview">
          <h1 className="bold">Overview</h1>

          <div className="overview-container">
            {/* Left Section: Students by Year */}
            <div className="students-by-year">
              <h2>Students by Year</h2>
              <hr />
              <br />
              <div className="chart-container">
                {isLoading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  <>
                    <div
                      className="donut-chart"
                      style={{
                        background: `conic-gradient(${chartBackground})`,
                      }}
                    >
                      <div className="donut-center">
                        {totalStudents}
                        <span>Students</span>
                      </div>
                    </div>
                    <div className="year-legend">
                      {donutSegments.map((segment, index) => (
                        <div className="legend-item" key={index}>
                          <span className="legend-circle" style={{ backgroundColor: segment.color }}></span>
                          {segment.year_range} <span className="count">{segment.count_per_year}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Section: Students by Branch */}
            <div className="students-by-branch">
              <div className="heading">
                <h2>Students by Branch</h2>
                <button
                  className={`view-all-btn ${showAllbranches ? "highlighted" : ""}`}
                  onClick={() => setShowAllbranches(!showAllbranches)}
                >
                  {showAllbranches ? "Show Less" : "View All"}
                </button>
              </div>
              <hr />
              <br />
              <div className="branch-container">
                {(showAllbranches ? branchPercentages : branchPercentages.slice(0, 5)).map((branch, index) => (
                  <div className="branch-item" key={index}>
                    <div className="branch-details">
                      <span className="branch-name">
                        {branch.branch} | <span className="branch-count">{branch.count}</span>
                      </span>
                    </div>
                    <div className="progress-bar">
                      <span
                        className="progress"
                        style={{
                          width: `${branch.percentage}%`,
                          backgroundColor: "rgb(49 31 102 / var(--tw-bg-opacity))",
                        }}
                      ></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/*internship status container*/}
        <div className="internship-status-container" id="internships">
          <div className="header">
            <h2>Internships</h2>
            <button className={`view-all-btn ${showAll ? "highlighted" : ""}`} onClick={() => setShowAll(!showAll)}>
              {showAll ? "Show Less" : "View All"}
            </button>
          </div>
          <hr />
          <br />
          <div className={`cards-container ${showAll ? "expanded" : "collapsed"}`}>
            {internshipData.slice(0, showAll ? internshipData.length : 3).map((internship, index) => (
              <div className="card" key={index}>
                <h3>{internship.interested_stream}</h3>
                <p>26-01-2025</p>
                <div className="students">
                  <FaUser className="user-icon" />
                  {internship.participants.length} Students
                </div>
                <button className="view-report-btn" onClick={() => handleViewReport(internship)}>
                  View Students
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Student Data Table */}
        <div id="students">
          <StudentTable />
        </div>
      </div>
      {showPopup && selectedInternship && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-btn" onClick={closePopup}>
              ×
            </button>
            <h2>{selectedInternship.interested_stream} Internship Registered Students</h2>
            <button className="view-all-btn" onClick={handleDownload}>
               Download CSV
            </button>
            <table className="participant-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>College</th>
                  <th>Roll Number</th>
                  <th>Degree</th>
                  <th>Branch</th>
                </tr>
              </thead>
              <tbody>
                {selectedInternship.participants.map((participant, index) => (
                  <tr key={index}>
                    <td>{participant.name}</td>
                    <td>{participant.email}</td>
                    <td>{participant.phone}</td>
                    <td>{participant.college_name}</td>
                    <td>{participant.roll_number}</td>
                    <td>{participant.degree}</td>
                    <td>{participant.branch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

