import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  LineChart, 
  LogIn, 
  DollarSign, 
  Clock, 
  Zap, 
  Hand, 
  RefreshCw, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const Bids = () => {
  const { user, isAuthenticated } = useAuth();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadBids();
    }
  }, [isAuthenticated]);

  const loadBids = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/bids/my-bids');
      setBids(response.data);
      setError('');
    } catch (error) {
      console.error('Error loading bids:', error);
      setError('Failed to load your bids. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'winning': return 'badge-active';
      case 'outbid': return 'badge-pending';
      case 'lost': return 'badge-inactive';
      default: return 'badge-completed';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <LogIn size={48} style={{ color: '#ed8936', marginBottom: '20px' }} />
          <h3 style={{ color: '#4a5568', marginBottom: '10px' }}>Authentication Required</h3>
          <p style={{ color: '#718096', marginBottom: '20px' }}>
            Please log in to view and manage your bids
          </p>
          <a href="/login" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <LogIn size={16} /> Login
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
          <span style={{ marginLeft: '10px' }}>Loading your bids...</span>
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
              <LineChart size={24} /> My Bids
            </h1>
            <p style={{ color: '#718096', margin: 0 }}>
              Track and manage your auction bids
            </p>
          </div>
          <button
            onClick={loadBids}
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

      {/* Bid Statistics */}
      {bids.length > 0 && (
        <div className="grid grid-4">
          <div className="card" style={{ textAlign: 'center' }}>
            <LineChart size={24} style={{ color: '#667eea', marginBottom: '8px' }} />
            <h3 style={{ color: '#2d3748', margin: '0 0 5px 0' }}>
              {bids.length}
            </h3>
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>Total Bids</p>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <Zap size={24} style={{ color: '#ed8936', marginBottom: '8px' }} />
            <h3 style={{ color: '#2d3748', margin: '0 0 5px 0' }}>
              {bids.filter(b => b.isAutomaticBid).length}
            </h3>
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>Auto Bids</p>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <Hand size={24} style={{ color: '#48bb78', marginBottom: '8px' }} />
            <h3 style={{ color: '#2d3748', margin: '0 0 5px 0' }}>
              {bids.filter(b => !b.isAutomaticBid).length}
            </h3>
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>Manual Bids</p>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <DollarSign size={24} style={{ color: '#9f7aea', marginBottom: '8px' }} />
            <h3 style={{ color: '#2d3748', margin: '0 0 5px 0' }}>
              ${bids.reduce((sum, bid) => sum + (bid.amount || 0), 0).toLocaleString()}
            </h3>
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>Total Bid Value</p>
          </div>
        </div>
      )}

      {/* Bids List */}
      {bids.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <LineChart size={48} style={{ color: '#cbd5e0', marginBottom: '20px' }} />
          <h3 style={{ color: '#4a5568', marginBottom: '10px' }}>No bids yet</h3>
          <p style={{ color: '#718096', marginBottom: '20px' }}>
            {error ? 'Unable to load your bids from the server.' : "You haven't placed any bids. Start bidding on active auctions!"}
          </p>
          {error ? (
            <button 
              onClick={loadBids}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <RefreshCw size={16} /> Try Again
            </button>
          ) : (
            <a href="/auctions" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <ExternalLink size={16} /> Browse Auctions
            </a>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Auction</th>
                <th>Bid Amount</th>
                <th>Bid Time</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <tr key={bid.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500', color: '#2d3748' }}>
                        {bid.auctionTitle || `Auction #${bid.auctionId}`}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                        Current: ${bid.auction?.currentBid?.toLocaleString() || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      fontWeight: 'bold',
                      color: '#2d3748'
                    }}>
                      <DollarSign size={16} />
                      {bid.amount?.toLocaleString() || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      fontSize: '0.9rem',
                      color: '#4a5568'
                    }}>
                      <Clock size={14} />
                      {new Date(bid.bidTime).toLocaleString()}
                    </div>
                  </td>
                  <td>
                    {bid.isAutomaticBid ? (
                      <span className="badge badge-completed" style={{ display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                        <Zap size={12} /> Auto
                      </span>
                    ) : (
                      <span className="badge badge-pending" style={{ display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                        <Hand size={12} /> Manual
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(bid.status)}`}>
                      {bid.status || 'Placed'}
                    </span>
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

export default Bids;