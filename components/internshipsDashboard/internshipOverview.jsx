"use client";
import React, { useState, useEffect } from 'react';

const InternshipOverview = () => {
  const [batchCount, setBatchCount] = useState(0);
  const [batchDetails, setBatchDetails] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [internshipId, setInternshipId] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const initialColors = ['#AC95EE', '#53ACFD', '#EED477'];

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    setInternshipId(id);
  }, []);

  // Fetch batch count
  useEffect(() => {
    if (internshipId) {
      setLoading(true); // Start loading
      fetch(`/api/internship_overview/batch_count/${internshipId}`)
        .then((response) => response.json())
        .then((data) => {
          setBatchCount(data.batchCount);
          setLoading(false); // End loading
        })
        .catch((error) => {
          console.error('Error fetching batch count:', error);
          setLoading(false); // End loading on error
        });
    }
  }, [internshipId]);

  // Fetch batch details
  useEffect(() => {
    if (internshipId) {
      setLoading(true); // Start loading
      fetch(`/api/internship_overview/batch_details/${internshipId}`)
        .then((response) => response.json())
        .then((data) => {
          setBatchDetails(data);
          setLoading(false); // End loading
        })
        .catch((error) => {
          console.error('Error fetching batch details:', error);
          setLoading(false); // End loading on error
        });
    }
  }, [internshipId]);

  // Fetch student list
  const fetchStudentDetails = async () => {
    if (internshipId) {
      setLoading(true); // Start loading
      try {
        const response = await fetch(`/api/internship_overview/batch_students_data/${internshipId}`);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        const data = await response.json();
        setStudentList(data);
        setLoading(false); // End loading
      } catch (error) {
        console.error('Error fetching student details:', error);
        setLoading(false); // End loading on error
      }
    }
  };

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
    if (!showPopup) {
      fetchStudentDetails();
    }
  };

  const calculateWidthPercentage = (count, totalCount) => {
    return Math.log(count) / Math.log(totalCount) * 100;
  };

  const totalCount = batchDetails.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="section2_1_1" style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
      {loading ? (
        // Shimmer Effect
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px', height:"200px" }}>
          <div className="shimmer" style={{
            height: '22px',
            backgroundColor: '#E0E0E0',
            marginBottom: '10px',
            borderRadius: '5px',
            animation: 'shimmer 1.5s infinite',
          }} />
          <div className="shimmer" style={{
            height: '61px',
            backgroundColor: '#E0E0E0',
            borderRadius: '5px',
            animation: 'shimmer 1.5s infinite',
            width: '100%',
           
          }} />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
          <div className="section2_inner_section">
            <div className="roww">
              <h4 className="f22 font600 marginr" id="batch-count">{batchCount}</h4>
              <p className="f12">Students</p>
            </div>
            <div style={{ float: 'right' }}>
              <p
                className="f12"
                style={{
                  color: '#53acfd',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={togglePopup}
              >
                {showPopup ? 'Hide Students list' : 'Show Students list'}
              </p>
            </div>
          </div>

          <div id="batch-container" style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
            {batchDetails.map((item, index) => (
              <div
                key={index}
                style={{
                  width: `${calculateWidthPercentage(item.count, totalCount)}%`,
                  backgroundColor: initialColors[index % initialColors.length],
                  height: '61px',
                  margin: '2px',
                  borderRadius: '5px',
                }}
              />
            ))}
          </div>

          <div id="batch-text-container" style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
            {batchDetails.map((item, index) => (
              <div
                key={index}
                style={{
                  fontSize: '12px',
                  width: `${calculateWidthPercentage(item.count, totalCount)}%`,
                  margin: '2px',
                }}
              >
                {item.batch} <br />
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showPopup && (
        <div
          id="studentPopup"
          style={{
            display: 'block',
            position: 'fixed',
            top: '57px',
            left: '80px',
            width: '94%',
            height: '100%',
            right: "100px",
            zIndex: 1,
            backgroundColor: '#fff',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            overflowY: 'auto',
          }}
        >
          <span
            className="close"
            style={{ float: 'right', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={togglePopup}
          >
            x
          </span>
          <br />
          <br />
          <div className="table-responsive">
            <table id="studentTable" className="table">
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Reg No</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {studentList.map((student, index) => (
                  <tr key={index}>
                    <td>{student.batch_name}</td>
                    <td>{student.student_name}</td>
                    <td>{student.email}</td>
                    <td>{student.regno}</td>
                    <td>{student.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipOverview;
