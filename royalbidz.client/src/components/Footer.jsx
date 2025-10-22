import React from "react";
import "./Footer.css";
import logoImage from "../img/logo6.png";
import {
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            
            {/* Brand  */}
            <div className="footer-brand">
              <div className="footer-logo">
                <img
                  src={logoImage}
                  alt="ROYALBIDZ JEWELRY"
                  className="footer-logo-image"
                />
              </div>
              <p className="footer-tagline">
                Crafting timeless elegance with exceptional quality and
                purposeful design.
              </p>
              <div className="social-media">
                <h4 className="social-title">Follow Us</h4>
                <div className="social-icons">
                  <a href="#" className="social-link" aria-label="Twitter">
                    <Twitter size={18} />
                  </a>
                  <a href="#" className="social-link" aria-label="Instagram">
                    <Instagram size={18} />
                  </a>
                  <a href="#" className="social-link" aria-label="Youtube">
                    <Youtube size={18} />
                  </a>
                  <a href="#" className="social-link" aria-label="Linkedin">
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-menu">
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">For You</a>
                </li>
                <li>
                  <a href="#">Items</a>
                </li>
                <li>
                  <a href="#">Register</a>
                </li>
                <li>
                  <a href="#">Sign In</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
              </ul>
            </div>

            {/* Collections */}
            <div className="footer-column">
              <h3 className="footer-heading">Collections</h3>
              <ul className="footer-menu">
                <li>
                  <a href="#">Necklaces</a>
                </li>
                <li>
                  <a href="#">Pendants</a>
                </li>
                <li>
                  <a href="#">Rings</a>
                </li>
                <li>
                  <a href="#">Bangles</a>
                </li>
                <li>
                  <a href="#">Bracelets</a>
                </li>
                <li>
                  <a href="#">Earrings</a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="footer-column">
              <h3 className="footer-heading">Support</h3>
              <ul className="footer-menu">
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms & Conditions</a>
                </li>
                <li>
                  <a href="#">Services</a>
                </li>
                <li>
                  <a href="#">Quality Policy</a>
                </li>
                <li>
                  <a href="#">Shipping Info</a>
                </li>
                <li>
                  <a href="#">Returns</a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-column">
              <h3 className="footer-heading">Get In Touch</h3>
              <ul className="footer-contact">
                <li>
                  <Mail size={18} />
                  <a href="mailto:info@royalbidz.com">info@royalbidz.com</a>
                </li>
                <li>
                  <Phone size={18} />
                  <a href="tel:+97171444444">+97 71 444 444</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
