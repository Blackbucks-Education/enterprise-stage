"use client";

import React, { useState, useEffect } from 'react';
import Hackathons from '../../components/compare_components/hackathons';
import ParticipantGraph from '../../components/compare_components/ParticipantGraph';
import ComparisonGraph from '../../components/compare_components/ComparisonGraph';
import RangesGraph from '../../components/compare_components/RangesGraph';
import EmpBands from '../../components/compare_components/EmpBandsChart';
import CompletionTracker from '../../components/compare_components/CompletionTracker';
import PerformanceTable from '../../components/compare_components/PerformanceTable';
import axios from 'axios';
import '../compareAssessments/compare.css';

const Page = () => {
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [participantCounts, setParticipantCounts] = useState([]);
  const [subDomainData1, setSubDomainData1] = useState(null);
  const [subDomainData2, setSubDomainData2] = useState(null);
  const [showGraphs, setShowGraphs] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchParticipantCounts = async () => {
      if (selectedAssessments.length === 2) {
        setLoading(true); // Set loading to true when fetching data
        const hackathonIds = selectedAssessments.map(a => a.value).join(',');
        try {
          const response = await axios.get('/api/compare/participant_count', {
            params: { hackathon_id: hackathonIds }
          });
          setParticipantCounts(response.data);
        } catch (error) {
          console.error('Error fetching participant counts:', error);
        } finally {
          setLoading(false); // Set loading to false after data fetch
        }
      }
    };

    fetchParticipantCounts();
  }, [selectedAssessments]);

  const handleSelectAssessments = (assessments) => {
    setSelectedAssessments(assessments);
  };

  const handleCompare = (assessment1, assessment2, data1, data2) => {
    setSelectedAssessments([assessment1, assessment2]);
    setSubDomainData1(data1);
    setSubDomainData2(data2);
    setShowGraphs(true);
  };

  const isParticipantCountsDataPresent = participantCounts && participantCounts.length > 0;
  const isSelectedAssessmentsDataPresent = selectedAssessments && selectedAssessments.length > 0;

  return (
    <div className="container">
      <div className="mainCard">
        <div className="icon">
          <img className="image" src="/img/employability.svg" alt="internship icon" />
          <h1>Compare Assessments</h1>
        </div>

        <p className="heading">Select Assessments</p>
        <Hackathons onCompare={handleCompare} />

        <div className={`card ${isParticipantCountsDataPresent ? '' : 'fadedCard'} ${loading ? 'shimmer' : ''}`}>
          <h2 className="cardHeader">Participant Count</h2>
          {loading ? <div className="shimmer-placeholder"></div> : <ParticipantGraph participantCounts={participantCounts} />}
        </div>

        <div className={`card ${isSelectedAssessmentsDataPresent ? '' : 'fadedCard'} ${loading ? 'shimmer' : ''}`}>
          <h2 className="cardHeader">Score Analysis</h2>
          {loading ? <div className="shimmer-placeholder"></div> : <ComparisonGraph selectedAssessments={selectedAssessments} />}
        </div>

        <div className="cardRow">
          <div className={`card ${isSelectedAssessmentsDataPresent ? '' : 'fadedCard'} ${loading ? 'shimmer' : ''}`}>
            <h2 className="cardHeader">Employability Band Count Analysis</h2>
            {loading ? <div className="shimmer-placeholder"></div> : <EmpBands selectedAssessments={selectedAssessments} />}
          </div>

          <div className={`card ${isSelectedAssessmentsDataPresent ? '' : 'fadedCard'} ${loading ? 'shimmer' : ''}`}>
            <h2 className="cardHeader">Subdomain Analysis</h2>
            {loading ? <div className="shimmer-placeholder"></div> : <PerformanceTable assessment1Data={subDomainData1} assessment2Data={subDomainData2} />}
          </div>
        </div>

        <div className="cardContainer">
          <div className={`card ${isSelectedAssessmentsDataPresent ? '' : 'fadedCard'} ${loading ? 'shimmer' : ''}`}>
            <h2 className="cardHeader">Performance</h2>
            {loading ? <div className="shimmer-placeholder"></div> : <RangesGraph selectedAssessments={selectedAssessments} />}
          </div>
        </div>

        <div className="cardContainer">
          <div className={`card ${isSelectedAssessmentsDataPresent ? '' : 'fadedCard'} ${loading ? 'shimmer' : ''}`}>
            <h2 className="cardHeader">Subdomain Accuracy</h2>
            {loading ? <div className="shimmer-placeholder"></div> : <CompletionTracker selectedAssessments={selectedAssessments} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
