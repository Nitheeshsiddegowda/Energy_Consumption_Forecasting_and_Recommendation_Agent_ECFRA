import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";
import { Navigate } from "react-router-dom";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [distribution, setDistribution] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const datasetId = localStorage.getItem("datasetId");

      const overviewRes = await axios.get(
        `http://127.0.0.1:8000/api/energy/datasets/${datasetId}/overview/`,
      );

      const distributionRes = await axios.get(
        `http://127.0.0.1:8000/api/energy/datasets/${datasetId}/distribution/`,
      );

      setOverview(overviewRes.data);

      setDistribution(distributionRes.data);

      const latestForecast = JSON.parse(
        localStorage.getItem("dashboardForecast"),
      );

      setForecast(latestForecast);
    } catch (err) {
      ;
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading Dashboard...</h2>;
  }

  if (!overview) {
    return (
      <div className="dashboard-container">
        <h2>No Dataset Uploaded</h2>
      </div>
    );
  }

  if (!localStorage.getItem("access")) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">⚡⚡ Smart Energy Analytics Dashboard</h1>

      <div className="cards-grid">
        <div className="summary-card blue">
          <h3>Total Records</h3>

          <h2>{overview.total_rows}</h2>
        </div>

        <div className="summary-card green">
          <h3>Total Energy</h3>

          <h2>{overview.total_energy} Units</h2>
        </div>

        <div className="summary-card orange">
          <h3>Average Units</h3>

          <h2>{overview.average_units} Units</h2>
        </div>

        <div className="summary-card teal">
          <h3>Average Bill</h3>

          <h2>₹ {overview.average_bill}</h2>
        </div>
      </div>
      <div className="chart-card">
        <h2>📈 Monthly Energy Consumption</h2>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={overview.monthly_chart}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="units"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="chart-card">
          <h2>📊 Dataset Insights</h2>

          <div className="cards-grid">
            <div className="summary-card blue">
              <h3>Highest Month</h3>
              <h2>{overview.highest_month.month}</h2>
              <p>{overview.highest_month.units} Units</p>
            </div>

            <div className="summary-card green">
              <h3>Lowest Month</h3>
              <h2>{overview.lowest_month.month}</h2>
              <p>{overview.lowest_month.units} Units</p>
            </div>

            <div className="summary-card orange">
              <h3>Average Temperature</h3>
              <h2>{overview.average_temperature} °C</h2>
            </div>

            <div className="summary-card teal">
              <h3>Missing Values</h3>
              <h2>{overview.missing_values}</h2>
            </div>
          </div>
        </div>
        <div className="chart-card">
          <h2>🏆 Appliance Consumption</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart layout="vertical" data={distribution.appliance_chart}>
              <XAxis type="number" />

              <YAxis type="category" dataKey="name" />

              <Tooltip />

              <Bar dataKey="units" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="chart-card">
        <h2>🤖 Top Recommendations</h2>

        {forecast.recommendations.slice(0, 3).map((item, index) => (
          <div key={index} className="recommendation-card">
            <h3>
              {item.icon} {item.title}
            </h3>

            <p>{item.message}</p>

            <p>
              ⚡ Save <b>{item.saving_units}</b> Units
            </p>

            <p>
              💰 Save <b>₹ {item.saving_bill}</b>
            </p>
          </div>
        ))}
        <div className="chart-card">
          <h2>🔮 Latest Forecast Summary</h2>

          <div className="cards-grid">
            <div className="summary-card blue">
              <h3>Forecast Month</h3>

              <h2>{months[forecast.month]}</h2>
            </div>

            <div className="summary-card green">
              <h3>Forecast Days</h3>

              <h2>{forecast.days}</h2>
            </div>

            <div className="summary-card orange">
              <h3>Predicted Units</h3>

              <h2>{forecast.total_units}</h2>
            </div>

            <div className="summary-card teal">
              <h3>Estimated Bill</h3>

              <h2>₹ {forecast.estimated_bill}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  <footer className="footer">Smart Energy Analytics System © 2026</footer>;
}

export default Dashboard;
