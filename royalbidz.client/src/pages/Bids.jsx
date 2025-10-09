import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './bids.css';

import bigImg from '../img/bid1.png';
import thumb1 from '../img/bid2.png';
import thumb2 from '../img/bid3.png';

export default function Bids() {
  const [selectedImage, setSelectedImage] = useState(bigImg);
  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 2,
    minutes: 25,
    seconds: 15
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bids-page">
      <Navbar />
      
      <div className="bids-container">
        {/* Breadcrumb */}
        <div className="bids-breadcrumb">
          <a href="#">Selection of jewelry</a>
        </div>

        {/* Title & Like */}
        <div className="bids-header">
          <h1 className="bids-title">One Gram Gold Polki Guttapusalu Necklace Set By Asp Fashion Jewellery</h1>
          <button className="bids-like" aria-label="Like this item">
            <span>♡</span>
            <span>51</span>
          </button>
        </div>

        <div className="bids-grid">
          {/* Left side - Gallery and About */}
          <div className="bids-left-section">
            {/* Gallery */}
            <div className="bids-gallery">
              <div className="bids-image-main">
                <img src={selectedImage} alt="Selected jewelry" />
              </div>
              <div className="bids-thumbs">
                {[bigImg, thumb1, thumb2].map((src, idx) => (
                  <button
                    key={idx}
                    className={`bids-thumb ${selectedImage === src ? 'active' : ''}`}
                    onClick={() => setSelectedImage(src)}
                  >
                    <img src={src} alt={`thumb ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* About Section */}
            <section className="about-box">
              <h2>About the Jewellery</h2>
              <h3>One Gram Gold Guttapusalu Necklace set By Asp Fashion Jewellery</h3>
              <p>
                This beautiful 24 Ct gold plated Plated Guttapusalu Necklace has made of the highest
                quality metalwork and embroidered with Polki, dazzling Ruby & Emerald Kempu stones. With a pair
                of exquisite earrings to match, it's perfect for any occasion, be it a friend's party or a
                traditional wedding gala.
              </p>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="bids-sidebar">
            {/* Bid Box */}
            <div className="bid-box">
              <div className="bid-timer">
                Closes in {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </div>

              <div className="bid-current">
                <div className="label">Current bid</div>
                <div className="price">$ 1000</div>
                <div className="no-reserve">No Reserve Price</div>
              </div>

              <div className="bidder-row">
                <div className="bidder-avatar" aria-hidden>DP</div>
                <div className="bidder-text">Selected by Duwindu piyumika Sanduneth ▸</div>
              </div>

              <div className="quick-bids">
                <button>$ 1020</button>
                <button>$ 1015</button>
                <button>$ 1010</button>
              </div>

              <div className="bid-input-row">
                <input type="text" placeholder="$ 1000 or up" />
              </div>
              
              <div className="bid-actions">
                <button className="btn-place">Place bid</button>
                <button className="btn-max">Set Max bid</button>
              </div>

              <div className="watchers">16 other people are watching this object</div>

              <div className="bid-history">
                <div className="history-row"><span>Bidder -32814</span><span>3 day ago</span><span>$1040</span></div>
                <div className="history-row"><span>Bidder -72854</span><span>1 day ago</span><span>$1065</span></div>
                <div className="history-row"><span>Bidder -42814</span><span>2 day ago</span><span>$1055</span></div>
                <div className="history-row"><span>Bidder -32814</span><span>2 day ago</span><span>$1050</span></div>
                <div className="history-row"><span>Bidder -32814</span><span>3 day ago</span><span>$1040</span></div>
              </div>

              <div className="see-all-bidders">
                <a href="#">See All Bidders (5) ⌄</a>
              </div>
            </div>

            {/* Details Box */}
            <div className="details-box">
              <h3>Details & Specifications</h3>
              <ul>
                <li>Metal-Brass, silver</li>
                <li>Finish-gold</li>
                <li>Polish-24 Ct gold</li>
                <li>Stone's-Polki,Ruby Emralds</li>
                <li>Beeds-pearls</li>
                <li>Size-short</li>
                <li>Earrings -Push type</li>
                <li>Size -1.5 inches</li>
                <li>For-Woman</li>
                <li>Occasion-Birthday, party, wedding, Reception, engagment</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}