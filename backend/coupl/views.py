from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework import authentication, permissions
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.forms.models import model_to_dict

from coupl.serializers import UserSerializer, EventSerializer
from coupl.models import Event

class UserLoginView(APIView):
    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


class EventGetView(APIView):
    def get(self, request, format=None):
        event_id = request.query_params.get('event_id')
        event = Event.objects.get(pk=event_id)
        return JsonResponse(model_to_dict(event), status=400)


class EventAddView(APIView):
    def post(self, request, format=None):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)