import React from 'react';

const ProgressBar = ({ progress, large = false }) => {
  const percentage = Math.round((progress || 0) * 100);
  
  return (
    <div className={`progress-bar ${large ? 'large' : ''}`}>
      <div
        className="progress-fill"
        style={{ width: `${percentage}%` }}
      ></div>
      <span className="progress-text">
        {percentage}% {large ? 'Complete' : ''}
      </span>
    </div>
  );
};

export default ProgressBar;
