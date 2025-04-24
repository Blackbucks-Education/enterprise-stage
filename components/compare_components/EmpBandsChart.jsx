import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Import Chart.js
import '../../app/compareAssessments/EmpBands.css'; // Ensure this path is correct

const EmpBands = ({ selectedAssessments }) => {
  const [bandCounts, setBandCounts] = useState([]);

  useEffect(() => {
    const fetchBandCounts = async () => {
      if (selectedAssessments.length === 2) {
        const hackathonIds = selectedAssessments.map(a => a.value);
        try {
          const response1 = await axios.get('/api/compare/employability_band_counts', {
            params: { hackathon_id: hackathonIds[0] },
          });
          const response2 = await axios.get('/api/compare/employability_band_counts', {
            params: { hackathon_id: hackathonIds[1] },
          });

          setBandCounts([response1.data[0], response2.data[0]]);
        } catch (error) {
          console.error('Error fetching band counts:', error);
        }
      }
    };

    fetchBandCounts();
  }, [selectedAssessments]);

  // Generate random data if no data is fetched
  const generateRandomData = () => {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 100));
  };

  const bands = [
    { label: 'A++', key: 'count_a_plus_plus' },
    { label: 'A+', key: 'count_a_plus' },
    { label: 'A', key: 'count_a' },
    { label: 'B', key: 'count_b' },
    { label: 'C', key: 'count_c' },
    { label: 'F', key: 'count_f' }
  ];

  const labels = bands.map(band => band.label);

  // If data is fetched, use it; otherwise, generate random data
  const data1 = bandCounts[0] ? bands.map(band => bandCounts[0][band.key]) : generateRandomData();
  const data2 = bandCounts[1] ? bands.map(band => bandCounts[1][band.key]) : generateRandomData();

  const data = {
    labels,
    datasets: [
      {
        label: selectedAssessments[0]?.label || 'Assessment 1 (Placeholder)',
        data: data1,
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.4,
      },
      {
        label: selectedAssessments[1]?.label || 'Assessment 2 (Placeholder)',
        data: data2,
        fill: true,
        backgroundColor: 'rgba(153,102,255,0.2)',
        borderColor: 'rgba(153,102,255,1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 24,
          padding: 15,
          color: 'rgba(0, 0, 0, 0.7)',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        display: true,
        grid: { display: false },
        ticks: { display: true },
      },
    },
    elements: {
      line: { borderWidth: 2 },
      point: { radius: 0 },
    },
  };

  return (
    <div className="empbands-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default EmpBands;
