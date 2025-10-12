import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';

const SecuritySettings = ({ user, onPasswordChange }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    // Validate new password
    const passwordValidation = validatePassword(passwordForm.newPassword);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    // Check if passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await onPasswordChange({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      // Reset form on success
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
    } catch (error) {
      setPasswordError(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return { level: 'weak', color: '#f56565', width: '33%' };
    if (strength <= 4) return { level: 'medium', color: '#ed8936', width: '66%' };
    return { level: 'strong', color: '#48bb78', width: '100%' };
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Shield size={20} /> Security Settings
        </h3>
      </div>

      {/* Account Security Status */}
      <div style={{
        background: '#f0fff4',
        border: '1px solid #9ae6b4',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle size={16} style={{ color: '#48bb78' }} />
          <span style={{ fontWeight: '600', color: '#22543d' }}>Account Secured</span>
        </div>
        <div style={{ fontSize: '14px', color: '#22543d' }}>
          Your account is protected with secure authentication.
        </div>
      </div>

      {/* Security Information */}
      <div className="grid grid-2 mb-4">
        <div>
          <h4 style={{ color: '#2d3748', marginBottom: '12px' }}>Account Information</h4>
          <div style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.5' }}>
            <div><strong>User ID:</strong> #{user?.id}</div>
            <div><strong>Email:</strong> {user?.email}</div>
            <div><strong>Role:</strong> {user?.role}</div>
            <div><strong>Status:</strong> {user?.status}</div>
          </div>
        </div>
        
        <div>
          <h4 style={{ color: '#2d3748', marginBottom: '12px' }}>Security Features</h4>
          <div style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.5' }}>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={14} style={{ color: '#48bb78' }} />
              <span>Password Protected</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={14} style={{ color: '#48bb78' }} />
              <span>JWT Authentication</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={14} style={{ color: '#48bb78' }} />
              <span>Secure API Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      {!showPasswordForm ? (
        <div style={{
          background: '#fff5f5',
          border: '1px solid #fed7d7',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Lock size={16} style={{ color: '#e53e3e' }} />
                <span style={{ fontWeight: '600', color: '#742a2a' }}>Password Security</span>
              </div>
              <div style={{ fontSize: '14px', color: '#742a2a' }}>
                Change your password to keep your account secure
              </div>
            </div>
            <button
              onClick={() => setShowPasswordForm(true)}
              className="btn btn-outline btn-sm"
            >
              <Lock size={14} /> Change Password
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          background: '#f7fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h4 style={{ color: '#2d3748', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={16} /> Change Password
          </h4>

          {passwordError && (
            <div className="alert alert-error" style={{ marginBottom: '16px' }}>
              <AlertTriangle size={16} />
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  className="form-input"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  required
                  placeholder="Enter your current password"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#718096'
                  }}
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  className="form-input"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                  placeholder="Enter your new password"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#718096'
                  }}
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {passwordForm.newPassword && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>
                    Password Strength: {getPasswordStrength(passwordForm.newPassword).level}
                  </div>
                  <div style={{
                    width: '100%',
                    height: '4px',
                    background: '#e2e8f0',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: getPasswordStrength(passwordForm.newPassword).width,
                      height: '100%',
                      background: getPasswordStrength(passwordForm.newPassword).color,
                      transition: 'all 0.3s ease'
                    }} />
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  className="form-input"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  placeholder="Confirm your new password"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#718096'
                  }}
                >
                  {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: '14px', height: '14px', margin: 0 }} />
                    Updating...
                  </>
                ) : (
                  <>
                    <Shield size={16} /> Update Password
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError('');
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;