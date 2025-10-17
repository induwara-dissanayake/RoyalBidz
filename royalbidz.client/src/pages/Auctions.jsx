import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Gavel, DollarSign, Eye, Plus, RefreshCw, AlertCircle } from 'lucide-react';

const Auctions = () => {
  const { user, isAuthenticated } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/auctions');
      // Handle both paginated and direct array responses
      const auctionData = response.data.items || response.data;
      setAuctions(Array.isArray(auctionData) ? auctionData : []);
      setError('');
    } catch (error) {
      console.error('Error loading auctions:', error);
      setError('Failed to load auctions. Please check if the backend server is running.');
      setAuctions([]); // Ensure auctions is always an array
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    // Handle both string and integer enum values
    const statusStr = typeof status === 'string' ? status : String(status);
    switch (statusStr?.toLowerCase()) {
      case 'active': case '2': return 'badge-active';
      case 'completed': case '5': return 'badge-completed';  
      case 'ended': case '3': return 'badge-completed';
      case 'cancelled': case '4': return 'badge-inactive';
      default: return 'badge-pending';
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="spinner"></div>
          <span style={{ marginLeft: '10px' }}>Loading auctions...</span>
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
              <Gavel size={24} /> Auctions
            </h1>
            <p style={{ color: '#718096', margin: 0 }}>
              Browse and manage jewelry auctions
            </p>
          </div>
          <button
            onClick={loadAuctions}
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

      {/* Auctions Grid */}
      {auctions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
            <Gavel size={64} color="#cbd5e0" />
          </div>
          <h3 style={{ color: '#4a5568', marginBottom: '10px' }}>No auctions found</h3>
          <p style={{ color: '#718096' }}>
            {error ? 'Unable to load auctions from the server.' : 'No auctions have been created yet.'}
          </p>
          {error && (
            <button 
              onClick={loadAuctions}
              className="btn btn-primary"
              style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <RefreshCw size={16} /> Try Again
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-2">
          {auctions.map((auction, index) => (
            <div key={auction?.id ? `auction-${auction.id}` : `auction-item-${index}`} className="card">
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ color: '#2d3748', margin: 0, flex: 1 }}>
                    {auction.title}
                  </h3>
                  <span className={`badge ${getStatusBadgeClass(auction.status)}`}>
                    {auction.status}
                  </span>
                </div>
                
                <p style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.4' }}>
                  {auction.description?.substring(0, 120)}
                  {auction.description?.length > 120 && '...'}
                </p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: '#718096' }}>Starting Bid:</span>
                    <div style={{ fontWeight: 'bold', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <DollarSign size={16} />
                      {auction.startingBid?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#718096' }}>Current Bid:</span>
                    <div style={{ fontWeight: 'bold', color: '#48bb78', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <DollarSign size={16} />
                      {(auction.currentBid || auction.startingBid)?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Jewelry Item Info */}
              {auction.jewelryItem && (
                <div style={{ marginBottom: '15px', padding: '10px', background: '#f7fafc', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                    <strong>{auction.jewelryItem.name}</strong>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                      <span className="badge badge-secondary">{auction.jewelryItem.type}</span>
                      <span className="badge badge-secondary">{auction.jewelryItem.primaryMaterial}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {auction.status === 'Active' && (
                  <button className="btn btn-primary btn-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                    <Plus size={14} /> Place Bid
                  </button>
                )}
                <button className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={14} /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Auctions;