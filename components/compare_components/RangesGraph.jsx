import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Bar } from 'react-chartjs-2';
import './ranges.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RangesGraphWithBarChart = ({ selectedAssessments }) => {
  const [filter, setFilter] = useState('employability');
  const [ranges, setRanges] = useState(['0-10', '11-20', '21-30']);
  const [customRanges, setCustomRanges] = useState([{ min: 0, max: 10 }, { min: 11, max: 20 }, { min: 21, max: 30 }]);
  const [data, setData] = useState({});
  const [isRangeCustomizing, setIsRangeCustomizing] = useState(false);

  // Small bump for zero values
  const minBump = 0.9;

  useEffect(() => {
    const fetchGraphData = async () => {
      if (selectedAssessments.length === 2) {
        try {
          const hackathonIds = selectedAssessments.map(a => a.value).join(',');
          const rangesQuery = ranges.join(',');
          const response = await axios.get('/api/compare/assessment_scores', {
            params: {
              hackathon_id: hackathonIds,
              filter: filter,
              ranges: rangesQuery,
              min: 0,
              max: 100
            }
          });
          setData(response.data);
        } catch (error) {
          console.error('Error fetching graph data:', error);
        }
      }
    };

    fetchGraphData();
  }, [selectedAssessments, filter, ranges]);

  const handleRangeChange = (index, key, value) => {
    const updatedRanges = [...customRanges];
    updatedRanges[index][key] = value;
    setCustomRanges(updatedRanges);
  };

  const addCustomRange = () => {
    setCustomRanges([...customRanges, { min: 0, max: 0 }]);
  };

  const removeRange = (index) => {
    if (customRanges.length <= 2) {
      alert('You must have at least 2 ranges.');
      return;
    }

    const updatedRanges = customRanges.filter((_, i) => i !== index);
    setCustomRanges(updatedRanges);
  };

  const handleApplyRanges = () => {
    const validRanges = customRanges
      .filter(range => range.min !== undefined && range.max !== undefined && range.min !== range.max)
      .map(range => `${range.min}-${range.max}`);

    if (validRanges.length < 2) {
      alert('You must provide at least 2 ranges.');
      return;
    }

    // Update the ranges state directly with valid custom ranges
    setRanges(validRanges);
    setIsRangeCustomizing(false);
  };

  const handleCancel = () => {
    setIsRangeCustomizing(false);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filters = [
    { value: 'employability', label: 'Employability' },
    { value: 'aptitude', label: 'Aptitude' },
    { value: 'coding', label: 'Coding' },
    { value: 'english', label: 'English' }
  ];

  const generateChartData = () => {
    const labels = ranges;

    const assessment1Counts = ranges.map(range => {
      const count = (data[range] && data[range][selectedAssessments[0]?.value]) || 0;
      return count === 0 ? minBump : count;
    });

    const assessment2Counts = ranges.map(range => {
      const count = (data[range] && data[range][selectedAssessments[1]?.value]) || 0;
      return count === 0 ? minBump : count;
    });

    return {
      labels: labels,
      datasets: [
        {
          label: selectedAssessments[0]?.label || 'Assessment 1',
          data: assessment1Counts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          borderRadius: 10,
          barThickness: 50,
        },
        {
          label: selectedAssessments[1]?.label || 'Assessment 2',
          data: assessment2Counts,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          borderRadius: 10,
          barThickness: 50,
        }
      ]
    };
  };

  const openCustomizePopup = () => {
    // Ensure that we only show ranges that are valid
    const filteredRanges = customRanges.filter(range => range.min !== 0 || range.max !== 0);
    setCustomRanges(filteredRanges);
    setIsRangeCustomizing(true);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom', // Change this to 'bottom' to move the legends below the graph
        labels: {
          padding: 10 // This controls padding between legend items (optional)
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.dataset.label + ': ' + (context.raw === minBump ? '0' : context.raw);
          }
        }
      },
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'top',
        color: '#000',
        font: {
          weight: 'bold'
        },
        formatter: (value) => value === minBump ? '0' : value
      }
    },
    layout: {
      padding: {
        top: 30, // This controls space above the chart
        bottom: 2, // Increase this to create space between bars and legend
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ranges'
        },
        grid: {
          display: false
        },
        ticks: {
          autoSkip: false
        },
        barPercentage: 0.2,
        categoryPercentage: 1.0
      },
      y: {
        display: false,
        grid: {
          display: false
        }
      }
    }
  };
  

  return (
    <div className="ranges-graph-container">
      <div className="graph-controls-container">
        <div className="filter-buttons-container">
          {filters.map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? "contained" : "outlined"}
              color="primary"
              onClick={() => setFilter(option.value)}
              className={`filter-button ${filter === option.value ? 'active' : ''}`}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="customize-container">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={openCustomizePopup} 
            className="range-customize-button"
          >
            Customize Ranges
          </Button>
          <div className={`customize-popup ${isRangeCustomizing ? 'show' : ''}`}>
            <h3>Customize Ranges</h3>
            {customRanges.map((range, index) => (
              <div key={index} className="range-input-container">
                <input
                  type="number"
                  value={range.min}
                  onChange={(e) => handleRangeChange(index, 'min', Number(e.target.value))}
                  placeholder="Min"
                  className="range-input"
                />
                <input
                  type="number"
                  value={range.max}
                  onChange={(e) => handleRangeChange(index, 'max', Number(e.target.value))}
                  placeholder="Max"
                  className="range-input"
                />
                {customRanges.length > 2 && (
                  <button className="remove-range-button" onClick={() => removeRange(index)}>
                    -
                  </button>
                )}
              </div>
            ))}
            <IconButton onClick={addCustomRange} color="primary" className="add-range-button">
              <AddIcon />
            </IconButton>
            <div className="popup-buttons">
              <Button onClick={handleApplyRanges} variant="contained" color="primary" className="save-ranges-button">Save</Button>
              <Button onClick={handleCancel} variant="outlined" color="secondary" className="cancel-ranges-button">Cancel</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bar-chart-container">
        <Bar
          data={generateChartData()}
          options={options}
        />
      </div>
    </div>
  );
};

export default RangesGraphWithBarChart;
