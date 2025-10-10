import React from 'react';
import './VerifyEmail.css';

const VerifyEmail = () => {
  return (
    <div className="verify-wrapper">
      <div className="verify-card">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/542/542638.png" 
          alt="Mail Icon" 
          className="verify-icon"
        />
        <h2>Please verify your email</h2>
        <p>You’re almost there! We sent an email to</p>
        <p className="email">abcd@gmail.com</p>
        <p className="note">
          Just click on the link in that email to complete your signup. 
          If you don’t see it, you may need to check your spam folder.
        </p>
        <button className="verify-btn">Resend Verification Email</button>
      </div>

      <footer className="footer">
        <div className="footer-column">
          <h4>Our Pages</h4>
          <p>Home</p>
          <p>For you</p>
          <p>Items</p>
          <p>Register</p>
          <p>Sign in</p>
        </div>
        <div className="footer-column">
          <h4>Explore</h4>
          <p>Design</p>
          <p>Prototyping</p>
          <p>Design systems</p>
        </div>
        <div className="footer-column">
          <h4>Resources</h4>
          <p>Blog</p>
          <p>Support</p>
          <p>Developers</p>
        </div>
      </footer>
    </div>
  );
};

export default VerifyEmail;