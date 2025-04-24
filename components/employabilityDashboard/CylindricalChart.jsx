"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register chart.js components
Chart.register(...registerables);

const CylindricalChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const chartRef = useRef(null); // Create a ref to store the chart instance

  useEffect(() => {
    fetchDataAndRenderChart();

    // Cleanup function to destroy chart instance on component unmount or before re-rendering
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const fetchDataAndRenderChart = async () => {
    try {
      const response = await fetch('api/emp_accuracy_analysis/data');
      const data = await response.json();
      console.log("Data received:", data);

      // Ensure the data is defined and has sub_domain_stats
      if (data && data.sub_domain_stats && data.sub_domain_stats.length > 0) {
        const processedData = processChartData(data.sub_domain_stats);
        setChartData(processedData);
      } else {
        console.error('Data structure is not as expected:', data);
        setError('No data available');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (subDomainStats) => {
    const filteredStatsArray = subDomainStats.filter(data => parseFloat(data.average_accuracy) > 0);
    const subDomainNames = filteredStatsArray.map(data => data.sub_domain.replace(/"/g, ''));
    const subDomainScores = filteredStatsArray.map(data => parseFloat(data.average_accuracy));
    const emptyData = subDomainScores.map(value => 100 - value);

    return {
      labels: subDomainNames,
      datasets: [
        {
          label: 'Accuracy',
          data: subDomainScores,
          backgroundColor: 'rgba(121, 98, 189, 0.8)',
          borderColor: 'rgba(121, 98, 189, 1)',
          borderWidth: 0,
          borderRadius: {
            topLeft: 25,
            topRight: 25,
            bottomLeft: 25,
            bottomRight: 25,
          },
          borderSkipped: false,
          stack: 'stack1',
          barThickness: 20,
          categoryPercentage: 0.5,
        },
        {
          label: 'Remaining',
          data: emptyData,
          backgroundColor: 'rgba(0,0,0,0.06)',
          borderColor: 'rgba(128, 128, 128, 1)',
          borderWidth: 0,
          borderRadius: {
            topLeft: 25,
            topRight: 25,
          },
          borderSkipped: false,
          stack: 'stack1',
          barThickness: 20,
          categoryPercentage: 0.5,
        },
      ],
    };
  };

  useEffect(() => {
    if (chartData) {
      const ctx = canvasRef.current.getContext('2d');

      // Destroy the previous chart if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const config = {
        type: 'bar',
        data: chartData,
        options: {
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                filter: (labelItem) => labelItem.text !== 'Remaining',
                usePointStyle: true,
                pointStyle: 'rectRounded',
                fontSize: 12,
              },
            },
          },
          animation: {
            duration: 0,
          },
          scales: {
            x: {
              stacked: true,
              display: true,
              grid: {
                display: false,
                drawTicks: false,
                drawBorder: false,
              },
            },
            y: {
              display: false,
              ticks: {
                stepSize: 50,
              },
              grid: {
                display: false,
              },
            },
          },
        },
      };

      // Create the new chart instance and save it to the ref
      chartRef.current = new Chart(ctx, config);
    }
  }, [chartData]);

  return (
    <div id="chartSection" style={{ position: 'relative' }}>
      {loading && <div className="shimmer-loader" />}
      {error && <div id="noDataMessage">{error}</div>}
      <canvas ref={canvasRef} id="cylindricalChart" style={{ display: loading || error ? 'none' : 'block' }} />
      <style jsx>{`
        .shimmer-loader {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.1) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: 0 0;
          }
        }

        #noDataMessage {
          color: red;
          text-align: center;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default CylindricalChart;
