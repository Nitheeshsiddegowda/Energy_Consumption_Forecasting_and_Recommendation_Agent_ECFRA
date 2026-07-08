import React, { useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ForecastingPage() {
  const [month, setMonth] = useState(1);
  const [days, setDays] = useState(7);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleForecast = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/forecast/seasonal/",
        { month, days }
      );
      setForecast(response.data);
    } catch (error) {
      console.log(error);
      alert("Forecast generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const highestAppliance = forecast
    ? forecast.appliances.reduce((max, item) => (item.units > max.units ? item : max))
    : null;

  const lowestAppliance = forecast
    ? forecast.appliances.reduce((min, item) => (item.units < min.units ? item : min))
    : null;

  return (
    <div className="dashboard-container"  style={{paddingTop:"60px"}}>
      <h1 className="dashboard-title">Energy Consumption Forecast</h1>

      <div className="top-controls">
        <div className="control-group">
          <label>Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            <option value={1}>January</option>
            <option value={2}>February</option>
            <option value={3}>March</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
          </select>
        </div>

        <div className="control-group">
          <label>Forecast Period</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={7}>7 Days</option>
            <option value={15}>15 Days</option>
            <option value={30}>30 Days</option>
          </select>
        </div>

        <button className="generate-btn" onClick={handleForecast}>
          {loading ? "Generating..." : "Generate Forecast"}
        </button>
      </div>

      {forecast && (
        <div className="forecast-results" style={{ marginTop: "30px" }}>
          
          {/* Dashboard Summary Grid Using Your CSS Classes */}
          <div className="cards-grid">
            <div className="summary-card blue">
              <h3>Total Energy</h3>
              <h2>{forecast.total_units}</h2>
              <p>Units</p>
            </div>

            <div className="summary-card green">
              <h3>Estimated Bill</h3>
              <h2>₹{forecast.estimated_bill}</h2>
            </div>

            <div className="summary-card orange">
              <h3>Highest Consumer</h3>
              <h2>{highestAppliance?.name}</h2>
              <p>{highestAppliance?.units} Units</p>
            </div>

            <div className="summary-card teal">
              <h3>Lowest Consumer</h3>
              <h2>{lowestAppliance?.name}</h2>
              <p>{lowestAppliance?.units} Units</p>
            </div>
          </div>

          <h2 style={{ marginTop: "40px" }}>Forecast Summary</h2>

          {/* Chart Section */}
          <div className="chart-card">
            <h3>Appliance-wise Energy Consumption</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={forecast.appliances}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="units" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}
    </div>
  );
}

export default ForecastingPage;