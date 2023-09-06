from django.core.management.base import BaseCommand, CommandError
from django.conf import settings

from stocks.models import Stock, StockData, StockPredictionData, StockPredictionHistory

from datetime import datetime, timedelta
from datetime import date

import yfinance as yf
import pandas as pd

import logging

logger = logging.getLogger('django')

# !This should be ran every 1 hour by a script to update with current data

# TODO: Implement comment below

#? how should we do this? We could just delete all data then run the
#? new stock download command which is good. Or we could delete all data before
#? years ago. Then add data from where it has stopped. 

class Command(BaseCommand):
    help = 'Updates all stocks to ONLY have 2 years worth of data.'

    def handle(self, *args, **options):


        # get the tickers in the database
        tickers_in_database = [x['ticker'] for x in Stock.objects.values('ticker').distinct()]

        # delete all stock data that is over two years then re add the stock data
        StockData.objects.all().delete()


        # for each ticker, get the last datapoint, then add data from then to now with yfinance
        for ticker in tickers_in_database:
            print('Downloading data from ' + ticker)
            data = pd.DataFrame([])

            # attempt to download data from the given ticker
            try:
                data = yf.download(  # or pdr.get_data_yahoo(...
                    # tickers list or string as well
                    tickers = ticker,

                    # use "period" instead of start/end
                    # valid periods: 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max
                    # (optional, default is '1mo')
                    period = "2y",

                    # fetch data by interval (including intraday if period < 60 days)
                    # valid intervals: 1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo
                    # (optional, default is '1d')
                    interval = "1h",

                    # group by ticker (to access via data['SPY'])
                    # (optional, default is 'column')
                    group_by = 'ticker'
                )
            except Exception as e:
                print('Error with download data ---> ' + e)

            if data.empty:
                return

            print('saving')
            # create column for date time
            data['Date Time'] = data.index

            # save data to all stock models
            data_records = data.to_dict('records')

            stock = Stock.objects.filter(ticker = ticker).first()

            model_instances = [
                StockData(
                    open = record['Open'],
                    high = record['High'],
                    low = record['Low'],
                    close = record['Close'],
                    adj_close = record['Adj Close'],
                    volume = record['Volume'],
                    date_time = record['Date Time'],
                    stock = stock
                ) for record in data_records
            ]

            StockData.objects.bulk_create(model_instances)

            # logic for adding stock prediction history to the database
            #? my way of doing this is get the last date time from prediction data, 
            #? and actual data, if they line up, then push to database 
            #? IF THERE IS NOT A VALUE THERE ALREADY
            actual_data_datetime = StockData.objects.filter(
                stock=stock
            ).values('date_time').last()
            prediction_data_datetime = StockPredictionData.objects.filter(
                stock=stock
            ).values('date_time').last()

            prediction_end_close = StockPredictionData.objects.filter(
                stock=stock
            ).values('close').last()

            actual_end_close = StockData.objects.filter(
                stock=stock
            ).values('close').last()

            # day = date.today() - timedelta(days=1)
            day = date.today()
            


            prediction_data_day = StockPredictionData.objects.filter(
                stock=stock
            ).order_by('-date_time').values('close')[:settings.TRAINING_PARAMS['forward_predictions']][::-1]
            actual_data_day = StockData.objects.filter(
                stock = stock
            ).order_by('-date_time').values('close')[:settings.TRAINING_PARAMS['forward_predictions']][::-1]

            correct_prediction = None
            if (((actual_data_day[0]['close'] > actual_data_day[::-1][0]['close']) and (prediction_data_day[0]['close'] > prediction_data_day[::-1][0]['close'])) or ((actual_data_day[0]['close'] < actual_data_day[::-1][0]['close']) and (prediction_data_day[0]['close'] < prediction_data_day[::-1][0]['close']))):
                 correct_prediction = True
            else:
                correct_prediction = False

            
            if actual_data_datetime == prediction_data_datetime:
                # #! if today isn't in the history AND today isn't a weekend, then add
                if (day.weekday() != 5 and day.weekday() != 6) and not(StockPredictionHistory.objects.filter(stock=stock, day=day).exists()):
                    StockPredictionHistory(
                        stock=stock,
                        prediction_end_close=prediction_end_close['close'],
                        actual_end_close=actual_end_close['close'],
                        correct_prediction= correct_prediction,
                        day=day
                    ).save()

            
        logger.info("Database Update Complete")
                
                
                

