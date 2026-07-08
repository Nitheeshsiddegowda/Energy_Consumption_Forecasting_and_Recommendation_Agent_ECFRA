from django.urls import path
from .views import TrainModelView, PredictView, SeasonalForecastView

urlpatterns = [
    path("train/", TrainModelView.as_view(), name="train-model"),
    path(
        "predict/",
        PredictView.as_view(),
        name="predict"
    ),
    path(
    "seasonal/",
    SeasonalForecastView.as_view(),
    name="seasonal-forecast"
    ),
]