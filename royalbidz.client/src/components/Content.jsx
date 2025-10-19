import React from 'react';
import './Content.css';
import logoImage from '../img/ring.png';

export default function Content() {
  return (
    <section className="elegance-section">
      <div className="elegance-container">
        <div className="elegance-content">
          <div className="elegance-text">
            <h2 className="elegance-heading">
              Elegance in Every Detail, Crafted with Purpose
            </h2>
            <div className="elegance-paragraphs">
              <p className="elegance-paragraph">
                At Caracal Jewelry, we blend timeless elegance with purposeful craftsmanship. Our tagline, "Elegance in Every Detail, Crafted with Purpose," captures the heart of our brand. Every piece is thoughtfully designed and meticulously finished, ensuring it reflects grace, luxury, and meaning. From sparkling gemstones to refined metals, we select only the finest materials to celebrate life's most precious moments.
              </p>
              <p className="elegance-paragraph">
                Our artisans bring decades of expertise to every creation, combining traditional techniques with contemporary design sensibilities. Each diamond is hand-selected for its exceptional clarity and brilliance, while our precious metals are sourced from responsible suppliers who share our commitment to quality and ethical practices. We believe that true luxury lies not just in appearance, but in the story and integrity behind each piece.
              </p>
            
            </div>
          </div>

          <div className="elegance-image">
            <div className="image-wrapper">
              <img 
                src={logoImage} 
                alt="Elegant Gold Diamond Ring" 
                className="ring-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}