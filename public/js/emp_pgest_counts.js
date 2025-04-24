// Function to fetch data from the server and update the HTML elements
function fetchData() {
    fetch('api/emp_cards/main_cards')
        .then(response => response.json())
        .then(data => {
            // Check if total_participants and average_emp_score are empty and set them to 0 if they are
            const totalParticipants = data.total_participants || 0;
            const averageEmpScore = data.avg_emp_score || 0;

            if(data.total_participants==='0' || !data){
                checkTotalParticipants()
            }


            document.getElementById('totalParticipants').innerText = totalParticipants;
            document.getElementById('totalCollegeCodes').innerText = data.total_college_codes;
            
            document.getElementById('collegeRank').innerText = data.college_rank;
            document.getElementById('average_emp_score').innerText = averageEmpScore;
            document.getElementById('zero_scorers').innerText = data.zero_scorers;
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Call the fetchData function when the page is loaded




  function checkTotalParticipants() {
    console.log('popup calling......')
      document.getElementById('popup-overlay').classList.add('show');
  }

  function closePopup() {
    document.getElementById('popup-overlay').classList.remove('show');
  }



// document.addEventListener('DOMContentLoaded', () => {checkTotalParticipants();});  
document.addEventListener('DOMContentLoaded', fetchData);
