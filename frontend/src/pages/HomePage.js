import React from "react";
import "../styles/home.css";
import { Navigate } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-container">

      <div className="hero-card">
        <h1>⚡ Smart Energy Analytics System</h1>

        <p>
          AI-powered Energy Consumption Analysis, Forecasting and Recommendation
          System for monitoring household electricity usage.
        </p>

        <div className="feature-grid">

          <div className="feature-card">
            📂
            <h3>Dataset Upload</h3>
            <p>Upload CSV datasets for energy analysis.</p>
          </div>

          <div className="feature-card">
            📊
            <h3>Overview</h3>
            <p>View statistics, trends and monthly insights.</p>
          </div>

          <div className="feature-card">
            📈
            <h3>Distribution</h3>
            <p>Analyze appliance-wise energy consumption.</p>
          </div>

          <div className="feature-card">
            🔮
            <h3>Forecasting</h3>
            <p>Predict future energy consumption using AI.</p>
          </div>

          <div className="feature-card">
            🤖
            <h3>Recommendations</h3>
            <p>Receive personalized energy saving suggestions.</p>
          </div>

          <div className="feature-card">
            ⚡
            <h3>Dashboard</h3>
            <p>Interactive visualization of all analytics.</p>
          </div>

        </div>
      </div>

      <footer className="footer">
        Smart Energy Analytics System © 2026 <br />
      </footer>

    </div>
  );
};

export default HomePage;