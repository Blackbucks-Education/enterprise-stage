import React from "react";

const InternshipCard = ({ internship, onViewReport }) => {
  return (
    <div className="internship">
      <div className="roww" style={{ justifyContent: "space-between" }}>
        <div className="roww">
          <div className="banner-t-img">
            <img
              className="banner"
              src="/img/blackbuckslogo.jpg"
              alt="Training Banner"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <p className="f18 font600" style={{ marginBottom: "20px" }}>
              {internship.title}
            </p>
            <div className="roww">
              <img
                src="/img/date.png"
                alt="date"
                width="14px"
                height="14px"
                style={{ marginRight: "5px" }}
              />
              <p className="f12 font600" style={{ marginRight: "20px", marginTop: "0" }}>
                Start Date: {internship.start_date}
              </p>
              <img
                src="/img/date.png"
                alt="date"
                width="14px"
                height="14px"
                style={{ marginRight: "5px" }}
              />
              <p className="f12 font600" style={{ marginTop: "0" }}>
                End Date: {internship.end_date}
              </p>
            </div>
          </div>
        </div>
        <div style={{ paddingLeft: "525px" }}>
          <button
            className="view"
            onClick={() => onViewReport(internship.id)}
            style={{ textWrap: "nowrap", width: "140px", display: "flex", alignItems: "center" }}
          >
            <img
              src="/img/eye.png"
              alt="view report"
              style={{ marginRight: "5px" }}
            />
            <p> View Report</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternshipCard;
