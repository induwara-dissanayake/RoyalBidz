import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  User, 
  Settings, 
  Activity, 
  BarChart3, 
  Crown, 
  Gavel, 
  DollarSign, 
  Award,
  Loader2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

// Import styles and components
import '../styles/common.css';
import ProfileCard from '../components/ProfileCard';
import StatCard from '../components/StatCard';
import ActivityCard from '../components/ActivityCard';
import SecuritySettings from '../components/SecuritySettings';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile data states
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  
  // Statistics states
  const [stats, setStats] = useState({
    totalBids: 0,
    wonAuctions: 0,
    totalSpent: 0,
    activeAuctions: 0
  });
  
  // Activity states
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfileData();
    }
  }, [isAuthenticated, user]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load profile data (using user from context for now)
      setProfileData(user);
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || ''
      });

      // Load user statistics
      await Promise.all([
        loadUserStats(),
        loadRecentActivity()
      ]);

    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      // Load user's bids
      const bidsResponse = await axios.get('/api/bids/my-bids');
      const userBids = bidsResponse.data || [];
      
      // Load user's payments
      let userPayments = [];
      try {
        const paymentsResponse = await axios.get('/api/payments/my-payments');
        userPayments = paymentsResponse.data || [];
      } catch (error) {
        console.warn('Could not load payments:', error);
      }

      // Calculate statistics
      const totalBids = userBids.length;
      const wonAuctions = userBids.filter(bid => bid.status === 'Winning').length;
      const totalSpent = userPayments.reduce((sum, payment) => sum + payment.totalAmount, 0);
      
      // Get active auctions where user has bid
      let activeAuctions = 0;
      try {
        const activeAuctionsResponse = await axios.get('/api/auctions/active');
        const activeAuctionsList = activeAuctionsResponse.data || [];
        const userBidAuctionIds = userBids.map(bid => bid.auctionId);
        activeAuctions = activeAuctionsList.filter(auction => 
          userBidAuctionIds.includes(auction.id)
        ).length;
      } catch (error) {
        console.warn('Could not load active auctions:', error);
      }

      setStats({
        totalBids,
        wonAuctions,
        totalSpent,
        activeAuctions
      });

    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const activities = [];
      
      // Load recent bids
      const bidsResponse = await axios.get('/api/bids/my-bids');
      const recentBids = (bidsResponse.data || []).slice(0, 5);
      
      recentBids.forEach(bid => {
        activities.push({
          type: 'bid',
          title: `Bid placed on ${bid.auctionTitle || 'Auction'}`,
          description: `Bid amount: $${bid.amount}`,
          timestamp: bid.bidTime,
          amount: bid.amount
        });
      });

      // Load recent payments
      try {
        const paymentsResponse = await axios.get('/api/payments/my-payments');
        const recentPayments = (paymentsResponse.data || []).slice(0, 3);
        
        recentPayments.forEach(payment => {
          activities.push({
            type: 'payment',
            title: `Payment completed for ${payment.auctionTitle || 'Auction'}`,
            description: `Total paid: $${payment.totalAmount}`,
            timestamp: payment.paymentDate,
            amount: payment.totalAmount
          });
        });
      } catch (error) {
        console.warn('Could not load recent payments:', error);
      }

      // Sort by timestamp and take the most recent
      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setRecentActivity(activities.slice(0, 8));

    } catch (error) {
      console.error('Error loading recent activity:', error);
      // Add some sample activities if API fails
      setRecentActivity([
        {
          type: 'bid',
          title: 'Welcome to RoyalBidz!',
          description: 'Your profile has been created successfully',
          timestamp: user?.createdAt,
          amount: null
        }
      ]);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      
      const response = await axios.put(`/api/users/${user.id}`, formData);
      
      setProfileData(response.data);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      firstName: profileData?.firstName || '',
      lastName: profileData?.lastName || '',
      email: profileData?.email || '',
      phoneNumber: profileData?.phoneNumber || '',
      address: profileData?.address || ''
    });
    setError('');
  };

  const handlePasswordChange = async (passwordData) => {
    try {
      await axios.post('/api/auth/change-password', passwordData);
      setSuccess('Password changed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          <Loader2 size={32} className="spinner" />
          <span>Loading your profile...</span>
        </div>
      </div>
    );
  }

  // Show authentication required
  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="card text-center" style={{ padding: '60px 20px' }}>
          <AlertTriangle size={48} style={{ color: '#ed8936', marginBottom: '20px' }} />
          <h3 style={{ color: '#4a5568', marginBottom: '12px' }}>Authentication Required</h3>
          <p style={{ color: '#718096', marginBottom: '24px' }}>
            Please log in to view your profile and manage your account settings.
          </p>
          <div className="flex gap-2 justify-center">
            <a href="/login" className="btn btn-primary">
              <User size={16} /> Login
            </a>
            <a href="/register" className="btn btn-outline">
              Register
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="card">
        <div className="text-center">
          <h1 style={{ 
            color: '#2d3748', 
            fontSize: '2.5rem', 
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <Crown size={32} style={{ color: '#667eea' }} />
            My Profile
          </h1>
          <p style={{ color: '#718096', fontSize: '1.1rem', margin: 0 }}>
            Manage your account settings and view your activity
          </p>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="alert alert-error">
          <AlertTriangle size={16} />
          {error}
          <button 
            onClick={() => setError('')}
            style={{ 
              position: 'absolute',
              right: '16px',
              top: '16px',
              background: 'none', 
              border: 'none', 
              fontSize: '18px',
              cursor: 'pointer',
              color: '#742a2a'
            }}
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle size={16} />
          {success}
          <button 
            onClick={() => setSuccess('')}
            style={{ 
              position: 'absolute',
              right: '16px',
              top: '16px',
              background: 'none', 
              border: 'none', 
              fontSize: '18px',
              cursor: 'pointer',
              color: '#22543d'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Profile Information */}
      <ProfileCard
        user={profileData}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSaveProfile}
        onCancel={handleCancelEdit}
        formData={formData}
        onFormChange={handleFormChange}
      />

      {/* Statistics Cards */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <BarChart3 size={20} /> Account Statistics
          </h3>
        </div>
        
        <div className="grid grid-4">
          <StatCard
            icon={<Gavel size={28} />}
            title="Total Bids"
            value={stats.totalBids}
            subtitle="Bids placed"
            color="#667eea"
          />
          <StatCard
            icon={<Award size={28} />}
            title="Won Auctions"
            value={stats.wonAuctions}
            subtitle="Successful bids"
            color="#ed8936"
          />
          <StatCard
            icon={<DollarSign size={28} />}
            title="Total Spent"
            value={`$${stats.totalSpent.toLocaleString()}`}
            subtitle="All payments"
            color="#48bb78"
          />
          <StatCard
            icon={<Activity size={28} />}
            title="Active Bids"
            value={stats.activeAuctions}
            subtitle="Ongoing auctions"
            color="#9f7aea"
          />
        </div>
      </div>

      <div className="grid grid-2">
        {/* Recent Activity */}
        <ActivityCard
          activities={recentActivity}
          title="Recent Activity"
          emptyMessage="No recent activity found. Start bidding on auctions to see your activity here!"
        />

        {/* Security Settings */}
        <SecuritySettings
          user={profileData}
          onPasswordChange={handlePasswordChange}
        />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Settings size={20} /> Quick Actions
          </h3>
        </div>
        
        <div className="grid grid-4">
          <a href="/auctions" className="btn btn-primary">
            <Gavel size={16} /> Browse Auctions
          </a>
          <a href="/bids" className="btn btn-secondary">
            <Activity size={16} /> My Bids
          </a>
          <a href="/payments" className="btn btn-outline">
            <DollarSign size={16} /> Payment History
          </a>
          <a href="/jewelry" className="btn btn-outline">
            <Crown size={16} /> View Jewelry
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;