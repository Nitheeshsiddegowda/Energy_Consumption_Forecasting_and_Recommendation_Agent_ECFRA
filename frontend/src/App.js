import "./styles/App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import ForecastingPage from "./pages/ForecastingPage";
import DistributionPage from "./pages/DistributionPage";
import Overview from "./pages/Overview";
import Dataset from "./pages/Dataset";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

function Layout() {
  const location = useLocation();

  const hideSidebar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="app">
      {!hideSidebar && <Sidebar />}

      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/dataset" element={<ProtectedRoute>
                <Dataset />
              </ProtectedRoute>} />

          <Route path="/overview" element={<ProtectedRoute>
                <Overview />
              </ProtectedRoute>} />

          <Route path="/distribution" element={<ProtectedRoute>
                <DistributionPage />
              </ProtectedRoute>} />

          <Route path="/forecasting" element={<ProtectedRoute>
                <ForecastingPage />
              </ProtectedRoute>} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
