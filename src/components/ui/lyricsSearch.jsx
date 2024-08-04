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
  doc,
  getDoc
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Footer from "./footer";
import { useMediaQuery } from "react-responsive";
import Suggestions from "./Suggestions";

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
    setVisibleCount(5);
    setShowMore(true);
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
        const artistMap = new Map();
        const songsData = await Promise.all(
          data.docs.map(async (songDoc) => {
            const songData = songDoc.data();
            if (songData.artistId) {
              if (!artistMap.has(songData.artistId)) {
                const artistDocRef = doc(db, "artists", songData.artistId);
                const artistDocSnap = await getDoc(artistDocRef);
                if (artistDocSnap.exists()) {
                  artistMap.set(songData.artistId, artistDocSnap.data().name);
                } else {
                  artistMap.set(songData.artistId, "Unknown Artist");
                }
              }
              songData.artist = artistMap.get(songData.artistId);
            } else {
              songData.artist = "Unknown Artist";
            }
            return { ...songData, id: songDoc.id };
          })
        );
        setSongs(songsData);
      } catch (error) {
        console.error("Error fetching songs: ", error);
      }
      setLoading(false);
    };

    const getArtists = async () => {
      try {
        const artistsSnapshot = await getDocs(artistsCollectionRef);
        const artistsData = artistsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setArtists(artistsData);
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
            <Link to={`/songs/${song.id}`} className="song-link" key={song.id}>
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

      <Suggestions 
        categories={categories}
        artists={artists}
        trendingSongs={trendingSongs}
        visibleCategories={visibleCategories}
        showMore={showMore}
        handleShowMoreCategory={handleShowMoreCategory}
        handleShowLessCategory={handleShowLessCategory}
        showMoreTrending={showMoreTrending}
        handleShowMoreTrending={handleShowMoreTrending}
      />

      <Footer />
    </div>
  );
};

const capitalize = (text) => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

export default LyricsSearch;
