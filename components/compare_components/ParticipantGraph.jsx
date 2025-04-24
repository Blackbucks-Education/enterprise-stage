import React from 'react';
import './ParticipantGraph.css';

const ParticipantGraph = ({ participantCounts }) => {
  if (participantCounts.length === 2) {
    // Calculate the average score difference for each assessment
    const avgScore1 = parseFloat(participantCounts[0].average_marks);
    const avgScore2 = parseFloat(participantCounts[1].average_marks);
    const scoreDifference = avgScore1 - avgScore2;

    // Determine color for the first assessment (green if higher, red if lower)
    const firstTextColor = scoreDifference > 0 ? 'rgb(0, 182, 155)' : 'red';

    // Determine color for the second assessment (green if higher, red if lower)
    const secondTextColor = scoreDifference < 0 ? 'rgb(0, 182, 155)' : 'red';

    // Determine Font Awesome icons
    const firstIcon = scoreDifference > 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
    const secondIcon = scoreDifference < 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';

    // Determine text description
    const firstText = scoreDifference > 0 
      ? `more than ${participantCounts[1].title}` 
      : `less than ${participantCounts[1].title}`;
    const secondText = scoreDifference < 0 
      ? `more than ${participantCounts[0].title}` 
      : `less than ${participantCounts[0].title}`;

    return (
      <div className="participant-cards-container">
        <div className="cards-row">
          {/* First Assessment Card */}
          <div className="participant-card">
            <div className="card-header">
              <div className="card-icon-container">
                <img src="img/icon-count.svg" alt="Assessment 1" className="card-logo" />
              </div>
              <div className="card-text-container">
                <p className="participationheader">{participantCounts[0].title}</p>
                <div className="card-percentage" style={{ color: firstTextColor }}>
                  <i className={`fa-solid ${firstIcon}`}></i> {Math.abs(scoreDifference).toFixed(2)} {firstText}
                </div>
              </div>
              <div className="card-count-container">
                <img src="img/user-count.svg" alt="Participant Count" className="count-icon" />
                <span className="card-value">{parseInt(participantCounts[0].participant_count, 10)}</span>
              </div>
            </div>

            {/* Additional smaller cards */}
            <div className="additional-cards">
              <div className="small-card">
                <div className="small-card-top">
                  <img src="img/aptitude.svg" alt="Aptitude" className="small-card-icon" />
                  <p className="small-card-heading">Aptitude</p>
                </div>
                <div className="animated-clock">
                  <svg viewBox="0 0 100 100" className="clock">
                    <circle cx="50" cy="50" r="45" className="clock-face" />
                    <line x1="50" y1="50" x2="50" y2="15" className="clock-hand"></line>
                  </svg>
                  <p className="time-value">22.4</p>
                </div>
                <div className="questions-count">
                  <div className="hand-icon">
                  <img src="img/question-count.png" alt="English" className="question-count-icon" />
                  </div>
                  <p className="question-count-number">22</p>
                </div>
              </div>
              <div className="small-card">
                <div className="small-card-top">
                  <img src="img/coding.svg" alt="Coding" className="small-card-icon" />
                  <p className="small-card-heading">Coding</p>
                </div>
                <div className="animated-clock">
                  <svg viewBox="0 0 100 100" className="clock">
                    <circle cx="50" cy="50" r="45" className="clock-face" />
                    <line x1="50" y1="50" x2="50" y2="15" className="clock-hand"></line>
                  </svg>
                  <p className="time-value">22.4</p>
                </div>
                <div className="questions-count">
                  <div className="hand-icon">
                  <img src="img/question-count.png" alt="English" className="question-count-icon" />
                  </div>
                  <p className="question-count-number">22</p>
                </div>
              </div>
              <div className="small-card">
                <div className="small-card-top">
                  <img src="img/verbal.svg" alt="English" className="small-card-icon" />
                  <p className="small-card-heading">English</p>
                </div>
                <div className="animated-clock">
                  <svg viewBox="0 0 100 100" className="clock">
                    <circle cx="50" cy="50" r="45" className="clock-face" />
                    <line x1="50" y1="50" x2="50" y2="15" className="clock-hand"></line>
                  </svg>
                  <p className="time-value">22.4</p>
                </div>
                <div className="questions-count">
                  <div className="hand-icon">
                  <img src="img/question-count.png" alt="English" className="question-count-icon" />
                  </div>
                  <p className="question-count-number">22</p>
                </div>
              </div>
            </div>
          </div>

          {/* Second Assessment Card */}
          <div className="participant-card">
            <div className="card-header">
              <div className="card-icon-container">
                <img src="img/icon-count.svg" alt="Assessment 2" className="card-logo" />
              </div>
              <div className="card-text-container">
                <p className="participationheader">{participantCounts[1].title}</p>
                <div className="card-percentage" style={{ color: secondTextColor }}>
                  <i className={`fa-solid ${secondIcon}`}></i> {Math.abs(scoreDifference).toFixed(2)} {secondText}
                </div>
              </div>
              <div className="card-count-container">
                <img src="img/user-count.svg" alt="Participant Count" className="count-icon" />
                <span className="card-value">{parseInt(participantCounts[1].participant_count, 10)}</span>
              </div>
            </div>

            {/* Additional smaller cards */}
            <div className="additional-cards">
              <div className="small-card">
                <div className="small-card-top">
                  <img src="img/aptitude.svg" alt="Aptitude" className="small-card-icon" />
                  <p className="small-card-heading">Aptitude</p>
                </div>
                <div className="animated-clock">
                  <svg viewBox="0 0 100 100" className="clock">
                    <circle cx="50" cy="50" r="45" className="clock-face" />
                    <line x1="50" y1="50" x2="50" y2="15" className="clock-hand"></line>
                  </svg>
                  <p className="time-value">22.4</p>
                </div>
                <div className="questions-count">
                  <div className="hand-icon">
                  <img src="img/question-count.png" alt="English" className="question-count-icon" />
                  </div>
                  <p className="question-count-number">22</p>
                </div>
              </div>
              <div className="small-card">
                <div className="small-card-top">
                  <img src="img/coding.svg" alt="Coding" className="small-card-icon" />
                  <p className="small-card-heading">Coding</p>
                </div>
                <div className="animated-clock">
                  <svg viewBox="0 0 100 100" className="clock">
                    <circle cx="50" cy="50" r="45" className="clock-face" />
                    <line x1="50" y1="50" x2="50" y2="15" className="clock-hand"></line>
                  </svg>
                  <p className="time-value">22.4</p>
                </div>
                <div className="questions-count">
                  <div className="hand-icon">
                  <img src="img/question-count.png" alt="English" className="question-count-icon" />
                  </div>
                  <p className="question-count-number">22</p>
                </div>
              </div>
              <div className="small-card">
                <div className="small-card-top">
                  <img src="img/verbal.svg" alt="English" className="small-card-icon" />
                  <p className="small-card-heading">English</p>
                </div>
                <div className="animated-clock">
                  <svg viewBox="0 0 100 100" className="clock">
                    <circle cx="50" cy="50" r="45" className="clock-face" />
                    <line x1="50" y1="50" x2="50" y2="15" className="clock-hand"></line>
                  </svg>
                  <p className="time-value">22.4</p>
                </div>
                <div className="questions-count">
                  <div className="hand-icon">
                  <img src="img/question-count.png" alt="English" className="question-count-icon" />
                  </div>
                  <p className="question-count-number">22</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>No data available</div>;
};

export default ParticipantGraph;
