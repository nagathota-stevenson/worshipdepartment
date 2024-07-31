import React, { useState, useEffect } from "react";
import Card from "./card"; // Assuming the Card component is in the same directory
import SkeletonLoader from "./skeletonLoader"; // Assuming SkeletonLoader is defined elsewhere
import "./card.css"; // Ensure you have Card.css for the styling
import "../../auth/firebaseConfig";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Colors } from "./colors";
import WorshipSet from "./worshipSetCard"; // Ensure you have the WorshipSetCard component

const Card2 = () => {
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

  const description = loading ? (
    <SkeletonLoader width="100%" height="10px" />
  ) : (
    storedValues[0]?.description
  );

  
  return (
    <div >
      <Card
        heading="MOST LIKED SETLIST"
        subText={description}
        headingIcon="/images/list.png"
        backgroundImage="/images/bg3.png"
        childComponent={<WorshipSet />}
      />
    </div>
  );
};

export default Card2;
