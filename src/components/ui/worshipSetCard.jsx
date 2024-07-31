import React, { useState }  from 'react';
import './worshipSetCard.css';

const WorshipSet = () => {
    const songs = [
      { title: 'Aardhana Neekey' },
      { title: 'Goppa Devudu' },
      { title: 'Mahimaku Paathruda' },
      { title: 'Deva Nee Sannidhi' },
      { title: 'Praise the Lord' },
      { title: 'Stothram Stuthi' }
    ];
  
    const [hoveredIndex, setHoveredIndex] = useState(null);
  
    const handleLyricsClick = (index) => {
      console.log(`Lyrics button for song ${index + 1} clicked.`);
      
    };
  
    return (
      <div 
      className='setlist-card'
      >
        <h1
        className='card-title'
        >SUNDAY WORSHIP SET</h1>
        <ul className="set-list">
          {songs.map((song, index) => (
            <li key={index} className="set-item">
              <span>{song.title}</span>
              <button
                className="lyrics-button"
                onClick={() => handleLyricsClick(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <img
                  src={hoveredIndex === index ? "/images/lyrics-active.png" : "/images/lyrics-inactive.png"}
                  alt={hoveredIndex === index ? 'Active Lyrics Icon' : 'Inactive Lyrics Icon'}
                  className="lyrics-icon"
                />
              </button>
            </li>
          ))}
        </ul>
        <div className="set-footer">
          <div className="likes">
          <img
          style={{
            width: "25px",
            paddingRight: "5px"
          }}
                  src= "/images/like.png"
                /> 125 Likes
          </div>
          <button className="show-more">Show more</button>
        </div>
      </div>
    );
  };
  
  export default WorshipSet;