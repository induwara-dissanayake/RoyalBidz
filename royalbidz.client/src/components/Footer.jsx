import React from 'react';
import './Footer.css';
import logoImage from '../img/logo6.png';
import { Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Upper Section */}
      <div className="footer-upper">
        <div className="footer-container">
          <div className="footer-content">
            {/* Logo and Social Media */}
            <div className="footer-section logo-section">
              <div className="footer-logo">
                <img src={logoImage} alt="ROYALBIDZ JEWELRY" className="footer-logo-image" />
              </div>
              <div className="social-icons">
                <a href="#" className="social-icon">
                  <Twitter size={20} />
                </a>
                <a href="#" className="social-icon">
                  <Instagram size={20} />
                </a>
                <a href="#" className="social-icon">
                  <Youtube size={20} />
                </a>
                <a href="#" className="social-icon">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            {/* Our Pages */}
            <div className="footer-section">
              <h3 className="footer-title">Our Pages</h3>
              <ul className="footer-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">For you</a></li>
                <li><a href="#">Items</a></li>
                <li><a href="#">Register</a></li>
                <li><a href="#">Sign in</a></li>
                <li><a href="#">Contact us</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="footer-section">
              <h3 className="footer-title">Categories</h3>
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

            {/* Useful Links */}
            <div className="footer-section">
              <h3 className="footer-title">Useful Links</h3>
              <ul className="footer-links">
                <li><a href="#">Privacy policy</a></li>
                <li><a href="#">Terms and Conditions</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Quality Policy</a></li>
              </ul>
            </div>

            {/* Address */}
            <div className="footer-section">
              <h3 className="footer-title">Address</h3>
              <div className="footer-address">
                <p>NSBM Green university of Sri Lanka.</p>
                <p><a href="mailto:info@royalbidz.com">email: info@royalbidz.com</a></p>
                <p>Telephone Number: +97 71444444</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-container">
          <p className="copyright">© 2025 Vogue Jewellers. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}