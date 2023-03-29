from django.core.management.base import BaseCommand, CommandError
from stocks.models import Stock, StockData

from datetime import datetime as dt
from dateutil.relativedelta import relativedelta

import yfinance as yf
import pandas as pd

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

        # delete all data that is over two years then re add the stock data
        Stock.objects.all().delete()


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

            stock = Stock(ticker = ticker)
            stock.save()

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



