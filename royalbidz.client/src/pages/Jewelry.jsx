import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Gem, Eye, DollarSign, Weight, Calendar, MapPin, RefreshCw, AlertCircle } from 'lucide-react';

const Jewelry = () => {
  const { user, isAuthenticated } = useAuth();
  const [jewelry, setJewelry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJewelry();
  }, []);

  const loadJewelry = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/jewelry');
      setJewelry(response.data);
      setError('');
    } catch (error) {
      console.error('Error loading jewelry:', error);
      setError('Failed to load jewelry items. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const getConditionBadgeClass = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'new': return 'badge-active';
      case 'excellent': case 'verygood': return 'badge-completed';
      case 'good': return 'badge-pending';
      default: return 'badge-inactive';
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="spinner"></div>
          <span style={{ marginLeft: '10px' }}>Loading jewelry...</span>
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
              <Gem size={24} /> Jewelry Catalog
            </h1>
            <p style={{ color: '#718096', margin: 0 }}>
              Browse and manage jewelry items
            </p>
          </div>
          <button
            onClick={loadJewelry}
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

      {/* Jewelry Grid */}
      {jewelry.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
            <Gem size={64} color="#cbd5e0" />
          </div>
          <h3 style={{ color: '#4a5568', marginBottom: '10px' }}>No jewelry items found</h3>
          <p style={{ color: '#718096' }}>
            {error ? 'Unable to load jewelry items from the server.' : 'No jewelry items have been added yet.'}
          </p>
          {error && (
            <button 
              onClick={loadJewelry}
              className="btn btn-primary"
              style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <RefreshCw size={16} /> Try Again
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-3">
          {jewelry.map((item) => (
            <div key={item.id} className="card">
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ color: '#2d3748', margin: 0, flex: 1 }}>
                    {item.name}
                  </h3>
                  <span className={`badge ${getConditionBadgeClass(item.condition)}`}>
                    {item.condition}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ 
                    background: '#667eea', 
                    color: 'white', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    {item.type}
                  </span>
                  <span style={{ 
                    background: '#48bb78', 
                    color: 'white', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    {item.primaryMaterial}
                  </span>
                </div>

                {item.brand && (
                  <p style={{ color: '#9f7aea', fontSize: '0.9rem', margin: '5px 0', fontWeight: '500' }}>
                    {item.brand}
                  </p>
                )}
                
                <p style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.4' }}>
                  {item.description?.substring(0, 100)}
                  {item.description?.length > 100 && '...'}
                </p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: '#718096' }}>Estimated Value:</span>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: '#2d3748',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <DollarSign size={14} />
                      {item.estimatedValue ? `$${item.estimatedValue.toLocaleString()}` : 'N/A'}
                    </div>
                  </div>
                  
                  {item.weight && (
                    <div>
                      <span style={{ color: '#718096' }}>Weight:</span>
                      <div style={{ fontWeight: 'bold', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Weight size={14} />
                        {item.weight}g
                      </div>
                    </div>
                  )}

                  {item.yearMade && (
                    <div>
                      <span style={{ color: '#718096' }}>Year:</span>
                      <div style={{ fontWeight: 'bold', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} />
                        {item.yearMade}
                      </div>
                    </div>
                  )}

                  {item.origin && (
                    <div>
                      <span style={{ color: '#718096' }}>Origin:</span>
                      <div style={{ fontWeight: 'bold', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} />
                        {item.origin}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
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

export default Jewelry;