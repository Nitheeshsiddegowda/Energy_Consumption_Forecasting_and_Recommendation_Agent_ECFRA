import React, { useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";
import { Navigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function ForecastingPage() {
  const [month, setMonth] = useState(1);
  const [days, setDays] = useState(7);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lineChartData, setLineChartData] = useState([]);

  const handleForecast = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/forecast/seasonal/",
        { month, days },
      );

      console.log(response.data);

      setForecast(response.data);
      localStorage.setItem("dashboardForecast", JSON.stringify(response.data));
      const chart = [];

      // Historical data (Red)
      response.data.historical.forEach((item) => {
        chart.push({
          date: item.date,
          Actual: item.units,
          Predicted: null,
        });
      });

      // Forecast data (Green)
      response.data.forecast.forEach((item) => {
        chart.push({
          date: item.date,
          Actual: null,
          Predicted: item.units,
        });
      });

      setLineChartData(chart);
    } catch (error) {
      console.log(error);
      alert("Forecast generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const highestAppliance = forecast
    ? forecast.appliances.reduce((max, item) =>
        item.units > max.units ? item : max,
      )
    : null;

  const lowestAppliance = forecast
    ? forecast.appliances.reduce((min, item) =>
        item.units < min.units ? item : min,
      )
    : null;

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
  ];
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
        return "#ef4444";
      case "Medium":
        return "#f59e0b";
      default:
        return "#22c55e";
    }
  };
  if (!localStorage.getItem("access")) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-container" style={{ paddingTop: "60px" }}>
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
            <h3>Historical vs Forecast Energy Consumption</h3>

            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={lineChartData}>
                <ReferenceLine
                  x={forecast.historical[forecast.historical.length - 1]?.date}
                  stroke="#000"
                  strokeDasharray="5 5"
                  label={{
                    value: "Forecast Starts",
                    position: "top",
                  }}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} Units`, "Consumption"]}
                />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="Actual"
                  stroke="#ef4444"
                  strokeWidth={4}
                  dot={false}
                  name="Historical"
                />

                <Line
                  type="monotone"
                  dataKey="Predicted"
                  stroke="#22c55e"
                  strokeWidth={4}
                  dot={false}
                  name="Forecast"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
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
            {/* ================= Recommendations ================= */}

            {forecast?.recommendations?.length > 0 && (
              <div
                style={{
                  marginTop: "40px",
                }}
              >
                <h2
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  🤖 AI Recommendations
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
                    gap: "20px",
                  }}
                >
                  {forecast.recommendations.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        background: "#ffffff",

                        padding: "20px",

                        borderRadius: "12px",

                        boxShadow: "0 5px 15px rgba(0,0,0,.12)",

                        borderLeft:`6px solid ${getSeverityColor(item.severity)}`,
                      }}
                    >
                      <h3>
                        {item.icon} {item.title}
                      </h3>

                      <p
                        style={{
                          marginTop: "10px",

                          lineHeight: "1.7",
                        }}
                      >
                        {item.message}
                      </p>

                      <hr />

                      <h4>Estimated Saving</h4>

                      <p>⚡ Energy : {item.saving_units} Units</p>

                      <p>💰 Cost : ₹{item.saving_bill}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <h3 style={{ marginTop: "40px", marginBottom: "20px" }}>
              Appliance Contribution
            </h3>

            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={forecast.appliances}
                  dataKey="units"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {forecast.appliances.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-card">
              <h2>🤖 AI Energy Recommendation</h2>

              <div style={{ marginTop: "20px", lineHeight: "1.9" }}>
                <p>
                  <strong>Forecast Month:</strong> {month}
                </p>

                <p>
                  <strong>Estimated Consumption:</strong>
                  {forecast.total_units} Units
                </p>

                <p>
                  <strong>Estimated Bill:</strong>₹{forecast.estimated_bill}
                </p>

                <p>
                  <strong>Highest Consumer:</strong>

                  {highestAppliance.name}
                </p>

                <hr style={{ margin: "15px 0" }} />

                <h3>Recommendation</h3>

                <ul>
                  <li>Use Eco Mode for {highestAppliance.name}.</li>

                  <li>Turn OFF appliances when not in use.</li>

                  <li>Avoid peak-hour electricity usage.</li>

                  <li>Regular maintenance can reduce energy usage.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  <footer className="footer">Smart Energy Analytics System © 2026</footer>;
}


export default ForecastingPage;
