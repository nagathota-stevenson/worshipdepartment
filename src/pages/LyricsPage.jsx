import NavBar from "../components/ui/navbar";
import "./HomePage.css";
import "./LyricsPage.css";
import LyricsSearch from "../components/ui/lyricsSearch";
import Footer from "../components/ui/footer";

const LyricsPage = () => {
  return (
    <div className="lyrics-page">
      <NavBar />
      <LyricsSearch />
    </div>
  );
};

export default LyricsPage;
