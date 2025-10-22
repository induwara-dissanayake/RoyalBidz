import React, { useState } from 'react';
import './Collage.css';
import i1Image from '../img/i1.png';
import i2Image from '../img/i2.png';
import i3Image from '../img/i3.png';
import i4Image from '../img/i4.png';
import i5Image from '../img/i5.png';
import { Heart, Star } from 'lucide-react';

export default function Collage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [liked, setLiked] = useState({});

  const items = [
    { id: 'i1', src: i1Image, area: 'a', name: 'New Necklaces', price: '$120', rating: 5 },
    { id: 'i2', src: i2Image, area: 'b', name: 'Golden Jewelry Set', price: '$240', rating: 4 },
    { id: 'i3', src: i3Image, area: 'c', name: 'Pearl Necklace', price: '$180', rating: 5 },
    { id: 'i4', src: i4Image, area: 'd', name: 'Golden Jewelry Set', price: '$300', isSpecial: true, rating: 5 },
    { id: 'i5', src: i5Image, area: 'e', name: 'Diamond Earrings', price: '$90', rating: 4 },
  ];

  const handleImageClick = (item) => {
    setSelectedImage(item);
    document.body.classList.add('modal-open');
  };

  const handleClose = () => {
    setSelectedImage(null);
    document.body.classList.remove('modal-open');
  };

  const toggleLike = (id) => {
    setLiked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="collage-wrapper">
      <section className="collage">
        <h3 className="collage-title">New Items</h3>
        
        <div className="collage-grid">
          {items.map((item) => (
            <figure
              key={item.id}
              className={`tile tile-${item.area} ${item.isSpecial ? 'special-tile' : ''}`}
              onClick={() => handleImageClick(item)}
            >
              <img 
                className="tile-image" 
                src={item.src} 
                alt={item.name}
              />

              {/* Hover Overlay */}
              <div className="tile-overlay">
                
                {/* Heart Buttom */}
                <div className="overlay-top">
                  <button
                    className="heart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(item.id);
                    }}
                  >
                    <Heart
                      size={20}
                      color={liked[item.id] ? '#ef4444' : '#9ca3af'}
                      fill={liked[item.id] ? '#ef4444' : 'none'}
                      strokeWidth={2}
                    />
                  </button>
                </div>

                {/* Bottom Content - Name, Stars, Price */}
                <div className="overlay-bottom">
                  <h4 className="overlay-name">{item.name}</h4>
                  
                  <div className="star-rating">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={18}
                        fill={index < item.rating ? '#fbbf24' : 'none'}
                        color={index < item.rating ? '#fbbf24' : '#ffffff'}
                        strokeWidth={2}
                      />
                    ))}
                  </div>
                  
                </div>
              </div>
            </figure>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div 
            className="modal" 
            onClick={handleClose}
          >
            <button
              className="close-button"
              onClick={handleClose}
            >
              ✕
            </button>
            
            <div 
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.name}
                className="modal-image"
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}