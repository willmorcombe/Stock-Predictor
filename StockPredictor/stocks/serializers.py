from rest_framework import serializers

from .models import Stock, StockData, StockPredictionData, StockPredictionHistory


class StockDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Stock 
        fields = '__all__'

class StockDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockData 
        fields = '__all__'

class StockPredictionDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockPredictionData
        fields = '__all__'

class StockPredictionHistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = StockPredictionHistory
        fields = '__all__'