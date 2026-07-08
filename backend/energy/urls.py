from django.urls import path

from .views import (
    DatasetUploadView,
    DatasetPreviewView,
    DatasetOverviewView,
    DatasetDistributionView,
)

urlpatterns = [

    path(
        "datasets/",
        DatasetUploadView.as_view(),
        name="datasets"
    ),

    path(
        "datasets/<int:pk>/preview/",
        DatasetPreviewView.as_view(),
        name="preview"
    ),

    path(
        "datasets/<int:pk>/overview/",
        DatasetOverviewView.as_view(),
        name="overview"
    ),

    path(
    "datasets/<int:pk>/distribution/",
    DatasetDistributionView.as_view(),
    name="distribution"
    ),
]