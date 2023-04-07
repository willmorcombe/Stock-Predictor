from django.shortcuts import render
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Stock, StockData, StockPredictionData, StockPredictionHistory
from .serializers import StockDetailsSerializer, StockDataSerializer, StockPredictionDataSerializer, StockPredictionHistorySerializer

from datetime import date

class StockDetailsList(APIView):
    def get(self, request):
        stocks = Stock.objects.all()
        stock_serializer = StockDetailsSerializer(stocks, many=True)

        return Response(stock_serializer.data, status=200)

class StockDetailsSingle(APIView):
    def get(self, request, pk):

        try:
            stock = Stock.objects.get(id=pk)
        except Exception as e:
            return Response({"message" : "Stock does not exist"}, status=400)
        
        stock_serializer = StockDetailsSerializer(stock, many=False)
    
        return Response(stock_serializer.data, status=200)
        

class StockDataDay(APIView):
    # gets the last day of stock data form the database
    def get(self, request, pk):

        try:
            stock = Stock.objects.get(id=pk)
        except Exception as e:
            return Response({"message" : "Stock does not exist"}, status=400)
        
        
        stock_data = StockData.objects.filter(
            stock = stock
        ).order_by('-date_time')[:settings.TRAINING_PARAMS['forward_predictions']][::-1]
        stock_data_serializer = StockDataSerializer(stock_data, many=True)

        return Response(stock_data_serializer.data, status=200)

class StockPredictionDay(APIView):
    # gets the last day of predictions from the database
    def get(self, request, pk):

        try:
            stock = Stock.objects.get(id=pk)
        except Exception as e:
            return Response({"message" : "Stock does not exist"}, status=400)
        
        stock_predictions_data = StockPredictionData.objects.filter(
            stock=stock
        ).order_by('-date_time')[:settings.TRAINING_PARAMS['forward_predictions']][::-1]
        stock_predictions_data_serializer = StockPredictionDataSerializer(stock_predictions_data, many=True)

        return Response(stock_predictions_data_serializer.data, status=200)
    

class StockPredictionHistoryStock(APIView):
    def get(self, request, pk):

        try:
            stock = Stock.objects.get(id=pk)
        except Exception as e:
            return Response({"message" : "Stock does not exist"}, status=400)
        
        stock_prediction_history_data = StockPredictionHistory.objects.filter(
            stock=stock
        ).order_by('-day')

        stock_prediction_history_serializer = StockPredictionHistorySerializer(stock_prediction_history_data, many=True)

        return Response(stock_prediction_history_serializer.data, status=200)
    

class StockPredictionHistoryAll(APIView):
    def get(self, request):

        all_history = StockPredictionHistory.objects.all()
        
        stock_prediction_history_serializer = StockPredictionHistorySerializer(all_history, many=True)

        return Response(stock_prediction_history_serializer.data, status=200)
        