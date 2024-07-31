import React from "react";
import "./AboutUs.css"; // Ensure you create and import a CSS file for styling
import { Colors } from "./colors";
import ScrollingText from "./scrollingText";

const AboutUs = () => {
  return (
    
    <div className="about-us-container">
      <div

      className="main-title"
      
      
      >What We Do
      
      </div>
      <div className="cards-container">
      
        <div className="about-card">
          <div className="icon">
            <img src="/images/mic.png" alt="Icon 1" />
          </div>
          <h2>WORSHIP LEADERS</h2>
          <p>
            We provide a platform to discover new songs that will inspire your congregation to actively
            engage and respond to the truth of the Gospel.
          </p>
          {/* <button>SIGN UP NOW</button> */}
        </div>
        <div className="about-card">
          <div className="icon">
            <img src="/images/piano.png" alt="Icon 2" />
          </div>
          <h2>MUSICIANS</h2>
          <p>
          We provide a platform to explore charts, lyrics, and other resources tailored to empower you
            to lead with confidence and develop your musicianship.
          </p>
        </div>
        <div className="about-card">
          <div className="icon">
            <img src="/images/crowd.png" alt="Icon 3" />
          </div>
          <h2>AUDIENCE</h2>
          <p>
          We provide a platform to help the audience find their favorite worship songs, learn about the stories behind the songs, get latest updates on worship artists and songs.
          </p>
        </div>
       
      </div>
     
    </div>
  );
};

export default AboutUs;
