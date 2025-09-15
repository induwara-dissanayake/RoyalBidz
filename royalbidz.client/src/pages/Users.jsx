import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Users as UsersIcon, Shield, Mail, Phone, CalendarDays, RefreshCw, AlertCircle } from 'lucide-react';

const Users = () => {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.role === 'Admin') {
      loadUsers();
    }
  }, [isAuthenticated, user]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data);
      setError('');
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'badge-inactive';
      case 'seller': return 'badge-completed';
      case 'buyer': return 'badge-active';
      default: return 'badge-pending';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'badge-active';
      case 'inactive': return 'badge-pending';
      case 'suspended': return 'badge-inactive';
      default: return 'badge-pending';
    }
  };

  // Check if user is admin
  if (!isAuthenticated || user?.role !== 'Admin') {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Shield size={48} style={{ color: '#f56565', marginBottom: '20px' }} />
          <h3 style={{ color: '#4a5568', marginBottom: '10px' }}>Access Denied</h3>
          <p style={{ color: '#718096' }}>
            This page is only accessible to administrators.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="spinner"></div>
          <span style={{ marginLeft: '10px' }}>Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UsersIcon size={24} /> User Management
            </h1>
            <p style={{ color: '#718096', margin: 0 }}>
              Manage registered users and their permissions
            </p>
          </div>
          <button
            onClick={loadUsers}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={16} style={{ marginRight: '8px' }} />
          {error}
          <button 
            onClick={() => setError('')}
            style={{ float: 'right', background: 'none', border: 'none', fontSize: '16px' }}
          >
            ×
          </button>
        </div>
      )}

      {/* User Statistics */}
      <div className="grid grid-4">
        <div className="card" style={{ textAlign: 'center' }}>
          <UsersIcon size={24} style={{ color: '#667eea', marginBottom: '8px' }} />
          <h3 style={{ color: '#2d3748', margin: '0 0 5px 0' }}>
            {users.length}
          </h3>
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>Total Users</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <Shield size={24} style={{ color: '#f56565', marginBottom: '8px' }} />
          <h3 style={{ color: '#2d3748', margin: '0 0 5px 0' }}>
            {users.filter(u => u.role === 'Admin').length}
          </h3>
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>Admins</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <UsersIcon size={24} style={{ color: '#48bb78', marginBottom: '8px' }} />
          <h3 style={{ color: '#2d3748', margin: '0 0 5px 0' }}>
            {users.filter(u => u.role === 'Seller').length}
          </h3>
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>Sellers</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <UsersIcon size={24} style={{ color: '#ed8936', marginBottom: '8px' }} />
          <h3 style={{ color: '#2d3748', margin: '0 0 5px 0' }}>
            {users.filter(u => u.role === 'Buyer').length}
          </h3>
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>Buyers</p>
        </div>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <UsersIcon size={48} style={{ color: '#cbd5e0', marginBottom: '20px' }} />
          <h3 style={{ color: '#4a5568', marginBottom: '10px' }}>No users found</h3>
          <p style={{ color: '#718096' }}>
            {error ? 'Unable to load users from the server.' : 'No users are registered.'}
          </p>
          {error && (
            <button 
              onClick={loadUsers}
              className="btn btn-primary"
              style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <RefreshCw size={16} /> Try Again
            </button>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Contact</th>
                <th>Joined</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#667eea',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: '500', color: '#2d3748' }}>
                          {u.firstName} {u.lastName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                          ID: {u.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getRoleBadgeClass(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(u.status)}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                        <Mail size={12} /> {u.email}
                      </div>
                      {u.phoneNumber && (
                        <div style={{ color: '#718096', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} /> {u.phoneNumber}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.9rem', color: '#4a5568', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CalendarDays size={12} /> {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                      {u.lastLogin 
                        ? new Date(u.lastLogin).toLocaleDateString()
                        : 'Never'
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;