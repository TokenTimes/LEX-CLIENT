import React from "react";
import Hero from "./Hero";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="hero-section-wrapper">
          <Hero />
        </div>

        <div className="content-section">
          <div className="intro-content">
            <h1 className="main-title">LEX - AI Judge™</h1>
            <h2 className="subtitle">Intelligent Dispute Resolution</h2>
            <p className="description">
              Resolve your eCommerce disputes instantly with our advanced
              AI-powered system. Get fair, impartial decisions for disputes
              under $1,000 USD in minutes, not months.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Resolution</h3>
              <p>
                Get AI-generated decisions with confidence scoring in real-time
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚖️</div>
              <h3>Impartial Analysis</h3>
              <p>
                GPT-4 powered decisions based on established legal rules and
                procedures
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>eCommerce Focused</h3>
              <p>
                Specialized for contract, service, product, and delivery
                disputes
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>
                Your data is protected with enterprise-grade security measures
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Confidence Scoring</h3>
              <p>
                Each decision includes a confidence score to help you understand
                the AI's certainty
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>24/7 Availability</h3>
              <p>
                Submit and resolve disputes anytime, anywhere with our
                always-available AI system
              </p>
            </div>
          </div>

          <div className="cta-section">
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
