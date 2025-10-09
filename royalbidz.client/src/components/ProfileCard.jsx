import React from 'react';
import { User, Edit3, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';

const ProfileCard = ({ user, isEditing, onEdit, onSave, onCancel, formData, onFormChange }) => {
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'badge-admin';
      case 'seller': return 'badge-seller';
      case 'buyer': return 'badge-buyer';
      default: return 'badge-inactive';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'badge-active';
      case 'suspended': return 'badge-pending';
      case 'inactive': return 'badge-inactive';
      default: return 'badge-inactive';
    }
  };

  if (isEditing) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Edit3 size={20} /> Edit Profile
          </h3>
        </div>

        <form onSubmit={onSave}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.firstName}
                onChange={(e) => onFormChange('firstName', e.target.value)}
                required
                placeholder="Enter your first name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.lastName}
                onChange={(e) => onFormChange('lastName', e.target.value)}
                required
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => onFormChange('email', e.target.value)}
              required
              placeholder="Enter your email address"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              value={formData.phoneNumber || ''}
              onChange={(e) => onFormChange('phoneNumber', e.target.value)}
              placeholder="Enter your phone number (optional)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              className="form-input form-textarea"
              value={formData.address || ''}
              onChange={(e) => onFormChange('address', e.target.value)}
              placeholder="Enter your address (optional)"
              rows="3"
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">
              <Shield size={16} /> Save Changes
            </button>
            <button type="button" onClick={onCancel} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <div className="avatar avatar-lg">
            {getInitials(user?.firstName, user?.lastName)}
          </div>
          <div>
            <h2 className="card-title mb-1">
              {user?.firstName} {user?.lastName}
            </h2>
            <div className="flex items-center gap-2">
              <span className={`badge ${getRoleBadgeClass(user?.role)}`}>
                {user?.role}
              </span>
              <span className={`badge ${getStatusBadgeClass(user?.status)}`}>
                {user?.status}
              </span>
            </div>
          </div>
        </div>
        <button onClick={onEdit} className="btn btn-primary">
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>

      <div className="grid grid-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-gray-600" />
            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="font-semibold">{user?.email}</div>
            </div>
          </div>

          {user?.phoneNumber && (
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-gray-600" />
              <div>
                <div className="text-sm text-gray-600">Phone</div>
                <div className="font-semibold">{user.phoneNumber}</div>
              </div>
            </div>
          )}

          {user?.address && (
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gray-600 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Address</div>
                <div className="font-semibold">{user.address}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-gray-600" />
            <div>
              <div className="text-sm text-gray-600">Member Since</div>
              <div className="font-semibold">{formatDate(user?.createdAt)}</div>
            </div>
          </div>

          {user?.lastLogin && (
            <div className="flex items-center gap-3">
              <User size={18} className="text-gray-600" />
              <div>
                <div className="text-sm text-gray-600">Last Login</div>
                <div className="font-semibold">{formatDate(user.lastLogin)}</div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Shield size={18} className="text-gray-600" />
            <div>
              <div className="text-sm text-gray-600">User ID</div>
              <div className="font-semibold">#{user?.id}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;