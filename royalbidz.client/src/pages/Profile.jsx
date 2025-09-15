import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfile();
    }
  }, [isAuthenticated, user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // For now, we'll use the user data from context
      setProfileData(user);
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${user.id}`, formData);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData({
      firstName: profileData.firstName || '',
      lastName: profileData.lastName || '',
      email: profileData.email || '',
      phoneNumber: profileData.phoneNumber || '',
      address: profileData.address || ''
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>??</div>
          <h3 style={{ color: '#4a5568', marginBottom: '10px' }}>Authentication Required</h3>
          <p style={{ color: '#718096', marginBottom: '20px' }}>
            Please log in to view your profile
          </p>
          <a href="/login" className="btn btn-primary">
            Login
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="spinner"></div>
          <span style={{ marginLeft: '10px' }}>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              {profileData?.firstName?.[0]}{profileData?.lastName?.[0]}
            </div>
            <div>
              <h1 className="card-title">
                {profileData?.firstName} {profileData?.lastName}
              </h1>
              <p style={{ color: '#718096', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                ??? {profileData?.role} Account
                {profileData?.status && (
                  <span className={`badge badge-${profileData.status.toLowerCase()}`}>
                    {profileData.status}
                  </span>
                )}
              </p>
            </div>
          </div>
          
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="btn btn-primary"
            >
              ?? Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error">
          {error}
          <button 
            onClick={() => setError('')}
            style={{ float: 'right', background: 'none', border: 'none', fontSize: '16px' }}
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
          <button 
            onClick={() => setSuccess('')}
            style={{ float: 'right', background: 'none', border: 'none', fontSize: '16px' }}
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-2">
        {/* Profile Information */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>Profile Information</h3>
          
          {editMode ? (
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  placeholder="Optional"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Optional"
                  rows="3"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  ?? Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-outline"
                >
                  ? Cancel
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>??</span>
                <span style={{ color: '#4a5568' }}>
                  {profileData?.firstName} {profileData?.lastName}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>??</span>
                <span style={{ color: '#4a5568' }}>{profileData?.email}</span>
              </div>

              {profileData?.phoneNumber && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>??</span>
                  <span style={{ color: '#4a5568' }}>{profileData.phoneNumber}</span>
                </div>
              )}

              {profileData?.address && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span>??</span>
                  <span style={{ color: '#4a5568', lineHeight: '1.4' }}>{profileData.address}</span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>??</span>
                <span style={{ color: '#4a5568' }}>
                  Member since {new Date(profileData?.createdAt).toLocaleDateString()}
                </span>
              </div>

              {profileData?.lastLogin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>??</span>
                  <span style={{ color: '#4a5568' }}>
                    Last login: {new Date(profileData.lastLogin).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account Information */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>Account Details</h3>
          
          <div style={{ marginBottom: '30px', padding: '15px', background: '#f7fafc', borderRadius: '8px' }}>
            <h4 style={{ color: '#2d3748', marginBottom: '10px' }}>Account Information</h4>
            <div style={{ fontSize: '0.9rem', color: '#4a5568', lineHeight: '1.5' }}>
              <p><strong>User ID:</strong> {profileData?.id}</p>
              <p><strong>Role:</strong> {profileData?.role}</p>
              <p><strong>Status:</strong> {profileData?.status}</p>
              <p><strong>Created:</strong> {new Date(profileData?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div style={{ padding: '15px', background: '#fff5f5', borderRadius: '8px', border: '1px solid #fed7d7' }}>
            <h4 style={{ color: '#2d3748', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ?? Security
            </h4>
            <p style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.4', margin: 0 }}>
              To change your password or update security settings, please contact support or use the password reset feature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;