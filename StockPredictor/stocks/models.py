from django.db import models
from django.conf import settings

import pickle
from datetime import date
import numpy as np


class Stock(models.Model):
    ticker = models.CharField(max_length=10)
    company_name = models.CharField(max_length=50)
    company_description = models.TextField()
    company_currency = models.CharField(max_length=10)
    company_country = models.CharField(max_length=50)
    company_industry = models.CharField(max_length=200)
    

class StockData(models.Model):

    open = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    adj_close = models.FloatField()
    volume = models.IntegerField()
    date_time = models.DateTimeField()
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, default=None)

    # this method should return the last datapoints to be used as input to the model
    # i.e. the last n datapoints of the previous day
    @classmethod
    def get_data_for_prediction(self, stock):
        current_date = date.today()
        return self.objects.filter(stock=stock, date_time__lt=current_date)[::-1][:settings.TRAINING_PARAMS['look_back']]

    
class StockPredictionData(models.Model):
    close = models.FloatField()
    date_time = models.DateTimeField()
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, default=None)
    created_at = models.DateTimeField(auto_now_add=True)

class StockPredictionHistory(models.Model):
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, default=None)
    correct_prediction = models.BooleanField()
    prediction_end_close = models.FloatField()
    actual_end_close = models.FloatField()
    day = models.DateTimeField()

    @classmethod # get the stock that is doing the best overall or weekly
    def get_hot_stock_overall(self, all_time):
        stock_percentage_list = []
        all_stocks = Stock.objects.all()
        for stock in all_stocks:
            if all_time:
                stock_prediction_data = self.objects.filter(stock=stock).values('correct_prediction')
            else:
                stock_prediction_data = self.objects.filter(stock=stock).order_by('-day').values('correct_prediction')[:5]
            stock_prediction_correct = [prediction['correct_prediction'] for prediction in stock_prediction_data if prediction['correct_prediction']]
            stock_percentage_list.append([stock.id, stock.ticker, len(stock_prediction_correct) / len(stock_prediction_data) * 100])

        return max(stock_percentage_list, key=lambda x:x[2])

            
    

