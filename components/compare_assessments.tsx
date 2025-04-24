"use client";

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import '../public/css/compare.css'; // Import the CSS file

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement);

const CompareAssessments = () => {
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [showGraph, setShowGraph] = useState(false);
  const [options, setOptions] = useState<any[]>([]); 
  const [participantCounts, setParticipantCounts] = useState<number[]>([]);
  const [averageScores, setAverageScores] = useState<any[]>([]);
  const [minScore, setMinScore] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(100);
  const [customRanges, setCustomRanges] = useState<{ start: number; end: number }[]>([{ start: 0, end: 10 }, { start: 11, end: 20 }]);
  const [employabilityCounts, setEmployabilityCounts] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('employability');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [bandCounts, setBandCounts] = useState<any[]>([]);  // New state variable for band counts
  const [comparisonInsight, setComparisonInsight] = useState<string>(''); // New state variable for comparison insight

  useEffect(() => {
    // Fetch hackathons data from the API
    const fetchHackathons = async () => {
      try {
        const response = await fetch('api/compare/hackathons');
        const data = await response.json();

        const formattedOptions = data.map((hackathon: any) => ({
          value: hackathon.id,
          label: hackathon.title
        }));

        setOptions(formattedOptions);
      } catch (error) {
        console.error('Error fetching hackathons:', error);
      }
    };

    fetchHackathons();
  }, []);

  useEffect(() => {
    if (selectedOptions.length === 2) {
      fetchEmployabilityData(); // Fetch employability data whenever selected options or ranges change
      fetchBandCounts(); // Fetch band counts whenever selected options change
    }
  }, [minScore, maxScore, selectedFilter, selectedOptions, customRanges]);

  const fetchEmployabilityData = async () => {
    try {
      const employabilityData = await Promise.all(
        selectedOptions.map(async (option: any) => {
          const ranges = customRanges.map(range => `${range.start}-${range.end}`).join(',');
          const response = await fetch(`/api/compare/assessment_scores?hackathon_id=${option.value}&filter=${selectedFilter}&min=${minScore}&max=${maxScore}&ranges=${ranges}`);
          const data = await response.json();
          return data;
        })
      );

      // Aggregate data
      const aggregatedData = customRanges.map(range => {
        const key = `${range.start}-${range.end}`;
        return selectedOptions.map((_, index) => {
          return employabilityData[index][key] || 0;
        });
      });

      setEmployabilityCounts(aggregatedData);
      setShowGraph(true);
    } catch (error) {
      console.error('Error fetching employability data:', error);
    }
  };

  const fetchBandCounts = async () => {
    try {
      const bandData = await Promise.all(
        selectedOptions.map(async (option: any) => {
          const response = await fetch(`/api/compare/employability_band_counts?hackathon_id=${option.value}`);
          const data = await response.json();
          return data[0]; // Assuming the API returns an array with one object
        })
      );
      setBandCounts(bandData);
    } catch (error) {
      console.error('Error fetching employability band counts:', error);
    }
  };

  const getParticipantGraphData = () => {
    const data = {
      labels: selectedOptions.map((option: any) => option.label),
      datasets: [
        {
          label: 'Student Count',
          data: participantCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
    return data;
  };

  const getAverageScoreGraphData = () => {
    const labels = ['Employability', 'Aptitude', 'Coding', 'English'];
    const datasets = selectedOptions.map((option: any, index: number) => ({
      label: option.label,
      data: averageScores[index],
      borderColor: index === 0 ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
      backgroundColor: index === 0 ? 'rgba(54, 162, 235, 0.2)' : 'rgba(255, 99, 132, 0.2)',
      borderWidth: 2,
      fill: false,
      tension: 0.4,
    }));

    return {
      labels,
      datasets,
    };
  };

  const getEmployabilityGraphData = () => {
    const labels = customRanges.map(range => `${range.start}-${range.end}`);
    const datasets = selectedOptions.map((option: any, index: number) => ({
      label: `${option.label} ${selectedFilter} Count`,
      data: employabilityCounts.map(counts => counts[index] || 0),
      backgroundColor: index === 0 ? 'rgba(153, 102, 255, 0.2)' : 'rgba(255, 159, 64, 0.2)',
      borderColor: index === 0 ? 'rgba(153, 102, 255, 1)' : 'rgba(255, 159, 64, 1)',
      borderWidth: 1,
    }));

    return {
      labels,
      datasets,
    };
  };

  const handleChange = (options: any) => {
    if (options.length > 2) {
      // Limit to two selections
      return;
    }
    setSelectedOptions(options);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleRangeChange = (index: number, field: 'start' | 'end', value: number) => {
    const updatedRanges = [...customRanges];
    updatedRanges[index] = { ...updatedRanges[index], [field]: value };
    setCustomRanges(updatedRanges);
  };

  const handleCompare = async () => {
    try {
      // Fetch participant counts
      const counts = await Promise.all(
        selectedOptions.map(async (option: any) => {
          const response = await fetch(`/api/compare/participant_count?hackathon_id=${option.value}`);
          const data = await response.json();
          return data[0]?.participant_count || 0;
        })
      );
      setParticipantCounts(counts);

      // Fetch average scores
      const scores = await Promise.all(
        selectedOptions.map(async (option: any) => {
          const response = await fetch(`/api/compare/average_scores?hackathon_id=${option.value}`);
          const data = await response.json();
          return [
            data.average_marks,
            data.average_aptitude,
            data.average_coding,
            data.average_english,
            data.average_marks // Storing the average employability score
          ];
        })
      );
      setAverageScores(scores);

      // Calculate and display the difference in average employability scores
      if (scores.length === 2) {
        const difference = scores[0][4] - scores[1][4];
        const comparisonMessage = `The average employability score for "${selectedOptions[0].label}" is ${
          difference > 0 ? difference + " more" : Math.abs(difference) + " less"
        } than "${selectedOptions[1].label}".`;
        setComparisonInsight(comparisonMessage); // Set the comparison message to state
      }

      setShowGraph(true);
    } catch (error) {
      console.error('Error fetching comparison data:', error);
    }
  };

  const handleApplyCustomRanges = () => {
    if (customRanges.length !== 2) {
      setComparisonInsight('Please provide exactly two ranges.'); // Set error message to state
      return;
    }
    setShowPopup(false);
    fetchEmployabilityData();
  };

  return (
    <div className="container">
      <div className="selectContainer">
        <Select
          options={options}
          isMulti
          value={selectedOptions}
          onChange={handleChange}
          placeholder="Select assessments..."
          isClearable
        />
      </div>
      <div className="selectedItems">
        <h2>Selected Values:</h2>
        {selectedOptions.map((option: any) => (
          <span key={option.value} className="selectedItem">
            {option.label}
            <button
              onClick={() => setSelectedOptions(selectedOptions.filter(o => o.value !== option.value))}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <button className="compareButton" onClick={handleCompare} disabled={selectedOptions.length === 0}>
        Compare
      </button>
      {showGraph && (
        <>
          <div className="graphContainer">
            <h2>Participant Count</h2>
            <Bar data={getParticipantGraphData()} />
          </div>
          <div className="graphContainer">
            <h2>Average Scores</h2>
            <Line data={getAverageScoreGraphData()} />
          </div>
          <div className="graphContainer">
            <h2>Employability Count Comparison</h2>
            <div className="rangeFilters">
              <select
                value={selectedFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="customDropdown"
              >
                <option value="employability">Employability</option>
                <option value="coding">Coding</option>
                <option value="aptitude">Aptitude</option>
                <option value="english">English</option>
              </select>
              <button className="customButton" onClick={() => setShowPopup(true)}>Custom Range</button>
            </div>
            <Bar data={getEmployabilityGraphData()} />
          </div>
          <div className="tableContainer">
            <h2>Employability Band Counts</h2>
            <table>
              <thead>
                <tr>
                  <th>Hackathon</th>
                  <th>A++</th>
                  <th>A+</th>
                  <th>A</th>
                  <th>B</th>
                  <th>C</th>
                  <th>F</th>
                  <th>A++ (Possible)</th>
                  <th>A+ (Possible)</th>
                  <th>A (Possible)</th>
                  <th>B (Possible)</th>
                  <th>C (Possible)</th>
                  <th>F (Possible)</th>
                </tr>
              </thead>
              <tbody>
                {bandCounts.map((band: any, index: number) => {
                  const selectedOption = selectedOptions[index];
                  return selectedOption ? (
                    <tr key={index}>
                      <td>{selectedOption.label}</td>
                      <td>{band.count_a_plus_plus}</td>
                      <td>{band.count_a_plus}</td>
                      <td>{band.count_a}</td>
                      <td>{band.count_b}</td>
                      <td>{band.count_c}</td>
                      <td>{band.count_f}</td>
                      <td>{band.count_a_plus_plus_possible}</td>
                      <td>{band.count_a_plus_possible}</td>
                      <td>{band.count_a_possible}</td>
                      <td>{band.count_b_possible}</td>
                      <td>{band.count_c_possible}</td>
                      <td>{band.count_f_possible}</td>
                    </tr>
                  ) : null;
                })}
              </tbody>
            </table>
          </div>
          {comparisonInsight && (
            <div className="comparisonInsight">
              <p>{comparisonInsight}</p> {/* Display the comparison insight */}
            </div>
          )}
        </>
      )}
      {showPopup && (
        <div className="popupContainer">
          <div className="popupContent">
            <h3>Custom Ranges</h3>
            {customRanges.map((range, index) => (
              <div key={index} className="customRange">
                <input
                  type="number"
                  value={range.start}
                  onChange={(e) => handleRangeChange(index, 'start', parseInt(e.target.value))}
                  placeholder="Start"
                />
                <input
                  type="number"
                  value={range.end}
                  onChange={(e) => handleRangeChange(index, 'end', parseInt(e.target.value))}
                  placeholder="End"
                />
              </div>
            ))}
            <button className="applyButton" onClick={handleApplyCustomRanges}>Apply</button>
            <button className="cancelButton" onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareAssessments
