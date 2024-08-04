import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import NavBar from "../components/ui/navbar";
import Footer from "../components/ui/footer";
import "./AllArtists.css";

const db = getFirestore();

const capitalize = (text) => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

const AllArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleArtists, setVisibleArtists] = useState(10);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "artists"));
        const artistsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArtists(artistsList);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
      setLoading(false);
    };

    fetchArtists();
  }, []);

  const loadMore = () => {
    setVisibleArtists((prevVisibleArtists) => prevVisibleArtists + 10);
  };

  if (loading) {
    return (
      <div className="all-artists-page">
        <NavBar />
        <div className="loading-lyrics-display-page">
          <div className="logo-loading">
            <img src="/images/logo512.png" className="logo" alt="logo" style={{ width: "150px" }} />
            <p className="song-artist-lyrics-display">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="all-artists-page">
      <NavBar />
      <div className="artists-content">
        <h1 className="artists-title">All Artists</h1>
        <ul className="artists-list">
          {artists.slice(0, visibleArtists).map((artist) => (
            <li key={artist.id} className="artist-item">
              <Link to={`/artists/${artist.id}`} className="artist-link">
                <img src={artist.img} alt={artist.name} className="artist-image" />
                <span className="artist-name">{capitalize(artist.name)}</span>
              </Link>
            </li>
          ))}
        </ul>
        {visibleArtists < artists.length && (
          <button className="show-more-button-lyrics" onClick={loadMore}>Show More</button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AllArtistsPage;
