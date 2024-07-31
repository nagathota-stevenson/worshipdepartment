import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import NavBar from "../components/ui/navbar";
import Footer from "../components/ui/footer";
import "./LyricsPage.css";
import "./SongsByCategory.css";

const db = getFirestore();

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
    title: ""
  });

  const songsCollectionRef = collection(db, "songs");

  useEffect(() => {
    const getSongs = async () => {
      setLoading(true);
      try {
        const q = query(songsCollectionRef, where("category", "==", category));
        const data = await getDocs(q);
        setSongs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
      (filter.artist === "" || song.artist.toLowerCase().includes(filter.artist.toLowerCase())) &&
      (filter.title === "" || song.title.toLowerCase().includes(filter.title.toLowerCase()))
    );
  });

  return (
    <div className="songs-by-category-page">
      <NavBar />
      <h1 className="category-title"> {capitalize(category)} Songs </h1>
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
            paddingTop: "12px"
        }}
        > or
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
          <div className="category-card-loading">
            <h2>Loading...</h2>
          </div>
        ) : (
          filteredSongs.slice(0, displayCount).map((song) => (
            <Link to={`/lyrics/${song.id}`} className="category-song-card" key={song.id}>
              <div className="category-card-content">
                <h2 className="category-card-song-title">{capitalize(song.title)}</h2>
                <p className="category-card-song-artist">Artist: {capitalize(song.artist)}</p>
                <p className="category-card-song-views">Views: {song.views}</p>
              </div>
            </Link>
          ))
        )}
      </div>
      <div className="show-more-container-category">
        {filteredSongs.length > displayCount && (
          <button className="show-more-button-category" onClick={handleShowMore}>
            Show More
          </button>
        )}
        {displayCount > 7 && (
          <button className="show-more-button-category" onClick={handleShowLess}>
            Show Less
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SongsByCategory;
