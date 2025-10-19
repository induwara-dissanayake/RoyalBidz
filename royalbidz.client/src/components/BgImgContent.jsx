import React from 'react';
import './BgImgContent.css';

export default function BgImgContent() {
  return (
    <section className="bg-img-content">
      <div className="bg-img-container">
        {/* Background Image */}
        <div className="background-image">
          <img src="/img/s2.png" alt="Background" className="bg-img" />
        </div>
        
        {/* Jewelry Images */}
        <div className="jewelry-images">
          {/* Left side - Single bangle */}
          <div className="jewelry-left">
           
          </div>
          
          {/* Center - Stacked bangles */}
          <div className="jewelry-center">
         
          </div>
          
          {/* Bottom right - Earrings */}
          <div className="jewelry-right">
          </div>
        </div>
        
        {/* Text Content and Button */}
        <div className="text-content">
          <div className="text-wrapper">
            <p className="content-text">
              At Caracal Jewelry, we believe in<br />
              timeless beauty, exceptional<br />
              craftsmanship, and trust.<br />
              Each piece is carefully designed<br />
              to symbolize elegance, honesty,<br />
              and the lasting bond we share<br />
              with our customers.
            </p>
            <button className="contact-button">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
