// Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";
import logoImage from "../img/logo6.png";
import RegisterForm from "./RegisterForm";
import SignIn from "../pages/SignIn";

function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // Fetch unread notification count
  const fetchUnreadNotificationCount = async () => {
    if (!isAuthenticated) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/notifications/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Accept PascalCase or camelCase from the server
        const count = data.unreadNotifications ?? data.UnreadNotifications ?? 0;
        setUnreadNotificationCount(
          Number.isFinite(Number(count)) ? Number(count) : 0
        );
      } else if (response.status === 401 || response.status === 403) {
        // Unauthenticated/forbidden: keep count at 0 quietly
        setUnreadNotificationCount(0);
      }
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    if (showRegister || showSignIn) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalBodyOverflow || "";
      document.documentElement.style.overflow = originalHtmlOverflow || "";
    }
    return () => {
      document.body.style.overflow = originalBodyOverflow || "";
      document.documentElement.style.overflow = originalHtmlOverflow || "";
    };
  }, [showRegister, showSignIn]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadNotificationCount();
      // Refresh notification count every 30 seconds
      const interval = setInterval(fetchUnreadNotificationCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);
  return (
    <>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logoImage} alt="ROYALBIDZ JEWELRY" className="logo-image" />
          <div className="logo-text"></div>
        </Link>

        <div className="navbar-search">
          <button className="search-button" aria-label="Search">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
          />
        </div>

        <nav className="navbar-links">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/foryou">For You</Link>
            </li>
            <li className="dropdown">
              <Link to="/jewelry">
                Jewelry <span className="dropdown-arrow">▼</span>
              </Link>
              <div className="dropdown-content">
                {/* Use React Router Links with query params so the Jewelry page can read searchParams and apply filters */}
                <Link to="/jewelry?category=Necklace">Necklaces</Link>
                <Link to="/jewelry?category=Pendant">Pendants</Link>
                <Link to="/jewelry?category=Ring">Rings</Link>
                {/* Map 'Bangles' to 'Bracelet' which the Jewelry page recognises */}
                <Link to="/jewelry?category=Bracelet">Bangles</Link>
                <Link to="/jewelry?category=Bracelet">Bracelets</Link>
                {/* Normalize to 'Earrings' */}
                <Link to="/jewelry?category=Earrings">
                  Ear studs / Earrings
                </Link>
              </div>
            </li>
            <li>
              <Link to="/contact">Contact us</Link>
            </li>

            {/* Show Register and Sign In buttons only for non-authenticated users */}
            {!isAuthenticated && (
              <>
                <li>
                  <button
                    className="signin-nav-button"
                    onClick={() => setShowSignIn(true)}
                  >
                    Sign in
                  </button>
                </li>
                <li>
                  <button
                    className="register-button"
                    onClick={() => setShowRegister(true)}
                  >
                    Register
                  </button>
                </li>
              </>
            )}

            {/* Show user-specific icons only for authenticated users */}
            {isAuthenticated && (
              <>
                <li>
                  <Link
                    to="/notifications"
                    className="notification-icon"
                    aria-label="Notifications"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6981 21.5547 10.4458 21.3031 10.27 21"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {unreadNotificationCount > 0 && (
                      <span className="notification-badge">
                        {unreadNotificationCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wishlist"
                    className="wishlist-icon"
                    aria-label="Wishlist"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        stroke="black"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 5.5C12.5 4.5 14 3 16.5 3C19.58 3 22 5.42 22 8.5C22 11.5 20 14 16 17"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.3"
                      />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="profile-icon"
                    aria-label="User Profile"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="7"
                        r="4"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {/* Render RegisterForm modal when requested */}
      {showRegister && (
        <RegisterForm
          onClose={() => setShowRegister(false)}
          onShowSignIn={() => {
            setShowRegister(false);
            setShowSignIn(true);
          }}
        />
      )}

      {/* Render SignIn modal when requested; allow it to open Register as well */}
      {showSignIn && (
        <SignIn
          onClose={() => setShowSignIn(false)}
          onShowRegister={() => {
            setShowSignIn(false);
            setShowRegister(true);
          }}
        />
      )}
    </>
  );
}

export default Navbar;
