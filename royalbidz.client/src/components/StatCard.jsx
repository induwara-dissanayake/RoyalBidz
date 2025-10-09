import React from 'react';

const StatCard = ({ icon, title, value, subtitle, trend, trendValue, color = "#667eea" }) => {
  const getTrendColor = (trend) => {
    if (trend === 'up') return '#48bb78';
    if (trend === 'down') return '#f56565';
    return '#718096';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return '?';
    if (trend === 'down') return '?';
    return '?';
  };

  return (
    <div className="card stat-card">
      <div style={{ 
        fontSize: '2rem', 
        color: color,
        marginBottom: '12px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
      
      <div className="stat-value">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      
      <div className="stat-label">
        {title}
      </div>
      
      {subtitle && (
        <div style={{ 
          fontSize: '0.8rem', 
          color: '#a0aec0', 
          marginTop: '4px' 
        }}>
          {subtitle}
        </div>
      )}
      
      {trend && trendValue && (
        <div style={{
          fontSize: '0.8rem',
          color: getTrendColor(trend),
          marginTop: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px'
        }}>
          <span>{getTrendIcon(trend)}</span>
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;