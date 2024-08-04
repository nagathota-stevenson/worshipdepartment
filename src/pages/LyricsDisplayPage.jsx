import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";


import { getAuth } from "firebase/auth";
import NavBar from "../components/ui/navbar";
import Footer from "../components/ui/footer";
import "./LyricsDisplayPage.css";
import useIsMobile from "./isMobile";
import CommentsSection from "./CommentsSection";
import LoginCard from "./LoginCard";

const db = getFirestore();

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

const transposeChord = (chord, steps) => {
  const notes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
    "Cb",
    "Db",
    "Eb",
    "Fb",
    "Gb",
    "Ab",
    "Bb",
  ];
  const regex = /([A-G][b#]?)/g;
  return chord.replace(regex, (match) => {
    const index = notes.indexOf(match);
    if (index === -1) return match;
    const transposedIndex = (index + steps + notes.length) % notes.length;
    return notes[transposedIndex];
  });
};

const LyricsDisplay = () => {
  const isMobile = useIsMobile();

  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnglish, setIsEnglish] = useState(false);
  const [fontSize, setFontSize] = useState(isMobile ? 18 : 26);
  const [transposeSteps, setTransposeSteps] = useState(0);
  const [viewsIncremented, setViewsIncremented] = useState(false);
  const [similarSongs, setSimilarSongs] = useState([]);
  const [displayedSongs, setDisplayedSongs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [showMore, setShowMore] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);

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
    setVisibleCount(5);
    setShowMore(true);
  };

  const visibleCategories = categories.slice(0, visibleCount);

  const capitalize = (text) =>
    text.replace(/\b\w/g, (char) => char.toUpperCase());

  const incrementViews = async () => {
    if (viewsIncremented) return;
    try {
      const docRef = doc(db, "songs", id);
      await updateDoc(docRef, {
        views: increment(1),
      });
      setViewsIncremented(true);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  useEffect(() => {
    const fetchSongAndArtist = async () => {
      try {
        const songDocRef = doc(db, "songs", id);
        const songDocSnap = await getDoc(songDocRef);

        if (songDocSnap.exists()) {
          const songData = songDocSnap.data();
          if (songData.artistId) {
            const artistDocRef = doc(db, "artists", songData.artistId);
            const artistDocSnap = await getDoc(artistDocRef);
            if (artistDocSnap.exists()) {
              songData.artistName = artistDocSnap.data().name;
            } else {
              songData.artistName = "Unknown Artist";
            }
          }
          setSong(songData);
          await incrementViews();
          await fetchSimilarSongs(songData.tags);
          checkIfLiked(); 
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching song:", error);
      }
      setLoading(false);
    };

    fetchSongAndArtist();
  }, [id]);

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const fetchSimilarSongs = async (tags) => {
    if (!tags || tags.length === 0) return;

    const tagsQuery = query(
      collection(db, "songs"),
      where("tags", "array-contains-any", tags)
    );

    try {
      const querySnapshot = await getDocs(tagsQuery);
      const songs = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== id) {
          songs.push({ id: doc.id, ...doc.data() });
        }
      });
      setSimilarSongs(songs);
      setDisplayedSongs(songs.slice(0, 5));
    } catch (error) {
      console.error("Error fetching similar songs:", error);
    }
  };

  const handleShowMore = () => {
    const shuffledSongs = shuffleArray(similarSongs);
    setDisplayedSongs(shuffledSongs.slice(0, 5));
  };

  const handleCloseLoginCard = () => {
    setShowLoginCard(false);
  };

  const handleFontSizeChange = (increment) => {
    setFontSize((prevSize) => prevSize + increment);
  };

  const handleTransposeChange = (steps) => {
    setTransposeSteps(steps);
  };

  const toggleLike = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      // User is not logged in, show login card
      setShowLoginCard(true);
      return;
    }

    const userId = user.uid;
    const songDocRef = doc(db, "songs", id);

    try {
      const songDocSnap = await getDoc(songDocRef);

      if (songDocSnap.exists()) {
        const songData = songDocSnap.data();
        const likesArray = songData.likes || [];

        // Update local state immediately
        const updatedLikesArray = likesArray.includes(userId)
          ? likesArray.filter((like) => like !== userId)
          : [...likesArray, userId];

        setSong((prevSong) => ({
          ...prevSong,
          likes: updatedLikesArray,
        }));

        // Sync with Firestore
        await updateDoc(songDocRef, {
          likes: updatedLikesArray,
        });

        // Update local liked state
        setIsLiked(updatedLikesArray.includes(userId));
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const checkIfLiked = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setIsLiked(false);
      return;
    }

    const userId = user.uid;
    const songDocRef = doc(db, "songs", id);

    try {
      const songDocSnap = await getDoc(songDocRef);

      if (songDocSnap.exists()) {
        const songData = songDocSnap.data();
        setIsLiked(songData.likes && songData.likes.includes(userId));
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error checking if liked:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="loading-lyrics-display-page">
          <div className="logo-loading">
            <img
              src="/images/logo512.png"
              className="logo"
              alt="logo"
              style={{ width: "100px" }}
            />
            <p className="song-artist-lyrics-display">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!song) {
    return (
      <div className="lyrics-display-page">
        <NavBar />
        <div className="error">Song not found</div>
      </div>
    );
  }

  const extractVideoId = (url) => {
    const urlObj = new URL(url);
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v");
    }
    return null;
  };

  return (
    <div>
      <NavBar />
      <div className="lyrics-display-page">
        <div className="lyrics-content">
          <div className="lyrics">
            <h1 className="song-title-lyrics-display">
              {capitalize(song.title)}
            </h1>

            <p className="song-artist-lyrics-display">
              Artist Name:
              <Link to={`/artists/${song.artistId}`}>
                {" "}
                {capitalize(song.artistName || "Unknown Artist")}
              </Link>
            </p>

            <p className="song-artist-lyrics-display">
              Scale: {capitalize(song.scale)}
            </p>
            <div className="views-likes-container">
              <div className="views-container">
                <img src="/images/views.png" alt="Icon 1" />
                <h2>{song.views} Views</h2>
              </div>
              <div>
                {showLoginCard && <LoginCard onClose={handleCloseLoginCard} />}
                <div className="likes-container" onClick={toggleLike}>
                  <img
                    src={isLiked ? "/images/like.png" : "/images/unlike.png"}
                    alt="Like Icon"
                  />
                  <h2>{song.likes.length} Likes</h2>
                </div>
              </div>
            </div>
            <div className="toggle-container">
              <div
                className={`toggle-button ${isEnglish ? "english" : "telugu"}`}
              >
                <span
                  onClick={() => setIsEnglish(false)}
                  className={`toggle-option ${!isEnglish ? "active" : ""}`}
                >
                  {song.lan}
                </span>
                <span
                  onClick={() => setIsEnglish(true)}
                  className={`toggle-option ${isEnglish ? "active" : ""}`}
                >
                  English
                </span>
              </div>
            </div>
            <div className="controls-container">
              <div className="font-size-control">
                <span>Font</span>
                <button
                  onClick={() => handleFontSizeChange(-2)}
                  className="font-size-button"
                >
                  -
                </button>
                <button
                  onClick={() => handleFontSizeChange(2)}
                  className="font-size-button"
                >
                  +
                </button>
              </div>
              <div className="transpose-control">
                <span>Transpose </span>
                <button
                  onClick={() => handleTransposeChange(transposeSteps - 1)}
                  className="transpose-button"
                  disabled={
                    song.scale === "N/A" ||
                    !song.chords ||
                    song.chords.length === 0
                  }
                >
                  -
                </button>
                <span className="transpose-steps">{transposeSteps}</span>
                <button
                  onClick={() => handleTransposeChange(transposeSteps + 1)}
                  className="transpose-button"
                  disabled={
                    song.scale === "N/A" ||
                    !song.chords ||
                    song.chords.length === 0
                  }
                >
                  +
                </button>
              </div>
            </div>
            <div className="song-lyrics" style={{ fontSize: `${fontSize}px` }}>
              {(isEnglish ? song["lyricsen"] : song.lyrics).map(
                (line, index) => (
                  <div key={index}>
                    {song.chords && song.chords.length > 0 ? (
                      <pre
                        className="song-chords"
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        {transposeChord(song.chords[index], transposeSteps)}
                      </pre>
                    ) : (
                      <pre className="song-chords"></pre>
                    )}
                    {line === "" ? <br /> : line}
                  </div>
                )
              )}
            </div>

            <CommentsSection songId={id} />
          </div>
          <div className="lyrics-display-right-content">
            {song.link && (
              <div className="youtube-video-lyrics-page">
                <iframe
                  src={`https://www.youtube.com/embed/${extractVideoId(
                    song.link
                  )}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
            )}
            <hr className="divider-lyrics-page" />
            <div>
              <h2 className="related-songs-heading">Related Songs</h2>
              <ul>
                {displayedSongs.map((similarSong) => (
                  <li key={similarSong.id} className="related-songs">
                    <Link to={`/songs/${similarSong.id}`}>
                      {capitalize(similarSong.title)}
                    </Link>
                  </li>
                ))}
              </ul>
              {similarSongs.length > 5 && (
                <button
                  className="show-more-button-lyrics"
                  onClick={handleShowMore}
                >
                  Show More
                </button>
              )}
            </div>
            <hr className="divider-lyrics-page" />
            <div>
              <h2 className="related-songs-heading">Songs by Category</h2>
              <ul>
                {visibleCategories.map((e, index) => (
                  <div key={index} className="related-songs-container">
                    <li className="related-songs">
                      <Link to={`/songs/category/${e.toLowerCase()}`}>
                        {capitalize(e)}
                      </Link>
                    </li>
                  </div>
                ))}
              </ul>
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LyricsDisplay;
