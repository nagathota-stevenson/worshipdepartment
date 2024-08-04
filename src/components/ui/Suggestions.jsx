// components/ui/Suggestions.js

import React from "react";
import { Link } from "react-router-dom";
import Lottie from 'lottie-react';
import { useState } from "react";
import animationData from '../../images/fire.json';


const Suggestions = ({ categories, artists, trendingSongs, visibleCategories, showMore, handleShowMoreCategory, handleShowLessCategory, showMoreTrending, handleShowMoreTrending }) => {
  
    const [displayCount, setDisplayCount] = useState(5);
    return (
    <div className="lyrics-search-page-suggestions-container">
      <div className="songs-by-category-container-search-page">
        <h2 className="songs-by-category-search-page">
          Songs by Category
          <img
            src="/images/list.png"
            alt="Icon"
            className="heading-icon-search-page"
          />
        </h2>
        <ul>
          {visibleCategories.map((e, index) => (
            <div key={index} className="related-songs-container-search-page">
              <li className="related-songs">
                <Link to={`/songs/category/${e.toLowerCase()}`}>
                  {capitalize(e)}
                </Link>
              </li>
            </div>
          ))}
        </ul>
        <div className="show-more-container-search">
          {visibleCategories.length < categories.length && showMore && (
            <button
              className="show-more-button-lyrics"
              onClick={handleShowMoreCategory}
            >
              Show More
            </button>
          )}
          {visibleCategories.length > 5 && !showMore && (
            <button
              className="show-more-button-lyrics"
              onClick={handleShowLessCategory}
            >
              Show Less
            </button>
          )}
        </div>
      </div>

      <div className="songs-by-category-container-search-page">
        <h2 className="songs-by-category-search-page">
          Songs by Artists
          <img
            src="/images/mic.png"
            alt="Icon"
            className="heading-icon-search-page"
          />
        </h2>
        <ul>
          {artists.map((artist, index) => (
            <div key={index} className="related-songs-container-search-page">
              <li className="related-songs">
                <Link to={`/artists/${artist.id}`}>
                  {capitalize(artist.name)}
                </Link>
              </li>
            </div>
          ))}
        </ul>
        <Link to={`/artists`}>
          <div className="show-more-container-search">
            <button className="show-more-button-lyrics">
              Show More
            </button>
          </div>
        </Link>
      </div>

      <div className="songs-by-category-container-search-page">
        <h2 className="songs-by-category-search-page">
          Trending Songs
          <img
            src="/images/trend.png"
            alt="Icon"
            className="heading-icon-search-page"
          />
        </h2>
        <ul>
          {trendingSongs.slice(0, displayCount).map((song, index) => (
            <div key={index} className="related-songs-container-search-page">
              <li className="related-songs">
                <Link
                  to={`/songs/${song.id}`}
                  className="song-title-suggestions-search-page"
                >
                  {capitalize(song.title)}
                </Link>

                {index === 0 && (
                  <div className="lottie-container">
                    <Lottie animationData={animationData} loop={true} />
                  </div>
                )}
              </li>
            </div>
          ))}
        </ul>
        <div className="show-more-container-search">
          {trendingSongs.length > 4 && (
            <button
              className="show-more-button-lyrics"
              onClick={handleShowMoreTrending}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const capitalize = (text) => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

export default Suggestions;
