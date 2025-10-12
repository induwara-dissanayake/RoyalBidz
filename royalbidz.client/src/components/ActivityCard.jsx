import React from 'react';
import { Clock, DollarSign, Gavel, Award } from 'lucide-react';

const ActivityCard = ({ activities, title, emptyMessage }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'bid': return <Gavel size={16} />;
      case 'payment': return <DollarSign size={16} />;
      case 'win': return <Award size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'bid': return '#667eea';
      case 'payment': return '#48bb78';
      case 'win': return '#ed8936';
      default: return '#718096';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Clock size={20} /> {title}
        </h3>
      </div>
      
      {activities && activities.length > 0 ? (
        <div className="flex flex-col gap-3">
          {activities.map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              background: '#f7fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: getActivityColor(activity.type),
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: '500', 
                  color: '#2d3748',
                  fontSize: '14px',
                  marginBottom: '2px'
                }}>
                  {activity.title}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#718096' 
                }}>
                  {activity.description}
                </div>
              </div>
              
              <div style={{
                fontSize: '12px',
                color: '#a0aec0',
                textAlign: 'right'
              }}>
                <div>{formatTime(activity.timestamp)}</div>
                {activity.amount && (
                  <div style={{ 
                    fontWeight: '600', 
                    color: getActivityColor(activity.type) 
                  }}>
                    ${activity.amount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#718096'
        }}>
          <Clock size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <div>{emptyMessage || 'No recent activity'}</div>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;