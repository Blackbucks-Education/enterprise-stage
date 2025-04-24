import React from 'react';

const SkeletonGraph = () => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    summaryTitlePlaceholder: {
      width: '80%',
      height: '20px',
      backgroundColor: 'rgba(224, 224, 224, 0.5)', // 50% opacity
      marginBottom: '15px',
      borderRadius: '4px',
    },
    barChartPlaceholder: {
      backgroundColor: 'rgba(224, 224, 224, 0.5)', // 50% opacity
      borderRadius: '4px',
      height: '300px',
      width: '90%',
    },
    legendContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '90%',
      marginTop: '15px',
    },
    legendItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '5px 0',
    },
    row: {
      display: 'flex',
      alignItems: 'center',
    },
    legendPlaceholder: {
      width: '20px',
      height: '20px',
      backgroundColor: 'rgba(224, 224, 224, 0.5)', // 50% opacity
      marginRight: '10px',
      borderRadius: '4px',
    },
    valuePlaceholder: {
      width: '50px',
      height: '15px',
      backgroundColor: 'rgba(224, 224, 224, 0.5)', // 50% opacity
      borderRadius: '4px',
      marginLeft: 'auto',
    },
  };
  
  return (
    <div style={styles.container}>
      {/* <div style={styles.summaryTitlePlaceholder}></div> */}
      <div style={styles.barChartPlaceholder}></div>
      <div style={styles.legendContainer}>
        <div style={styles.legendItem}>
          <div style={styles.row}>
            <div style={styles.legendPlaceholder}></div>
            <p>Highest Marks</p>
          </div>
          {/* <span style={styles.valuePlaceholder}></span> */}
        </div>
        <div style={styles.legendItem}>
          <div style={styles.row}>
            <div style={styles.legendPlaceholder}></div>
            <p>Average Marks</p>
          </div>
          {/* <span style={styles.valuePlaceholder}></span> */}
        </div>
        <div style={styles.legendItem}>
          <div style={styles.row}>
            <div style={styles.legendPlaceholder}></div>
            <p>Lowest Marks</p>
          </div>
          {/* <span style={styles.valuePlaceholder}></span> */}
        </div>
      </div>
    </div>
  );
};

export default SkeletonGraph;
