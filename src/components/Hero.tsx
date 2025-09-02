import React from "react";
import "./Hero.css";

const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-graphic">
          <img
            src="/Hero.png"
            alt="AI Dispute Resolution"
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
