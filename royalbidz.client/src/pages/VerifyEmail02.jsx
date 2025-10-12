import React from 'react';
import './VerifyEmail02.css'; 

const VerifyEmail02 = ({ email = 'abcd@gmail.com' }) => {
  const handleResendClick = () => {
    
    console.log(`Resending verification email to ${email}`);
    alert(`A new verification email has been sent to ${email}. Please check your inbox.`);
  };

  return (
    <div className="verify-Email-02-container">
      <div className="verification-card">
        <div className="email-icon">
          {/* Email SVG icon */}
          <svg viewBox="0 0 24 24" width="60" height="60" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>
        <h1>Please verify your email</h1>
        <p className="subtitle">You're almost there! We sent an email to</p>
        <p className="email-address">{email}</p>
        <p className="instructions">
          Just click on the link in that email to complete your signup. If you don't see it, you may need to check your spam folder.
        </p>
        <button className="resend-button" onClick={handleResendClick}>
          Resend Verification Email
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail02;