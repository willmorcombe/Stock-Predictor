
#!Only run this at the end of each day

# TODO : Potetntially change the look back value to something larger, like the number of datapoints per day

import datetime
import pickle
from datetime import date

import numpy as np
import pandas as pd
import yfinance as yf

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from stocks.models import Stock, StockData

from tensorflow.keras import layers
from tensorflow.keras.models import Sequential
from tensorflow.keras.optimizers import Adam


class Command(BaseCommand):
    help = 'trains models on all tickers in the database'

    def strToDatetime(self, s):
        split_day_month_year = s.split('T')[0].split('-')
        split_hour_minute_sec = s.split('T')[1].split(':')
        year, month, day, hour, minute= int(split_day_month_year[0]), int(split_day_month_year[1]), int(split_day_month_year[2]), int(split_hour_minute_sec[0]), int(split_hour_minute_sec[1])
        return datetime.datetime(year=year, month=month, day=day, hour=hour, minute=minute)

    
    def windowedDfToDateX_y(self, windowed_dataframe):
        df_as_np = windowed_dataframe.to_numpy()

        dates = df_as_np[:, 0]

        middle_matrix = df_as_np[:, 1:-1]
        X = middle_matrix.reshape((len(dates), middle_matrix.shape[1], 1))

        Y = df_as_np[:, -1]

        return dates, X.astype(np.float32), Y.astype(np.float32)
    

    # Complex function that turns the data into a dataframe for the model to use
    def dfToWindowedDf(self, dataframe, first_date_str, last_date_str, n=3):
        first_date = self.strToDatetime(first_date_str)
        last_date  = self.strToDatetime(last_date_str)
        target_date = first_date

        dates = []
        X, Y = [], []

        last_time = False
        while True:
            df_subset = dataframe.loc[:target_date].tail(n+1)

            if len(df_subset) != n+1:
                print(f'Error: Window of size {n} is too large for date {target_date}')
                return

            values = df_subset['close'].to_numpy()
            x, y = values[:-1], values[-1]

            dates.append(target_date)
            X.append(x)
            Y.append(y)

            next_week = dataframe.loc[target_date:target_date+datetime.timedelta(days=7)]
            next_datetime_str = str(next_week.head(2).tail(1).index.values[0])
            next_date_str = next_datetime_str.split('T')[0]
            next_date_str_time = next_datetime_str.split('T')[1]
            year_month_day = next_date_str.split('-')
            year, month, day = year_month_day
            hour, minute, second = next_date_str_time.split(':')
            next_date = datetime.datetime(day=int(day), month=int(month), year=int(year), hour=int(hour), minute=int(minute))
            if last_time:
                break

            target_date = next_date

            if target_date == last_date:
                last_time = True

        ret_df = pd.DataFrame({})
        ret_df['Target Date'] = dates

        X = np.array(X)
        for i in range(0, n):
            X[:, i]
            ret_df[f'Target-{n-i}'] = X[:, i]

        ret_df['Target'] = Y

        return ret_df
    

    # command handling
    def handle(self, *args, **options):
        # get the all stock objects in the database
        stock_in_database = Stock.objects.all()
        current_date = date.today()


        for stock in stock_in_database: # loop through each stock
            data = pd.DataFrame(list(StockData.objects.filter(stock=stock, date_time__lt=current_date).values()))
            data = data[['date_time', 'close']]
            # create the date the index

            data.index = data.pop('date_time')

            # start and end date to create windowed_df, end date should be the last datetime of yesterday
            start_date = str(data.head(settings.TRAINING_PARAMS['look_back'] + 1).tail(1).index.values[0])
            end_date = str(data.tail(1).index.values[0]) 
            print(end_date)
            windowed_df = self.dfToWindowedDf(data,
                                start_date,
                                end_date,
                                n=settings.TRAINING_PARAMS['look_back'])
            
            dates, X, y = self.windowedDfToDateX_y(windowed_df)
            dates.shape, X.shape, y.shape

            # get the whole data for training
            dates_train, X_train, y_train = dates, X, y

            model = Sequential([layers.Input((3, 1)),
                                layers.LSTM(64),
                                layers.Dense(32, activation='relu'),
                                layers.Dense(32, activation='relu'),
                                layers.Dense(1)])

            model.compile(loss='mse', 
                        optimizer=Adam(learning_rate=0.001),
                        metrics=['mean_absolute_error'])

            model.fit(X_train, y_train, epochs=settings.TRAINING_PARAMS['epochs'])

            print('saving ' + stock.ticker + 'model')
            # save model in ai_models directory
            pickle.dump(model, open(settings.AI_MODELS_URL + stock.ticker + '.pkl', 'wb'))


