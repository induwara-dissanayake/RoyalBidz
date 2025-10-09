import React from 'react';
import './Content.css';
import logoImage from '../img/ring.png';

export default function Content() {  // Changed from EleganceSection to Content
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
                At Caracal Jewelry, we blend timeless elegance with purposeful craftsmanship. Our tagline. "Elegance in Every Detail, Crafted with Purpose," captures the heart of our brand. Every piece is thoughtfully designed and meticulously finished, ensuring it reflects grace, luxury, and meaning. From sparkling gemstones to refined metals, we select only the finest materials to celebrate life's most precious moments. Whether it's a gift of love or a personal treasure, our jewelry is made to inspire confidence and beauty. With Caracal, you don't just wear jewelry — you wear a story of quality, intention, and enduring elegance.
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