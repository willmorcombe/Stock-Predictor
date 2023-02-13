from django.db import models


class Stocks(models.Model):
    id = models.AutoField(primary_key=True)
    ticker = models.CharField(max_length=10)
    open = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    adj_close = models.FloatField()
    volume = models.IntegerField()
    date_time = models.DateTimeField()
