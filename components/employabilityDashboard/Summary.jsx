"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Custom Legend Component
const CustomLegend = ({ data }) => {
  return (
    <div style={{ marginLeft: '20px' ,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
      <div className="legend-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ backgroundColor: '#7962BD', width: '20px', height: '20px', marginRight: '10px' }}></div>
        <div>
          <p style={{ margin: 0 }}>Highest Marks</p>
          <span style={{ fontWeight: 'bold' }}>{data.marks_stats.highest_marks}</span>
        </div>
      </div>

      <div className="legend-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ backgroundColor: 'rgba(121, 98, 189, 0.5)', width: '20px', height: '20px', marginRight: '10px' }}></div>
        <div>
          <p style={{ margin: 0 }}>Average Marks</p>
          <span style={{ fontWeight: 'bold' }}>{data.marks_stats.average_marks}</span>
        </div>
      </div>

      <div className="legend-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ backgroundColor: 'rgba(178, 157, 236, 0.2)', width: '20px', height: '20px', marginRight: '10px' }}></div>
        <div>
          <p style={{ margin: 0 }}>Lowest Marks</p>
          <span style={{ fontWeight: 'bold' }}>{data.marks_stats.lowest_marks}</span>
        </div>
      </div>
    </div>
  );
};

const AssessmentSummary = ({ data }) => {
  // Prepare the data for Recharts
  const chartData = [
    {
      category: 'Total Marks',
      highest: data.marks_stats.highest_marks,
      lowest: data.marks_stats.lowest_marks,
      average: data.marks_stats.average_marks,
    },
    {
      category: 'Aptitude',
      highest: data.aptitude_stats.highest_marks,
      lowest: data.aptitude_stats.lowest_marks,
      average: data.aptitude_stats.average_marks,
    },
    {
      category: 'English',
      highest: data.english_stats.highest_marks,
      lowest: data.english_stats.lowest_marks,
      average: data.english_stats.average_marks,
    },
    {
      category: 'Technical',
      highest: data.technical_stats.highest_marks,
      lowest: data.technical_stats.lowest_marks,
      average: data.technical_stats.average_marks,
    },
  ];

  

  return (
    <div style={{display:'flex',flexDirection:"column"}}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {/* Chart Area */}
      <div style={{ width: '75%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="highest" fill="#7962BD" name="Highest Marks" />
            <Bar dataKey="average" fill="rgba(121, 98, 189, 0.5)" name="Average Marks" />
            <Bar dataKey="lowest" fill="rgba(178, 157, 236, 0.2)" name="Lowest Marks" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend Area */}
      <CustomLegend data={data} />
    </div>
    </div>
  );
};

export default AssessmentSummary;
