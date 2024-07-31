import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

import { Link } from "react-router-dom";
import NavBar from "../components/ui/navbar";
import "./LyricsDisplayPage.css";
import Footer from "../components/ui/footer";

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
    if (index === -1) return match; // If the chord is not found in notes
    const transposedIndex = (index + steps + notes.length) % notes.length;
    return notes[transposedIndex];
  });
};

const LyricsDisplay = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnglish, setIsEnglish] = useState(false);
  const [fontSize, setFontSize] = useState(40); // Initial font size for lyrics
  const [transposeSteps, setTransposeSteps] = useState(0);
  const [viewsIncremented, setViewsIncremented] = useState(false);
  const [similarSongs, setSimilarSongs] = useState([]); // State for similar songs
  const [displayedSongs, setDisplayedSongs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [showMore, setShowMore] = useState(true);

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

  const capitalize = (text) => {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const incrementViews = async () => {
    if (viewsIncremented) return; // Guard to prevent multiple increments
    try {
      const docRef = doc(db, "songs", id);
      await updateDoc(docRef, {
        views: increment(1),
      });
      setViewsIncremented(true); // Mark as incremented
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const docRef = doc(db, "songs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const songData = docSnap.data();
          setSong(songData);
          console.log(songData);
          await incrementViews();
          await fetchSimilarSongs(songData.tags);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching song:", error);
      }
      setLoading(false);
    };

    fetchSong();
  }, [id]);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

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
          // Exclude the current song
          songs.push({ id: doc.id, ...doc.data() });
        }
      });
      console.log(songs);
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

  const handleFontSizeChange = (increment) => {
    setFontSize((prevSize) => prevSize + increment);
  };

  const handleTransposeChange = (steps) => {
    setTransposeSteps(steps);
  };

  if (loading) {
    return (
      <div className="lyrics-display-page">
        <NavBar />
        <div className="loading-lyrics-display-page">
          <div className="logo-loading">
            <img
              src="/images/logo512.png"
              className="logo"
              alt="logo"
              style={{ width: "150px" }}
            />
            <p className="song-artist-lyrics-display">Loading...</p>
          </div>
        </div>
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
    <div className="lyrics-display-page">
      <NavBar />
      <div className="lyrics-content">
        <div className="lyrics">
          <h1 className="song-title-lyrics-display">
            {capitalize(song.title)}
          </h1>
          <p className="song-artist-lyrics-display">
            Artist Name: {capitalize(song.artist)}
          </p>
          <p className="song-artist-lyrics-display">
            Scale: {capitalize(song.scale)}
          </p>
          <div className="views-likes-container">
            <div className="views-container">
              <img src="/images/views.png" alt="Icon 1" />
              <h2>{song.views} Views</h2>
            </div>

            <div className="likes-container">
              <img src="/images/like.png" alt="Icon 1" />
              <h2>{song.likes} Likes</h2>
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

          <div
            className="song-lyrics"
            style={{
              fontSize: `${fontSize}px`,
            }}
          >
            {(isEnglish ? song["lyricsen"] : song.lyrics).map((line, index) => (
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
            ))}
          </div>
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
                  <Link to={`/lyrics/${similarSong.id}`}>
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
                    <Link to={`/lyrics/category/${e.toLowerCase()}`}>{capitalize(e)}</Link>
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
      <Footer />
    </div>
  );
};

export default LyricsDisplay;
