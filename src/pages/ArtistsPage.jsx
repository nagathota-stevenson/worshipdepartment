import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import NavBar from "../components/ui/navbar";
import Footer from "../components/ui/footer";
import "./SongsByCategory.css";
import "./ArtistsPage.css";
import { Link } from "react-router-dom";

const db = getFirestore();

const capitalize = (text) => {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

const extractVideoId = (url) => {
    const shortUrlRegex = /youtu\.be\/([^?&]+)/;
    const longUrlRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
    let match = url.match(shortUrlRegex);
    if (match) {
      return match[1];
    }
    match = url.match(longUrlRegex);
    return match ? match[1] : null;
  };
  
  const ArtistPage = () => {
    const { artistId } = useParams();
    const [artist, setArtist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [displayCount, setDisplayCount] = useState(7);
    const [view, setView] = useState("songs"); // State to manage view (songs or videos)
    const [playlistVideos, setPlaylistVideos] = useState([]); // Initialize as empty array
  
    useEffect(() => {
      const fetchArtistData = async () => {
        try {
          const artistDocRef = doc(db, "artists", artistId);
          const artistDoc = await getDoc(artistDocRef);
  
          if (artistDoc.exists()) {
            const artistData = artistDoc.data();
            setArtist(artistData);
  
            const songsData = await Promise.all(
              artistData.songs.map(async (songId) => {
                const songDocRef = doc(db, "songs", songId);
                const songDoc = await getDoc(songDocRef);
                return { id: songDoc.id, ...songDoc.data() };
              })
            );
  
            setSongs(songsData);
            console.log(artistData.playlist);
            setPlaylistVideos(artistData.playlist.map(url => extractVideoId(url)).filter(id => id !== null)); // Extract video IDs
            console.log(playlistVideos);
            setLoading(false);
          } else {
            console.log("No such artist!");
          }
        } catch (error) {
          console.error("Error fetching artist data: ", error);
        }
      };
  
      fetchArtistData();
    }, [artistId]);
  
    const handleShowMore = () => {
      setDisplayCount(displayCount + 7);
    };
  
    const handleShowLess = () => {
      setDisplayCount(displayCount - 7);
    };
  
    const handleViewChange = (view) => {
      setView(view);
    };
  
    if (!artist) {
      return <div>

      
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
    ;
    }
  
    return (
      <div className="artist-page">
        <NavBar />
        <div className="artist-header">
          <div
            className="artist-background"
            style={{ backgroundImage: `url(${artist.img})` }}
          ></div>
          <div className="artist-content">
            <img src={artist.img} alt={artist.name} className="artist-img" />
            <div className="artist-content-img-name">
              <h1 className="artist-name">{capitalize(artist.name)}</h1>
              <div className="social-media-links">
                <a
                  href={artist.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/images/fbb.png" alt="Facebook" />
                </a>
                <a
                  href={artist.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/images/igb.png" alt="Instagram" />
                </a>
                <a
                  href={artist.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/images/ytb.png" alt="YouTube" />
                </a>
                <a
                  href={artist.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/images/spotifyb.png" alt="Spotify" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="about-section">
          <h2>About</h2>
          <p>{artist.bio}</p>
          <div className="category-buttons">
            <button 
              onClick={() => handleViewChange("songs")}
              className={view === "songs" ? "active" : ""}
            >
              Songs
            </button>
            <button 
              onClick={() => handleViewChange("videos")}
              className={view === "videos" ? "active" : ""}
            >
              Videos
            </button>
          </div>
        </div>
        <div className="cards-artist-page">
          {loading ? (
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
          ) : view === "songs" ? (
            <>
              {songs.slice(0, displayCount).map((song) => (
                <div
               className="category-song-card"
                >
                <Link
                  to={`/songs/${song.id}`}
                  key={song.id}
                >
                  <div className="category-card-content">
                    <h2 className="category-card-song-title">
                      {capitalize(song.title)}
                    </h2>
                    <p className="category-card-song-artist">
                      Artist: {capitalize(artist.name)}
                    </p>
                    <p className="category-card-song-views">Views: {song.views}</p>
                  </div>
                </Link>
                </div>
              ))}
              <div className="show-more-container-featured">
                {songs.length > displayCount && (
                  <button
                    className="show-more-button-featured"
                    onClick={handleShowMore}
                  >
                    Show More
                  </button>
                )}
                {displayCount > 7 && (
                  <button
                    className="show-more-button-featured"
                    onClick={handleShowLess}
                  >
                    Show Less
                  </button>
                )}
              </div>
            </>
          ) : view === "videos" ? (
            <div className="videos-container">
              {playlistVideos.length > 0 ? (
                playlistVideos.map((videoId) => (
                  <iframe
                    key={videoId}
                    width="300"
                    height="200"
                    className="youtube-videos-artist"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`Video ${videoId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ))
              ) : (
                <p>No videos available.</p>
              )}
            </div>
          ) : null}
        </div>
        <Footer/>
      </div>
    );
  };
  
export default ArtistPage;