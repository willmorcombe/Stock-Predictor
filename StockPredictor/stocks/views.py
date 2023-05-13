from django.shortcuts import render
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Stock, StockData, StockPredictionData, StockPredictionHistory
from .serializers import StockDetailsSerializer, StockDataSerializer, StockPredictionDataSerializer, StockPredictionHistorySerializer

from datetime import timedelta, date
import json

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
    
class StockPredictionHistoryWeek(APIView):
    def get(self, request):

        date_last_week = date.today() + timedelta(-7)
        print(date_last_week)
        week_history = StockPredictionHistory.objects.filter(day__gte=date_last_week).order_by('-day')
        
        stock_prediction_history_serializer = StockPredictionHistorySerializer(week_history, many=True)
        return Response(stock_prediction_history_serializer.data, status=200)
    

class HotStocks(APIView):

    def get(self, request):
        try:
            hot_stock_all = StockPredictionHistory.get_hot_stock_overall(all_time=True)
            hot_stock_weekly = StockPredictionHistory.get_hot_stock_overall(all_time=False)
            return Response([{"weekly": {
                "id" : hot_stock_weekly[0],
                "ticker" : hot_stock_weekly[1],
                "percentage" : hot_stock_weekly[2]
            },
                            "all_time": {
                "id" : hot_stock_all[0],
                "ticker" : hot_stock_all[1],
                "percentage" : hot_stock_all[2]
                            }}], status=200)
        except:
            return Response({"message" : "Error"}, status=400)
        
class StockPredictionDayPercentages(APIView):

    def get(self, request):
        try:
            data = StockPredictionData.get_stock_prediction_percentages()
            return Response([
                {"positive" : data[:2],
                 "negative" : data[::-1][:2],
                }
                ])
        except:
            return Response({"message" : "Error"}, status=400)
    
        