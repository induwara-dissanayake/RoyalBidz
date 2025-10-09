import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Settings, Home, Gavel, Gem } from 'lucide-react';
import './Navbar.css';
import logoImage from '../img/logo6.png';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="navbar-container">
      <div className="navbar-logo"> 
        <a href="/">
          <img src={logoImage} alt="ROYALBIDZ JEWELRY" className="logo-image" />
        </a>
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
        <input type="text" placeholder="Search auctions..." className="search-input" />
      </div>
      
      <nav className="navbar-links">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li className="dropdown">
            <a href="/auctions">Auctions <span className="dropdown-arrow">▼</span></a>
            <div className="dropdown-content">
              <a href="/auctions">Browse Auctions</a>
              <a href="/jewelry">Jewelry Catalog</a>
              {isAuthenticated && <a href="/bids">My Bids</a>}
            </div>
          </li>
          {isAuthenticated && (
            <>
              <li><a href="/bids">My Bids</a></li>
              <li><a href="/payments">Payments</a></li>
              {user?.role === 'Admin' && <li><a href="/users">Users</a></li>}
            </>
          )}
          <li><a href="#contact">Contact us</a></li>
        </ul>
      </nav>
      
      <div className="navbar-actions">
        {!isAuthenticated ? (
          <>
            <a href="/register" className="register-button">Register</a>
            <a href="/login" className="register-button" style={{ marginLeft: '8px' }}>Login</a>
          </>
        ) : (
          <>
            <span style={{ color: 'white', fontSize: '14px', marginRight: '12px' }}>
              Hello, {user?.firstName}!
            </span>
            
            {/* Profile Icon */}
            <a href="/profile" className="profile-icon" aria-label="User Profile" title="Profile">
              <User size={20} />
            </a>

            {/* Logout Icon */}
            <button 
              onClick={handleLogout}
              className="profile-icon" 
              aria-label="Logout" 
              title="Logout"
              style={{ background: 'rgba(239, 68, 68, 0.2)', border: 'none', cursor: 'pointer' }}
            >
              <LogOut size={20} />
            </button>
          </>
        )}
        
        {/* Notification Icon - Only show if authenticated */}
        {isAuthenticated && (
          <a href="#notifications" className="notification-icon" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" 
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6981 21.5547 10.4458 21.3031 10.27 21" 
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="notification-badge">3</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default Navbar;