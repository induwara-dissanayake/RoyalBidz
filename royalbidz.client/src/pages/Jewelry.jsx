 import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, ChevronDown, Filter, Crown, X, Facebook, Instagram, Linkedin, Youtube, LayoutDashboard, Gavel, Gem, LineChart, CreditCard, Users, User, LogOut } from 'lucide-react';

const JewelryStore = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);

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
const jewelleryItems = [
  {
    id: 1,
    name: "Gold Plated Kundan Jewellery",
    category: "Necklace",
    image:
      ":https://cdn.joyalukkas.in/media/catalog/product/c/n/cn1400078797_1.jpg"
  },
  {
    id: 2,
    name: "Possibly Moissanite or Zircon",
    category: "Ring",
    image:
      "https://fc896706.delivery.rocketcdn.me/wp-content/uploads/2022/06/IMG_2430-1-500x500.jpg"
  },
  {
    id: 3,
    name: "Bengal Terminology",
    category: "Bangles",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM9dpEfkNfLX8JAaEkt5xzlL2Gyz5H0TXqhb_e6iafJRn4WpQpmcHx-cp1QQm45rjzJ20&usqp=CAU"
  },
  {
    id: 4,
    name: "Gold Wedding Jewellery",
    category: "Bangles",
    image:      
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAzh_vgJKFGM7gv8X_2Qiv7xh5kExT27nlynKFDNzHd-Y5xEr8xLbuzcR9u3cf_hfYFLA&usqp=CAU"
  },
  {
    id: 5,
    name: "Manufacturer of 22ct Gold Ring",
    category: "Ring",
    image:
      "https://cdn1.jewelxy.com/live/img/business_product/360x360/nepUYs5C9T_20211101114124.jpg"
  },
  {
    id: 6,
    name: "Gold Wedding Jewellery",
    category: "Pendants",
    image:
      "https://kinclimg1.bluestone.com/f_jpg,c_scale,w_1024,b_rgb:f0f0f0/giproduct/BIPG0008P28-POSTER-4167.jpg"
  },
  {
    id: 7,
    name: "Gold Wedding Ring",
    category: "Ring",
    image:
      "https://ae01.alicdn.com/kf/S3972e4cc9bdf47c883ccb09933d979ddq.jpg_640x640q90.jpg"
  },
  {
    id: 8,
    name: "Lyra Pendant",
    category: "Pendants",
    image:
      "https://assets.telegraphindia.com/abp/2024/Oct/1730184911_locket.jpg"
  },
];

