from django.urls import path
from . import views

urlpatterns = [
    path('stock_details_list', views.StockDetailsList.as_view(), name='stock_details_list'),
    path('stock_details_single=<str:pk>', views.StockDetailsSingle.as_view(), name='stock_details_single'),
    path('stock_prediction_day=<str:pk>', views.StockPredictionDay.as_view(), name='stock_prediction'),
    path('stock_data_today=<str:pk>', views.StockDataToday.as_view(), name='stock_data_today'),

]
