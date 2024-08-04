
import './App.css';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LyricsPage from './pages/LyricsPage';
import LyricsDisplayPage from './pages/LyricsDisplayPage';
import LyricsAddPage from './pages/LyricsAddPage';
import SongsByCategory from './pages/SongsByCategory';
import ArtistsPage from './pages/ArtistsPage';
import AllArtistsPage from './pages/AllArtistsPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './AuthContext';


function App() {
  return (
    <AuthProvider>
      <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/songs' element={<LyricsPage />} />
        <Route path="/songs/:id" element={<LyricsDisplayPage />} />
        <Route path="/artists/:artistId" element={<ArtistsPage />} />
        <Route path="/artists" element={<AllArtistsPage />} />
        <Route path="/addlyrics" element={<LyricsAddPage />} />
        <Route path="/login" element={<LoginPage  signUp={false}/>} />
        <Route path="/signup" element={<LoginPage signUp={true}/>} />
        <Route path="/songs/category/:category" element={<SongsByCategory />} />
      </Routes>
  
    </Router>
    </AuthProvider>
    
  );
}

export default App;
