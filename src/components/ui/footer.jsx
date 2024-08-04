import React, { useEffect, useState } from "react";
import "./footer.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Footer = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handlePostLyricsClick = () => {
    if (user) {
      navigate("/addlyrics");
    } else {
      navigate("/login", { state: { from: "/addlyrics" } });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img
            src="/images/logotextonly.png"
            alt="Worship Department Logo"
            className="logo"
          />
        </div>
        <div className="footer-social">
          <a
            href="https://www.youtube.com/@WorshipDepartmentIndia"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/ytw.png" alt="YouTube" />
          </a>
          <a
            href="https://www.instagram.com/worshipdepartmentindia"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/igw.png" alt="Instagram" />
          </a>
          <a href="" target="_blank" rel="noopener noreferrer">
            <img src="/images/fbw.png" alt="Email" />
          </a>
          <a
            href="https://wa.me/15672945648"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/whatsappw.png" alt="Whatsapp" />
          </a>
        </div>
        <div className="footer-links">
          <button onClick={handlePostLyricsClick} className="footer-link">
            Post Lyrics
          </button>
          <a href="/privacy-policy" className="footer-link">
            Privacy Policy
          </a>
          <a href="/terms-conditions" className="footer-link">
            Terms & Conditions
          </a>
          {user ? (
            <button onClick={handleLogout} className="footer-link logout-button">
              Logout
            </button>
          ) : (
            <Link to="/login" className="footer-link">
              Login
            </Link>
          )}
        </div>
        <div className="footer-copyright">
          <p>© 2024 WorshipDepartment.in</p>
          <p>All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
