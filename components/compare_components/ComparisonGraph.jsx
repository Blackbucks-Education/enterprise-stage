import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import '../../app/compareAssessments/compare.css';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const ComparisonGraph = ({ selectedAssessments }) => {
  const [graphData, setGraphData] = useState([]);
  const [category, setCategory] = useState('employability');

  useEffect(() => {
    const fetchGraphData = async () => {
      if (selectedAssessments.length === 2) {
        const hackathonIds = selectedAssessments.map(a => a.value).join(',');
        try {
          const response = await axios.get('/api/compare/average_scores', {
            params: { hackathon_id: hackathonIds }
          });
          setGraphData(response.data);
        } catch (error) {
          console.error('Error fetching graph data:', error);
        }
      }
    };
    fetchGraphData();
  }, [selectedAssessments, category]);

  const sanitizeData = (value) => value !== null && value >= 0 ? value : 0;

  const getCategoryData = () => {
    // Default data when no graph data is available
    const defaultData = {
      labels: ['Assessment 1', 'Assessment 2'],
      datasets: [
        {
          label: 'Max',
          backgroundColor: '#7962bd',
          data: [70, 80], // Default random data
          borderRadius: 10,
          barThickness: 50,
        },
        {
          label: 'Avg',
          backgroundColor: 'rgba(121, 98, 189, 0.5)',
          data: [50, 60],
          borderRadius: 10,
          barThickness: 50,
        },
        {
          label: 'Min',
          backgroundColor: 'rgba(178, 157, 236, 0.2)',
          data: [30, 40],
          borderRadius: 10,
          barThickness: 50,
        }
      ]
    };

    if (!graphData || graphData.length === 0) {
      return defaultData;
    }

    const assessment1 = graphData[0] || {};
    const assessment2 = graphData[1] || {};

    const categoryMap = {
      'employability': ['max_total_score', 'average_marks', 'min_total_score'],
      'coding': ['max_coding', 'average_coding', 'min_coding'],
      'english': ['max_english', 'average_english', 'min_english'],
      'aptitude': ['max_aptitude', 'average_aptitude', 'min_aptitude']
    };

    const fields = categoryMap[category];

    return {
      labels: [
        selectedAssessments[0]?.label || 'Assessment 1', 
        selectedAssessments[1]?.label || 'Assessment 2'
      ],
      datasets: [
        {
          label: 'Max',
          backgroundColor: '#7962bd',
          data: [
            sanitizeData(Number(assessment1[fields[0]])), 
            sanitizeData(Number(assessment2[fields[0]]))
          ],
          borderRadius: 10, 
          barThickness: 50, 
        },
        {
          label: 'Avg',
          backgroundColor: 'rgba(121, 98, 189, 0.5)',
          data: [
            sanitizeData(Number(assessment1[fields[1]])), 
            sanitizeData(Number(assessment2[fields[1]]))
          ],
          borderRadius: 10, 
          barThickness: 50, 
        },
        {
          label: 'Min',
          backgroundColor: 'rgba(178, 157, 236, 0.2)',
          data: [
            sanitizeData(Number(assessment1[fields[2]])), 
            sanitizeData(Number(assessment2[fields[2]]))
          ],
          borderRadius: 10, 
          barThickness: 50, 
        }
      ]
    };
  };

  return (
    <div className="comparison-container">
      <div className="bar-chart-container">
        <Bar 
          data={getCategoryData()} 
          options={{
            scales: {
              x: {
                beginAtZero: true,
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                display: false,
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  boxWidth: 10
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.raw}`;
                  }
                }
              },
              datalabels: {
                display: true,
                color: '#444',
                anchor: 'end',
                align: 'top',
                formatter: (value) => value,
                font: {
                  weight: 'bold',
                  size: 12
                }
              }
            }
          }} 
          height={300}
          width={600}
        />
      </div>

      <div className="filter-cards-container">
        {['employability', 'coding', 'english', 'aptitude'].map((item) => (
          <div 
            key={item}
            className={`filter-card ${category === item ? 'active' : ''}`}
            onClick={() => setCategory(item)}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonGraph;
