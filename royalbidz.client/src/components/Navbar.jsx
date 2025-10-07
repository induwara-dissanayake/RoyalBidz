// Navbar.jsx
import React from 'react';
import './Navbar.css';
import logoImage from '../img/logo6.png';

function Navbar() {
  return (
    <div className="navbar-container">
      <div className="navbar-logo"> <img src={logoImage} alt="ROYALBIDZ JEWELRY" className="logo-image" />
        <div className="logo-text">
          
        </div>
      </div>       
      
      <div className="navbar-search">
        <button className="search-button" aria-label="Search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" 
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <input type="text" placeholder="Search products..." className="search-input" />
      </div>
      
      <nav className="navbar-links">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#foryou">For You</a></li>
          <li className="dropdown">
            <a href="#items">Items <span className="dropdown-arrow">▼</span></a>
            <div className="dropdown-content">
              <a href="#jewelry">Jewelry</a>
              <a href="#watches">Watches</a>
              <a href="#accessories">Accessories</a>
            </div>
          </li>
          <li><a href="#contact">Contact us</a></li>
          <li><a href="#signin">Sign in</a></li>
        </ul>
      </nav>
      
      <div className="navbar-actions">
        <button className="register-button">Registe</button>
        
        {/* Notification Icon */}
        <a href="#notifications" className="notification-icon" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" 
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6981 21.5547 10.4458 21.3031 10.27 21" 
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="notification-badge">3</span>
        </a>
        
        
        {/* User Profile Icon */}
        <a href="#profile" className="profile-icon" aria-label="User Profile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" 
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

export default Navbar;