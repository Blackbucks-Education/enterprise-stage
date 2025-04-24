import { IoClose } from 'react-icons/io5';
import '../public/css/sidebarmobile.css';

export default function SideBarMobileNew({ isOpen, onClose }) {
  return (
    <aside className={`sidebar-mobile ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <img src="img/taptapmobile.svg" alt="TaPTaP" />
          <span className="taptap-heading">TaPTaP</span>
        </div>
        <button onClick={onClose} className="close-sidebar">
          <IoClose size={24} />
        </button>
      </div>
      <nav>
        <ul>
          <li>
            <img src="img/dashmobile.svg" alt="Dashboard" className="icon" />
            <a href="myDashboard">Dashboard</a>
          </li>
          <li>
            <img src="img/empmobile.svg" alt="Employability" className="icon" />
            <a href="employabilityReport">Employability</a>
          </li>
          <li>
            <img src="img/assessmentmobile.svg" alt="Assessments" className="icon" />
            <a href="https://admin.hackathon.blackbucks.me">Assessments</a>
          </li>
          <li>
            <img src="img/jobsmobile.svg" alt="Jobs" className="icon" />
            <a href="jobsDashboard">Jobs</a>
          </li>
          <li>
            <img src="img/coursemobile.svg" alt="Course" className="icon" />
            <a href="https://admin.hackathon.blackbucks.me/createAndManageCourse/">Course</a>
          </li>
          <li>
            <img src="img/lessonplanmobile.svg" alt="Lesson Plan" className="icon" />
            <a href="https://admin.hackathon.blackbucks.me/lessonPlan/">Lesson Plan</a>
          </li>
          <li>
            <img src="img/trainingmobile.svg" alt="Trainings" className="icon" />
            <a href="trainingsDashboard">Trainings</a>
          </li>
          <li>
            <img src="img/internshipsmobile.svg" alt="Internships" className="icon" />
            <a href="internshipsDashboard">Internships</a>
          </li>
          <li>
            <img src="img/vplmobile.svg" alt="VPL" className="icon" />
            <a href="https://admin.hackathon.blackbucks.me/createAndManageLabTest/">VPL</a>
          </li>
        </ul>
      </nav>
      <div className="footer">
        <img src="img/LOGOUT.svg" alt="Logo" className="logo-image" />
      </div>
    </aside>
  );
}
