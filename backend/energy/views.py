from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import EnergyDataset
from .serializers import EnergyDatasetSerializer
from accounts.models import CustomUser
from .utils import load_dataset

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
                ),
                "full_dataset": df.to_dict(orient="records")

            })

        except Exception as e:

            return Response(
                {
                    "error": str(e)
                },
                status=400
            )   

class DatasetOverviewView(APIView):

    def get(self, request, pk):

        try:

            dataset = EnergyDataset.objects.get(id=pk)

            df = load_dataset(dataset)

            daily_usage = (
                df.groupby("Date")["Units"]
                .sum()
                .reset_index()
            )

            daily_chart = [

                {
                    "date": row["Date"].strftime("%Y-%m-%d"),
                    "units": round(row["Units"],2)
                }

                for _,row in daily_usage.iterrows()

            ]

            monthly_usage = (

                df.groupby(df["Date"].dt.to_period("M"))["Units"]

                .sum()

                .reset_index()

            )

            monthly_chart = [

                {

                    "month": str(row["Date"]),

                    "units": round(row["Units"],2)

                }

                for _,row in monthly_usage.iterrows()

            ]

            highest = monthly_usage.loc[
                monthly_usage["Units"].idxmax()
            ]

            lowest = monthly_usage.loc[
                monthly_usage["Units"].idxmin()
            ]

            return Response({

                "dataset_name": dataset.dataset_name,

                "total_rows": len(df),

                "total_columns": len(df.columns),

                "missing_values": int(
                    df.isnull().sum().sum()
                ),

                "average_temperature": round(
                    df["Temperature"].mean(),
                    2
                ),

                "average_units": round(
                    df["Units"].mean(),
                    2
                ),

                "average_bill": round(
                    df["ElectricityBill"].mean(),
                    2
                ),

                "total_energy": round(
                    df["Units"].sum(),
                    2
                ),

                "daily_chart": daily_chart,

                "monthly_chart": monthly_chart,

                "highest_month":{

                    "month":str(highest["Date"]),

                    "units":round(highest["Units"],2)

                },

                "lowest_month":{

                    "month":str(lowest["Date"]),

                    "units":round(lowest["Units"],2)

                }

            })

        except Exception as e:

            return Response(

                {

                    "error":str(e)

                },

                status=400

            )

class DatasetDistributionView(APIView):

    def get(self, request, pk):

        try:

            dataset = EnergyDataset.objects.get(id=pk)

            df = load_dataset(dataset)

            # Monthly Consumption
            monthly = (
                df.groupby(df["Date"].dt.strftime("%Y-%m"))["Units"]
                .sum()
                .reset_index()
            )

            monthly_chart = [
                {
                    "month": row["Date"],
                    "units": round(row["Units"], 2)
                }
                for _, row in monthly.iterrows()
            ]

            # Appliance Consumption
            appliances = [
                "Fan(Units)",
                "Fridge(Units)",
                "AC(Units)",
                "Bulb(Units)",
                "TV(Units)",
                "Monitor(Units)",
                "Motor(Units)"
            ]

            appliance_chart = []

            for col in appliances:

                appliance_chart.append({

                    "name": col.replace("(Units)", ""),

                    "units": round(df[col].sum(), 2)

                })

            # Temperature Distribution
            temperature_chart = [
                {
                    "temperature": round(row["Temperature"], 2),
                    "units": round(row["Units"], 2)
                }

                for _, row in df.iterrows()
            ]

            return Response({

                "monthly_chart": monthly_chart,

                "appliance_chart": appliance_chart,

                "temperature_chart": temperature_chart

            })

        except Exception as e:

            return Response(

                {

                    "error": str(e)

                },

                status=400

            )