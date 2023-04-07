
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('stock/<int:stock_id>', views.index),
]
