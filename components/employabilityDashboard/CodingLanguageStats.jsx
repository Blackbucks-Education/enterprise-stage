'use client';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Custom component to render text inside the pie chart
const CustomLabel = ({ cx, cy, total }) => {
  return (
    <text
      x={cx}
      y={cy}
      fill="#000"
      textAnchor="middle"
      dominantBaseline="middle"
      style={{ fontSize: '30px', fontFamily: 'sans-serif' }}
    >
      {total}
      <tspan x={cx} dy="30" style={{ fontSize: '12px' }}>
        Have taken the Coding test
      </tspan>
    </text>
  );
};

const CodingLanguageStats = ({ data, backgroundColors }) => {
  // Prepare total count for display in the center
  const total = data.reduce((acc, item) => acc + item.distinct_users, 0);
  

  return (
    <div style={{ width:"60%", height: '400px' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="distinct_users"
            nameKey="language"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            fill="#8884d8"
            startAngle={180}
            endAngle={0}
            paddingAngle={5}
          >
            {data.map((language, index) => (
              <Cell key={`cell-${index}`} fill={backgroundColors[index % backgroundColors.length]} />
            ))}
            {/* Custom Label in the center */}
            <CustomLabel cx="50%" cy="50%" total={total}/>
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CodingLanguageStats;
