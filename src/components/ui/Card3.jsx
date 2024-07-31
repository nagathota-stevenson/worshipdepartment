import React, { useState, useEffect } from "react";
import Card from "./card"; // Assuming the Card component is in the same directory
import SkeletonLoader from "./skeletonLoader"; // Assuming SkeletonLoader is defined elsewhere
import "./card.css"; // Ensure you have Card.css for the styling
import "../../auth/firebaseConfig";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { Colors } from "./colors";

const Card3 = () => {
  const [storedValues, setStoredValues] = useState([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  const fetchDataFromFirestore = async () => {
    try {
      // Create a query to fetch documents where showOnHome is true
      const q = query(collection(db, "trendingNews"), where("showOnHome", "==", true));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const temporaryArr = [];
        querySnapshot.forEach((doc) => {
          temporaryArr.push(doc.data());
        });
        setStoredValues(temporaryArr);
        console.log(temporaryArr);
      } else {
        // Handle the case where no documents are found
        console.log("No documents found with showOnHome set to true.");
      }
    } catch (error) {
      // Handle errors (e.g., network issues, permission issues)
      console.error("Error fetching documents: ", error);
    } finally {
      setLoading(false); // Set loading to false after data fetch attempt
    }
  };

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  const description = loading ? (
    <SkeletonLoader width="100%" height="10px" />
  ) : (
    storedValues[0]?.description
  );

  const youtubeId = storedValues[0]?.youtubeId;
  const title = storedValues[0]?.title;

  const childComponent = loading ? (
    <SkeletonLoader width="40vw" height="55vh" />
  ) : (
    <iframe
      className="iframe"
      src={`https://www.youtube.com/embed/${youtubeId}`}
      title={title}
     
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
    ></iframe>
  );

  return (
    <div>
      <Card
        heading="WHAT'S NEW?"
        subText={description}
        headingIcon="/images/news.png"
        backgroundImage="/images/bg4.png"
        childComponent={childComponent}
      />
    </div>
  );
};

export default Card3;
