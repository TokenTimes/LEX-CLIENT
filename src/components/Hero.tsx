import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const handleHeroClick = () => {
    navigate("/dispute");
  };

  return (
    <section className="hero-section" onClick={handleHeroClick}>
      <div className="hero-content">
        <div className="hero-graphic">
          <img
            src="/HEROS.png"
            alt="AI Dispute Resolution"
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
