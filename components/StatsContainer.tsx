import type React from "react"
import { useEffect, useState } from "react"
import { FaBriefcase, FaUserGraduate, FaMoneyBillAlt } from "react-icons/fa"
import axios from "axios"

const StatsContainer: React.FC = () => {
  const [stats, setStats] = useState({
    unique_interested_streams_count: 0,
    unique_user_id_count: 0,
    payment_true_count: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("api/internship_2025/main_cards")
        setStats(response.data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="stats-container">
      <div className="card">
        <div className="icon">
          <FaBriefcase />
          <h2 className="iconheader">Internships</h2>
        </div>
        <div className="card-content">
          <p className="stat-number">
            {stats.unique_interested_streams_count} <span className="sub">Programs</span>
          </p>
        </div>
      </div>
      <div className="card">
        <div className="icon">
          <FaUserGraduate />
          <h2 className="iconheader">Total Unique Students</h2>
        </div>
        <div className="card-content">
          <p className="stat-number">
            {stats.unique_user_id_count} <span className="sub">Students</span>
          </p>
        </div>
      </div>
      <div className="card">
        <div className="icon">
          <FaMoneyBillAlt />
          <h2 className="iconheader">Paid Students</h2>
        </div>
        <div className="card-content">
          <p className="stat-number">
            {stats.payment_true_count} <span className="sub">Students</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatsContainer

