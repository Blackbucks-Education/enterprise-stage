import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import '../../app/compareAssessments/compare.css';

const Hackathons = ({ onCompare }) => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment1, setSelectedAssessment1] = useState(null);
  const [selectedAssessment2, setSelectedAssessment2] = useState(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axios.get('/api/compare/hackathons');
        setAssessments(response.data.map(a => ({ value: a.id, label: a.title })));
      } catch (error) {
        console.error('Error fetching assessments:', error);
      }
    };

    fetchAssessments();
  }, []);

  const handleSelectAssessment1 = (option) => {
    setSelectedAssessment1(option);
  };

  const handleSelectAssessment2 = (option) => {
    setSelectedAssessment2(option);
  };

  const handleCompare = async () => {
    if (selectedAssessment1 && selectedAssessment2) {
      try {
        const [response1, response2] = await Promise.all([
          axios.get(`/api/compare/sub_domain_stats?hackathon_id=${selectedAssessment1.value}`),
          axios.get(`/api/compare/sub_domain_stats?hackathon_id=${selectedAssessment2.value}`)
        ]);

        onCompare(selectedAssessment1, selectedAssessment2, response1.data, response2.data);
      } catch (error) {
        console.error('Error fetching subdomain stats:', error);
      }
    }
  };

  const filteredAssessments = assessments.filter(
    assessment => !selectedAssessment1 || assessment.value !== selectedAssessment1.value
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ flex: 1, marginRight: '10px', maxWidth: '360px' }}>
          <Select
            options={assessments}
            value={selectedAssessment1}
            onChange={handleSelectAssessment1}
            placeholder="Select assessment 1"
            maxMenuHeight={150}
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: '8px',
                padding: '2px 4px',
                borderColor: '#e0e0e0',
              }),
            }}
          />
        </div>

        <div style={{ flex: 1, marginLeft: '10px', maxWidth: '360px' }}>
          <Select
            options={filteredAssessments}
            value={selectedAssessment2}
            onChange={handleSelectAssessment2}
            placeholder="Select assessment 2"
            maxMenuHeight={150}
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: '8px',
                padding: '2px 4px',
                borderColor: '#e0e0e0',
              }),
            }}
          />
        </div>

        <div style={{ marginLeft: '15px' }}>
          <button
            onClick={handleCompare}
            disabled={!selectedAssessment1 || !selectedAssessment2}
            style={{
              backgroundColor: '#d3fb52',
              color: '#333',
              padding: '8px 20px',
              border: '2px solid #a1c900',
              borderRadius: '50px',
              cursor: 'pointer',
              marginRight: '10px',
              fontSize: '14px',
              fontWeight: 'bold',
              textDecoration: 'none',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s, box-shadow 0.3s',
            }}
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hackathons;
