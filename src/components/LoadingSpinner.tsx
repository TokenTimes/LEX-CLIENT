import React from "react";
import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  isVisible: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-spinner-container">
        <img
          src="/Loading-spinner.png"
          alt="Loading..."
          className="loading-spinner"
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
