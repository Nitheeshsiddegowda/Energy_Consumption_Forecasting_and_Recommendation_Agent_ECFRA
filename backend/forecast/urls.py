from django.urls import path
from .views import TrainModelView, PredictView

urlpatterns = [
    path("train/", TrainModelView.as_view(), name="train-model"),
    path(
        "predict/",
        PredictView.as_view(),
        name="predict"
    ),
]