import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Gavel, Gem, LineChart, CreditCard, Users, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    { path: '/auctions', icon: <Gavel size={16} />, label: 'Auctions' },
    { path: '/jewelry', icon: <Gem size={16} />, label: 'Jewelry' },
    { path: '/bids', icon: <LineChart size={16} />, label: 'Bids', auth: true },
    { path: '/payments', icon: <CreditCard size={16} />, label: 'Payments', auth: true },
    { path: '/users', icon: <Users size={16} />, label: 'Users', admin: true }
  ];

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px'
      }}>
        {/* Logo */}
        <Link 
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#2d3748',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          <Gem size={20} color="#667eea" />
          RoyalBidz
        </Link>

        {/* Navigation Items */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          {navItems.map(({ path, icon, label, auth, admin }) => {
            // Hide auth-required items if not authenticated
            if (auth && !isAuthenticated) return null;
            // Hide admin items if not admin
            if (admin && (!user || user.role !== 'Admin')) return null;

            return (
              <Link
                key={path}
                to={path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  textDecoration: 'none',
                  color: '#4a5568',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f7fafc';
                  e.target.style.color = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#4a5568';
                }}
              >
                <span>{icon}</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {label}
                </span>
              </Link>
            );
          })}

          {/* User Menu */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginLeft: '20px',
            paddingLeft: '20px',
            borderLeft: '1px solid #e2e8f0'
          }}>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    textDecoration: 'none',
                    color: '#4a5568',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f7fafc';
                    e.target.style.color = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#4a5568';
                  }}
                >
                  <User size={16} />
                  <span style={{ fontSize: '14px' }}>
                    {user?.firstName || 'Profile'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    background: 'none',
                    border: 'none',
                    color: '#e53e3e',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#fed7d7';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline btn-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;