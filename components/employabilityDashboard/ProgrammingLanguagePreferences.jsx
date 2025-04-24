"use client";
import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

const ProgrammingLanguagePreferences = () => {
  const [programmingLanguagePreference, setProgrammingLanguagePreference] = useState(false);
  const [languageData, setLanguageData] = useState([]);
  const [accuracyData, setAccuracyData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const chartRef = useRef(null); // Reference to store the chart instance
  const [showMore, setShowMore] = useState(false); // State to track if more cards should be shown
  const initialCount = 3;

  const backgroundColors = [
    '#978FED',
    '#53ACFD',
    '#D3FB52',
    '#EED477',
    '#FF6384',
    '#36A2EB',
  ];

  const defaultLanguages = [
    { "language": "python", "distinct_users": "1" },
    { "language": "javascript", "distinct_users": "1" },
    { "language": "c", "distinct_users": "1" },
    { "language": "java", "distinct_users": "1" },
    { "language": "cpp", "distinct_users": "1" },
    { "language": "sql", "distinct_users": "1" },
    { "language": "dart", "distinct_users": "1" },
    { "language": "kotlin", "distinct_users": "1" }
  ];

  const defaultAccuracy = [
    { "language": "cpp", "accuracy_percentage": "1" },
    { "language": "python", "accuracy_percentage": "1" },
    { "language": "c", "accuracy_percentage": "1" },
    { "language": "java", "accuracy_percentage": "1" },
    { "language": "sql", "accuracy_percentage": "1" },
    { "language": "javascript", "accuracy_percentage": "1" },
    { "language": "kotlin", "accuracy_percentage": "1" },
    { "language": "dart", "accuracy_percentage": "1" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const languageDataUrl = 'api/emp_student_coding_lan/language_data';
      const accuracyScoresUrl = 'api/emp_student_coding_lan/accuracy_scores';

      try {
        const [languageResponse, accuracyResponse] = await Promise.all([
          fetch(languageDataUrl),
          fetch(accuracyScoresUrl),
        ]);

        if (!languageResponse.ok || !accuracyResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const languageData = await languageResponse.json();
        const accuracyData = await accuracyResponse.json();

        const combinedData = combineData(languageData, accuracyData);
        setLanguageData(combinedData);
        setAccuracyData(accuracyData);
        setProgrammingLanguagePreference(true);
        setLoading(false); // Set loading to false after data is fetched

        renderCodingLangChart(combinedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProgrammingLanguagePreference(false);
        defaultValues(false);
        setLoading(false); // Set loading to false on error
      }
    };

    fetchData();
  }, []);

  const renderCodingLangChart = (data) => {
    const ctx = document.getElementById('myChart4').getContext('2d');
    const labels = data.map(item => item.language);
    const distinctUsers = data.map(item => item.distinct_users);

    const gaugeChartText = {
      id: 'gaugeChartText',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        ctx.save();
        const xcoor = chart.getDatasetMeta(0).data[0].x;
        const ycoor = chart.getDatasetMeta(0).data[0].y;
        const total = chart.data.datasets[0].data.reduce((acc, value) => acc + value, 0);

        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(total, xcoor, ycoor - 25);
        ctx.font = '10px sans-serif';
        ctx.fillText('Have taken the Coding test', xcoor, ycoor);
        ctx.restore();
      }
    };

    // Destroy the previous chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create the new chart and store the instance in chartRef
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'No of Users',
          data: distinctUsers,
          backgroundColor: backgroundColors,
          borderWidth: 1,
          cutout: '90%',
          borderRadius: 20,
          offset: 1,
          circumference: 180,
          rotation: 270,
        }]
      },
      options: {
        aspectRatio: 1.5,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        }
      },
      plugins: [gaugeChartText]
    });
  };

  function defaultValues() {
    const combinedData = combineData(defaultLanguages, defaultAccuracy);
    renderLanguageCards(combinedData, backgroundColors);
    renderCodingLangChart(combinedData);

    if (!programmingLanguagePreference) {
      const programmingPreferencesCont = document.getElementById("programmingPreferences");
      programmingPreferencesCont.style.opacity = "0.5";
    }
  }

  function combineData(languageData, accuracyData) {
    const dataMap = {};
    languageData.forEach(item => {
      dataMap[item.language] = {
        language: item.language,
        distinct_users: parseInt(item.distinct_users, 10),
        accuracy_percentage: 'N/A'
      };
    });
    accuracyData.forEach(item => {
      if (dataMap[item.language]) {
        dataMap[item.language].accuracy_percentage = item.accuracy_percentage;
      }
    });
    return Object.values(dataMap);
  }

  const renderLanguageCards = () => {
    return languageData.map((item, index) => {
      // Display more cards if 'showMore' is true or if index is less than initialCount
      const cardStyle = index < initialCount || showMore ? {} : { display: 'none' };
      return (
        <div className="card" key={index} style={cardStyle}>
          <div className="row">
            <div className="circle" style={{ backgroundColor: backgroundColors[index % backgroundColors.length] }} />
            <p className="language">{item.language}</p>
            <span className="separator"></span>
            <p className="year">{item.distinct_users}</p>
            <span className="percentage">{item.accuracy_percentage}%</span>
          </div>
        </div>
      );
    });
  };

  const renderSkeletonLoader = () => {
    return (
      <>
        {Array.from({ length: initialCount }).map((_, index) => (
          <div className="card skeleton" key={index}>
            <div className="row">
              <div className="circle" style={{ backgroundColor: '#e0e0e0' }} />
              <p className="language skeleton-text" />
              <span className="separator"></span>
              <p className="year skeleton-text" />
              <span className="percentage skeleton-text" />
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="section3_2_2_1" style={{ display: 'flex', flexDirection: 'column', paddingLeft: "40px" }}>
      <p style={{ display: 'flex', alignSelf: 'flex-start' ,fontWeight:"bold"}}>
        Programming language preferences among students
      </p>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', alignItems: 'center' }}>
        <div className="column1" style={{ alignItems: 'center', width: '60%' }}>
          <div className="circle-graph" style={{ width: '200px', height: '150px', justifyContent: 'center' }}>
            <canvas id="myChart4" style={{ width: '200px', height: '150px' }} />
          </div>
        </div>
        <div className="column2" style={{ alignItems: 'center', width: '40%', marginRight: '10px' }}>
          {loading ? renderSkeletonLoader() : renderLanguageCards()}
          <button onClick={() => setShowMore(!showMore)} style={{ marginTop: '10px', border: 'none' }}>
            {showMore ? 'Show Less' : 'Show More'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgrammingLanguagePreferences;
