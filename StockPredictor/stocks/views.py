from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Stocks

class TestView(APIView):
    def get(self, request):

        return Response({'test' : 'test'})
