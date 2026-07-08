from rest_framework.views import APIView
from rest_framework.response import Response

from energy.models import EnergyDataset
from energy.utils import load_dataset

from .ml import train_models
from .ml import predict_units

class TrainModelView(APIView):

    def get(self, request):

        try:

            dataset = EnergyDataset.objects.latest("uploaded_at")

            df = load_dataset(dataset)

            results = train_models(df)

            return Response(results)

        except Exception as e:

            return Response(
                {
                    "error": str(e)
                },
                status=400
            )
        
class PredictView(APIView):

    def post(self, request):

        try:

            prediction = predict_units(request.data)

            return Response({

                "predicted_units": prediction

            })

        except Exception as e:

            return Response(

                {

                    "error": str(e)

                },

                status=400

            )