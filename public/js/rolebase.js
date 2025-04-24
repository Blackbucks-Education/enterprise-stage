const defaultMonthlyReport = [
  {
    "formatted_month": "September 2023",
    "student_count": "4",
    "avg_emp_score": "13",
    "avg_apt_score": "25",
    "avg_eng_score": "45",
    "avg_coding_score": "0",
    "banda_count": "0",
    "bandb_count": "0",
    "bandc_count": "0",
    "bandd_count": "0",
    "bandf_count": "4"
  },
  {
    "formatted_month": "October   2023",
    "student_count": "1",
    "avg_emp_score": "16",
    "avg_apt_score": "15",
    "avg_eng_score": "18",
    "avg_coding_score": "15",
    "banda_count": "0",
    "bandb_count": "0",
    "bandc_count": "0",
    "bandd_count": "0",
    "bandf_count": "1"
  },
  {
    "formatted_month": "November  2023",
    "student_count": "374",
    "avg_emp_score": "28",
    "avg_apt_score": "50",
    "avg_eng_score": "26",
    "avg_coding_score": "20",
    "banda_count": "0",
    "bandb_count": "0",
    "bandc_count": "3",
    "bandd_count": "52",
    "bandf_count": "319"
  },
  {
    "formatted_month": "December  2023",
    "student_count": "64",
    "avg_emp_score": "22",
    "avg_apt_score": "54",
    "avg_eng_score": "22",
    "avg_coding_score": "1",
    "banda_count": "0",
    "bandb_count": "0",
    "bandc_count": "0",
    "bandd_count": "19",
    "bandf_count": "45"
  },
  {
    "formatted_month": "February  2024",
    "student_count": "22",
    "avg_emp_score": "47",
    "avg_apt_score": "76",
    "avg_eng_score": "47",
    "avg_coding_score": "43",
    "banda_count": "0",
    "bandb_count": "0",
    "bandc_count": "0",
    "bandd_count": "7",
    "bandf_count": "15"
  },
  {
    "formatted_month": "March     2024",
    "student_count": "17",
    "avg_emp_score": "47",
    "avg_apt_score": "72",
    "avg_eng_score": "44",
    "avg_coding_score": "37",
    "banda_count": "0",
    "bandb_count": "0",
    "bandc_count": "0",
    "bandd_count": "1",
    "bandf_count": "16"
  },
  {
    "formatted_month": "April     2024",
    "student_count": "2",
    "avg_emp_score": "43",
    "avg_apt_score": "87",
    "avg_eng_score": "47",
    "avg_coding_score": "22",
    "banda_count": "0",
    "bandb_count": "0",
    "bandc_count": "0",
    "bandd_count": "1",
    "bandf_count": "1"
  },
  {
    "formatted_month": "May       2024",
    "student_count": "41",
    "avg_emp_score": "17",
    "avg_apt_score": "35",
    "avg_eng_score": "21",
    "avg_coding_score": "2",
    "banda_count": "0",
    "bandb_count": "0",
    "bandc_count": "0",
    "bandd_count": "3",
    "bandf_count": "38"
  },
  {
    "formatted_month": "June      2024",
    "student_count": "102",
    "avg_emp_score": "38",
    "avg_apt_score": "63",
    "avg_eng_score": "41",
    "avg_coding_score": "28",
    "banda_count": "1",
    "bandb_count": "2",
    "bandc_count": "0",
    "bandd_count": "19",
    "bandf_count": "80"
  },
  {
    "formatted_month": "July      2024",
    "student_count": "45",
    "avg_emp_score": "40",
    "avg_apt_score": "65",
    "avg_eng_score": "36",
    "avg_coding_score": "30",
    "banda_count": "0",
    "bandb_count": "0",
    "bandc_count": "2",
    "bandd_count": "11",
    "bandf_count": "32"
  }
]


document.addEventListener("DOMContentLoaded", function() {
  const userRole = window.userRole; // Access the globally defined userRole
  const currentPath = window.location.pathname;

  const employabilityPages = [
    "/employabilityReport",
    "/employbilityMonthlyReport",
    "/employabilityStudentsResults",
    "/employabilityStudentReport",
    "/assessmentDashboard",
    "/assessmentReport",
    "/assessmentStudentResults",
    "/assessmentStudentReport"
  ];

  const internshipsPages = [
    "/internshipsDashboard",
    "/internshipReport",
    "/internshipDomainReport",
    "/internshipsDashboardsample",
    "/internshipDomainsample"
  ];

  let shouldDisplayPopup = false;
  let redirectPath = ""; // Set redirect path based on role

  if (userRole === "EmployabilityAdmin") {
    shouldDisplayPopup = !employabilityPages.includes(currentPath);
    redirectPath = "/employabilityReport";
  } else if (userRole === "InternshipsAdmin") {
    shouldDisplayPopup = !internshipsPages.includes(currentPath);
    redirectPath = "/internshipsDashboard";
  } else if (userRole === "SuperAdmin") {
    shouldDisplayPopup = ![...employabilityPages, ...internshipsPages].includes(currentPath);
    redirectPath = "/employabilityReport";
  }

  if (shouldDisplayPopup) {
    // Create the modal elements
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "9999";

    const popup = document.createElement("div");
    popup.style.backgroundColor = "#fff";
    popup.style.padding = "20px";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    popup.style.textAlign = "center";
    popup.style.maxWidth = "400px";
    popup.style.width = "100%";
    popup.style.position = "relative"; // Needed for the close button positioning

    // Create and style the image element
    const image = document.createElement("img");
    image.src = "img/noaccess.png"; // Path to your image
    image.style.width = "70%"; // Adjust width as needed
    image.style.height = "auto"; // Maintain aspect ratio
    image.style.borderRadius = "10px"; // Optional: match the popup's border radius
    image.style.marginBottom = "15px"; // Space between image and text

    const message = document.createElement("p");
    message.textContent = "You don't have access to view this page. Please contact our Sales Administration.";
    message.style.marginBottom = "20px";
    message.style.color = "#000"; // Dark text for better visibility
    message.style.fontWeight = "bold";

    // Container for message and button
    const container = document.createElement("div");
    container.style.paddingBottom = "40px"; // Space for the button

    // Create and style the close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "OK";
    closeButton.style.padding = "10px 20px";
    closeButton.style.backgroundColor = "#7962bd";
    closeButton.style.color = "#fff";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";
    closeButton.style.position = "absolute";
    closeButton.style.bottom = "20px";
    closeButton.style.left = "50%";
    closeButton.style.transform = "translateX(-50%)";
    closeButton.style.textDecoration = "none";

    // Append elements
    container.appendChild(message);
    container.appendChild(closeButton);
    popup.appendChild(image);
    popup.appendChild(container);
    modal.appendChild(popup);
    document.body.appendChild(modal);

    // Redirect after clicking OK
    closeButton.addEventListener("click", function() {
      window.location.href = redirectPath;
    });
  }
});
