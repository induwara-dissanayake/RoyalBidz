import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Carousel.css';

// Import images directly (alternative approach)
import s1Image from '../img/s1.png';
import s2Image from '../img/s2.png';
import s3Image from '../img/s3.jpg';

function useAutoplay(currentIndex, totalSlides, isPaused, delayMs, onAdvance) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPaused) {
      return;
    }
    timerRef.current = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % totalSlides;
      onAdvance(nextIndex);
    }, delayMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, totalSlides, isPaused, delayMs, onAdvance]);
}

export default function Carousel() {
  // Using imported images (more efficient for bundling)
  const slides = useMemo(() => ([
    {
      id: 's1',
      image: s1Image,
      heading: 'Where Elegance Meets Timeless Beauty',
      subheading: 'Discover exquisite pieces curated for every occasion',
      ctaText: 'Explore Collection',
      ctaHref: '#collection'
    },
    {
      id: 's2',
      image: s2Image,
      heading: 'Handcrafted Luxury, Modern Design',
      subheading: 'Elevate your style with our latest arrivals',
      ctaText: 'Shop New In',
      ctaHref: '#new'
    },
    {
      id: 's3',
      image: s3Image,
      heading: 'Signature Pieces That Tell Your Story',
      subheading: 'Make every moment unforgettable',
      ctaText: 'Start Bidding',
      ctaHref: '#auctions'
    }
  ]), []);

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const total = slides.length;

  function goTo(newIndex) {
    if (isAnimating || newIndex === index) {
      return;
    }
    setIsAnimating(true);
    // allow CSS transition to start
    requestAnimationFrame(() => {
      setIndex(((newIndex % total) + total) % total);
      setTimeout(() => setIsAnimating(false), 300);
    });
  }

  function prev() {
    goTo(index - 1);
  }

  function next() {
    goTo(index + 1);
  }

  useAutoplay(index, total, isPaused, 5000, setIndex);

  return (
    <section className="carousel" aria-roledescription="carousel">
      <div
        className="carousel-viewport"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {slides.map((slide, i) => {
          const isActive = i === index;
          return (
            <article
              key={slide.id}
              className={"carousel-slide" + (isActive ? " active" : "")}
              aria-hidden={!isActive}
            >
              <img src={slide.image} alt="" className="carousel-image" />

              <div className="carousel-overlay">
                <div className="carousel-content">
                  <h2 className="carousel-heading">{slide.heading}</h2>
                  <p className="carousel-subheading">{slide.subheading}</p>
                  <div className="carousel-actions">
                    <a className="carousel-btn primary" href={slide.ctaHref}>
                      {slide.ctaText}
                    </a>
                    <a className="carousel-btn ghost" href="#contact">
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        <button className="nav prev" aria-label="Previous" onClick={prev}>
          <span aria-hidden>‹</span>
        </button>
        <button className="nav next" aria-label="Next" onClick={next}>
          <span aria-hidden>›</span>
        </button>

        <div className="dots" role="tablist" aria-label="Select slide">
          {slides.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === index}
              className={"dot" + (i === index ? " active" : "")}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
