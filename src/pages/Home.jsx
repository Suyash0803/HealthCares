import React, { useEffect } from "react";

// ✅ Your components
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import HomeCircles from "../components/HomeCircles";
import Contact from "../components/Contact";

// ✅ Import the CSS only
import "../styles/background.css";

const Home = () => {
  // ✅ Optional: Debug if page mounted properly
  useEffect(() => {
    console.log("Home component mounted");
  }, []);

  return (
    <>
      {/* ✅ Background Video */}
      <video
        className="video-background"
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => console.log("✅ Video is ready to play")}
        onError={(e) => {
          console.error("❌ Video failed to load", e);
          alert("Video failed to load. Check file path or type.");
        }}
      >
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* ✅ Overlay content */}
      <Navbar />
      <Hero />
      <AboutUs />
      <HomeCircles />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;
