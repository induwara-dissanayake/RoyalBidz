import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './SignIn.css';
import logo from '../img/logo6.png';

export default function SignIn({ onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(formData);
      if (result && result.success) {
        setLoading(false);
        if (onClose) onClose();
        navigate('/');
      } else {
        setLoading(false);
        setError(result?.message || 'Invalid credentials');
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred during sign in');
    }
  };

  return (
    <div className="signin-page modal-mode">
      <div className="signin-wrapper">
        <div className="signin-container-modern">
          {/* Close button */}
          <button
            type="button"
            className="signin-close"
            onClick={() => {
              if (onClose) onClose();
              else navigate('/');
            }}
            aria-label="Close sign in"
          >
            ✕
          </button>

          {/* Left Panel -  */}
          <div className="welcome-panel">
            <div className="welcome-content">
              <div className="logo-container">
                <img src={logo} alt="RoyalBidz Logo" className="signin-logo" />
              </div>
              <h1 className="welcome-title">Welcome Back to<br/>RoyalBidz</h1>
              <p className="welcome-description">
                Sign in to access your account and continue your bidding journey.
              </p>
              <div className="welcome-features">
                <div className="feature-item">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Track Your Bids</span>
                </div>
                <div className="feature-item">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Manage Listings</span>
                </div>
                <div className="feature-item">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Secure Access</span>
                </div>
              </div>
              <div className="welcome-link">
                <button onClick={() => { if (onClose) onClose(); navigate('/register'); }} className="create-account-btn">
                  Create Account
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Sign In Form */}
          <div className="form-panel">
            <div className="form-content">
              <h2 className="form-title">Sign in to your account</h2>

              {error && (
                <div className="alert-error">
                  <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="signin-form">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    className="form-input"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter your username"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-input"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <div className="flex-between">
                    <label className="checkbox-container">
                      <input type="checkbox" className="remember-checkbox" />
                      <span className="checkbox-label">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-signin" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>
                </div>
              </form>

              <div className="form-footer">
                <p>Don't have an account? <Link to="/register" className="register-link">Sign Up</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