return (
    <div className="jewelry-store">
      {/* Navigation Bar */}
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

      {/* Header */}
      <header className="store-header">
        <div className="header-container">
          {/* Logo */}
          <div className="logo-section">
            <Crown size={24} className="crown-icon" />
            <span className="logo-text">ROYALBILUZ JEWELRY</span>
          </div>

          {/* Search Bar */}
          <div className="search-section">
            <div className="search-bar">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="nav-section">
            <a href="#" className="nav-link">Home</a>
            <a href="#" className="nav-link">For You</a>
            <div className="nav-dropdown">
              <a href="#" className="nav-link">
                Items
                <ChevronDown size={14} />
              </a>
            </div>
            <a href="#" className="nav-link">Contact</a>
            <a href="#" className="nav-link">Sign in</a>
          </nav>

          {/* Actions */}
          <div className="action-section">
            <button className="register-btn">Register</button>
            <div className="user-icon">
              <div className="user-avatar"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Banner Section */}
        <section className="banner-section">
          <div className="banner-header">
            <div className="banner-text">
              <h1 className="banner-title">Jewellery Items</h1>
              <p className="banner-subtitle">Explore our curated collection of fine jewelry.</p>
            </div>
            <button className="filter-btn" onClick={() => setShowFilter(!showFilter)}>
              <Filter size={16} />
              Filter
            </button>
          </div>
          
          <div className="promo-banner">
            <div className="promo-text-section">
              <div className="promo-line-1">FLASH SALE FRIDAY</div>
              <div className="promo-line-2">SAVE 20%</div>
              <div className="promo-line-3">ON SELECT ITEMS</div>
              <div className="promo-code">PROMO CODE: FRIYAY</div>
            </div>
            <div className="jewelry-display">
              <div className="jewelry-item jewelry-bangle-large"></div>
              <div className="jewelry-item jewelry-ring-gemstone"></div>
              <div className="jewelry-item jewelry-earrings-small"></div>
              <div className="jewelry-item jewelry-ring-tricolor"></div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="product-section">
          <div className="product-grid">
            {jewelryItems.map((item) => (
              <div key={item.id} className="product-card">
                <div className="product-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="product-info">
                  <h3 className="product-title">{item.name}</h3>
                  <span className="product-category">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="store-footer">
        <div className="footer-top">
          <div className="footer-container">
            <div className="footer-column">
              <div className="footer-logo">
                <Crown size={20} className="crown-icon" />
                <span className="logo-text">ROYALBILUZ JEWELRY</span>
              </div>
              <div className="social-links">
                <a href="#" className="social-link"><X size={16} /></a>
                <a href="#" className="social-link"><Facebook size={16} /></a>
                <a href="#" className="social-link"><Instagram size={16} /></a>
                <a href="#" className="social-link"><Linkedin size={16} /></a>
                <a href="#" className="social-link"><Youtube size={16} /></a>
              </div>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-title">Our Pages</h4>
              <ul className="footer-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">For you</a></li>
                <li><a href="#">Register</a></li>
                <li><a href="#">Sign in</a></li>
                <li><a href="#">Contact us</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-title">Categories</h4>
              <ul className="footer-links">
                <li><a href="#">Necklaces</a></li>
                <li><a href="#">Pendants</a></li>
                <li><a href="#">Rings</a></li>
                <li><a href="#">Bangles</a></li>
                <li><a href="#">Bracelets</a></li>
                <li><a href="#">Contact us</a></li>
                <li><a href="#">Ear studs-Earring</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-title">Useful Links</h4>
              <ul className="footer-links">
                <li><a href="#">Privacy policy</a></li>
                <li><a href="#">Terms and Conditions</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Quality Policy</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-title">Address</h4>
              <div className="contact-info">
                <p>NISEM Green university of Sri Lanka.</p>
                <p>email: info@royalbiluz.com</p>
                <p>Telephone Number: +50 71444444</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2015 Vogue Jewellers. All Rights Reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .jewelry-store {
          min-height: 100vh;
          background: #f8f6f0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Header Styles */
        .store-header {
          background: #f5f0e8;
          padding: 15px 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .crown-icon {
          color: #E0AF62;
        }

        .logo-text {
          font-size: 1.2rem;
          font-weight: bold;
          color: #E0AF62;
        }

        .search-section {
          flex: 1;
          max-width: 300px;
        }

        .search-bar {
          position: relative;
          display: flex;
          align-items: center;
          background: white;
          border-radius: 8px;
          padding: 8px 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .search-icon {
          color: #666;
          margin-right: 8px;
        }

        .search-input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 14px;
        }

        .nav-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-link {
          color: #333;
          text-decoration: none;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #E0AF62;
        }

        .action-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .register-btn {
          background: #E0AF62;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .register-btn:hover {
          background: #d19d4f;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: #e5e7eb;
          border-radius: 50%;
          cursor: pointer;
        }

        /* Main Content */
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        /* Banner Section */
        .banner-section {
          margin-bottom: 40px;
        }

        .banner-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
        }

        .banner-text {
          flex: 1;
        }

        .banner-title {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 10px;
          font-weight: bold;
          font-style: italic;
        }

        .banner-subtitle {
          font-size: 1.1rem;
          color: #ff6b35;
          margin: 0;
        }

        .filter-btn {
          background: #1e3a8a;
          color: white;
          border: 2px solid #3b82f6;
          padding: 10px 20px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .filter-btn:hover {
          background: #1e40af;
          border-color: #1e40af;
        }

        .promo-banner {
          background: #f8f6f0;
          border-radius: 12px;
          padding: 40px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          min-height: 300px;
        }

        .promo-text-section {
          flex: 1;
          z-index: 2;
          position: relative;
        }

        .promo-line-1 {
          font-size: 1.2rem;
          color: #8b7355;
          margin-bottom: 10px;
          font-weight: 400;
        }

        .promo-line-2 {
          font-size: 3.5rem;
          color: #5d4e37;
          margin-bottom: 10px;
          font-weight: bold;
          line-height: 1;
        }

        .promo-line-3 {
          font-size: 1.2rem;
          color: #8b7355;
          margin-bottom: 25px;
          font-weight: 400;
        }

        .promo-code {
          background: #5d4e37;
          color: #f8f6f0;
          padding: 12px 24px;
          border-radius: 6px;
          display: inline-block;
          font-weight: bold;
          border: 2px solid #8b7355;
          font-size: 0.9rem;
        }

        .jewelry-display {
          flex: 1;
          position: relative;
          height: 300px;
          z-index: 1;
        }

        .jewelry-item {
          position: absolute;
          border-radius: 50%;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .jewelry-bangle-large {
          width: 140px;
          height: 140px;
          background: linear-gradient(45deg, #ffd700, #ffed4e, #daa520);
          top: 50%;
          right: 15%;
          transform: translateY(-50%) rotate(25deg);
          border: 4px solid #daa520;
          border-radius: 50%;
          box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }

        .jewelry-ring-gemstone {
          width: 90px;
          height: 90px;
          background: radial-gradient(circle, #ff6b6b 20%, #ff8e8e 40%, #ffa8a8 60%, #ffd700 80%);
          top: 15%;
          right: 35%;
          border: 3px solid #ff4757;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .jewelry-earrings-small {
          width: 35px;
          height: 35px;
          background: linear-gradient(45deg, #ffd700, #ff69b4);
          top: 10%;
          right: 10%;
          border: 2px solid #daa520;
          box-shadow: 0 3px 6px rgba(0,0,0,0.2);
        }

        .jewelry-ring-tricolor {
          width: 70px;
          height: 70px;
          background: conic-gradient(from 0deg, #ffd700 0deg, #c0c0c0 120deg, #ff69b4 240deg, #ffd700 360deg);
          bottom: 15%;
          right: 5%;
          border: 3px solid #333;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        /* Product Grid */
        .product-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .product-card {
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .product-image {
          margin-bottom: 15px;
        }

        .product-image img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image img {
          transform: scale(1.05);
        }

        .product-title {
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 8px;
          font-weight: 600;
          line-height: 1.4;
        }

        .product-category {
          color: #dc2626;
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Footer */
        .store-footer {
          background: #f5f0e8;
          margin-top: 60px;
        }

        .footer-top {
          padding: 40px 0;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 30px;
        }

        .footer-column h4 {
          color: #333;
          margin-bottom: 15px;
          font-size: 1.1rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .social-links {
          display: flex;
          gap: 15px;
        }

        .social-link {
          color: #666;
          transition: color 0.3s ease;
        }

        .social-link:hover {
          color: #E0AF62;
        }

        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 8px;
        }

        .footer-links a {
          color: #666;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: #E0AF62;
        }

        .contact-info p {
          color: #666;
          margin-bottom: 8px;
        }

        .footer-bottom {
          background: #E0AF62;
          color: white;
          text-align: center;
          padding: 20px 0;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            gap: 15px;
          }

          .nav-section {
            flex-wrap: wrap;
            justify-content: center;
          }

          .banner-title {
            font-size: 2rem;
          }

          .promo-line-2 {
            font-size: 2.5rem;
          }

          .product-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .footer-container {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default JewelryStore;