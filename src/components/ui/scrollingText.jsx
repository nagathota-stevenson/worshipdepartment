
import './ScrollingText.css';
import React, { useEffect, useRef } from 'react';

const ScrollingText = () => {
  const menuItems = ['NEWS', 'LYRICS', 'TUTORIALS', 'SONG STORIES', 'STORE', 'NEWS', 'LYRICS', 'TUTORIALS', 'SONG STORIES', 'STORE', ];
  const dotImage = '/images/dot.png';

  

  return (
    <div className="scrolling-container">
      <div className="scrolling-text">
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <span className="menu-item">{item}</span>
            <img src={dotImage} alt="dot" className="dot-image" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ScrollingText;
