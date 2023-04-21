from django.urls import path
from . import views

urlpatterns = [
    path('stock_details_list', views.StockDetailsList.as_view(), name='stock_details_list'),
    path('stock_details_single=<str:pk>', views.StockDetailsSingle.as_view(), name='stock_details_single'),
    path('stock_prediction_day=<str:pk>', views.StockPredictionDay.as_view(), name='stock_prediction'),
    path('stock_data_day=<str:pk>', views.StockDataDay.as_view(), name='stock_data_day'),
    path('stock_prediction_history=<str:pk>', views.StockPredictionHistoryStock.as_view(), name='stock_prediction_history'),
    path('stock_prediction_history_all', views.StockPredictionHistoryAll.as_view(), name='stock_prediction_history_all'),
    path('stock_hot_stocks', views.HotStocks.as_view(), name='stock_hot_stocks'),
]
