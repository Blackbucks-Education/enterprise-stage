"use client";
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import SkeletonGraph from './BarGraphSkeleton'; // Import the SkeletonGraph component

const AssessmentSummaryLeftSection = () => {
  const [data, setData] = useState(null);
  const [isSummaryActive, setIsSummaryActive] = useState(true);

  const defaultAssessmentData = {
    marks_stats: { highest_marks: 0, lowest_marks: 0, average_marks: 0 },
    aptitude_stats: { highest_marks: 0, lowest_marks: 0, average_marks: 0 },
    english_stats: { highest_marks: 0, lowest_marks: 0, average_marks: 0 },
    technical_stats: { highest_marks: 0, lowest_marks: 0, average_marks: 0 },
  };

  useEffect(() => {
    const apiUrl = '/api/emp_performance_overview/marks_section_stats';

    // Fetch the data from API
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        if (data.length === 0) {
          setIsSummaryActive(false);
        } else {
          setIsSummaryActive(true);
        }
      })
      .catch((error) => {
        console.log('Error Fetching Data..', error);
        // Use default data in case of an error
        setData(defaultAssessmentData);
        setIsSummaryActive(false);
      });
  }, []);

  if (!data) {
    // return <SkeletonGraph />; // Show SkeletonGraph while data is loading
    console.log("there is no data to display graph");
    return;
  }

  const chartData = [
    {
      name: 'Total Marks',
      Highest: data.marks_stats.highest_marks,
      Lowest: data.marks_stats.lowest_marks,
      Average: data.marks_stats.average_marks,
    },
    {
      name: 'Aptitude',
      Highest: data.aptitude_stats.highest_marks,
      Lowest: data.aptitude_stats.lowest_marks,
      Average: data.aptitude_stats.average_marks,
    },
    {
      name: 'English',
      Highest: data.english_stats.highest_marks,
      Lowest: data.english_stats.lowest_marks,
      Average: data.english_stats.average_marks,
    },
    {
      name: 'Technical',
      Highest: data.technical_stats.highest_marks,
      Lowest: data.technical_stats.lowest_marks,
      Average: data.technical_stats.average_marks,
    },
  ];

  return (
    <div
      className=""
      id="summaryCont"
      style={{ opacity: isSummaryActive ? '1' : '0.5' }}
    >
      <p style={{ marginBottom: "30px", fontWeight: "600" }}>Summary</p>
      <div className="section3_2_1_inside">
        <div className="section3_2_1_graph" style={{ width: '90%', height: '300px', fontSize: "14px", paddingLeft:"0px"}}>
          <ResponsiveContainer width="100%" height="100%" >
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.3)' }} />
              <Bar dataKey="Highest" fill="#7962BD" />
              <Bar dataKey="Lowest" fill="#b29dec" />
              <Bar dataKey="Average" fill="rgba(121, 98, 189, 0.5)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="legend-container">
          <div className="legend-item">
            <div className="row2">
              <div className="highest-marks"></div>
              <p>Highest Marks</p>
            </div>
            <span className="fweight f16" id="highestTotalMarks">
              {data.marks_stats.highest_marks}
            </span>
          </div>
          <div className="legend-item">
            <div className="row2">
              <div className="average-marks"></div>
              <p>Average Marks</p>
            </div>
            <span className="fweight f16" id="averageTotalMarks">
              {data.marks_stats.average_marks}
            </span>
          </div>
          <div className="legend-item">
            <div className="row2">
              <div className="lowest-marks"></div>
              <p>Lowest Marks</p>
            </div>
            <span className="fweight f16" id="lowestTotalMarks">
              {data.marks_stats.lowest_marks}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSummaryLeftSection;
