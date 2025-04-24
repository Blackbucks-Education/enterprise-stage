document.addEventListener('DOMContentLoaded', () => {
  fetchColleges();
});

async function fetchColleges() {
  try {
      const response = await fetch('/api/createCollege/colleges');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const colleges = await response.json();
      populateDropdown(colleges);
  } catch (error) {
      console.error('Error fetching colleges:', error);
  }
}

function populateDropdown(colleges) {
  const collegeDropdown = document.getElementById('collegeDropdown');
  collegeDropdown.innerHTML = ''; // Clear existing options

  colleges.forEach(college => {
      const div = document.createElement('div');
      div.className = 'dropdown-item';
      div.textContent = college.name;
      div.setAttribute('data-id', college.id);
      div.onclick = () => selectCollege(college);
      collegeDropdown.appendChild(div);
  });
}

function filterColleges() {
  const input = document.getElementById('collegeSearch');
  const filter = input.value.toLowerCase();
  const dropdown = document.getElementById('collegeDropdown');
  const items = dropdown.getElementsByClassName('dropdown-item');

  let hasResults = false;

  for (let i = 0; i < items.length; i++) {
      const txtValue = items[i].textContent || items[i].innerText;
      if (txtValue.toLowerCase().indexOf(filter) > -1) {
          items[i].style.display = '';
          hasResults = true;
      } else {
          items[i].style.display = 'none';
      }
  }

  dropdown.style.display = hasResults ? 'block' : 'none';
}

function selectCollege(college) {
  const input = document.getElementById('collegeSearch');
  input.value = college.collegeName;
  const input1 = document.getElementById('college_id');
  input1.value = college.collegeID;
  console.log("selected college id:", input1.value);
  document.getElementById('collegeDropdown').style.display = 'none';
}
