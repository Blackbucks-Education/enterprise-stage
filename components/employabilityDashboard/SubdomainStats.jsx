"use client";
import React, { useState, useEffect } from 'react';
import ShimmerTable from './ShimmerTable'; // Assuming you have ShimmerTable in the same directory

// Default values to handle scenarios when no data is returned
const defaultSubdomains = {
  weak_areas: ['Example weak area 1', 'Example weak area 2'],
  strong_areas: ['Example strong area 1', 'Example strong area 2'],
};

const SubDomainStats = () => {
  const [weakAreas, setWeakAreas] = useState([]);
  const [strongAreas, setStrongAreas] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [weakAreasExpanded, setWeakAreasExpanded] = useState(false);
  const [strongAreasExpanded, setStrongAreasExpanded] = useState(false);

  useEffect(() => {
    // Fetch sub domain stats from server
    const fetchSubDomainStats = async () => {
      try {
        const response = await fetch('/api/emp_subdomainaccuracy/sub_domain_stats');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        if (data.length === 0) {
          setWeakAreas(defaultSubdomains.weak_areas);
          setStrongAreas(defaultSubdomains.strong_areas);
        } else {
          setWeakAreas(data.weak_areas || []);
          setStrongAreas(data.strong_areas || []);
        }
      } catch (error) {
        console.error('Error fetching sub domain stats:', error);
        alert('Failed to fetch sub domain stats.');
        setWeakAreas(defaultSubdomains.weak_areas);
        setStrongAreas(defaultSubdomains.strong_areas);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchSubDomainStats();
  }, []);

  const populateText = (items) => {
    const cleanedItems = items.map((item) => item.replace(/"/g, ''));
    const initialItems = cleanedItems.slice(0, 6).join(', ');
    const remainingItems = cleanedItems.slice(6).join(', ');
    const fullText = initialItems + (remainingItems ? ', ' + remainingItems : '');
    return { initialText: initialItems, fullText };
  };

  const handleToggle = (type) => {
    if (type === 'weak') setWeakAreasExpanded(!weakAreasExpanded);
    if (type === 'strong') setStrongAreasExpanded(!strongAreasExpanded);
  };

  const weakAreasTextData = populateText(weakAreas);
  const strongAreasTextData = populateText(strongAreas);

  // Return the skeleton shimmer if still loading
  if (loading) {
    return <ShimmerTable />;
  }

  return (
    <div className="section3_2_2_2">
      <table className="custom-table" id="strong-weak-container">
        <thead>
          <tr>
            <th>Performance</th>
            <th style={{ backgroundColor: '#4C4267', color: '#FFFFFF' }}>Topics</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Weak</td>
            <td>
              <div id="weakAreasContainer" style={{ maxWidth: '100%', overflowX: 'auto' }}>
                <div id="weakAreasTextContainer" style={{ whiteSpace: 'nowrap', overflowX: 'auto' }}>
                  <span id="weakAreasText">
                    {weakAreasExpanded ? weakAreasTextData.fullText : weakAreasTextData.initialText}
                  </span>
                  {weakAreas.length > 6 && (
                    <button
                      id="toggleWeakAreasBtn"
                      style={{ display: 'inline', margin: 0, padding: 0, border: 'none', fontSize: '12px' }}
                      onClick={() => handleToggle('weak')}
                    >
                      {weakAreasExpanded ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>Strong</td>
            <td>
              <div id="strongAreasContainer">
                <div id="strongAreasTextContainer">
                  <span id="strongAreasText">
                    {strongAreasExpanded ? strongAreasTextData.fullText : strongAreasTextData.initialText}
                  </span>
                  {strongAreas.length > 6 && (
                    <button
                      id="toggleStrongAreasBtn"
                      style={{ display: 'inline', margin: 0, padding: 0, border: 'none', fontSize: '12px', marginLeft: '5px' }}
                      onClick={() => handleToggle('strong')}
                    >
                      {strongAreasExpanded ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SubDomainStats;
