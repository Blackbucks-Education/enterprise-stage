"use client";
import React, { useEffect, useState } from "react";

const shimmerStyle = {
  display: "flex",
  alignItems: "center",
  padding: "20px",
  background: "#f6f7f8",
  borderRadius: "5px",
  marginBottom: "20px",
};

const shimmerCellStyle = {
  flex: 1,
  height: "40px", // Adjust height according to your design
  background: "linear-gradient(90deg, #f6f7f8 0%, #e0e0e0 50%, #f6f7f8 100%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite",
  marginRight: "15px", // Space between shimmer cells
};

const keyframes = `
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}`;

const InternshipDashboardCards = () => {
  const [showShimmer, setShowShimmer] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowShimmer(false); // Remove shimmer after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <div className="section2_2" style={{ position: "relative" }}>
      <style>{keyframes}</style> {/* Injecting keyframes directly */}
      {/* Render shimmer or actual content based on state */}
      {showShimmer ? (
        <>
          {/* Card 1: Average Feedback */}
          <div className="card_s2" style={shimmerStyle}>
            <div
              className="card_s2_div"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div
                style={{
                  height: "40px",
                  width: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                  backgroundColor: "#e0e0e0", // Placeholder color
                  marginRight: "15px", // Space between icon and text
                }}
              />
              <div style={shimmerCellStyle} /> {/* Title placeholder */}
            </div>
            <div
              className="card_s2_div"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div style={shimmerCellStyle} /> {/* Value placeholder */}
              <div
                style={{
                  height: "20px",
                  width: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#e0e0e0", // Placeholder color
                  marginLeft: "15px", // Space between value and icon
                }}
              />
            </div>
          </div>

          {/* Card 2: Overall Interactiveness */}
          <div className="card_s2" style={shimmerStyle}>
            <div
              className="card_s2_div"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div
                style={{
                  height: "40px",
                  width: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                  backgroundColor: "#e0e0e0", // Placeholder color
                  marginRight: "15px", // Space between icon and text
                }}
              />
              <div style={shimmerCellStyle} /> {/* Title placeholder */}
            </div>
            <div
              className="card_s2_div"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div style={shimmerCellStyle} /> {/* Value placeholder */}
              <div
                style={{
                  height: "20px",
                  width: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#e0e0e0", // Placeholder color
                  marginLeft: "15px", // Space between value and icon
                }}
              />
            </div>
          </div>
        </>
      ) : (

        <>
          {/* Card 1: Average Feedback */}
          <div className="card_s2">
            <div className="card_s2_div">
              <div className="background-img-color" style={{height:"40px",width:"40px",alignItems:"center",justifyContent:"center",display:"flex"}}>
                <img src="/img/feedback1.png" alt="projects" style={{height:"25px",width:"25px",maxWidth:"none"}}/>
              </div>
              <p className="f16 font600">
                Average <br />
                Feedback
              </p>
            </div>
            <div className="card_s2_div">
              <span className="font600 f22">4.5/5</span>
              <img src="/img/feedback1.png" alt="projects" />
            </div>
          </div>

          <div className="card_s2">
            <div className="card_s2_div">
              <div className="background-img-color" style={{height:"40px",width:"40px",alignItems:"center",justifyContent:"center",display:"flex"}}>
                <img src="/img/overall1.png" alt="projects" style={{height:"25px",width:"25px",maxWidth:"none"}}/>
              </div>
              <p className="f16 font600">
                Overall <br />
                Interactiveness
              </p>
            </div>
            <div className="card_s2_div">
              <span className="font600 f22">93.4/100</span>
              <img src="/img/overall1.png" alt="projects" />
            </div>
          </div>
        </>
        
      )}
    </div>
  );
};

export default InternshipDashboardCards;
