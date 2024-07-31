import NavBar from "../components/ui/navbar";
import ScrollingText from "../components/ui/scrollingText";
import "./HomePage.css";
import AboutUs from "../components/ui/aboutUs";
import Videos from "../components/ui/videos";
import Songs from "../components/ui/songs";
import Footer from "../components/ui/footer";
import Carousel from "../components/ui/carousel";


const HomePage = () => {
  return (
    <div className="home-page">
      <NavBar />

      <Carousel />
      <AboutUs />
      
      <ScrollingText />
      <Videos />
      <Songs />
      <Footer />
    </div>
  );
};

export default HomePage;
