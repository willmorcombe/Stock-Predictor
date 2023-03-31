from django.db import models
from django.conf import settings

import pickle
from datetime import date
import numpy as np


class Stock(models.Model):
    ticker = models.CharField(max_length=10)

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


    # this method takes a set of stock_data models, it will pass the model their close data
    # and return its next days prediciton
    @classmethod
    def make_prediction_day(self, stock, model_input):
        
        model = pickle.load(open(settings.AI_MODELS_URL + stock.ticker + '.pkl', 'rb'))

        recursive_predictions = []

        last_window = np.array([[stock_data.close] for stock_data in model_input])

        for x in range(5): #! specify how many data points are in a day somewhere
            next_prediction = model.predict(np.array([last_window])).flatten()
            recursive_predictions.append(next_prediction)
            last_window[-1] = next_prediction

        return recursive_predictions
