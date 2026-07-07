from django.urls import path

from .views import (
    DatasetUploadView,
    DatasetPreviewView
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
]