import React, { useState } from 'react';
import styles from './PerformanceTable.module.css'; // Custom CSS for styling

const PerformanceTable = ({ assessment1Data, assessment2Data, assessment1Name, assessment2Name }) => {
  const [showMoreWeak, setShowMoreWeak] = useState(false);
  const [showMoreStrong, setShowMoreStrong] = useState(false);

  const toggleWeak = () => setShowMoreWeak(!showMoreWeak);
  const toggleStrong = () => setShowMoreStrong(!showMoreStrong);

  // Function to display the subdomains with show more/less logic
  const displaySubdomains = (subdomains, showMore, emptyMessage) => {
    if (!subdomains || subdomains.length === 0) return emptyMessage;
    const displayed = showMore ? subdomains : subdomains.slice(0, 4);
    return displayed.join(', ');
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.performanceTable}>
        <thead>
          <tr>
            <th>Performance</th>
            {/* Dynamically display assessment1Name and assessment2Name as hackathon titles */}
            <th>{assessment1Name || 'Assessment 1'}</th>
            <th>{assessment2Name || 'Assessment 2'}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Weak</td>
            <td>
              {displaySubdomains(
                assessment1Data?.weak_areas,
                showMoreWeak,
                'No weak areas available'
              )}
              {assessment1Data?.weak_areas?.length > 4 && (
                <button className={styles.showMoreBtn} onClick={toggleWeak}>
                  {showMoreWeak ? 'Show Less' : 'Show More'}
                </button>
              )}
            </td>
            <td>
              {displaySubdomains(
                assessment2Data?.weak_areas,
                showMoreWeak,
                'No weak areas available'
              )}
              {assessment2Data?.weak_areas?.length > 4 && (
                <button className={styles.showMoreBtn} onClick={toggleWeak}>
                  {showMoreWeak ? 'Show Less' : 'Show More'}
                </button>
              )}
            </td>
          </tr>

          <tr>
            <td>Strong</td>
            <td>
              {displaySubdomains(
                assessment1Data?.strong_areas,
                showMoreStrong,
                'No strong areas available'
              )}
              {assessment1Data?.strong_areas?.length > 4 && (
                <button className={styles.showMoreBtn} onClick={toggleStrong}>
                  {showMoreStrong ? 'Show Less' : 'Show More'}
                </button>
              )}
            </td>
            <td>
              {displaySubdomains(
                assessment2Data?.strong_areas,
                showMoreStrong,
                'No strong areas available'
              )}
              {assessment2Data?.strong_areas?.length > 4 && (
                <button className={styles.showMoreBtn} onClick={toggleStrong}>
                  {showMoreStrong ? 'Show Less' : 'Show More'}
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PerformanceTable;
