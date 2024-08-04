import React, { useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoginPage.css";
import NavBar from "../components/ui/navbar";


const LoginPage = ({ signUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(signUp ? true : false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();


  useEffect(() => {
    // Simulate a loading process before rendering the page
    setTimeout(() => {
      setInitialLoading(false);
    }, 1000); // Set loading duration as needed
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMessage("Logged in successfully!");
      navigate(from); // Redirect to the original page or home page
    } catch (error) {
      setErrorMessage("Failed to log in. Please check your credentials.");
    }

    setLoading(false);
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (createPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (createPassword !== reenterPassword) {
      setErrorMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, createPassword);
      setSuccessMessage("Signed up successfully!");
      navigate(from); 
    } catch (error) {
      setErrorMessage("Failed to sign up. Please try again.");
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate(from); // Redirect to the original page or home page
    } catch (error) {
      setErrorMessage("Failed to log in with Google. Please try again.");
    }
  };



  if (initialLoading) {
    return (
      <div className="loading-container">
         <NavBar />
        <div className="loading-lyrics-display-page">
          <div className="logo-loading">
            <img src="/images/logo512.png" className="logo" alt="logo" style={{ width: "150px" }} />
            <p className="song-artist-lyrics-display">Loading...</p>
          </div>
        </div>
        
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="login-page-container"
      
      style={{
        // backgroundImage: "url('/images/bg2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}

      >
        <div className="left-side">
          <img src="/images/logotextonlyb.png" alt="My Logo" className="logo" />
          <p className="welcome-text">
            {isSignUp
              ? "Sign up to add lyrics, news, setlists, like, receive updates, and the latest news."
              : "Login to add lyrics, news, setlists, like, receive updates, and the latest news."}
          </p>
        </div>
        <div className="right-side">
          <div className="login-card">
            <h1 className="page-heading">{isSignUp ? "Sign Up" : "Login"}</h1>
            
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner">Loading...</div>
              </div>
            ) : (
              <form
                onSubmit={isSignUp ? handleEmailSignUp : handleEmailLogin}
                className="login-form-container"
              >
                <div className="form-group-container">
                  <label htmlFor="email" className="input-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                {isSignUp ? (
                  <>
                    <div className="form-group-container">
                      <label htmlFor="create-password" className="input-label">
                        Create Password
                      </label>
                      <input
                        type="password"
                        id="create-password"
                        value={createPassword}
                        onChange={(e) => setCreatePassword(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="form-group-container">
                      <label htmlFor="reenter-password" className="input-label">
                        Re-enter Password
                      </label>
                      <input
                        type="password"
                        id="reenter-password"
                        value={reenterPassword}
                        onChange={(e) => setReenterPassword(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div className="form-group-container">
                    <label htmlFor="password" className="input-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                )}
                {errorMessage && (
              <div className="error-message"
              style={{
                paddingBottom: "20px",
                textAlign: 'left',
                fontSize: '14px',
                fontFamily: 'Nohemi Light',
                color: '#ff2d2d'
              }}
              
              >{errorMessage}</div>
            )}
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
                <button type="submit" className="submit-button">
                  {isSignUp ? "Sign Up" : "Login"}
                </button>
              </form>
            )}
            <div className="alternative-login">
              <button className="auth-button" onClick={handleGoogleLogin}>
                <div className="auth-button-content">
                  <img
                    src="/images/google.png"
                    alt="Google logo"
                    className="auth-logo"
                  />
                  {isSignUp ? "Sign up with Google" : "Login with Google"}
                </div>
              </button>
            </div>
            
            <div className="sign-up-container">
              <p>{isSignUp ? "Already have an account?" : "Don't have an account?"}</p>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="sign-up-link"
              >
                {isSignUp ? "Login here" : "Sign up here"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
