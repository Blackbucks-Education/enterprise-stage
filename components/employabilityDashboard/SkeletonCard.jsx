import React from 'react';
import '../../app/employabilityReport/Skeleton.css'

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-title"></div>
      <div className="skeleton-value"></div>
      {/* <div className="skeleton-info"></div>
      <div className="skeleton-college-count"></div> */}
      <div className="skeleton-link"></div>
    </div>
  );
};

export default SkeletonCard;
