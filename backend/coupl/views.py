import datetime

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework import authentication, permissions
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.forms.models import model_to_dict
from django.core.exceptions import ObjectDoesNotExist

from coupl.serializers import UserSerializer, EventSerializer, TagSerializer, UserDisplaySerializer, ProfileSerializer
from coupl.models import Event, Tag, Profile


# todo
class LoginView(APIView):
    def post(self, request, format=None):
        username = request.data['username']
        password = request.data['password']
        user = User.objects.get(username=username)
        authenticated_user = authenticate(username=username, password=password)
        if authenticated_user is not None:
            return JsonResponse({'pk': authenticated_user.pk}, status=200)
        return Response(False)


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


class ListProfileView(APIView):
    def get(self, request, format=None):
        profiles = Profile.objects.all()
        serializer = ProfileSerializer(profiles, many=True)
        return Response(serializer.data)


class CreateProfileView(APIView):
    def post(self, request):
        print(request.data)
        userSerializer = UserSerializer(data=request.data.get('user'))
        if userSerializer.is_valid():
            userSerializer.save()
        else:
            return JsonResponse("Can't create user", status=400, safe=False)
        userPk = userSerializer.data.get('pk')
        request.data.pop('user', None)
        request.data.update({'user': userPk})
        profileSerializer = ProfileSerializer(data=request.data)
        if profileSerializer.is_valid():
            profileSerializer.save()
            return JsonResponse(profileSerializer.data, status=201)
        # User.objects.get(userPk).delete() # if profile is not valid the user will should be deleted from the database as well
        return JsonResponse(profileSerializer.errors, status=400)


class ProfileGetView(APIView):
    def get(self, request, format=None):
        userId = request.query_params.get('userId')
        profile = Profile.objects.get(user=userId)

        serializer = ProfileSerializer(profile)

        return Response(serializer.data, status=201)


class EventListView(APIView):
    def get(self, request, format=None):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)


class EventGetView(APIView):
    def get(self, request, format=None):
        event_id = request.query_params.get('eventId')
        event = Event.objects.get(pk=event_id)

        serializer = EventSerializer(event)

        return Response(serializer.data, status=201)


class EventAddView(APIView):
    def post(self, request, format=None):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


class EventJoinView(APIView):
    def post(self, request, format=None):
        event_id = request.query_params.get('eventId')
        user_id = request.query_params.get('userId')
        try:
            event = Event.objects.get(pk=event_id)
        except ObjectDoesNotExist:
            return JsonResponse('Event with the given id is not found.', status=400, safe=False)
        try:
            user = User.objects.get(pk=user_id)
        except ObjectDoesNotExist:
            return JsonResponse('User with the given id is not found.', status=400, safe=False)
        event.eventAttendees.add(user)
        return JsonResponse('Successfully joined the event', status=201, safe=False)


class EventLeaveView(APIView):
    def post(self, request, format=None):
        event_id = request.query_params.get('eventId')
        user_id = request.query_params.get('eventId')
        try:
            event = Event.objects.get(pk=event_id)
        except ObjectDoesNotExist:
            return JsonResponse('Event with the given id is not found.', status=400, safe=False)
        try:
            user = User.objects.get(pk=user_id)
        except ObjectDoesNotExist:
            return JsonResponse('User with the given id is not found.', status=400, safe=False)
        if event.eventAttendees.contains(user):
            event.eventAttendees.remove(user)
            return JsonResponse('Successfully left event', status=201, safe=False)
        else:
            return JsonResponse('User is not in the event', status=400, safe=False)


class TagCreateView(APIView):
    def post(self, request, format=None):
        serializer = TagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


class EventAddTagView(APIView):
    def post(self, request, format=None):
        event_id = request.query_params.get('eventId')
        tag_id = request.query_params.get('tagId')
        try:
            event = Event.objects.get(pk=event_id)
        except ObjectDoesNotExist:
            return JsonResponse('Event with the given id is not found.', status=400, safe=False)
        try:
            tag = Tag.objects.get(pk=tag_id)
        except ObjectDoesNotExist:
            return JsonResponse('Tag with the given id is not found.', status=400, safe=False)
        event.eventTags.add(tag)
        return JsonResponse('Successfully added tag to the event', status=201, safe=False)


class TagListView(APIView):
    def get(self, request, format=None):
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)


class UserGetMatches(APIView):
    def get(self, request, format=None):
        event_id = request.query_params.get('eventId')
        user_id = request.query_params.get('userId')
        try:
            event = Event.objects.get(pk=event_id)
        except ObjectDoesNotExist:
            return JsonResponse('Event with the given id is not found.', status=400, safe=False)
        try:
            user = User.objects.get(pk=user_id)
        except ObjectDoesNotExist:
            return JsonResponse('User with the given id is not found.', status=400, safe=False)
        if event.eventAttendees.contains(user):
            attendees = event.eventAttendees.exclude(pk=user_id).filter(
                profile__gender__in=Profile.preferenceList[int(user.profile.preference)])
            serializer = UserSerializer(attendees, many=True)
            return Response(serializer.data)
        else:
            return JsonResponse('User is not in the event', status=400, safe=False)
