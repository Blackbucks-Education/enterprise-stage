// components/ButtonGroup.js
import Link from "next/link";

const ButtonGroup = () => (
  <div className="btns-container">
    <Link href={"employbilityMonthlyReport"}>
      <button className="active">Monthly Report</button>
    </Link>
    <Link href={"employabilityStudentsResults"}>
      <button>Student Results</button>
    </Link>
    <Link href={"assessmentDashboard"}>
      <button>Assessment Reports</button>
    </Link>
  </div>
);

export default ButtonGroup;
