import React from 'react';
import './ContactUs.css'; 
import { AlignLeft } from 'lucide-react';
import image1 from '../images/ContactImg.png';
import Footer from '../components/Footer';
import '../components/Footer.css';


const ContactUs = () => {
  return (
    <div className="contact-us-page">
     
      <section className="hero-section">
        <img src={image1} alt="Description of Image 1" className="new-image-class" />
            
      </section>

  
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
      <Footer />
    </div>
  );
};

export default ContactUs;