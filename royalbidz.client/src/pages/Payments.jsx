import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  CreditCard, 
  LogIn, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  RefreshCw,
  Hash
} from 'lucide-react';

const Payments = () => {
  const { user, isAuthenticated } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadPayments();
    }
  }, [isAuthenticated]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/payments/my-payments');
      setPayments(response.data);
      setError('');
    } catch (error) {
      console.error('Error loading payments:', error);
      setError('Failed to load payment history. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'badge-active';
      case 'pending': return 'badge-pending';
      case 'failed': return 'badge-inactive';
      default: return 'badge-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return <CheckCircle size={14} />;
      case 'failed': return <AlertCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <LogIn size={48} style={{ color: '#ed8936', marginBottom: '20px' }} />
          <h3 style={{ color: '#4a5568', marginBottom: '10px' }}>Authentication Required</h3>
          <p style={{ color: '#718096', marginBottom: '20px' }}>
            Please log in to view your payment history
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
          <span style={{ marginLeft: '10px' }}>Loading payments...</span>
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
              <CreditCard size={24} /> Payment History
            </h1>
            <p style={{ color: '#718096', margin: 0 }}>
              View and manage your payment transactions
            </p>
          </div>
          <button
            onClick={loadPayments}
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

      {/* Payment Summary Cards */}
      {payments.length > 0 && (
        <div className="grid grid-4">
          <div className="card" style={{ textAlign: 'center' }}>
            <DollarSign size={24} style={{ color: '#48bb78', marginBottom: '8px' }} />
            <h3 style={{ color: '#2d3748', margin: '0 0 5px 0' }}>
              ${payments.reduce((sum, p) => sum + (p.status === 'Completed' ? (p.totalAmount || 0) : 0), 0).toLocaleString()}
            </h3>
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>Total Paid</p>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <CheckCircle size={24} style={{ color: '#48bb78', marginBottom: '8px' }} />
            <h3 style={{ color: '#2d3748', margin: '0 0 5px 0' }}>
              {payments.filter(p => p.status === 'Completed').length}
            </h3>
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>Completed</p>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <Clock size={24} style={{ color: '#ed8936', marginBottom: '8px' }} />
            <h3 style={{ color: '#2d3748', margin: '0 0 5px 0' }}>
              {payments.filter(p => p.status === 'Pending').length}
            </h3>
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>Pending</p>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <CreditCard size={24} style={{ color: '#667eea', marginBottom: '8px' }} />
            <h3 style={{ color: '#2d3748', margin: '0 0 5px 0' }}>
              {payments.length}
            </h3>
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>Total Payments</p>
          </div>
        </div>
      )}

      {/* Payments List */}
      {payments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <CreditCard size={48} style={{ color: '#cbd5e0', marginBottom: '20px' }} />
          <h3 style={{ color: '#4a5568', marginBottom: '10px' }}>No payments found</h3>
          <p style={{ color: '#718096' }}>
            {error ? 'Unable to load payment history from the server.' : "You haven't made any payments yet. Win an auction to make your first payment!"}
          </p>
          {error && (
            <button 
              onClick={loadPayments}
              className="btn btn-primary"
              style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <RefreshCw size={16} /> Try Again
            </button>
          )}
        </div>
      ) : (
        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>Payment Transactions</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Auction</th>
                  <th>Amount</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <span style={{ 
                        fontFamily: 'monospace', 
                        color: '#667eea',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Hash size={12} />
                        {payment.id.toString().padStart(6, '0')}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '500', color: '#2d3748' }}>
                          {payment.auctionTitle || `Auction #${payment.auctionId}`}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                          Winning bid
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ 
                        fontWeight: 'bold', 
                        color: '#2d3748',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <DollarSign size={14} />
                        {payment.amount?.toLocaleString() || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div style={{ 
                        fontWeight: 'bold', 
                        color: '#2d3748',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <DollarSign size={16} />
                        {payment.totalAmount?.toLocaleString() || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: '#4a5568',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Calendar size={12} />
                        {new Date(payment.createdAt || payment.paymentDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {getStatusIcon(payment.status)}
                        <span className={`badge ${getStatusBadgeClass(payment.status)}`}>
                          {payment.status || 'Unknown'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;