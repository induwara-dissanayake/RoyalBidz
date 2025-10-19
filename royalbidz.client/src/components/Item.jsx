import React, { useState } from 'react';
import './item.css';

// To get the heart icon, you would typically install a library like react-icons
// by running: npm install react-icons
// Then you can import it like this:
// import { FaHeart } from 'react-icons/fa';

// For this standalone example, we'll use a simple text heart (♥)
// or you can use an SVG. Let's use an SVG for a cleaner look.
const HeartIcon = ({ color, fill }) => (
  <svg stroke={color} fill={fill} strokeWidth="2" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path>
  </svg>
);


// The `item` prop would be passed from a parent component that holds the data
// for all your jewelry items.
const Item = ({ item }) => {
  // State to track if the item is marked as a favorite
  const [isFavorite, setIsFavorite] = useState(false);

  // This function handles the click on the heart icon
  const handleHeartClick = (e) => {
    e.preventDefault(); // This stops the click from triggering parent link actions
    setIsFavorite(!isFavorite); // Toggle the favorite state
  };
  
  // A placeholder function for when the "Bid Now" button is clicked.
  // In a real app, this would navigate to the bidz.jsx page.
  const handleBidClick = () => {
    // This simulates navigating to the bidding page for the specific item
    window.location.href = `/bid/${item.id}`;
  };

  // Default item data in case no prop is passed, for easier testing.
  const defaultItem = {
    id: 1,
    name: 'Classic Gold Bangle',
    price: 1250,
    imageSrc: 'https://placehold.co/200x200/f0eada/7d5a11?text=Jewelry' // Placeholder image
  };

  const currentItem = item || defaultItem;

  return (
    <div className="item-card">
      {/* The circular background is part of this wrapper */}
      <div className="item-image-wrapper">
        <img src={currentItem.imageSrc} alt={currentItem.name} className="item-image" />
      </div>

      {/* Heart button, black as requested. Turns red when clicked */}
      <button 
        className="heart-button" 
        onClick={handleHeartClick}
        aria-label="Add to favorites"
      >
        <HeartIcon color={isFavorite ? 'red' : 'white'} fill={isFavorite ? 'red' : 'white'} />
      </button>

      {/* This overlay appears on hover */}
      <div className="item-hover-overlay">
        <h3 className="item-name">{currentItem.name}</h3>
        <p className="item-price">Starting Bid: ${currentItem.price}</p>
        
        {/* This button would navigate to "bidz.jsx" */}
        <button onClick={handleBidClick} className="bid-button">
          Bid Now
        </button>
      </div>
    </div>
  );
};

export default Item;
