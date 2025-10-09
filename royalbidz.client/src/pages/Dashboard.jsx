import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  CheckCircle2,
  CircleDashed,
  AlertOctagon,
  Loader2,
  Gavel,
  Gem,
  LineChart,
  Users as UsersIcon,
  RefreshCw,
  DollarSign,
  Flame,
  Zap,
  Book,
  User,
  LogIn,
  UserPlus
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    auctions: { total: 0, active: 0 },
    jewelry: { total: 0 },
    bids: { total: 0 },
    users: { total: 0 }
  });
  const [recentAuctions, setRecentAuctions] = useState([]);
  const [apiStatus, setApiStatus] = useState('loading');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load core data
      const [auctionsRes, jewelryRes, activeAuctionsRes] = await Promise.all([
        axios.get('/api/auctions'),
        axios.get('/api/jewelry'),
        axios.get('/api/auctions/active')
      ]);

      setStats({
        auctions: { 
          total: auctionsRes.data.items ? auctionsRes.data.items.length : auctionsRes.data.length,
          active: activeAuctionsRes.data.length 
        },
        jewelry: { total: jewelryRes.data.length },
        bids: { total: 0 },
        users: { total: 0 }
      });

      setRecentAuctions(activeAuctionsRes.data.slice(0, 5));
      setApiStatus('connected');

      // Load authenticated data if user is logged in
      if (isAuthenticated && user) {
        try {
          if (user.role === 'Admin') {
            const usersRes = await axios.get('/api/users');
            setStats(prev => ({
              ...prev,
              users: { total: usersRes.data.length }
            }));
          }
          
          const bidsRes = await axios.get('/api/bids/my-bids');
          setStats(prev => ({
            ...prev,
            bids: { total: bidsRes.data.length }
          }));
        } catch (error) {
          console.warn('Some authenticated data could not be loaded:', error);
        }
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please make sure the backend server is running.');
      setApiStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndicator = () => {
    switch (apiStatus) {
      case 'connected':
        return (
          <div style={{ color: '#48bb78', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} />
            API Connected
          </div>
        );
      case 'error':
        return (
          <div style={{ color: '#f56565', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertOctagon size={16} />
            API Error - Check Backend Server
          </div>
        );
      default:
        return (
          <div style={{ color: '#ed8936', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Loader2 size={16} className="spin" />
            Connecting...
          </div>
        );
    }
  };

  const statCards = [
    {
      title: 'Total Auctions',
      value: stats.auctions.total,
      subtitle: `${stats.auctions.active} active`,
      icon: <Gavel size={28} color="#667eea" />,
    },
    {
      title: 'Jewelry Items',
      value: stats.jewelry.total,
      subtitle: 'In catalog',
      icon: <Gem size={28} color="#48bb78" />,
    },
    {
      title: 'My Bids',
      value: stats.bids.total,
      subtitle: 'Total placed',
      icon: <LineChart size={28} color="#ed8936" />,
      authRequired: true
    },
    {
      title: 'Total Users',
      value: stats.users.total,
      subtitle: 'Registered',
      icon: <UsersIcon size={28} color="#9f7aea" />,
      adminOnly: true
    }
  ];

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="spinner"></div>
          <span style={{ marginLeft: '10px' }}>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="card">
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            color: '#2d3748', 
            fontSize: '2.5rem', 
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <Gem size={32} color="#4a5568" />
            RoyalBidz Dashboard
          </h1>
          <p style={{ color: '#718096', fontSize: '1.1rem', marginBottom: '15px' }}>
            Welcome to the Luxury Jewelry Auction Platform
            {user && <span> - Hello, {user.firstName}!</span>}
          </p>
          {getStatusIndicator()}
        </div>
      </div>

      {/* Error Display */}
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

      {/* Welcome Card for Non-Authenticated Users */}
      {!isAuthenticated && (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3 style={{ color: '#2d3748', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <User size={20} /> Welcome to RoyalBidz
            </h3>
            <p style={{ color: '#4a5568', marginBottom: '25px', lineHeight: '1.6' }}>
              Join our exclusive auction platform to bid on luxury jewelry from around the world. 
              Create an account to start participating in auctions and building your collection.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/register" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={16} /> Create Account
              </a>
              <a href="/login" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogIn size={16} /> Sign In
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-4">
        {statCards.map((stat, index) => {
          // Skip auth-required cards if not authenticated
          if (stat.authRequired && !isAuthenticated) return null;
          // Skip admin-only cards if not admin
          if (stat.adminOnly && (!user || user.role !== 'Admin')) return null;

          return (
            <div key={index} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
                {stat.icon}
              </div>
              <h3 style={{ 
                fontSize: '2rem', 
                color: '#2d3748', 
                margin: '0 0 5px 0' 
              }}>
                {stat.value}
              </h3>
              <p style={{ 
                color: '#4a5568', 
                fontWeight: '500', 
                marginBottom: '5px' 
              }}>
                {stat.title}
              </p>
              <p style={{ 
                color: '#718096', 
                fontSize: '0.9rem' 
              }}>
                {stat.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Auctions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={18} /> Active Auctions
          </h3>
          <button 
            onClick={loadDashboardData}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        
        {recentAuctions.length === 0 ? (
          <p style={{ color: '#718096', textAlign: 'center', padding: '20px' }}>
            No active auctions found
          </p>
        ) : (
          <div className="grid grid-2">
            {recentAuctions.map((auction) => {
              const statusText = auction?.status != null ? String(auction.status) : 'Unknown';
              const statusClass = statusText.toLowerCase().replace(/\s+/g, '-');
              return (
                <div key={auction.id} style={{
                  background: '#f7fafc',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ 
                    color: '#2d3748', 
                    marginBottom: '10px',
                    fontSize: '1.1rem'
                  }}>
                    {auction.title}
                  </h4>
                  <p style={{ 
                    color: '#4a5568', 
                    fontSize: '0.9em', 
                    marginBottom: '15px',
                    lineHeight: '1.4'
                  }}>
                    {auction.description?.substring(0, 100)}
                    {auction.description?.length > 100 && '...'}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      color: '#2b6cb0', 
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <DollarSign size={16} /> {auction.currentBid || auction.startingBid}
                    </span>
                    <span 
                      className={`badge badge-${statusClass}`}
                    >
                      {statusText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 style={{ color: '#2d3748', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} /> Quick Actions
        </h3>
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          flexWrap: 'wrap',
          justifyContent: 'center' 
        }}>
          <a href="/auctions" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gavel size={16} /> Browse Auctions
          </a>
          <a href="/jewelry" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gem size={16} /> View Jewelry
          </a>
          <a href="/swagger" target="_blank" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Book size={16} /> API Documentation
          </a>
          {isAuthenticated ? (
            <>
              <a href="/bids" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LineChart size={16} /> My Bids
              </a>
              <a href="/profile" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} /> Profile
              </a>
            </>
          ) : (
            <>
              <a href="/login" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogIn size={16} /> Sign In
              </a>
              <a href="/register" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={16} /> Register
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;