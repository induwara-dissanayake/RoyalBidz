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
    { id: 'i1', src: i1Image, area: 'a', name: 'Item 1', price: '$120' },
    { id: 'i2', src: i2Image, area: 'b', name: 'Item 2', price: '$240' },
    { id: 'i3', src: i3Image, area: 'c', name: 'Item 3', price: '$180' },
    { id: 'i4', src: i4Image, area: 'd', name: 'Golden Jewelry', price: '$300', isSpecial: true },
    { id: 'i5', src: i5Image, area: 'e', name: 'Item 5', price: '$90' },
  ];

  const handleImageClick = (item) => {
    setSelectedImage(item);
    document.body.classList.add("blurred"); // add blur on body
  };

  const handleClose = () => {
    setSelectedImage(null);
    document.body.classList.remove("blurred"); // remove blur
  };

  const toggleLike = (id) => {
    setLiked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="collage">
      <h3 className="collage-title">New Items</h3>
      <div className="collage-grid">
        {items.map((item) => (
          <figure
            key={item.id}
            className={`tile tile-${item.area} ${item.isSpecial ? 'special-tile' : ''}`}
            onClick={() => handleImageClick(item)}
          >
            <img className="tile-image" src={item.src} alt={item.id} />

            {/* Overlay content only for i4 */}


            {/* Heart button - bottom left */}
            <button
              className="heart-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(item.id);
              }}
            >
              <Heart
                size={28}
                color={liked[item.id] ? 'red' : 'white'}
                fill={liked[item.id] ? 'red' : 'transparent'}
              />
            </button>
          </figure>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="modal" onClick={handleClose}>
          <button className="close-button" onClick={handleClose}>
            ✕
          </button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.src}
              alt={selectedImage.id}
              className="modal-image"
            />
            <div className="modal-info">
              <h3>{selectedImage.name}</h3>
              <p className="modal-price">{selectedImage.price}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
