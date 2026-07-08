import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor

def prepare_data(df):
    features = [
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
    X = df[features]
    y = df["Units"]
    return X, y

def split_data(X, y):
    return train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42
    )

def train_random_forest(X_train, y_train):
    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42
    )
    model.fit(X_train, y_train)
    return model

def train_xgboost(X_train, y_train):
    model = XGBRegressor(
        n_estimators=100,
        random_state=42
    )
    model.fit(X_train, y_train)
    return model

def evaluate_model(model, X_test, y_test):
    pred = model.predict(X_test)
    return {
        "MAE": round(
            mean_absolute_error(y_test, pred),
            3
        ),
        "RMSE": round(
            mean_squared_error(
                y_test,
                pred
            ) ** 0.5,
            3
        ),
        "R2": round(
            r2_score(
                y_test,
                pred
            ),
            3
        )
    }

def train_models(df):
    X, y = prepare_data(df)
    X_train, X_test, y_train, y_test = split_data(X, y)
    rf = train_random_forest(
        X_train,
        y_train
    )
    xgb = train_xgboost(
        X_train,
        y_train
    )
    rf_metrics = evaluate_model(
        rf,
        X_test,
        y_test
    )
    xgb_metrics = evaluate_model(
        xgb,
        X_test,
        y_test
    )
    joblib.dump(
        rf,
        "forecast/random_forest.pkl"
    )
    joblib.dump(
        xgb,
        "forecast/xgboost.pkl"
    )
    return {
        "Random Forest": rf_metrics,
        "XGBoost": xgb_metrics
    }

def predict_units(data):
    model = joblib.load("forecast/xgboost.pkl")
    features = [[
        data["Temperature"],
        data["Fan"],
        data["Refrigerator"],
        data["AirConditioner"],
        data["Bulb"],
        data["Television"],
        data["Monitor"],
        data["MotorPump"],
        data["Month"],
        data["Extra"],
        data["TariffRate"]
    ]]
    prediction = model.predict(features)
    return round(float(prediction[0]), 2)