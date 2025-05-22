import React from "react";
import image from "../images/aboutimg.jpg";
import "../styles/about.css";

const AboutUs = () => {
  return (
    <section className="container">
      <h2 className="page-heading about-heading">About Us</h2>
      <div className="about">
        <div className="hero-img">
          <img src={image} alt="hero" />
        </div>
        <div className="hero-content">
          <p>
            This is the About Us page. Welcome! 👋
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
