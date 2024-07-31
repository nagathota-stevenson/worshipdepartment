
import './App.css';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LyricsPage from './pages/LyricsPage';
import LyricsDisplayPage from './pages/LyricsDisplayPage';
import LyricsAddPage from './pages/LyricsAddPage';
import SongsByCategory from './pages/SongsByCategory';




function App() {
  return (
    
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/lyrics' element={<LyricsPage />} />
        <Route path="/lyrics/:id" element={<LyricsDisplayPage />} />
        <Route path="/addlyrics" element={<LyricsAddPage />} />
        <Route path="/lyrics/category/:category" element={<SongsByCategory />} />
      </Routes>
  
    </Router>
  );
}

export default App;
