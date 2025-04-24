import React from "react";

// ShimmerTable Component accepting rows and columns as props
const ShimmerTable = ({ rows = 2, cols = 2 }) => {
  const shimmerStyles = {
    container: {
      width: '100%',
      padding: '16px',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '12px',
      height: '20px',
      borderRadius: '4px',
      overflow: 'hidden',
      position: 'relative',
    },
    cell: {
      height: '20px',
      width: `${100 / cols}%`, // Set cell width dynamically based on number of columns
      backgroundColor: 'rgba(224, 224, 224, 0.6)', // Decreased opacity for cell
      borderRadius: '4px',
      position: 'relative',
      overflow: 'hidden',
    },
    shimmer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage:
        'linear-gradient(to right, rgba(246, 247, 248, 0.6) 0%, rgba(237, 238, 241, 0.4) 20%, rgba(246, 247, 248, 0.6) 40%, rgba(246, 247, 248, 0.6) 100%)',
      animation: 'shimmer 1.5s infinite',
    },
    heading: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#444', // Darker color for better visibility
      marginBottom: '16px',
    },
  };

  return (
    <div style={shimmerStyles.container}>
      {/* Heading */}
      <div style={shimmerStyles.heading}></div>

      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} style={shimmerStyles.row}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} style={shimmerStyles.cell}>
              {/* Shimmer effect for each cell */}
              <div style={shimmerStyles.shimmer}></div>
            </div>
          ))}
        </div>
      ))}
      
      {/* Inline keyframe definition */}
      <style>
        {`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ShimmerTable;
