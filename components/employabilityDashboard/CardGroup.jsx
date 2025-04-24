"use client";

import Card from './Card';
import SkeletonCard from './SkeletonCard'; // Import the SkeletonCard
import React, { useEffect, useState } from 'react';

const CardGroup = () => {
  const [cardData, setCardData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    // Define an async function to fetch data
    const fetchData = async () => {
      try {
        const response = await fetch('/api/emp_cards/main_cards'); // Added leading '/'
        const data = await response.json();
        console.log(data);
        setCardData(data); // Store fetched data in state
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData(); 
  }, []); 

  return (
    <div className="cards-cont">
      {loading ? ( // Show skeleton cards while loading
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : ( // Show actual cards once data is loaded
        <>
          <Card title="Test takers from your college" value={cardData ? cardData.total_participants : ''} />
          <Card title="Average Employability Score" value={cardData ? cardData.avg_emp_score : ''} />
          <Card title="Rank" value={cardData ? cardData.college_rank : ''} collegeCount={cardData ? `Across ${cardData.total_college_codes} colleges in India` : ''} />
          <Card title="Things I Can Do" link='Shortlist Your Students for Placement Drives' />
        </>
      )}
    </div>
  );
};

export default CardGroup;
