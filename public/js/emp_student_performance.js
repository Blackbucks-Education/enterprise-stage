const defaultAssessmentData = {
    "marks_stats": {
      "highest_marks": "80.37",
      "lowest_marks": "0.00",
      "average_marks": "25.04",
      "above_average_count": "336.00",
      "below_average_count_without_zeros": "341.00",
      "zero_scores_count": "21.00"
    },
    "aptitude_stats": {
      "highest_marks": "100.00",
      "lowest_marks": "0.00",
      "average_marks": "48.15",
      "above_average_count": 366,
      "below_average_count_without_zeros": 324,
      "zero_scores_count": 34
    },
    "english_stats": {
      "highest_marks": "65.26",
      "lowest_marks": "0.00",
      "average_marks": "25.56",
      "above_average_count": 266,
      "below_average_count_without_zeros": 327,
      "zero_scores_count": 29
    },
    "technical_stats": {
      "highest_marks": "100.00",
      "lowest_marks": "0.00",
      "average_marks": "10.37",
      "above_average_count": 198,
      "below_average_count_without_zeros": 514,
      "zero_scores_count": 349
    }
  };

let isSummaryActive;


document.addEventListener('DOMContentLoaded', function() {
    // Extract the college code from the URL
    const apiUrl = `api/emp_performance_overview/marks_section_stats`;

    // Fetch data from API using college code from URL
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            renderStudentPerformanceCharts(data);
            if(data.length==0){
                document.getElementById("summaruCont").style.opacity = "0.5";
            }
        })
        .catch((error)=>{
            console.log('Error Fetching Data..')
            //USE DEFAULT DATA
            renderStudentPerformanceCharts(defaultAssessmentData);
            document.getElementById("summaruCont").style.opacity = "0.5";

        });
});




function renderStudentPerformanceCharts(data) {
    const ctx1 = document.getElementById('marksDistributionChart').getContext('2d');

    // Sample data for testing purposes
    // Replace this with your actual data structure
    const chartData = {
        labels: ['Total Marks', 'Aptitude', 'English', 'Technical'],
        datasets: [
            {
                label: 'Highest Marks',
                backgroundColor: '#7962BD', // Purple,
                borderWidth: 1,
                data: [
                    data.marks_stats.highest_marks,
                    data.aptitude_stats.highest_marks,
                    data.english_stats.highest_marks,
                    data.technical_stats.highest_marks
                ]
            },
            {
                label: 'Lowest Marks',
                backgroundColor: 'rgba(178, 157, 236, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: [
                    data.marks_stats.lowest_marks,
                    data.aptitude_stats.lowest_marks,
                    data.english_stats.lowest_marks,
                    data.technical_stats.lowest_marks
                ]
            },
            {
                label: 'Average Marks',
                backgroundColor: 'rgba(121, 98, 189, 0.5)',
                borderWidth: 1,
                data: [
                    data.marks_stats.average_marks,
                    data.aptitude_stats.average_marks,
                    data.english_stats.average_marks,
                    data.technical_stats.average_marks
                ]
            }
        ]
    };

    // Chart configuration
    const config = {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                
                annotation: {
                    annotations: [{
                        type: 'line',
                        mode: 'vertical',
                        scaleID: 'x',
                        value: 'March',
                        borderColor: 'red',
                        borderWidth: 2,
                        label: {
                            content: 'Today',
                            enabled: true,
                            position: 'top'
                        }
                    }]
                }
            },
            scales: {
                x: {
                    stacked: false,
                    grid: {
                        display: false // Remove background graph lines on x-axis
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false // Remove background graph lines on y-axis
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        },
    };

    // Create the chart
    const myChart = new Chart(ctx1, config);

    document.getElementById('highestTotalMarks').textContent = data.marks_stats.highest_marks;
    document.getElementById('lowestTotalMarks').textContent = data.marks_stats.lowest_marks;
    document.getElementById('averageTotalMarks').textContent = data.marks_stats.average_marks;
}
