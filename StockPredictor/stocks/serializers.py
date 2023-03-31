from rest_framework import serializers

from .models import Stock, StockData


class StockDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Stock 
        fields = '__all__'

class StockDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockData 
        fields = '__all__'