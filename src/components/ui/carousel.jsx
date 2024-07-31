import React, { useState, useEffect, useRef } from "react";
import Card1 from "./Card1";
import Card2 from "./Card2";
import Card3 from "./Card3";
import "./Carousel.css";

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const intervalRef = useRef(null);

  const cards = [<Card1 />, <Card3 />, <Card2 />];

//   const startAutoScroll = () => {
//     intervalRef.current = setInterval(() => {
//       setActiveIndex((prevIndex) => {
//         if (prevIndex === cards.length - 1) {
//           clearInterval(intervalRef.current); // Stop auto-scrolling at last card
//           setIsAtEnd(true);
//           return prevIndex; // Stay at the last card
//         }
//         return prevIndex + 1;
//       });
//     }, 3000); // Auto-scroll every 3 seconds
//   };
  const stopAutoScroll = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!isPaused) {
    //   startAutoScroll();
    } else {
      stopAutoScroll();
    }
    return () => stopAutoScroll();
  }, [isPaused]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
    setIsPaused(true);
  };

  return (
    <div
      className="carousel-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="carousel-cards"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {cards.map((card, index) => (
          <div className="carousel-card" key={index}>
            {card}
          </div>
        ))}
      </div>
      <div className="carousel-dots">
        {cards.map((_, index) => (
          <span
            key={index}
            className={`carousel-dot ${index === activeIndex ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
