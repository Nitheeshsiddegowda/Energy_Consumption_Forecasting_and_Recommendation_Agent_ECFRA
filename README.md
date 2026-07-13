⚡ Energy Consumption Forecasting and Recommendation Agent

An AI-powered web application that analyzes household electricity consumption, forecasts future energy usage using Machine Learning, 
estimates electricity bills, and provides personalized energy-saving recommendations through interactive visualizations.

Project Overview

The Energy Consumption Forecasting and Recommendation Agent helps users understand historical electricity usage, 
analyze appliance-wise consumption, forecast future energy demand, and optimize energy utilization through intelligent recommendations.
The application combines a React frontend, Django REST Framework backend, SQLite database, and an XGBoost machine learning model to provide
accurate predictions and data-driven insights.

Features

- User Registration & Login (JWT Authentication)
- Upload Household Energy Consumption Dataset (CSV)
- Dataset Preview
- Energy Consumption Overview
- Daily & Monthly Trend Analysis
- Appliance-wise Energy Distribution
- Energy Consumption Forecasting using XGBoost
- Electricity Bill Estimation
- Personalized Energy Saving Recommendations
- Interactive Dashboard
- Responsive User Interface

System Architecture

React Frontend
        │
        ▼
JWT Authentication
        │
        ▼
Django REST Framework APIs
        │
 ┌──────┴───────────┐
 ▼                  ▼
SQLite Database   XGBoost ML Model
        │
        ▼
Forecast + Recommendation Engine
        │
        ▼
Dashboard & Visualizations

Technology Stack

Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Axios
- Recharts
- Chart.js

Backend
- Python
- Django
- Django REST Framework
- JWT Authentication

Machine Learning
- XGBoost
- Scikit-learn
- Pandas
- NumPy

Database
- SQLite

Version Control
- Git
- GitHub

Project Structure

Energy Consumption Forecasting and Recommendation Agent

├── frontend/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── App.js
│
├── backend/
│   ├── accounts/
│   ├── energy/
│   ├── media/
│   ├── db.sqlite3
│   └── manage.py

Workflow

1. User Registration/Login
2. Upload CSV Dataset
3. Dataset Preview
4. Energy Consumption Overview
5. Appliance-wise Distribution Analysis
6. Forecast Future Energy Consumption
7. Estimate Electricity Bill
8. Generate Personalized Recommendations
9. View Complete Dashboard

Machine Learning

The forecasting module is implemented using the XGBoost Regression algorithm.
The model predicts future household electricity consumption based on historical energy usage and appliance-level features.

Input Features
- Temperature
- Humidity
- Fan Units
- AC Units
- TV Units
- Fridge Units
- Bulb Units
- Monitor Units
- Motor Units

Target Variable
- Total Energy Consumption (Units)

Visualizations

- Daily Energy Consumption Trend
- Monthly Energy Consumption Trend
- Appliance-wise Distribution
- Forecast Graph
- Dashboard Summary
- Recommendation Cards

Authentication

The application uses JWT Authentication for secure user login and protected API access.

Future Enhancements

- Real-time Smart Meter Integration
- IoT Device Support
- Deep Learning-based Forecasting
- Cloud Deployment
- Mobile Application
- Email & SMS Notifications
- User-specific Energy Analytics
