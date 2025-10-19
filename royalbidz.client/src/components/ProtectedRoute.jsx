import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import RegisterForm from "./RegisterForm";
import SignIn from "../pages/SignIn";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
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
            }}
          ></div>
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
          {/* Dimmed background content */}
          <div
            style={{
              opacity: 0.3,
              pointerEvents: "none",
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ textAlign: "center", padding: "40px" }}>
              <h2 style={{ color: "#4a5568", marginBottom: "16px" }}>
                Authentication Required
              </h2>
              <p style={{ color: "#718096" }}>
                Please sign in to access this page
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
              zIndex: 2000,
              overflow: "hidden",
            }}
          >
            <div style={{ maxHeight: "95vh", overflow: "hidden" }}>
              {showRegisterForm ? (
                <RegisterForm
                  onClose={() => {
                    // On close, redirect to home page
                    window.location.href = "/";
                  }}
                  onShowSignIn={() => {
                    setShowRegisterForm(false);
                    setShowSignIn(true);
                  }}
                />
              ) : showSignIn ? (
                <SignIn
                  onClose={() => {
                    // On close, redirect to home page
                    window.location.href = "/";
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
