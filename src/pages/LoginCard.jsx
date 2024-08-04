import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import "./LoginCard.css";
import { Link } from "react-router-dom";

const LoginCard = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose(); // Close the card on successful login
    } catch (error) {
      setLoginError("Failed to log in. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, googleProvider);
      onClose(); // Close the card on successful login
    } catch (error) {
      setLoginError("Failed to log in with Google. Please try again.");
    }
  };

  return (
    <div className="login-card-overlay-custom">
      <div className="login-card-custom">
        <button onClick={onClose} className="login-card-close-button-custom">
          &#10005;
        </button>
        <img
          src="/images/logo512.png"
          style={{
            width: "100px",
            height: "100px",
          }}
          alt="Logo"
        />
        <h2
          style={{
            alignItems: "center",
          }}
        >
          Login Required
        </h2>
        <p
          style={{
            fontFamily: "Nohemi Light",
            fontSize: "14px",
          }}
        >
          You need to be logged in to perform this action.
        </p>
        <Link to="/login">
          <button
            className="login-button-custom"
            style={{
              padding: "10px 60px",
            }}
          >
            Login
          </button>
        </Link>
        <div className="sign-up-prompt">
          <p
          
          style={{ fontSize: '14px'}}
          
          >
            Don't have an account?{" "}
            <Link to="/signup" className="sign-up-link"
            
            >
              Sign up now!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
