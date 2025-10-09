import React, { useState } from 'react';
import './Item.css';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import itm1 from '../img/itm1.png';
import itm2 from '../img/itm2.png';
import itm3 from '../img/itm3.png';
import i1 from '../img/i1.png';
import i2 from '../img/i2.png';
import i3 from '../img/i3.png';
import i4 from '../img/i4.png';

export function Item({ item }) {
  const [liked, setLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log('Added to cart:', item.name);
  };

  return (
    <div 
      className={`item-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="item-image-container">
        <img 
          src={item.image} 
          alt={item.name} 
          className="item-image"
        />
        
        <div className="item-overlay">
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
        
        <button 
          className={`heart-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <Heart 
            size={24} 
            color={liked ? '#ff4757' : '#ffffff'} 
            fill={liked ? '#ff4757' : 'transparent'} 
          />
        </button>
        
        {item.isSpecial && (
          <div className="special-badge">
            <Star size={16} fill="#ffd700" color="#ffd700" />
            <span>Featured</span>
          </div>
        )}
      </div>
      
      <div className="item-info">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-category">{item.category}</p>
        <div className="item-price-container">
          <span className="item-price">${item.price}</span>
          {item.originalPrice && (
            <span className="item-original-price">${item.originalPrice}</span>
          )}
        </div>
        
        <div className="item-rating">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              fill={i < item.rating ? '#ffd700' : '#e0e0e0'} 
              color={i < item.rating ? '#ffd700' : '#e0e0e0'} 
            />
          ))}
          <span className="rating-count">({item.reviewCount})</span>
        </div>
      </div>
    </div>
  );
}

export default function ItemList() {
  const items = [
    { id: 1, image: itm1, name: 'Item 1', category: 'Category', price: 100, rating: 5, reviewCount: 12 },
   
  ];

  return (
    <div className="item-list-grid">
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  );
}
