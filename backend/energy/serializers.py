from rest_framework import serializers
from .models import EnergyDataset


class EnergyDatasetSerializer(serializers.ModelSerializer):

    class Meta:
        model = EnergyDataset
        fields = [
            "id",
            "dataset_name",
            "dataset_file",
            "file_size",
            "uploaded_at",
        ]

        read_only_fields = [
            "id",
            "uploaded_at",
            "file_size",
        ]