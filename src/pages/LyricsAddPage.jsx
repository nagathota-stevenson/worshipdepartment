import React, { useState, useEffect } from "react";
import "./LyricsAddPage.css"; // Ensure the updated CSS file is used
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import NavBar from "../components/ui/navbar";
import OpenAI from "openai";
import { parseString } from "xml2js";
import ArtistSearch from "./SearchAddArtist";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const openai = new OpenAI({
  apiKey: "sk-proj-ZEn1KdWDkZU9cKhZ1YqST3BlbkFJ3c1aqj2kLpqBPYGgUHuO",
  dangerouslyAllowBrowser: true,
});

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

const scales = [
  "N/A",
  "C Major",
  "C# Major",
  "D Major",
  "D# Major",
  "E Major",
  "F Major",
  "F# Major",
  "G Major",
  "G# Major",
  "A Major",
  "A# Major",
  "B Major",
  "C Minor",
  "C# Minor",
  "D Minor",
  "D# Minor",
  "E Minor",
  "F Minor",
  "F# Minor",
  "G Minor",
  "G# Minor",
  "A Minor",
  "A# Minor",
  "B Minor",
];

const chords = [
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
  "Cm",
  "C#m",
  "Dm",
  "D#m",
  "Em",
  "Fm",
  "F#m",
  "Gm",
  "G#m",
  "Am",
  "A#m",
  "Bm",
];

const scaleChords = {
  "C Major": ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
  "G Major": ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
  "D Major": ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
  "A Major": ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
  "E Major": ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
  "B Major": ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim"],
  "F# Major": ["F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim"],
  "C# Major": ["C#", "D#m", "E#m", "F#", "G#", "A#m", "B#dim"],
  "F Major": ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"],
  "Bb Major": ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"],
  "Eb Major": ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim"],
  "Ab Major": ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"],
  "Db Major": ["Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim"],
  "Gb Major": ["Gb", "Abm", "Bbm", "Cb", "Db", "Ebm", "Fdim"],
  "Cb Major": ["Cb", "Dbm", "Ebm", "Fb", "Gb", "Abm", "Bbdim"],
  "A Minor": ["Am", "Bdim", "C", "Dm", "Em", "F", "G"],
  "E Minor": ["Em", "F#dim", "G", "Am", "Bm", "C", "D"],
  "B Minor": ["Bm", "C#dim", "D", "Em", "F#m", "G", "A"],
  "F# Minor": ["F#m", "G#dim", "A", "Bm", "C#m", "D", "E"],
  "C# Minor": ["C#m", "D#dim", "E", "F#m", "G#m", "A", "B"],
  "G# Minor": ["G#m", "A#dim", "B", "C#m", "D#m", "E", "F#"],
  "D# Minor": ["D#m", "E#dim", "F#", "G#m", "A#m", "B", "C#"],
  "A# Minor": ["A#m", "B#dim", "C#", "D#m", "E#m", "F#", "G#"],
  "D Minor": ["Dm", "Edim", "F", "Gm", "Am", "Bb", "C"],
  "G Minor": ["Gm", "Adim", "Bb", "Cm", "Dm", "Eb", "F"],
  "C Minor": ["Cm", "Ddim", "Eb", "Fm", "Gm", "Ab", "Bb"],
  "F Minor": ["Fm", "Gdim", "Ab", "Bbm", "Cm", "Db", "Eb"],
  "Bb Minor": ["Bbm", "Cdim", "Db", "Ebm", "Fm", "Gb", "Ab"],
  "Eb Minor": ["Ebm", "Fdim", "Gb", "Abm", "Bbm", "Cb", "Db"],
  "Ab Minor": ["Abm", "Bbdim", "Cb", "Dbm", "Ebm", "Fb", "Gb"],
};

