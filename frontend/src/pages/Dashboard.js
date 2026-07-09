import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("dashboardForecast");

    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  if (!data) {
    return (
      <div className="dashboard-container">
        <h2>⚡ Energy Dashboard</h2>
        <p>No forecast generated yet.</p>
        <p>Please generate a forecast first.</p>
      </div>
    );
  }

  const highest = data.appliances.reduce((a, b) => (a.units > b.units ? a : b));

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">⚡ Energy Consumption Dashboard</h1>

      <div className="cards-grid">
        <div className="summary-card blue">
          <h3>Total Units</h3>
          <h2>{data.total_units}</h2>
        </div>

        <div className="summary-card green">
          <h3>Estimated Bill</h3>
          <h2>₹ {data.estimated_bill}</h2>
        </div>

        <div className="summary-card orange">
          <h3>Recommendations</h3>
          <h2>{data.recommendations.length}</h2>
        </div>

        <div className="summary-card teal">
          <h3>Highest Consumer</h3>
          <h2>{highest.name}</h2>
        </div>
      </div>
      <div className="chart-card">
        <h2>📈 Forecast Trend</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.forecast}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

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
      </div>
      <div className="chart-card">
        <h2>🤖 Top Recommendations</h2>

        {data.recommendations.map((item, index) => (
          <div
            key={index}
            style={{
              marginTop: "15px",
              padding: "15px",
              borderRadius: "10px",
              background: "#f5f5f5",
            }}
          >
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
          <h2>📅 Last Forecast</h2>

          <div className="cards-grid">
            <div className="summary-card blue">
              <h3>Forecast Month</h3>

              <h2>{data.month}</h2>
            </div>

            <div className="summary-card green">
              <h3>Forecast Period</h3>

              <h2>{data.days} Days</h2>
            </div>

            <div className="summary-card orange">
              <h3>Daily Average</h3>

              <h2>{data.daily_units} Units</h2>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h2>📊 Appliance Summary</h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#2563eb",
                  color: "white",
                }}
              >
                <th style={{ padding: "12px" }}>Appliance</th>

                <th style={{ padding: "12px" }}>Units</th>
              </tr>
            </thead>

            <tbody>
              {data.appliances.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <td style={{ padding: "10px" }}>{item.name}</td>

                  <td style={{ padding: "10px" }}>{item.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
