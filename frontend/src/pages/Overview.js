import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/style.css";
import { Navigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Overview() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const datasetId = localStorage.getItem("datasetId");

      const response = await axios.get(
        `http://127.0.0.1:8000/api/energy/datasets/${datasetId}/overview/`,
      );

      setOverview(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!overview) {
    return <h2>Loading...</h2>;
  }
  if (!localStorage.getItem("access")) {
  return <Navigate to="/login" replace />;
}
  return (
    <div className="page-container">
      {/* Sidebar */}
      {/* <nav className="sidebar">
        <ul>
          <li>
            <a href="/dataset">Dataset Upload</a>
          </li>
          <li>
            <a href="/overview" className="active">
              Overview
            </a>
          </li>
          <li>
            <a href="/distribution">Distribution</a>
          </li>
          <li>
            <a href="/forecasting">Forecasting</a>
          </li>
          <li>
            <a href="/recommendation">Recommendation</a>
          </li>
          <li>
            <a href="/prediction">Prediction</a>
          </li>
        </ul>
      </nav> */}

      {/* Main Content */}
      <main className="overview-main">
        <h2 className="overview-title">📊 Energy Consumption Overview</h2>

        {/* Summary Cards */}
        <div className="summary-container">
          <div className="card">
            <h3>Average per Day</h3>
            <p>{overview.average_units} kWh/day</p>
          </div>
          <div className="card">
            <h3>Total Records</h3>
            <p>{overview.total_rows}</p>
          </div>
          <div className="card info">
            <h3>Highest Consumption Month</h3>
            <p>
              {overview.highest_month.month} ({overview.highest_month.units}{" "}
              kWh)
            </p>
          </div>
          <div className="card info">
            <h3>Lowest Consumption Month</h3>
            <p>
              {overview.lowest_month.month} ({overview.lowest_month.units} kWh)
            </p>
          </div>
          <div className="card highlight">
            <h3>Total Energy</h3>
            <p>{overview.total_energy} kWh</p>
          </div>
        </div>

        {/* Daily Line Chart */}
        <div className="chart-section">
          <h3>📈 Daily Energy Usage Trend</h3>
          {overview.daily_chart.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={overview.daily_chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  label={{
                    value: "Units (kWh)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="units"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No daily chart data available</p>
          )}
        </div>

        {/* Monthly Line Chart */}
        <div className="chart-section">
          <h3>📅 Monthly Energy Usage Trend</h3>
          {overview.monthly_chart.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={overview.monthly_chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  label={{
                    value: "Units (kWh)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="units"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No monthly chart data available</p>
          )}
        </div>
      </main>
    </div>
  );
  <footer className="footer">Smart Energy Analytics System © 2026</footer>;
}

export default Overview;
