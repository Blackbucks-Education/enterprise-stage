import React from 'react';
import Link from 'next/link'; // Corrected import statement
import '../../app/employabilityReport/empDashboard.css';
import SkeletonCard from './SkeletonCard'; // Import the SkeletonCard component

const Card = ({ title, value, additionalInfo, collegeCount, link }) => {
  return (
    <div className='emp-card'>
      <h2>{title}</h2>
      <h1>{value}</h1>
      <p>{additionalInfo}</p> 
      <p style={{color:"black"}}>{collegeCount}</p>
      {link && (
        <Link href={'/employabilityStudentsResults'} style={{ fontSize: "16px",fontWeight:'bold',textDecoration:"underline" }}>
          {link}
        </Link>
      )}
    </div>
  );
};

export default Card;
