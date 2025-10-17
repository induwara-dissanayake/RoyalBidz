import React from 'react';
import './VerifyEmail.css';
import Footer from '../components/Footer';
import '../components/Footer.css';
import Navbar from '../components/Navbar'; 

const VerifyEmail = () => {
  return (
   
    <div className="main-page-wrapper"> 
      <Navbar /> 

      
      <div className="verified-page-container">
        <div className="verification-card">
          <div className="checkmark-icon">
            <svg viewBox="0 0 24 24" width="70" height="70" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
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

      <Footer /> 
    </div>
  );
};

export default VerifyEmail;