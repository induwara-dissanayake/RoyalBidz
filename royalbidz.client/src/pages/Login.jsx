import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Eye, EyeOff, User, Mail, Lock, Loader2, Crown } from 'lucide-react';
import '../styles/common.css';

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

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const testUsers = [
    { role: 'Admin', email: 'admin@royalbidz.com', password: 'Admin123!', icon: <Crown size={16} />, color: '#9f7aea' },
    { role: 'Seller', email: 'seller@royalbidz.com', password: 'Seller123!', icon: <User size={16} />, color: '#667eea' },
    { role: 'Buyer', email: 'buyer@royalbidz.com', password: 'Buyer123!', icon: <User size={16} />, color: '#48bb78' }
  ];

  const fillTestUser = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-title">
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            <Crown size={48} style={{ color: '#667eea' }} />
          </div>
          <h1>Welcome Back</h1>
          <p style={{ color: '#718096', margin: '8px 0 0 0', fontSize: '14px' }}>
            Sign in to your RoyalBidz account
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <Mail size={16} style={{ marginRight: '6px' }} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={16} style={{ marginRight: '6px' }} />
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                style={{ paddingRight: '45px' }}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#718096',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="auth-link">
          <p>
            Don't have an account?{' '}
            <Link to="/register">Create one here</Link>
          </p>
        </div>

        {/* Test Users Section */}
        <div style={{ marginTop: '30px' }}>
          <h4 style={{ 
            color: '#2d3748', 
            marginBottom: '15px', 
            textAlign: 'center',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <User size={16} /> Demo Accounts
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {testUsers.map((user, index) => (
              <button
                key={index}
                type="button"
                onClick={() => fillTestUser(user.email, user.password)}
                disabled={loading}
                style={{
                  background: '#f7fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  opacity: loading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.background = '#edf2f7';
                    e.target.style.borderColor = user.color;
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.background = '#f7fafc';
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600', 
                  color: '#2d3748',
                  fontSize: '13px',
                  marginBottom: '4px'
                }}>
                  <span style={{ color: user.color }}>{user.icon}</span>
                  {user.role} Account
                </div>
                <div style={{ 
                  color: '#4a5568',
                  fontSize: '12px',
                  fontFamily: "'Courier New', monospace"
                }}>
                  {user.email}
                </div>
              </button>
            ))}
          </div>
          <p style={{
            textAlign: 'center',
            color: '#a0aec0',
            fontSize: '11px',
            marginTop: '12px'
          }}>
            Click any account to auto-fill the login form
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;