from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from stocks.models import Stock, StockData

import yfinance as yf
import pandas as pd
import requests


# todo: put in a view!
class Command(BaseCommand):
    help = 'Adds two years worth of stock data to the database specified by the companys ticker'

    def add_arguments(self, parser):
        parser.add_argument('ticker')

    def handle(self, *args, **options):
        stock_ticker = options['ticker'].upper()

        if Stock.objects.filter(ticker = stock_ticker).exists():
            print('Company already exists in database.')
            return

        print('Downloading data from ' + stock_ticker)
        data = pd.DataFrame([])
        company_info = {}

        # attempt to download data from the given ticker
        try:
            # stock data
            data = yf.download(  # or pdr.get_data_yahoo(...
                # tickers list or string as well
                tickers = stock_ticker,

                # use "period" instead of start/end
                # valid periods: 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max
                # (optional, default is '1mo')
                period = "2y",

                # fetch data by interval ( including intraday if period < 60 days)
                # valid intervals: 1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo
                # (optional, default is '1d')
                interval = "1h",

                # group by ticker (to access via data['SPY'])
                # (optional, default is 'column')
                group_by = 'ticker'
            )
            # stock info

            url = 'https://www.alphavantage.co/query?function=OVERVIEW&symbol='+ stock_ticker + '&apikey=' + settings.ALPHAVANTAGE_API_KEY
            r = requests.get(url)
            company_info = r.json()

        except Exception as e:
            print('Error with download data ---> ' + e)

        if data.empty:
            return

        print('saving')
        # create column for date time
        data['Date Time'] = data.index

        # save data to all stock models
        data_records = data.to_dict('records')

        stock = Stock(
            ticker = stock_ticker,
            company_name = company_info['Name'],
            company_description = company_info['Description'],
            company_currency = company_info['Currency'],
            company_country = company_info['Country'],
            company_industry = company_info['Industry']
        )

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