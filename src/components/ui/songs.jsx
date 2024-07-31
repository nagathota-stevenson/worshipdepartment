import React, { useEffect, useState, useRef } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import "../../auth/firebaseConfig";
import "./songs.css";
import { Colors } from "./colors";
import { useMediaQuery } from "react-responsive";

// Helper function to capitalize each word in a string
const capitalizeWords = (str) => {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [displayedSongs, setDisplayedSongs] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const db = getFirestore();
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchSongs = async () => {
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

      setSongs(songsData);
      setDisplayedSongs(songsData.slice(0, 5));
    };

    fetchSongs();
  }, [db]);

  const handleShowMore = () => {
    if (showMore) {
      setDisplayedSongs(songs.slice(0, 5));
    } else {
      setDisplayedSongs(songs);
    }
    setShowMore(!showMore);
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.height = showMore
          ? "auto"
          : `${containerRef.current.scrollHeight}px`;
      }
    }, 0);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.height = `${containerRef.current.scrollHeight}px`;
    }
  }, [displayedSongs]);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div>
      <h1
        style={{
          fontFamily: "Nohemi Medium",
          fontSize: isMobile ? "40px" : "60px",
          paddingTop: "80px",
          color: Colors.white,
          backgroundColor: Colors.black,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        Trending Songs
        <img src="/images/trend.png" style={{ width: isMobile ? "35px" : "45px" }} alt="Trend" />
      </h1>
        
      <div ref={containerRef} className="songs-list">
        {displayedSongs.map((song, index) => (
          <Link to={`/lyrics/${song.id}`} key={index} className="song-item">
            <h2 className="song-title">{capitalizeWords(song.title)}</h2>
            <p className="song-artist">Artist Name: {capitalizeWords(song.artist)}</p>
          </Link>
        ))}
      </div>

      {songs.length > 5 && (
        <div className="button-container">
          <button className="show-more-button" onClick={handleShowMore}>
            {showMore ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Songs;
