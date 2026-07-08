import pandas as pd
import joblib


def generate_forecast(df, month, days):

    # Filter dataset for selected month
    monthly_df = df[df["Month"] == month]

    if monthly_df.empty:
        raise Exception("No data available for selected month.")

    # Average values for the selected month
    avg = monthly_df.mean(numeric_only=True)

    # Load trained XGBoost model
    model = joblib.load("forecast/xgboost.pkl")

    # Prepare input features
    features = pd.DataFrame([{
        "Temperature": avg["Temperature"],
        "Fan": avg["Fan"],
        "Refrigerator": avg["Refrigerator"],
        "AirConditioner": avg["AirConditioner"],
        "Bulb": avg["Bulb"],
        "Television": avg["Television"],
        "Monitor": avg["Monitor"],
        "MotorPump": avg["MotorPump"],
        "Month": month,
        "Extra": avg["Extra"],
        "TariffRate": avg["TariffRate"]
    }])

    # Predict average daily units
    daily_units = float(model.predict(features)[0])

    # Forecast for selected days
    total_units = round(daily_units * days, 2)

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

    estimated_bill = round(
        total_units * avg["TariffRate"],
        2
    )

    return {

        "month": month,

        "days": days,

        "daily_units": round(daily_units, 2),

        "total_units": total_units,

        "estimated_bill": estimated_bill,

        "appliances": appliance_forecast

    }