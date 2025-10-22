import React from 'react';
import './ContactUs.css'; 
import { AlignLeft } from 'lucide-react';
import image1 from '../images/ContactImg.png';


const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    enquiry: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/contact", formData);
      setSuccess("Thank you for your message! We will get back to you soon.");
      setFormData({ name: "", email: "", mobileNumber: "", enquiry: "" });
    } catch (error) {
      setError("Failed to send message. Please try again.");
      console.error("Contact form error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-us-page">
     {/* Hero Section with Contact Us Title */}
      <section className="hero-section">
        <img src={image1} alt="Description of Image 1" className="new-image-class" />
            <h1>CONTACT US</h1>
      </section>

  
      <main className="contact-content">
        <div className="get-in-touch-section">
          <div className="section-header">
            <Users className="section-icon" size={32} />
            <h2>Get in Touch</h2>
          </div>
          <p>
            We are always happy to hear from you and address any questions or
            concerns you might have. Our team is dedicated to providing you with
            the best support and information possible. Please don't hesitate to
            reach out. Your satisfaction is our priority, and we're here to help
            with anything you need.
          </p>
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

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h3>Send us a Message</h3>
              <p>Fill out the form below and we'll get back to you soon!</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  <Users size={16} className="label-icon" />
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name..."
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} className="label-icon" />
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address..."
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mobile">
                <Phone size={16} className="label-icon" />
                Mobile Number
              </label>
              <input
                type="text"
                id="mobile"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Enter your mobile number..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="enquiry">
                <AlignLeft size={16} className="label-icon" />
                Message *
              </label>
              <textarea
                id="enquiry"
                name="enquiry"
                value={formData.enquiry}
                onChange={handleChange}
                placeholder="Tell us how we can help you..."
                required
                className="form-textarea"
                rows="5"
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="btn-content">
                  <div className="spinner"></div>
                  Sending...
                </span>
              ) : (
                <span className="btn-content">
                  <Send size={18} />
                  Send Message
                </span>
              )}
            </button>
          </form>
        </div>
      </main>

     
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
