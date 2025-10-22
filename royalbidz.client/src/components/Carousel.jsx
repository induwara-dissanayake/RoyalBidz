import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Carousel.css';

function useAutoplay(currentIndex, totalSlides, isPaused, delayMs, onAdvance) {
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Clear any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isPaused) {
      return;
    }

    // Use interval for continuous auto-loop
    intervalRef.current = setInterval(() => {
      onAdvance((prevIndex) => (prevIndex + 1) % totalSlides);
    }, delayMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [totalSlides, isPaused, delayMs, onAdvance]);
}

export default function Carousel() {
  // Carousel slides with images from public folder
  const slides = useMemo(() => ([
    {
      id: 's1',
      image: '/img/s1.png',
      heading: 'Where Elegance Meets Timeless Beauty',
      subheading: 'Discover exquisite pieces curated for every occasion',
      ctaText: 'Explore Collection',
      ctaHref: '#collection'
    },
    {
      id: 's2',
      image: '/img/s2.png',
      heading: 'Handcrafted Luxury, Modern Design',
      subheading: 'Elevate your style with our latest arrivals',
      ctaText: 'Shop New In',
      ctaHref: '#new'
    },
    {
      id: 's3',
      image: '/img/s3.jpg',
      heading: 'Signature Pieces That Tell Your Story',
      subheading: 'Make every moment unforgettable',
      ctaText: 'Start Bidding',
      ctaHref: '#auctions'
    }
  ]), []);

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const total = slides.length;

  useEffect(() => {
    const imagePromises = slides.map(slide => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve; // Continue even if image fails to load
        img.src = slide.image;
      });
    });

    Promise.all(imagePromises).then(() => {
      setIsLoaded(true);
    });
  }, [slides]);

  function goTo(newIndex) {
    if (isAnimating || newIndex === index) {
      return;
    }
    setIsAnimating(true);
    requestAnimationFrame(() => {
      setIndex(((newIndex % total) + total) % total);
      setTimeout(() => setIsAnimating(false), 600);
    });
  }

  function prev() {
    goTo(index - 1);
  }

  function next() {
    goTo(index + 1);
  }

  useAutoplay(index, total, isPaused || !isLoaded, 4000, setIndex);

  return (
    <section className="carousel" aria-roledescription="carousel">
      <div
        className="carousel-viewport"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {!isLoaded && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.2rem',
            zIndex: 10
          }}>
            Loading...
          </div>
        )}
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