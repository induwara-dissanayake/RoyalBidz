import React, { useState } from 'react';
import './ForYou.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../components/Footer.css';


const ForYou = () => {
  const [jewelryName, setJewelryName] = useState('');
  const [aboutJewelry, setAboutJewelry] = useState('');
  const [details, setDetails] = useState('');
  const [images, setImages] = useState([null, null, null, null]);

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = URL.createObjectURL(file);
      setImages(newImages);
    }
  };

  const handleAddItem = () => {
    console.log('Adding Item:', {
      jewelryName,
      aboutJewelry,
      details,
      images: images.filter(img => img !== null),
    });
    setJewelryName('');
    setAboutJewelry('');
    setDetails('');
    setImages([null, null, null, null]);
    alert('Item added successfully! (Check console for data)');
  };

  return (
    <div className="for-you-page-wrapper">
      <Navbar />
      <div className="for-you-header-banner">
        <div className="banner-content">
          <p className="banner-text">Add shine of gold</p>
          <p className="banner-subtext">to your precious bonds</p>
        </div>
      </div>

      <div className="for-you-content-area">
        <div className="for-you-intro-section">
          <h2>For You</h2>
          <p>Our platform allows you to insert your item quickly and easily. Customers can place bids, giving you the opportunity to win at the best possible price. This unique system benefits both sellers and buyers, ensuring fairness, transparency, and the chance to get the true value for your items.</p>
        </div>

        <div className="item-input-form-section">
          <div className="form-group">
            <label htmlFor="jewelryName">Jewelry Name</label>
            <input
              type="text"
              id="jewelryName"
              placeholder="Enter Jewelry Name"
              value={jewelryName}
              onChange={(e) => setJewelryName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Insert Item Image</label>
            <div className="image-upload-container">
              {images.map((image, index) => (
                <div key={index} className="image-upload-box">
                  <input
                    type="file"
                    id={`imageUpload${index}`}
                    accept="image/*"
                    onChange={(e) => handleImageChange(index, e)}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor={`imageUpload${index}`} className="image-upload-label">
                    {image ? (
                      <img src={image} alt={`Item Preview ${index + 1}`} className="image-preview" />
                    ) : (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 10a3 3 0 1 0-3-3 3 3 0 0 0 3 3z"></path>
                        <path d="M20 18v-5h-7v5a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2z"></path>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      </svg>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="aboutJewelry">About the jewelry</label>
            <textarea
              id="aboutJewelry"
              placeholder="Enter about the jewelry."
              value={aboutJewelry}
              onChange={(e) => setAboutJewelry(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="details">Details & Specifications</label>
            <textarea
              id="details"
              placeholder="Enter details & specifications."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            ></textarea>
          </div>

          <button className="add-items-button" onClick={handleAddItem}>
            Add Items
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForYou;