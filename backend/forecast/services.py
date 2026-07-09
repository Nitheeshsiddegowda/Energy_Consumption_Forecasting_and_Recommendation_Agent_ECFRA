import pandas as pd
import joblib
from datetime import timedelta

def generate_forecast(df, month, days):
    # Filter dataset for selected month
    monthly_df = df[df["Month"] == month]
    
    # Shuffle month records so forecast isn't always identical
    monthly_df = (
        monthly_df
        .sample(frac=1, random_state=42)
        .reset_index(drop=True)
    )
    historical_df = (
        df[df["Month"] == month]
        .sort_values("Date")
        .tail(30)
    )
    prediction_df = (
        monthly_df
        .sample(frac=1, random_state=42)
        .reset_index(drop=True)
    )

    if monthly_df.empty:
        raise Exception("No data available for selected month.")

    # Load trained XGBoost model
    model = joblib.load("forecast/xgboost.pkl")
    
    # FIX: "historical_df" was undefined here. We use the main "df" or "monthly_df" 
    # to extract the last valid date context. Assuming "df" has chronological dates.
    last_date = pd.to_datetime(df.iloc[-1]["Date"])
    
    forecast = []
    total_units = 0

    # Explicit list of feature names to guarantee column order for XGBoost
    feature_columns = [
        "Temperature", "Fan", "Refrigerator", "AirConditioner", 
        "Bulb", "Television", "Monitor", "MotorPump", 
        "Month", "Extra", "TariffRate"
    ]

    for i in range(days):
        row = monthly_df.iloc[i % len(monthly_df)]
        prediction_df.iloc[i % len(prediction_df)]

        features_dict = {
            "Temperature": row["Temperature"],
            "Fan": row["Fan"],
            "Refrigerator": row["Refrigerator"],
            "AirConditioner": row["AirConditioner"],
            "Bulb": row["Bulb"],
            "Television": row["Television"],
            "Monitor": row["Monitor"],
            "MotorPump": row["MotorPump"],
            "Month": month,
            "Extra": row["Extra"],
            "TariffRate": row["TariffRate"]
        }
        
        # Create DataFrame and ensure precise column order matching model expectations
        features = pd.DataFrame([features_dict])[feature_columns]

        prediction = float(model.predict(features)[0])
        total_units += prediction

        # FIX: Cleaned up the broken syntax loop entirely
        future_date = last_date + timedelta(days=i + 1)
        forecast.append({
            "date": future_date.strftime("%Y-%m-%d"),
            "units": round(prediction, 2)
        })

    total_units = round(total_units, 2)
    daily_units = round(total_units / days, 2)

    # Appliance-wise forecast
    appliances = [
        ("Fan", "Fan(Units)"),
        ("Refrigerator", "Fridge(Units)"),
        ("AirConditioner", "AC(Units)"),
        ("Bulb", "Bulb(Units)"),
        ("Television", "TV(Units)"),
        ("Monitor", "Monitor(Units)"),
        ("MotorPump", "Motor(Units)")
    ]

    appliance_forecast = []
    for name, column in appliances:
        units = round(monthly_df[column].mean() * days, 2)
        appliance_forecast.append({
            "name": name,
            "units": units
        })

    tariff_rate = monthly_df["TariffRate"].mean()
    estimated_bill = round(total_units * tariff_rate, 2)

    # -------------------------------
    # Historical Data (Last 30 Records)
    # -------------------------------
    historical_df = monthly_df.tail(30)
    historical = []

    for _, row in historical_df.iterrows():
        historical.append({
            "date": str(row["Date"]),
            "units": round(float(row["Units"]), 2)
        })

    return {
        "month": month,
        "days": days,
        "daily_units": round(daily_units, 2),
        "total_units": total_units,
        "estimated_bill": estimated_bill,
        "appliances": appliance_forecast,
        "historical": historical,
        "forecast": forecast
    }