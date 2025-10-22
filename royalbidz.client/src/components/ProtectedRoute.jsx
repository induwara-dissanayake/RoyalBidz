// src/components/ProtectedRoute.jsx

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { useAuth } from "../contexts/AuthContext";
import RegisterForm from "./RegisterForm"; 
import SignIn from "../pages/SignIn"; 


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation(); 
  const navigate = useNavigate(); 

  const [showRegisterForm, setShowRegisterForm] = useState(true); 
  const [showSignIn, setShowSignIn] = useState(false);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            className="spinner"
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #f3f4f6",
              borderTop: "3px solid #E0AF62",
              borderRadius: "50%",
              margin: "0 auto 16px",
              animation: "spin 1s linear infinite", 
            }}
          ></div>
          {/* Add basic spin animation for the spinner */}
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <span style={{ color: "#6b7280" }}>Checking authentication...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, show authentication popup
  if (!isAuthenticated) {
    return (
      <>
        {/* Background overlay with content dimmed */}
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            position: "relative",
          }}
        >
          {/* Dimmed background content - This part will act as the visible content behind the modal */}
          <div
            style={{
              
              pointerEvents: "none", 
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              
            }}
          >
            {/* You can replace this with a dimmed version of your main AppContent if needed */}
            <div style={{ textAlign: "center", padding: "40px" }}>
              <h2 style={{ color: "#4a5568", marginBottom: "16px" }}>
                Authentication Required
              </h2>
              <p style={{ color: "#718096" }}>
                Please sign in or register to access this page.
              </p>
            </div>
          </div>

          {/* Authentication popup overlay */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999, 
             
            }}
          >
            {/* Modal content wrapper - ensures scrolling only for the modal if it's too tall */}
            <div style={{ maxHeight: "95vh", overflowY: "auto", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
              {showRegisterForm ? (
                <RegisterForm
                  onClose={() => {
                    navigate("/"); // <-- Corrected: Use navigate for SPA routing
                  }}
                  onShowSignIn={() => {
                    setShowRegisterForm(false);
                    setShowSignIn(true);
                  }}
                />
              ) : showSignIn ? (
                <SignIn
                  onClose={() => {
                    navigate("/"); // <-- Corrected: Use navigate for SPA routing
                  }}
                  onShowRegister={() => {
                    setShowSignIn(false);
                    setShowRegisterForm(true);
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </>
    );
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;