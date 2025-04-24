import React from "react";
import InternshipHeader from "../../components/internshipsDashboard/internshipHeader";
import InternshipOverview from "../../components/internshipsDashboard/internshipOverview"; // Capitalize the component name
import PercentageCompletionGraph from  "../../components/internshipsDashboard/percentageCompletionGraph";
import InternshipDashboardCards from  "../../components/internshipsDashboard/internshipDashboardCards";
import InternshipDomainSummary from  "../../components/internshipsDashboard/internshipDomainSummary";
import OverallTopStudents from '../../components/internshipsDashboard/overallTopStudents';

import '../../public/css/training_overview.css';
// import '../../public/css/trainCommon.css';

const InternshipComponent = () => {
  return (
    <div className="css1">
      <div className="main-container">
        <InternshipHeader />
        <div className="section2 column1"> {/* class should be className in React */}
          <div className="section2_1 roww"> {/* class should be className in React */}
            <InternshipOverview /> 
            <PercentageCompletionGraph/>
          </div>
          <InternshipDashboardCards/>
          <InternshipDomainSummary/>
          <OverallTopStudents/>
        </div>
      </div>
    </div>
  );
};

export default InternshipComponent;
