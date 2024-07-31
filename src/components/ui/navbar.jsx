import React, { useState } from "react";
import MenuItem from "./menuItem";
import { Colors } from "./colors";
import "./navbar.css"; // Create and import a CSS file for styling
import { Link } from "react-router-dom";
const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`navbar ${isMobileMenuOpen ? 'expanded' : ''}`}>
      <Link to='/'> 
      <img
        src= "/images/logow.png"
        className="logo"
        alt="logo"
        style={{ width: "150px" }}
      />
       </Link>
      <button className="hamburger" onClick={toggleMobileMenu}>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>
      <nav className={isMobileMenuOpen ? "nav-links open" : "nav-links"}>
        <ul>
          <div>
            <li className="exit-icon" onClick={toggleMobileMenu}>
            ×
            </li>
          </div>
          <MenuItem name="NEWS" path= "/" />
          <MenuItem name="LYRICS" path= "/lyrics" />
          <MenuItem name="TUTORIALS" path= "/lyrics" />
          <MenuItem name="SONG STORIES" path= "/lyrics" />
          <MenuItem name="STORE" path= "/addlyrics" />
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
