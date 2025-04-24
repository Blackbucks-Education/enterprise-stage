// let collegeId;
// //Access college id
// function getCookie(name) {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
// }

// function decodeJWT(token) {
//     const payload = token.split('.')[1]; // Get the payload part of the JWT
//     const decodedPayload = atob(payload); // Decode Base64 payload
//     return JSON.parse(decodedPayload); // Parse it as JSON
// }

// const token = getCookie("userAdminToken");
// if (token) {
//     const decodedData = decodeJWT(token);
//     collegeId = decodedData.college;
// } else {
//     console.log("No token found in cookies");
// }



document.getElementById('navbar-container').innerHTML = `
  <div class="navbar">
      <div class="nav1"></div>
      <div class="nav2">
          <a href="https://admin.hackathon.blackbucks.me/manageStudents/">
              <div class="chakra-stack css-nr8aow">
                  <img alt="Manage Users" src="img/newManageUsers.svg" class="chakra-image css-0">
              </div>
          </a>
          <a href="https://admin.hackathon.blackbucks.me/tpCalendar/" style="margin-left: 1rem;">
              <div class="chakra-stack css-nr8aow">
                  <img alt="Calendar" src="img/newCalenderNavIcon.svg" class="chakra-image css-0">
              </div>
          </a>
          <a href="https://admin.hackathon.blackbucks.me/manageNotification/" style="margin-left: 1rem;">
              <div class="chakra-stack css-nr8aow">
                  <div class="css-1edim3w">
                      <img alt="Notifications" src="img/newNotificationIcon.svg" class="chakra-image css-6su6fj">
                      <div class="css-1bac456">
                          <div class="css-1rkwksi">1</div>
                      </div>
                  </div>
              </div>
          </a>
          <button type="button" class="navbtn" id="userButton">
              <span class="user-details">
                  <div class="user">
                      <span class="user-profile">
                          <i class="fa-solid fa-circle-user" style="font-size: 30px;"></i>
                      </span>
                      <div class="username">
                          <p class="userN"></p>
                          <p class="userR"></p>
                      </div>
                  </div>
              </span>
              <span class="chakra-button__icon css-1hzyiq5">
                  <svg viewBox="0 0 16 16" height="12px" width="12px" aria-hidden="true" focusable="false"
                       fill="currentColor" xmlns="http://www.w3.org/2000/svg" color="black" class="css-1eamic5 ex0cdmw0">
                      <path fill-rule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path>
                  </svg>
              </span>
          </button>
          <!-- New College Page button -->
          <button type="button" class="logoutbtn" id="collegePageButton" style="display: none; top:46px !important;">
              College
          </button>
          <button type="button" class="logoutbtn" id="logoutButton" style="display: none;top:92px !important;">
              Log out
          </button>
          
      </div>
  </div>
`;


document.addEventListener('DOMContentLoaded', () => {
    // Function to get the value of a cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Get the JWT token from the cookie
    const token = getCookie('userAdminToken');

    if (token) {
        // Decode the JWT token
        const decoded = jwt_decode(token);

        // Display the username and role
        document.querySelector('.userN').textContent = decoded.email;
        document.querySelector('.userR').textContent = decoded.role;
    } else {
        // Handle the case where the token is not found
        document.querySelector('.userN').textContent = 'No user logged in';
        document.querySelector('.userR').textContent = '';
    }

    const userButton = document.getElementById('userButton');
    const collegePageButton = document.getElementById('collegePageButton');
    const logoutButton = document.getElementById('logoutButton');

    userButton.addEventListener('click', () => {
        if (collegePageButton.style.display === 'none') {
            // Show the College button first
            collegePageButton.style.display = 'flex';
            collegePageButton.style.top = `${userButton.offsetTop + userButton.offsetHeight}px`;
            collegePageButton.style.left = `${userButton.offsetLeft}px`;
            collegePageButton.style.margin = 'none';

            // Then show the Logout button below the College button
            logoutButton.style.display = 'flex';
            logoutButton.style.top = `${collegePageButton.offsetTop + collegePageButton.offsetHeight}px`;
            logoutButton.style.left = `${userButton.offsetLeft}px`;
        } else {
            // Hide both buttons
            logoutButton.style.display = 'none';
            collegePageButton.style.display = 'none';
        }
    });
    
    const collegeName = localStorage.getItem("collegeName");
    const collegeNameWithUnderscores = collegeName.replace(/ /g, "_");

    collegePageButton.addEventListener('click', () => {
        // Navigate to the college page with the collegeName as a query parameter
        window.location.href = `/viewCollege?collegeName=${collegeNameWithUnderscores}`;
    });
    

    logoutButton.addEventListener('click', () => {
        // Add your logout logic here
        console.log('User logged out');
    });
});


let collegeId;

// Access college id from the JWT token stored in cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`); // Split cookie string to find the token
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function decodeJWT(token) {
    const payload = token.split('.')[1]; // Get the payload part of the JWT
    const decodedPayload = atob(payload); // Decode Base64 payload
    return JSON.parse(decodedPayload); // Parse it as JSON
}

const token = getCookie("userAdminToken");
if (token) {
    const decodedData = decodeJWT(token); // Decode the JWT
    collegeId = decodedData.college; // Extract the college ID
} else {
    console.log("No token found in cookies");
}

// Logout functionality
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');

    logoutButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default button behavior

        // Create the logout modal using innerHTML
        const logoutModal = document.createElement('div');
        logoutModal.id = 'logoutModal';
        logoutModal.className = 'modal';
        logoutModal.style.display = 'none'; // Initially hidden

        logoutModal.innerHTML = `
            <div class="logout-content">
                <p class="question">Are you sure you want to logout?</p>
                <div class="logout-div"></div>
                <div class="logout-buttons">
                    <button id="cancelLogout">Cancel</button>
                    <button id="confirmLogout">Yes</button>
                </div>
            </div>
        `;
            
        // Append the modal to the body
        document.body.appendChild(logoutModal);

        // Show the modal
        logoutModal.style.display = 'block';

        // Get buttons inside the modal
        const confirmLogoutButton = logoutModal.querySelector('#confirmLogout');
        const cancelLogoutButton = logoutModal.querySelector('#cancelLogout');

        // Add event listeners to the modal buttons
        confirmLogoutButton.addEventListener('click', () => {
            // Clear localStorage
            localStorage.removeItem('collegeName');
            // Clear the userAdminToken cookie
            document.cookie = 'userAdminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

            // Redirect the user to the logout page or login page
            window.location.href = '/logout';

            // Hide the modal
            logoutModal.style.display = 'none';
        });

        cancelLogoutButton.addEventListener('click', () => {
            // If user cancels, hide the modal
            logoutModal.style.display = 'none';
        });

        // Add event listener to the modal itself to close when clicked outside
        window.addEventListener('click', (event) => {
            if (event.target === logoutModal) {
                logoutModal.style.display = 'none'; // Hide the modal
            }
        });
    });
});
