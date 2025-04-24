document.addEventListener('DOMContentLoaded', async () => {
  const collegeId = "872";


  try {
    const response = await fetch(`/api/college_details/fetchCollegeData/${collegeId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    if (data.length === 0) {
      throw new Error('College not found');
    }

    const college = data[0]; // Assuming only one result is returned

    console.log(college);

    // Update the text content of the spans with the college data
    document.querySelector('#collegeName').textContent = college.name;
    document.querySelector('#collegeN').textContent = college.name;
    document.querySelector('#collegeType').textContent = college.type;
    document.querySelector('#collegeLocation').textContent = college.location;
    document.querySelector('#collegeDescription').textContent = college.description;
    document.querySelector('#collegeBanner').src = college.college_banner;
    document.querySelector('#collegeLogo').src = college.logo;
    document.querySelector('#collegeImages').src = college.images;
    document.querySelector('#collegeBus').textContent = college.bus;
    document.querySelector('#collegeCafeteria').textContent = college.cafeteria;
    document.querySelector('#collegeGym').textContent = college.gym;
    document.querySelector('#collegeHostel').textContent = college.hostel;
    document.querySelector('#collegeHostelDescription').textContent = college.hostel_description;
    document.querySelector('#collegeNirfDescription').textContent = college.nirf_description;
    document.querySelector('#collegeLibrary').textContent = college.library;
    document.querySelector('#collegeLibraryDescription').textContent = college.library_description;
    document.querySelector('#collegeSportsComplex').textContent = college.sports_complex;
    document.querySelector('#collegeSportsComplexDescription').textContent = college.sports_complex_description;
    document.querySelector('#collegeLabs').textContent = college.labs;
    document.querySelector('#collegeLabsDescription').textContent = college.labs_description;
    document.querySelector('#collegeMedicalFacilities').textContent = college.medical_facilities;
    document.querySelector('#collegeWifi').textContent = college.wifi;
  } catch (error) {
    console.error('Error fetching college data:', error.message);
  }
});
