import React from 'react';
import './ContactUs.css'; 
import { AlignLeft } from 'lucide-react';
import image1 from '../images/ContactImg.png';


const ContactUs = () => {
  return (
    <div className="contact-us-page">
     {/* Hero Section with Contact Us Title */}
      <section className="hero-section">
        <img src={image1} alt="Description of Image 1" className="new-image-class" />
            <h1>CONTACT US</h1>
      </section>

      {/* Main Content Area */}
      <main className="contact-content">
        <div className="get-in-touch-section">
          <h2>Get in Touch</h2>
          <p>We are always happy to hear from you and address any questions or concerns you might have. Our team is dedicated to providing you with the best support and information possible. Please don't hesitate to reach out. Your satisfaction is our priority, and we're here to help with anything you need.</p>
        </div>

        <div className="contact-form-section">
          <div className="connect-with-team">
            <h2>Connect with our Team</h2>
            <p>Our team is happy to answer your questions.</p>
            <h3>Head Office - Homagama</h3>
            <p>Address: NSBM Green University of Sri Lanka.</p>
            <p>Tel: +94xxxxxxxxx</p>
            <p>Email: info@royalbidz.com</p>
            <div className="social-icons">
              {/* Add social media icons here */}
              <span>x</span>
              <span>in</span>
              <span>ig</span>
            </div>
          </div>

          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Enter your name..." />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email..." />
            </div>
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input type="text" id="mobile" placeholder="Enter your Mobile Number..." />
            </div>
            <div className="form-group">
              <label htmlFor="enquiry">Enquiry</label>
              <textarea id="enquiry" placeholder="Enter your Enquiry..."></textarea>
            </div>
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      </main>

      {/* Footer - මෙයද වෙනම Component එකක් ලෙස තිබිය හැක */}
      <footer className="footer">
        <div className="footer-columns">
          <div className="footer-col">
            <h3>Our Pages</h3>
            <ul>
              <li>Home</li>
              <li>For you</li>
              <li>Items</li>
              <li>Register</li>
              <li>Sign in</li>
              <li>Online artistsand</li>
              <li>New collection</li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Explore</h3>
            <ul>
              <li>Design</li>
              <li>Photography</li>
              <li>Materials and texture</li>
              <li>Design concepts</li>
              <li>Digital art processes</li>
              <li>Design process</li>
              <li>Styles</li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Resources</h3>
            <ul>
              <li>Blog</li>
              <li>Best practices</li>
              <li>FAQs</li>
              <li>Color wheel</li>
              <li>Glossary</li>
              <li>Developers</li>
              <li>Resource library</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactUs;