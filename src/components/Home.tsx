import React, { useEffect, useState } from "react";
import Hero from "./Hero";
import "./Home.css";

// SVG Icons Components
const LightningIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      stroke="#1c3f39"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#1c3f39"
    />
  </svg>
);

const ScaleIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 11C16 13.2091 14.2091 15 12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11Z"
      stroke="#1c3f39"
      strokeWidth="2"
    />
    <path d="M12 1V3" stroke="#1c3f39" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M12 21V23"
      stroke="#1c3f39"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4.22 4.22L5.64 5.64"
      stroke="#1c3f39"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M18.36 18.36L19.78 19.78"
      stroke="#1c3f39"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M1 12H3" stroke="#1c3f39" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M21 12H23"
      stroke="#1c3f39"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4.22 19.78L5.64 18.36"
      stroke="#1c3f39"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M18.36 5.64L19.78 4.22"
      stroke="#1c3f39"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const BriefcaseIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="7"
      width="20"
      height="14"
      rx="2"
      ry="2"
      stroke="#1c3f39"
      strokeWidth="2"
      fill="rgba(28, 63, 57, 0.1)"
    />
    <path
      d="M16 21V5a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2V21"
      stroke="#1c3f39"
      strokeWidth="2"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 22S8 18 8 12V7l4-2 4 2V12C16 18 12 22 12 22Z"
      stroke="#1c3f39"
      strokeWidth="2"
      fill="rgba(28, 63, 57, 0.1)"
    />
    <path
      d="M9 12L11 14L15 10"
      stroke="#1c3f39"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChartIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 3V21H21"
      stroke="#1c3f39"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 9L12 6L16 10L22 4"
      stroke="#1c3f39"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="9" r="2" fill="#1c3f39" />
    <circle cx="12" cy="6" r="2" fill="#1c3f39" />
    <circle cx="16" cy="10" r="2" fill="#1c3f39" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke="#1c3f39" strokeWidth="2" />
    <path d="M2 12H22" stroke="#1c3f39" strokeWidth="2" />
    <path
      d="M12 2A15.3 15.3 0 0 1 16 12A15.3 15.3 0 0 1 12 22A15.3 15.3 0 0 1 8 12A15.3 15.3 0 0 1 12 2Z"
      stroke="#1c3f39"
      strokeWidth="2"
    />
    <circle cx="12" cy="12" r="3" fill="rgba(28, 63, 57, 0.2)" />
  </svg>
);

const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToContent = () => {
    const contentSection = document.querySelector(".content-section");
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div
          className={`hero-section-wrapper ${isVisible ? "slide-in-hero" : ""}`}
        >
          <Hero />

          <div className="scroll-indicator" onClick={scrollToContent}>
            <span>Scroll to explore</span>
            <svg
              className="scroll-arrow"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 10l5 5 5-5"
                stroke="#1c3f39"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="content-section">
          <div className={`intro-content ${isVisible ? "slide-in-intro" : ""}`}>
            <h2 className="subtitle">Intelligent Dispute Resolution</h2>
            <p className="description">
              Resolve your eCommerce disputes instantly with our advanced
              AI-powered system. Get fair, impartial decisions for disputes
              under $1,000 USD in minutes, not months.
            </p>
          </div>

          <div className="features-grid">
            <div
              className={`feature-card ${isVisible ? "slide-in-card-1" : ""}`}
            >
              <div className="feature-icon">
                <LightningIcon />
              </div>
              <h3>Instant Resolution</h3>
              <p>
                Get AI-generated decisions with confidence scoring in real-time
              </p>
            </div>

            <div
              className={`feature-card ${isVisible ? "slide-in-card-2" : ""}`}
            >
              <div className="feature-icon">
                <ScaleIcon />
              </div>
              <h3>Impartial Analysis</h3>
              <p>
                GPT-4 powered decisions based on established legal rules and
                procedures
              </p>
            </div>

            <div
              className={`feature-card ${isVisible ? "slide-in-card-3" : ""}`}
            >
              <div className="feature-icon">
                <BriefcaseIcon />
              </div>
              <h3>eCommerce Focused</h3>
              <p>
                Specialized for contract, service, product, and delivery
                disputes
              </p>
            </div>

            <div
              className={`feature-card ${isVisible ? "slide-in-card-4" : ""}`}
            >
              <div className="feature-icon">
                <ShieldIcon />
              </div>
              <h3>Secure & Private</h3>
              <p>
                Your data is protected with enterprise-grade security measures
              </p>
            </div>

            <div
              className={`feature-card ${isVisible ? "slide-in-card-5" : ""}`}
            >
              <div className="feature-icon">
                <ChartIcon />
              </div>
              <h3>Confidence Scoring</h3>
              <p>
                Each decision includes a confidence score to help you understand
                the AI's certainty
              </p>
            </div>

            <div
              className={`feature-card ${isVisible ? "slide-in-card-6" : ""}`}
            >
              <div className="feature-icon">
                <GlobeIcon />
              </div>
              <h3>24/7 Availability</h3>
              <p>
                Submit and resolve disputes anytime, anywhere with our
                always-available AI system
              </p>
            </div>
          </div>

          <div className={`cta-section ${isVisible ? "slide-in-cta" : ""}`}>
            <p className="cta-text">Ready to resolve your dispute?</p>
            <p className="cta-subtext">
              Click above to get started with our AI dispute resolution process
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
