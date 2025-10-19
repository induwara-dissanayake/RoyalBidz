import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import SignIn from "./SignIn";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    // Get email from location state (passed from registration)
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email, redirect to register
      navigate("/");
    }
  }, [location.state, navigate]);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/verify-email", {
        email,
        verificationCode,
      });

      if (response.data.Success) {
        setSuccess("Email verified successfully! Please sign in to continue.");
        setTimeout(() => {
          setShowSignIn(true);
        }, 2000);
      } else {
        setError(response.data.Message || "Verification failed");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/auth/resend-verification", {
        email,
      });

      setSuccess(
        "Verification code sent successfully! Please check your email."
      );
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to resend verification code"
      );
    } finally {
      setResending(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
      setError("");
    }
  };

  return (
    <div className="verify-wrapper">
      <div className="verify-card">
        <img
          src="https://cdn-icons-png.flaticon.com/512/542/542638.png"
          alt="Mail Icon"
          className="verify-icon"
        />
        <h2>Verify Your Email</h2>
        <p>We sent a verification code to</p>
        <p className="email">{email}</p>
        <p className="note">
          Enter the 6-digit code from your email to complete your registration.
        </p>

        {error && (
          <div className="alert-error">
            <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert-success">
            <svg
              className="success-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleVerifyEmail} className="verify-form">
          <div className="verification-input-container">
            <input
              type="text"
              value={verificationCode}
              onChange={handleCodeChange}
              placeholder="Enter 6-digit code"
              className="verification-input"
              maxLength="6"
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="verify-btn"
            disabled={loading || verificationCode.length !== 6}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Verifying...</span>
              </>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        <div className="resend-section">
          <p>Didn't receive the code?</p>
          <button
            onClick={handleResendCode}
            className="resend-btn"
            disabled={resending}
          >
            {resending ? "Sending..." : "Resend Verification Code"}
          </button>
        </div>
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

      {/* SignIn Modal */}
      {showSignIn && (
        <SignIn
          onClose={() => {
            setShowSignIn(false);
            navigate("/", { replace: true });
          }}
        />
      )}
    </div>
  );
};

export default VerifyEmail;