const LyricsAddPage = () => {
  const [title, setTitle] = useState("");
  const [artistId, setArtistId] = useState("");
  const [scale, setScale] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("Telugu");
  const [lyricsInput, setLyricsInput] = useState("");
  const [lyricsLines, setLyricsLines] = useState([]);
  const [addingChords, setAddingChords] = useState(false);
  const [link, setLink] = useState("");
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [translatedLyrics, setTranslatedLyrics] = useState([]);
  const [isConverted, setIsConverted] = useState(false);
  const [chords, setChords] = useState([]);
  const [artistSuggestions, setArtistSuggestions] = useState([]);
  const [artistName, setArtistName] = useState("");

  const [user, setUser] = useState(null); // Firebase auth user state
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleConvertLyrics = () => {
    const lines = lyricsInput.split("\n").map((line) => ({ lyric: line }));
    setLyricsLines(lines);
    setTranslatedLyrics(lines.map(() => ({ lyric: "" })));
    setChords(lines.map(() => ""));
    setIsConverted(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        if (file.name.endsWith(".xml")) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(fileContent, "text/xml");
          const verses = xmlDoc.getElementsByTagName("verse");
          let lyricsArray = [];
          for (let verse of verses) {
            const lines = verse
              .getElementsByTagName("lines")[0]
              .textContent.split("<br/>");
            lyricsArray.push(...lines);
          }
          setLyricsInput(lyricsArray.join("\n"));
        } else {
          setLyricsInput(fileContent);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleChangeLyricsLine = (
    index,
    field,
    value,
    isTranslated = false
  ) => {
    if (isTranslated) {
      const updatedTranslatedLines = translatedLyrics.map((line, i) =>
        i === index ? { ...line, lyric: value } : line
      );
      setTranslatedLyrics(updatedTranslatedLines);
    } else {
      if (field === "chord") {
        const updatedChords = chords.map((chord, i) =>
          i === index ? value : chord
        );
        setChords(updatedChords);
      } else {
        const updatedLines = lyricsLines.map((line, i) =>
          i === index ? { ...line, lyric: value } : line
        );
        setLyricsLines(updatedLines);
      }
    }
  };

  const handleAddTag = () => {
    if (newTag.trim().toLowerCase() !== "") {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage("You must be logged in to add lyrics.");
      return;
    }
    setLoading(true);

    // Input validation
    if (!title || !artistId || !scale || !link || !lyricsLines.length) {
      setErrorMessage("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    // Prepare data
    const newLyricsData = {
      title: title.toLowerCase(),
      artistId: artistId,
      scale,
      category: category.toLowerCase(),
      lan: language,
      chords: addingChords ? chords : [],
      likes: likes,
      views: views,
      link,
      lyrics: lyricsLines.map((line) => line.lyric),
      lyricsen: translatedLyrics.map((line) => line.lyric),
      tags,
    };

    try {
      const db = getFirestore();
      const docRef = await addDoc(collection(db, "songs"), newLyricsData);

      const artistDocRef = doc(db, "artists", artistId);
      await updateDoc(artistDocRef, {
        songs: arrayUnion(docRef.id),
      });

      setSuccessMessage(`Lyrics added successfully for ${title}!`);
      setTitle("");
      setArtistId("");
      setScale("");
      setCategory("");
      setLanguage("Telugu");
      setLyricsInput("");
      setLyricsLines([]);
      setLink("");
      setLikes(0);
      setViews(0);
      setTags([]);
      setChords([]);
    } catch (error) {
      console.error("Error adding document: ", error);
      setErrorMessage("Error adding lyrics. Please try again.");
    }

    setLoading(false);
  };

  const handleTranslateToEnglish = async () => {
    setLoading(true); // Start loading
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `transliterate this text in English (do not special characters) line by line (DO NOT WRITE THE MEANING IN ENGLISH),  just give the result , you do not say anything else:\n\n${lyricsInput}`,
          },
        ],
      });

      if (response.choices && response.choices.length > 0) {
        const translatedText = response.choices[0].message.content;
        const translatedLines = translatedText
          .split("\n")
          .map((line) => ({ lyric: line, chord: "" }));
        setTranslatedLyrics(translatedLines);
      } else {
        console.error("No choices found in the response.");
        setErrorMessage("No translation results found. Please try again.");
      }
    } catch (error) {
      console.error("Error translating lyrics: ", error);
      setErrorMessage("Error translating lyrics. Please try again.");
    }
    setLoading(false); // Stop loading
  };

  const availableChords = scaleChords[scale] || [];

  useEffect(() => {
    const fetchArtists = async () => {
      const db = getFirestore();
      const artistsCollection = collection(db, "artists");
      const artistSnapshot = await getDocs(artistsCollection);
      const artistsList = artistSnapshot.docs.map((doc) => doc.data().name);
      setArtistSuggestions(artistsList);
    };

    fetchArtists();
  }, []);

  const handleArtistChange = (e) => {
    setArtistId(e.target.value);
  };

  // Filter suggestions based on input value
  const filteredSuggestions = artistSuggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(artistId.toLowerCase())
  );

  return (
    <div>
      <NavBar />
      <div className="lyrics-add-page-container">
        <h1 className="page-heading">Add New Lyrics</h1>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">Loading...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="lyrics-form-container">
            {/* Form Fields */}
            <div className="form-group-container">
              <label className="input-label">Title:</label>
              <input
                type="text"
                className="input-field-add-lyrics"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <label className="input-label">Artist:</label>
            <ArtistSearch
              artistId={artistId}
              setArtistId={setArtistId}
              artistName={artistName}
              setArtistName={setArtistName}
            />
            <div className="form-group-container">
              <label className="input-label">Scale:</label>
              <select
                className="select-dropdown"
                value={scale}
                onChange={(e) => setScale(e.target.value)}
              >
                <option value="" disabled>
                  Select Scale
                </option>
                {scales.map((s, index) => (
                  <option key={index} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group-container">
              <label className="input-label">Language:</label>
              <select
                className="select-dropdown"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="Telugu">Telugu</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                {/* Add more options as needed */}
              </select>
            </div>

            <div className="form-group-container">
              <label className="input-label">Category:</label>
              <select
                className="select-dropdown"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((s, index) => (
                  <option key={index} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-container">
              <label className="input-label">Adding Chords?</label>
              <select
                className="select-dropdown"
                value={addingChords ? "Yes" : "No"}
                onChange={(e) => setAddingChords(e.target.value === "Yes")}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div className="lyrics-section-container">
              <h2>Lyrics</h2>
              <div className="input-fields-lyrics">
                <textarea
                  className="input-field-language"
                  value={lyricsInput}
                  onChange={(e) => setLyricsInput(e.target.value)}
                  placeholder="Enter full lyrics as paragraphs, clean the text, add line breaks for new verses or chorus, avoid using special characters."
                />
              </div>
              <div className="convert-buttons-container">
                <input
                  type="file"
                  className="file-upload-input"
                  accept=".txt,.xml"
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  className="submit-button-add-lyrics"
                  onClick={handleConvertLyrics}
                >
                  Convert to Line by Line
                </button>
                <button
                  type="button"
                  className="submit-button-add-lyrics"
                  onClick={handleTranslateToEnglish}
                  disabled={!isConverted || loading} // Disable button if not converted or loading
                >
                  {loading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    "Translate to English"
                  )}
                </button>
              </div>
            </div>
            <div className="lyrics-section-container">
              <h2>Converted Lyrics</h2>
              <div className="lyrics-side-by-side-container">
                <div className="original-lines">
                  {lyricsLines.map((line, index) => (
                    <div key={index} className="chord-lyric-pair-container">
                      {addingChords && (
                        <>
                          <label className="input-label">
                            Chord Line {index + 1}:
                          </label>
                          <input
                            type="text"
                            className="input-field-add-lyrics"
                            value={chords[index] || ""}
                            onChange={(e) =>
                              handleChangeLyricsLine(
                                index,
                                "chord",
                                e.target.value
                              )
                            }
                            placeholder="Enter chord (optional)"
                          />
                        </>
                      )}
                      <label className="input-label">
                        Lyric Line {index + 1}:
                      </label>
                      <input
                        type="text"
                        className="input-field-add-lyrics"
                        value={line.lyric}
                        onChange={(e) =>
                          handleChangeLyricsLine(index, "lyric", e.target.value)
                        }
                        placeholder="Enter lyric line"
                      />
                    </div>
                  ))}
                </div>
                <div className="english-lines">
                  {translatedLyrics.map((line, index) => (
                    <div key={index} className="chord-lyric-pair-container">
                      <label className="input-label">
                        English Line {index + 1}:
                      </label>
                      <input
                        type="text"
                        className="input-field-add-lyrics"
                        value={line.lyric}
                        onChange={(e) =>
                          handleChangeLyricsLine(
                            index,
                            "lyric",
                            e.target.value,
                            true
                          )
                        }
                        placeholder="Enter lyric line"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-group-container">
              <label className="input-label">Link:</label>
              <input
                type="text"
                className="input-field-add-lyrics"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <div className="form-group-container">
              <label className="input-label">Views:</label>
              <input
                type="number"
                className="input-field-add-lyrics"
                value={views}
                onChange={(e) => setViews(parseInt(e.target.value))}
              />
            </div>
            <div className="form-group-container">
              <label className="input-label">Likes:</label>
              <input
                type="number"
                className="input-field-add-lyrics"
                value={likes}
                onChange={(e) => setLikes(parseInt(e.target.value))}
              />
            </div>
            <div className="form-group-container">
              <label className="input-label">Tags:</label>
              <div className="tags-container">
                {tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button
                      type="button"
                      className="remove-tag-button"
                      onClick={() => handleRemoveTag(index)}
                    >
                      x
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  className="input-field-add-lyrics"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  className="add-tag-button"
                  onClick={handleAddTag}
                >
                  Add Tag
                </button>
              </div>
            </div>
            <div className="form-group-container">
              <button type="submit" className="submit-button-add-lyrics">
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LyricsAddPage;
