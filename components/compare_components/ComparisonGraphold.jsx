import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../app/compare/compare.css';

const CircularProgressBar = ({ size, strokeWidth, innerValue, outerValue, innerColor, outerColor, innerLabel, outerLabel }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Determine offsets and colors based on value presence
  const innerOffset = circumference - (innerValue / 100) * circumference;
  const outerOffset = circumference - (outerValue / 100) * circumference;
  const defaultColor = '#d3d3d3'; // Grey color for missing data

  const innerStroke = innerValue !== null ? innerColor : defaultColor;
  const outerStroke = outerValue !== null ? outerColor : defaultColor;

  

  return (
    <div style={{ textAlign: 'center', margin: '0 20px' }}>
      <svg width={size} height={size} className="circular-progress">
        {/* Outer circle */}
        <circle
          stroke={defaultColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset="0"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={outerStroke}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={outerOffset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Inner circle */}
        <circle
          stroke={defaultColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset="0"
          r={radius - strokeWidth - 4}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={innerStroke}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={innerOffset}
          strokeLinecap="round"
          r={radius - strokeWidth - 4}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Centered Labels */}
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="circular-progress-label" style={{ fontSize: '14px', fontWeight: 'bold' }}>
          <tspan x="50%" dy="-10" style={{ fill: innerStroke }}>{innerValue !== null ? `${innerValue}%` : 'N/A'}</tspan>
          <tspan x="50%" dy="20" style={{ fill: outerStroke }}>{outerValue !== null ? `${outerValue}%` : 'N/A'}</tspan>
        </text>
      </svg>
      <div style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ color: innerStroke, marginRight: '20px', fontWeight: 'bold' }}>{innerLabel}</span>
          <span style={{ color: outerStroke, fontWeight: 'bold' }}>{outerLabel}</span>
        </div>
      </div>
    </div>
  );
};

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

  const sanitizeData = (value) => value !== null && value >= 0 ? value : null;

  const getCategoryData = () => {
    const assessment1 = graphData[0] || {};
    const assessment2 = graphData[1] || {};

    switch (category) {
      case 'employability':
        return [
          {
            name: 'Max Total Score',
            inner: sanitizeData(Number(assessment1.max_total_score)),
            outer: sanitizeData(Number(assessment2.max_total_score)),
            innerLabel: selectedAssessments[0]?.label || 'Assessment 1',
            outerLabel: selectedAssessments[1]?.label || 'Assessment 2'
          },
          {
            name: 'Average Marks',
            inner: sanitizeData(Number(assessment1.average_marks)),
            outer: sanitizeData(Number(assessment2.average_marks)),
            innerLabel: selectedAssessments[0]?.label || 'Assessment 1',
            outerLabel: selectedAssessments[1]?.label || 'Assessment 2'
          },
          {
            name: 'Min Total Score',
            inner: sanitizeData(Number(assessment1.min_total_score)),
            outer: sanitizeData(Number(assessment2.min_total_score)),
            innerLabel: selectedAssessments[0]?.label || 'Assessment 1',
            outerLabel: selectedAssessments[1]?.label || 'Assessment 2'
          }
        ];
      case 'coding':
        return [
          {
            name: 'Max Coding',
            inner: sanitizeData(Number(assessment1.max_coding)),
            outer: sanitizeData(Number(assessment2.max_coding)),
            innerLabel: selectedAssessments[0]?.label || 'Assessment 1',
            outerLabel: selectedAssessments[1]?.label || 'Assessment 2'
          },
          {
            name: 'Average Coding',
            inner: sanitizeData(Number(assessment1.average_coding)),
            outer: sanitizeData(Number(assessment2.average_coding)),
            innerLabel: selectedAssessments[0]?.label || 'Assessment 1',
            outerLabel: selectedAssessments[1]?.label || 'Assessment 2'
          },
          {
            name: 'Min Coding',
            inner: sanitizeData(Number(assessment1.min_coding)),
            outer: sanitizeData(Number(assessment2.min_coding)),
            innerLabel: selectedAssessments[0]?.label || 'Assessment 1',
            outerLabel: selectedAssessments[1]?.label || 'Assessment 2'
          }
        ];
      case 'english':
        return [
          {
            name: 'Max English',
            inner: sanitizeData(Number(assessment1.max_english)),
            outer: sanitizeData(Number(assessment2.max_english)),
            innerLabel: selectedAssessments[0]?.label || 'Assessment 1',
            outerLabel: selectedAssessments[1]?.label || 'Assessment 2'
          },
          {
            name: 'Average English',
            inner: sanitizeData(Number(assessment1.average_english)),
            outer: sanitizeData(Number(assessment2.average_english)),
            innerLabel: selectedAssessments[0]?.label || 'Assessment 1',
            outerLabel: selectedAssessments[1]?.label || 'Assessment 2'
          },
          {
            name: 'Min English',
            inner: sanitizeData(Number(assessment1.min_english)),
            outer: sanitizeData(Number(assessment2.min_english)),
            innerLabel: selectedAssessments[0]?.label || 'Assessment 1',
            outerLabel: selectedAssessments[1]?.label || 'Assessment 2'
          }
        ];
      case 'aptitude':
        return [
          {
            name: 'Max Aptitude',
            inner: sanitizeData(Number(assessment1.max_aptitude)),
            outer: sanitizeData(Number(assessment2.max_aptitude)),
            innerLabel: selectedAssessments[0]?.label || 'Assessment 1',
            outerLabel: selectedAssessments[1]?.label || 'Assessment 2'
          },
          {
            name: 'Average Aptitude',
            inner: sanitizeData(Number(assessment1.average_aptitude)),
            outer: sanitizeData(Number(assessment2.average_aptitude)),
            innerLabel: selectedAssessments[0]?.label || 'Assessment 1',
            outerLabel: selectedAssessments[1]?.label || 'Assessment 2'
          },
          {
            name: 'Min Aptitude',
            inner: sanitizeData(Number(assessment1.min_aptitude)),
            outer: sanitizeData(Number(assessment2.min_aptitude)),
            innerLabel: selectedAssessments[0]?.label || 'Assessment 1',
            outerLabel: selectedAssessments[1]?.label || 'Assessment 2'
          }
        ];
      default:
        return [];
    }
  };

  return (
    <div>
      <div className="filter-container">
        <select 
          className="filter-select"
          onChange={(e) => setCategory(e.target.value)} 
          value={category}
        >
          <option value="employability">Employability</option>
          <option value="coding">Coding</option>
          <option value="english">English</option>
          <option value="aptitude">Aptitude</option>
        </select>
      </div>
      <div className="circular-progress-container">
        {getCategoryData().map((item, index) => (
          <div key={index} className="circular-progress-item">
            <h3>{item.name}</h3>
            <CircularProgressBar
              size={120}
              strokeWidth={8}
              innerValue={item.inner}
              outerValue={item.outer}
              innerColor="#7962bd"
              outerColor="#7962bd80"
              innerLabel={item.innerLabel}
              outerLabel={item.outerLabel}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonGraph;
