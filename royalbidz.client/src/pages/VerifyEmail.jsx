import React from 'react';
import './VerifyEmail.css';

const VerifyEmail = () => {
  return (
    <div className="VerifyEmail-container">
      <div className="verification-card">
        <div className="checkmark-icon">
          {/* Checkmark SVG or a simple div with a background image */}
          <svg viewBox="0 0 24 24" width="60" height="60" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h1>Verified !</h1>
        <p>You have successfully verified your account.</p>
        <button className="ok-button" onClick={() => console.log('OK button clicked')}>
          Ok
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;