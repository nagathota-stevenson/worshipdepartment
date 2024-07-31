import "./videos.css"; // Ensure you create and import a CSS file for styling
import { Colors } from "./colors";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import "../../auth/firebaseConfig";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState("");
  const db = getFirestore();
  const [titles, setTitles] = useState([]);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  useEffect(() => {
    const fetchVideos = async () => {
      const q = query(collection(db, 'trendingVideos'), where('trending', '==', 1));
      const querySnapshot = await getDocs(q);

      const videoLinks = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.link) {
          videoLinks.push(...data.link);
        }
      });

      if (videoLinks.length > 0) {
        setVideos(videoLinks);
        setCurrentVideo(extractVideoId(videoLinks[0]));
        console.log(videoLinks[0]); 
      } else {
        console.log("No videos list with trending 1 found!");
      }
    };

    fetchVideos();
  }, []);

  const [videoDetails, setVideoDetails] = useState([]);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (videos.length === 0) return;

      const apiKey = 'AIzaSyAyF6vBKg6KstPn8plfO3n3DGxuSiZ11cc';
      const videoIds = videos.map(url => extractVideoId(url)).join(',');

      try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds}&key=${apiKey}`);
        const data = await response.json();
        console.log(data.items);
        setVideoDetails(data.items);

        const fetchedTitles = data.items.map(item => item.snippet.title);
        setTitles(fetchedTitles);
      } catch (error) {
        console.error('Error fetching video details:', error);
      }
    };

    fetchVideoDetails();
  }, [videos]);

  const extractVideoId = (url) => {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    }
    return null;
  };

  const handleThumbnailClick = (videoUrl) => {
    setCurrentVideo(extractVideoId(videoUrl));
  };


  
  return (
    <div>
      <h1
        style={{
          fontFamily: "Nohemi Medium",
          fontSize: "60px",
          paddingTop: "50px",
          color: Colors.white,
          backgroundColor: Colors.black,
          textAlign: "center",
        }}
      >
        Videos
      </h1>

      <div className="iframe-container">
        <iframe
          className= { !isMobile ? "iframe-videos" : "iframe-mobile" }
         style=   {{
            height: isMobile ? "40vh" : "80vh"
          }} 
       
          src={`https://www.youtube.com/embed/${currentVideo}`}
          title="YouTube Video Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
        ></iframe>
        <div className="thumbnails-container">
          {videos.map((videoUrl, index) => (
            <div key={index} className="thumbnail-container">
              <img
                className="thumbnail"
                src={`https://img.youtube.com/vi/${extractVideoId(videoUrl)}/maxresdefault.jpg`}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => handleThumbnailClick(videoUrl)}
              />
              <p className="video-title">
                {titles[index] || 'No title available'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Videos;
