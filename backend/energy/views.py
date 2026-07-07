from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import EnergyDataset
from .serializers import EnergyDatasetSerializer
from accounts.models import CustomUser


class DatasetUploadView(generics.ListCreateAPIView):

    serializer_class = EnergyDatasetSerializer
    permission_classes = []

    def get_queryset(self):
        return EnergyDataset.objects.all()

    def perform_create(self, serializer):

        uploaded_file = self.request.FILES["dataset_file"]
        admin_user = CustomUser.objects.first()

        serializer.save(
            user=admin_user,
            file_size=uploaded_file.size
        )

import pandas as pd

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class DatasetPreviewView(APIView):

    permission_classes = []

    def get(self, request, pk):

        try:

            dataset = EnergyDataset.objects.get(id=pk)

            df = pd.read_csv(dataset.dataset_file.path)

            return Response({

                "dataset_name": dataset.dataset_name,

                "total_rows": len(df),

                "total_columns": len(df.columns),

                "columns": list(df.columns),

                "preview": df.head(10).to_dict(
                    orient="records"
                )

            })

        except Exception as e:

            return Response(
                {
                    "error": str(e)
                },
                status=400
            )   