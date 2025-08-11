import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Test_School</h1>
          <p>Your gateway to smart, engaging, and effective learning.</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn primary-btn">
              Get Started
            </Link>
            <Link to="/login" className="btn secondary-btn">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>📚 Quality Content</h3>
            <p>Expertly curated questions to boost your knowledge and skills.</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Fast & Responsive</h3>
            <p>Enjoy a seamless experience across devices, anytime, anywhere.</p>
          </div>
          <div className="feature-card">
            <h3>📈 Track Progress</h3>
            <p>Monitor your performance with detailed analytics.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
