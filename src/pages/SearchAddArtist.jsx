import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from 'browser-image-compression'; // Import the image compression library
import "./ArtistSearch.css"; // Add your styles here

const ArtistSearch = ({ artistId, setArtistId, artistName, setArtistName }) => {
  const [artistSuggestions, setArtistSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [newArtist, setNewArtist] = useState({
    bio: "",
    facebook: "",
    img: "",
    instagram: "",
    name: "",
    playlist: [],
    songs: [],
    spotify: "",
    youtube: ""
  });
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [playlistLink, setPlaylistLink] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [creatingArtist, setCreatingArtist] = useState(false);
  const [artistAdded, setArtistAdded] = useState("");

  useEffect(() => {
    const fetchArtists = async () => {
      const db = getFirestore();
      const artistsCollection = collection(db, "artists");
      const artistSnapshot = await getDocs(artistsCollection);
      const artistsList = artistSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setArtistSuggestions(artistsList);
    };

    fetchArtists();
  }, []);

  const capitalize = (text) => text.replace(/\b\w/g, (char) => char.toUpperCase());


  const handleArtistChange = (e) => {
    const value = e.target.value;
    setArtistName(value); // Set artist name for display

    if (value.trim() === "") {
      setFilteredSuggestions([]);
      setShowCreateNew(false);
      setShowSuggestions(false);
      return;
    }

    const filtered = artistSuggestions.filter((artist) =>
      artist.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredSuggestions(filtered);
    setShowCreateNew(!filtered.length);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (id, name) => {
    setArtistId(id); // Set artist ID for internal use
    setArtistName(name); // Set artist name for display
    setShowSuggestions(false);
  };

  const handleImageUpload = async (file, artistId) => {
    setUploadingImage(true);

    // Compress image before uploading
    const options = {
      maxSizeMB: 1, // Max file size in MB
      maxWidthOrHeight: 800, // Max width or height in pixels
    };

    let compressedFile;
    try {
      compressedFile = await imageCompression(file, options);
    } catch (error) {
      console.error("Error compressing image: ", error);
      setUploadingImage(false);
      return;
    }

    const storage = getStorage();
    const imageRef = ref(storage, `artists/${artistId}/${compressedFile.name}`);
    try {
      await uploadBytes(imageRef, compressedFile);
      const imageUrl = await getDownloadURL(imageRef);
      setUploadingImage(false);
      return imageUrl;
    } catch (error) {
      setUploadingImage(false);
      console.error("Error uploading image: ", error);
    }
  };

  const handleCreateNewArtist = async () => {
    setCreatingArtist(true);
    try {
      const db = getFirestore();
      const docRef = await addDoc(collection(db, "artists"), newArtist);
      const newArtistDoc = { id: docRef.id, name: newArtist.name };

      if (imageFile) {
        const imageUrl = await handleImageUpload(imageFile, docRef.id);
        await updateDoc(docRef, { img: imageUrl });
        newArtistDoc.img = imageUrl;
      }

      setArtistSuggestions([
        ...artistSuggestions,
        newArtistDoc
      ]);
      setArtistId(docRef.id); // Set artist ID for internal use
      setArtistName(newArtist.name.toLowerCase()); // Set artist name for display
      setArtistAdded("Artist added successfully!");
      setNewArtist({
        bio: "",
        facebook: "",
        img: "",
        instagram: "",
        name: "",
        playlist: [],
        songs: [],
        spotify: "",
        youtube: ""
      });
      setImageFile(null); // Clear image file state
      setPlaylistLink(""); // Clear playlist link state
      setShowCreateNew(false);
      setShowSuggestions(false);
    } catch (error) {
      console.error("Error creating new artist: ", error);
      setArtistAdded("Error creating artist.");
    } finally {
      setCreatingArtist(false);
    }
  };

  const handleAddPlaylistLink = () => {
    if (playlistLink.trim()) {
      setNewArtist((prev) => ({
        ...prev,
        playlist: [...prev.playlist, playlistLink]
      }));
      setPlaylistLink(""); // Clear the input after adding
    }
  };

  return (
    <div className="artist-search-container">
      <input
        className="input-field-artist"
        type="text"
        id="artist"
        style={{
          borderRadius: "20px",
          border: "1px solid #8a8a8a"
        }}
        value={artistName}
        onChange={handleArtistChange}
        placeholder="Search for an artist or type new..."
        required
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="suggestions-list">
          {filteredSuggestions.map((artist) => (
            <li
              key={artist.id}
              onClick={() => handleSuggestionClick(artist.id, artist.name)}
            >
             {capitalize(artist.name)}
            </li>
          ))}
        </ul>
      )}
      {showCreateNew && (
        <div className="create-artist-container">
          <h3>Create New Artist</h3>
          <label>
            Name:
            <input
              type="text"
              value={newArtist.name}
              onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })}
              required
            />
          </label>
          <label>
            Bio:
            <textarea
              value={newArtist.bio}
              onChange={(e) => setNewArtist({ ...newArtist, bio: e.target.value })}
            />
          </label>
          <label>
            Facebook:
            <input
              type="text"
              value={newArtist.facebook}
              onChange={(e) => setNewArtist({ ...newArtist, facebook: e.target.value })}
            />
          </label>
          <label>
            Instagram:
            <input
              type="text"
              value={newArtist.instagram}
              onChange={(e) => setNewArtist({ ...newArtist, instagram: e.target.value })}
            />
          </label>
          <label>
            Image:
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            {uploadingImage && <span>Uploading image...</span>}
          </label>
          <label>
            Playlist:
            <input
              type="text"
              value={playlistLink}
              onChange={(e) => setPlaylistLink(e.target.value)}
              placeholder="Add playlist link"
            />
            <button type="button" onClick={handleAddPlaylistLink}>
              Add Link
            </button>
            <ul>
              {newArtist.playlist.map((link, index) => (
                <li key={index}>{link}</li>
              ))}
            </ul>
          </label>
          <label>
            Spotify:
            <input
              type="text"
              value={newArtist.spotify}
              onChange={(e) => setNewArtist({ ...newArtist, spotify: e.target.value })}
            />
          </label>
          <label>
            YouTube:
            <input
              type="text"
              value={newArtist.youtube}
              onChange={(e) => setNewArtist({ ...newArtist, youtube: e.target.value })}
            />
          </label>
          <button onClick={handleCreateNewArtist} disabled={creatingArtist}>
            {creatingArtist ? "Creating Artist..." : "Create Artist"}
          </button>
          {artistAdded && <span>{artistAdded}</span>}
        </div>
      )}
    </div>
  );
};

export default ArtistSearch;
