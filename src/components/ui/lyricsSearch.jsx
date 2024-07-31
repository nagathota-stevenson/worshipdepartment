import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./lyricsSearch.css";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Footer from "./footer";
import { useMediaQuery } from "react-responsive";
const db = getFirestore();

const capitalize = (text) => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

const categories = [
  "Worship",
  "Offering",
  "Repentance",
  "Encouraging",
  "Christmas",
  "Marriage",
  "Good Friday",
  "Hope",
  "Gospel",
  "Praise",
  "Kids",
  "Comfort",
  "Correction",
  "Second Coming",
  "Commitment",
  "Easter",
  "Thanksgiving",
  "Prayer",
  "Healing",
  "Faith",
  "Grace",
  "Provision",
  "Peace",
  "Unity",
  "Surrender",
  "Deliverance",
  "Trust",
  "Victory",
  "Creation",
  "Joy",
];
const LyricsSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(5);
  const [visibleCount, setVisibleCount] = useState(5);
  const [showMore, setShowMore] = useState(true);
  const [showMoreTrending, setShowMoreTrending] = useState(false);

  const songsCollectionRef = collection(db, "songs");
  const artistsCollectionRef = collection(db, "artists");
  const containerRefTrending = useRef(null);

  const handleShowMoreCategory = () => {
    setVisibleCount((prevCount) => {
      const newCount = prevCount + 5;
      if (newCount >= categories.length) {
        setShowMore(false);
      }
      return newCount;
    });
  };

  const handleShowLessCategory = () => {
    setVisibleCount((prevCount) => {
      const newCount = 5;
      if (newCount === 5) {
        setShowMore(true);
      }
      return newCount;
    });
  };

  const visibleCategories = categories.slice(0, visibleCount);

  useEffect(() => {
    const getSongs = async () => {
      if (searchQuery === "") {
        setSongs([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const lowerCase = searchQuery.toLowerCase();
        const q = query(
          songsCollectionRef,
          where("title", ">=", lowerCase),
          where("title", "<=", lowerCase + "\uf8ff")
        );
        const data = await getDocs(q);
        setSongs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // Include document ID
      } catch (error) {
        console.error("Error fetching songs: ", error);
      }
      setLoading(false);
    };

    const getArtists = async () => {
      try {
        const artistsSnapshot = await getDocs(artistsCollectionRef);
        setArtists(artistsSnapshot.docs.map((doc) => doc.data().name)); // Assuming 'name' field contains the artist's name
      } catch (error) {
        console.error("Error fetching artists: ", error);
      }
    };

    const getTrendingSongs = async () => {
      try {
        const q = query(
          collection(db, "songs"),
          orderBy("views", "desc"),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const songsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrendingSongs(songsData);
        setDisplayCount(5);
      } catch (error) {
        console.error("Error fetching trending songs: ", error);
      }
    };

    getSongs();
    getArtists();
    getTrendingSongs();
  }, [searchQuery]);

  const handleShowMore = () => {
    setDisplayCount((prevCount) => prevCount + 5);
  };

  const handleShowLess = () => {
    setDisplayCount(5);
  };

  const handleShowMoreTrending = () => {};

  useEffect(() => {
    if (containerRefTrending.current) {
      containerRefTrending.current.style.height = `${containerRefTrending.current.scrollHeight}px`;
    }
  }, [trendingSongs]);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div>
      <div className="search-container">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          className="search-bar"
          placeholder="Enter song title"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setDisplayCount(5);
          }}
        />
      </div>

      <div className="lyrics-results">
        {loading ? (
          <div className="lyrics-row">
            <h2 className="result-song-title-loading">
              Loading<span className="loading-dots">.</span>
            </h2>
            <p className="result-song-artist-loading">
              Artist Name: Loading<span className="loading-dots">.</span>
            </p>
          </div>
        ) : (
          songs.slice(0, displayCount).map((song) => (
            <Link to={`/lyrics/${song.id}`} className="song-link" key={song.id}>
              <div className="lyrics-row">
                <h2 className="result-song-title">{capitalize(song.title)}</h2>
                <p className="result-song-artist">
                  Artist Name: {capitalize(song.artist)}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="show-more-container-lyrics">
        {songs.length > displayCount && (
          <button className="show-more-button-lyrics" onClick={handleShowMore}>
            Show More
          </button>
        )}
        {displayCount > 5 && (
          <button className="show-more-button-lyrics" onClick={handleShowLess}>
            Show Less
          </button>
        )}
      </div>

      <div className="lyrics-search-page-suggestions-container">
        <div className="songs-by-category-container-search-page">
          <h2 className="songs-by-category-search-page">Songs by Category

          <img src="/images/list.png" alt="Icon" className="heading-icon-search-page" />

          </h2>
          <ul>
            {visibleCategories.map((e, index) => (
              <div key={index} className="related-songs-container-search-page">
                <li className="related-songs">
                  <Link to={`/lyrics/category/${e.toLowerCase()}`}>
                    {capitalize(e)}
                  </Link>
                </li>
              </div>
            ))}
          </ul>
          <div className="show-more-container-search">
            {visibleCount < categories.length && showMore && (
              <button
                className="show-more-button-lyrics"
                onClick={handleShowMoreCategory}
              >
                Show More
              </button>
            )}
            {visibleCount > 5 && !showMore && (
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
          <h2 className="songs-by-category-search-page">Songs by Artists

          <img src="/images/mic.png" alt="Icon" className="heading-icon-search-page" />

          </h2>
          <ul>
            {artists.map((artist, index) => (
              <div key={index} className="related-songs-container-search-page">
                <li className="related-songs">
                  <Link to={`/lyrics/artist/${artist.toLowerCase()}`}>
                    {capitalize(artist)}
                  </Link>
                </li>
              </div>
            ))}
          </ul>
          <div className="show-more-container-search">
            {visibleCount < categories.length && showMore && (
              <button
                className="show-more-button-lyrics"
                onClick={handleShowMoreCategory}
              >
                Show More
              </button>
            )}
            {visibleCount > 5 && !showMore && (
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
          <h2 className="songs-by-category-search-page">Trending Songs

          <img src="/images/trend.png" alt="Icon" className="heading-icon-search-page" />

          </h2>
          <ul>
            {trendingSongs.slice(0, displayCount).map((song, index) => (
              <div key={index} className="related-songs-container-search-page">
                <li className="related-songs">
                  <Link to={`/lyrics/${song.id}`}>
                    {capitalize(song.title)}
                  </Link>
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
                {"Show More"}
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LyricsSearch;
