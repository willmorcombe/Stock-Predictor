from django.shortcuts import render
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Stock, StockData
from .serializers import StockDetailsSerializer, StockDataSerializer

from datetime import date

class StockDetailsList(APIView):
    def get(self, request):
        stocks = Stock.objects.all()
        stock_serializer = StockDetailsSerializer(stocks, many=True)

        return Response(stock_serializer.data)

class StockDetailsSingle(APIView):
    def get(self, request, pk):
        stock = Stock.objects.get(id=pk)
        stock_serializer = StockDetailsSerializer(stock, many=False)
        
        return Response(stock_serializer.data)

class StockDataToday(APIView):
    def get(self, request, pk):
        stock = Stock.objects.get(id=pk)
        current_date = date.today()
        stock_data = StockData.objects.filter(stock = stock, date_time__date = current_date)
        stock_data_serializer = StockDataSerializer(stock_data, many=True)

        return Response(stock_data_serializer.data)

class StockPredictionDay(APIView):
    
    def get(self, request, pk):
        stock = Stock.objects.get(id=pk)
        model_input = StockData.get_data_for_prediction(stock)
        prediction = StockData.make_prediction_day(stock, model_input)

        return Response(prediction)


        # return Response({'response' : recursive_predictions})
    



