import React, { useState, useEffect } from "react";
import Card from "./card";
import "./card.css"; 
import "../../auth/firebaseConfig";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Colors } from "./colors";
import SkeletonLoader from "./skeletonLoader";

const Card1 = () => {
  const [storedValues, setStoredValues] = useState([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  const fetchDataFromFirestore = async () => {
    const querySnapshot = await getDocs(collection(db, "playlists"));
    const temporaryArr = [];
    querySnapshot.forEach((doc) => {
      temporaryArr.push(doc.data());
    });
    setStoredValues(temporaryArr);
    setLoading(false); // Set loading to false after data is fetched
  };

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  const link = storedValues[0]?.link;
  const description = storedValues[0]?.description;

  const descriptionContent = loading ? (
    <SkeletonLoader width="100%" height="10px" />
  ) : (
    description
  );

  const childComponent = (
    <iframe
      className="iframe"
      src="https://open.spotify.com/embed/playlist/5tnEoOluCatJCgWGuUk42I?utm_source=generator&theme=0"
      loading="lazy"
      title="Embedded Playlist"
    ></iframe>
  );

  return (
    <div >
      <Card
        heading="TRENDING PLAYLIST"
        subText={descriptionContent}
        backgroundImage="/images/bg2.png"
        childComponent={childComponent}
        headingIcon="/images/trend.png"
      />
    </div>
  );
};

export default Card1;
