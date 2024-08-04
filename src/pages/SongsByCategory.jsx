import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import NavBar from "../components/ui/navbar";
import Footer from "../components/ui/footer";
import "./LyricsPage.css";
import "./SongsByCategory.css";
import Suggestions from "../components/ui/Suggestions";

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

const capitalize = (text) => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

const SongsByCategory = () => {
  const { category } = useParams();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(10);
  const [filter, setFilter] = useState({
    artist: "",
    title: "",
  });

  const songsCollectionRef = collection(db, "songs");

  const [searchQuery, setSearchQuery] = useState("");

  const [artists, setArtists] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);

  const [visibleCount, setVisibleCount] = useState(5);
  const [showMore, setShowMore] = useState(true);
  const [showMoreTrending, setShowMoreTrending] = useState(false);

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
      setLoading(true);
      try {
        const q = query(songsCollectionRef, where("category", "==", category));
        const data = await getDocs(q);
        const songsData = await Promise.all(
          data.docs.map(async (songDoc) => {
            const songData = songDoc.data();
            if (songData.artistId) {
              const artistDocRef = doc(db, "artists", songData.artistId);
              const artistDocSnap = await getDoc(artistDocRef);
              if (artistDocSnap.exists()) {
                songData.artist = artistDocSnap.data().name;
              } else {
                songData.artist = "Unknown Artist";
              }
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
    getSongs();
  }, [category]);

  const handleShowMore = () => {
    setDisplayCount((prevCount) => prevCount + 5);
  };

  const handleShowLess = () => {
    setDisplayCount(7);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const filteredSongs = songs.filter((song) => {
    return (
      (filter.artist === "" ||
        song.artist.toLowerCase().includes(filter.artist.toLowerCase())) &&
      (filter.title === "" ||
        song.title.toLowerCase().includes(filter.title.toLowerCase()))
    );
  });

  return (
    <div className="songs-by-category-page">
      <NavBar />
      <h1
        className="category-title"
        // style={{
        //   backgroundImage: "url(/images/bg1.png)",
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        //   color: "#fff",
        //   height: '200px',
        //   textAlign: "center",
        // }}
      >
        Category: {capitalize(category)} Songs
      </h1>
      <div className="filters">
        <input
          type="text"
          name="title"
          value={filter.title}
          placeholder="Search by Title"
          onChange={handleFilterChange}
        />
        <div
          style={{
            fontFamily: "Nohemi Regular",
            color: "#d6d6d6",
            alignItems: "center",
            paddingTop: "12px",
          }}
        >
          {" "}
          or
        </div>
        <input
          type="text"
          name="artist"
          value={filter.artist}
          placeholder="Search by Artist"
          onChange={handleFilterChange}
        />
      </div>
      <div className="category-cards-container">
        {loading ? (
           <div 
           style={{
            display: 'flex',
            gap: '20px'
           }}
           >
           {Array.from({ length: 3 }).map((_, index) => (
             <div key={index} className="category-card-skeleton">
               <div className="skeleton-title"></div>
               <div className="skeleton-artist"></div>
               <div className="skeleton-views"></div>
             </div>
           ))}
         </div>
        ) : (
          filteredSongs.slice(0, displayCount).map((song) => (
            <Link
              to={`/songs/${song.id}`}
              className="category-song-card"
              key={song.id}
            >
              <div className="category-card-content">
                <h2 className="category-card-song-title">
                  {capitalize(song.title)}
                </h2>
                <p className="category-card-song-artist">
                  Artist: {capitalize(song.artist)}
                </p>
                <p className="category-card-song-views">Views: {song.views}</p>
              </div>
            </Link>
          ))
        )}
      </div>
      <div className="show-more-container-category">
        {filteredSongs.length > displayCount && (
          <button
            className="show-more-button-category"
            onClick={handleShowMore}
          >
            Show More
          </button>
        )}
        {displayCount > 10 && (
          <button
            className="show-more-button-category"
            onClick={handleShowLess}
          >
            Show Less
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SongsByCategory;
