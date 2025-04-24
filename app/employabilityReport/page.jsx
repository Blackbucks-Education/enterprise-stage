import React, { Suspense } from "react";
import "./empDashboard.css";
import Image from "next/image";
import Link from "next/link";
import CardsGroup from "../../components/employabilityDashboard/CardGroup";
import AssessmentSummaryLeftSection from "../../components/employabilityDashboard/AssessmentSummaryLeftSection";
import AssessmentSummaryRightSection from "../../components/employabilityDashboard/AssessmentSummaryRightSection";
import FilterTable from "../../components/employabilityDashboard/FilterTable";
import TechnicalSectionAnalysis from "../../components/employabilityDashboard/TechnicalSectionAnalysis";
import Top100Students from "../../components/employabilityDashboard/Top100Students";

import AssessmentSummary from '../../components/employabilityDashboard/AssessmentSummary'
// import Loading from "../myDashboard/loading";
import Loading from "./loading";


const EmpDashboard = () => {
  return (
    <Suspense fallback={<p>Loading.......</p>}>
      <div className="emp-dashboard-bg-cont">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div className="bread-crump">
            <Image
              src="/img/empgrey.png"
              alt="Employee Grey Icon"
              height={5}
              width={13}
              className="bread-crumb-image"
            />
            <p>Employability Dashboard</p>
          </div>
          <div className="btns-container">
            <Link
              href={"employbilityMonthlyReport"}
              style={{ textDecoration: "none", color: "#000" }}
            >
              <button
                className="active"
                style={{ color: "#000", textDecoration: "none" }}
              >
                Monthly Report
              </button>
            </Link>
            <Link
              href={"employabilityStudentsResults"}
              style={{ textDecoration: "none", color: "#000" }}
            >
              <button style={{ color: "#000", textDecoration: "none" }}>
                Student Results
              </button>
            </Link>
            <Link
              href={"assessmentDashboard"}
              style={{ textDecoration: "none", color: "#000" }}
            >
              <button style={{ color: "#000", textDecoration: "none" }}>
                Assessment Reports
              </button>
            </Link>
          </div>
        </div>

        <CardsGroup />

        <AssessmentSummary/>

       


        <div className="TECH_SEC_ANALYSIS">
          <TechnicalSectionAnalysis />
        </div>

        <div>
          <Top100Students />
        </div>
      </div>
    </Suspense>
  );
};

export default EmpDashboard;
