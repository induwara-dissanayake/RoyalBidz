import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const testUsers = [
    { role: 'Admin', email: 'admin@royalbidz.com', password: 'Admin123!' },
    { role: 'Seller', email: 'seller@royalbidz.com', password: 'Seller123!' },
    { role: 'Buyer', email: 'buyer@royalbidz.com', password: 'Buyer123!' }
  ]

  const fillTestUser = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-title">
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>??</div>
          <h1>Login to RoyalBidz</h1>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#718096'
                }}
              >
                {showPassword ? '??' : '???'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '10px' }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px' }} />
                Logging in...
              </>
            ) : (
              <>
                ?? Login
              </>
            )}
          </button>
        </form>

        <div className="auth-link">
          <p>
            Don't have an account?{' '}
            <Link to="/register">Register here</Link>
          </p>
        </div>

        {/* Test Users Section */}
        <div style={{ marginTop: '30px' }}>
          <h4 style={{ 
            color: '#2d3748', 
            marginBottom: '15px', 
            textAlign: 'center',
            fontSize: '1rem'
          }}>
            ?? Test Accounts
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {testUsers.map((user, index) => (
              <button
                key={index}
                type="button"
                onClick={() => fillTestUser(user.email, user.password)}
                style={{
                  background: '#f7fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#edf2f7';
                  e.target.style.borderColor = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f7fafc';
                  e.target.style.borderColor = '#e2e8f0';
                }}
              >
                <div style={{ 
                  fontWeight: 'bold', 
                  color: '#2d3748',
                  fontSize: '0.9rem'
                }}>
                  {user.role}
                </div>
                <div style={{ 
                  color: '#4a5568',
                  fontSize: '0.8rem',
                  fontFamily: "'Courier New', monospace"
                }}>
                  {user.email}
                </div>
              </button>
            ))}
          </div>
          <p style={{
            textAlign: 'center',
            color: '#718096',
            fontSize: '0.8rem',
            marginTop: '10px'
          }}>
            Click any account to auto-fill the form
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;