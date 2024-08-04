import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
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
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [displayedSongs, setDisplayedSongs] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [hoverImagePosition, setHoverImagePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const db = getFirestore();
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchSongsAndArtists = async () => {
      const q = query(
        collection(db, "songs"),
        orderBy("views", "desc"),
        limit(5)
      );
      const songQuerySnapshot = await getDocs(q);

      const artistMap = new Map();
      const artistSnapshot = await getDocs(collection(db, "artists"));
      artistSnapshot.forEach((doc) => {
        const data = doc.data();
        artistMap.set(doc.id, data.name);
      });

      const songsData = songQuerySnapshot.docs.map((doc) => {
        const songData = doc.data();
        const artistName = artistMap.get(songData.artistId) || "Unknown Artist";
        return {
          id: doc.id,
          ...songData,
          artistName,
          youtubeLink: songData.link, // Assuming you have this field
        };
      });

      setSongs(songsData);
      setDisplayedSongs(songsData.slice(0, 5));
    };

    fetchSongsAndArtists();
  }, [db]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.height = `${containerRef.current.scrollHeight}px`;
    }
  }, [displayedSongs]);

  const fetchThumbnail = async (youtubeLink) => {
    try {
      const videoId = extractVideoId(youtubeLink);
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
      setThumbnailUrl(thumbnailUrl);
    } catch (error) {
      console.error("Error fetching YouTube thumbnail:", error);
    }
  };

  const extractVideoId = (url) => {
    const urlObj = new URL(url);
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v");
    }
    return null;
  };

  const handleMouseMove = (e, youtubeLink) => {
    const { clientX, clientY } = e;
    setHoverImagePosition({ x: clientX, y: clientY });
    if (youtubeLink) {
      fetchThumbnail(youtubeLink);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setThumbnailUrl(""); // Clear thumbnail on mouse leave
  };

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
        <img
          src="/images/trend.png"
          style={{ width: isMobile ? "35px" : "45px" }}
          alt="Trend"
        />
      </h1>

      <div
        ref={containerRef}
        className="songs-list"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {displayedSongs.map((song, index) => (
          <Link
            to={`/songs/${song.id}`}
            key={index}
            className="song-item"
            onMouseMove={(e) => handleMouseMove(e, song.link)}
          >
            <h2 className="song-title">{capitalizeWords(song.title)}</h2>
            <p className="song-artist">
              Artist Name: {capitalizeWords(song.artistName)}
            </p>
          </Link>
        ))}
      </div>

      {/* Floating image outside song items */}
      <img
        src={thumbnailUrl || "/images/trans.png"} // Use thumbnail URL or fallback image
        className="hover-image"
        alt="Hover Effect"
        style={{
          position: "fixed", // Ensure it follows the cursor across the viewport
          left: `${hoverImagePosition.x}px`,
          top: `${hoverImagePosition.y}px`,
          opacity: isHovering ? 1 : 0,
          transform: "translate(-50%, -50%)",
          height: "300px",
          width: "400px",
          borderRadius: "50px",
          pointerEvents: "none", // Prevent pointer events on the floating image
        }}
      />

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
