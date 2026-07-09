import pandas as pd
import joblib
from .recommendation_engine import generate_recommendations

def generate_forecast(df, month, days):

    # ----------------------------
    # Filter selected month
    # ----------------------------
    monthly_df = df[df["Month"] == month].copy()

    if monthly_df.empty:
        raise Exception("No data available for selected month.")

    # Convert Date column to datetime
    monthly_df["Date"] = pd.to_datetime(monthly_df["Date"])

    # Historical data (sorted)
    historical_df = (
        monthly_df
        .sort_values("Date")
        .tail(30)
    )

    # Prediction data (shuffled)
    prediction_df = (
        monthly_df
        .sample(frac=1, random_state=42)
        .reset_index(drop=True)
    )

    # ----------------------------
    # Load Model
    # ----------------------------
    model = joblib.load("forecast/xgboost.pkl")

    feature_columns = [
        "Temperature",
        "Fan",
        "Refrigerator",
        "AirConditioner",
        "Bulb",
        "Television",
        "Monitor",
        "MotorPump",
        "Month",
        "Extra",
        "TariffRate"
    ]

    forecast = []

    total_units = 0

    # ----------------------------
    # Predict each day
    # ----------------------------
    for i in range(days):

        row = prediction_df.iloc[i % len(prediction_df)]

        features = pd.DataFrame([{

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

        }])[feature_columns]

        prediction = float(model.predict(features)[0])

        total_units += prediction

        forecast.append({

            "date": f"Day {i + 1}",

            "units": round(prediction, 2)

        })

    total_units = round(total_units, 2)

    daily_units = round(total_units / days, 2)

    # ----------------------------
    # Appliance Forecast
    # ----------------------------
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

        appliance_forecast.append({

            "name": name,

            "units": round(monthly_df[column].mean() * days, 2)

        })

    tariff_rate = monthly_df["TariffRate"].mean()

    estimated_bill = round(
        total_units * tariff_rate,
        2
    )
    recommendations = generate_recommendations(
        appliance_forecast,
        tariff_rate
    )

    # ----------------------------
    # Historical
    # ----------------------------
    historical = []

    for _, row in historical_df.iterrows():

        historical.append({

            "date": row["Date"].strftime("%Y-%m-%d"),

            "units": round(float(row["Units"]), 2)

        })

    return {

        "month": month,

        "days": days,

        "daily_units": daily_units,

        "total_units": total_units,

        "estimated_bill": estimated_bill,

        "appliances": appliance_forecast,

        "historical": historical,

        "forecast": forecast,

        "recommendations": recommendations

    }