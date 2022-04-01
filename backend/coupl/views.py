import datetime
import json

from django.contrib.auth import authenticate
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework import authentication, permissions
from rest_framework.authtoken.models import Token
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.forms.models import model_to_dict
from django.core.exceptions import ObjectDoesNotExist

from coupl.serializers import UserSerializer, EventSerializer, TagSerializer, UserDisplaySerializer,\
    ProfileSerializer, MatchSerializer
from coupl.models import Event, Tag, Profile, Match
from coupl.mixins import UserInEventMixin, LikeInEventMixin, SkipInEventMixin


# todo Send user login token when successfully logged in
class LoginView(APIView):
    def post(self, request, format=None):
        username = request.data['username']
        password = request.data['password']
        authenticated_user = authenticate(username=username, password=password)
        if authenticated_user is not None:
            get, create = Token.objects.get_or_create(user=authenticated_user)
            token = get if get is not None else create
            return JsonResponse(token.key, status=200, safe=False)
        return Response(False)


LoginRequiredMixin


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
        user_serializer = UserSerializer(data=request.data.get('user'))
        if user_serializer.is_valid():
            user_serializer.save()
        else:
            return JsonResponse("Can't create user", status=400, safe=False)
        user_pk = user_serializer.data.get('pk')
        request.data.pop('user', None)
        request.data.update({'user': user_pk})
        profile_serializer = ProfileSerializer(data=request.data)
        if profile_serializer.is_valid():
            profile_serializer.save()
            return JsonResponse(profile_serializer.data, status=201)
        # User.objects.get(userPk).delete() # if profile is not valid the user will should be deleted from the database as well
        return JsonResponse(profile_serializer.errors, status=400)


class ProfileGetView(APIView):
    def get(self, request, format=None):
        user_id = request.query_params.get('userId')
        profile = Profile.objects.get(user=user_id)

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
        event.event_attendees.add(user)
        return JsonResponse('Successfully joined the event', status=201, safe=False)


class EventLeaveView(UserInEventMixin, APIView):
    def post(self, request, format=None):
        event_id = request.query_params.get('eventId')
        user_id = request.query_params.get('userId')
        user = User.objects.get(pk=user_id)
        event = Event.objects.get(pk=event_id)

        event.event_attendees.remove(user)

        return JsonResponse('Successfully left event', status=201, safe=False)


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


class UserGetMatches(UserInEventMixin, APIView):
    def get(self, request, format=None):
        user_id = self.args[0].get("user_id")
        event_id = self.args[0].get("event_id")
        user = User.objects.get(pk=user_id)
        event = Event.objects.get(pk=event_id)
        liked = Match.objects.filter(event__match__liker=user_id).values_list('liked_id', flat=True, named=False)

        attendees = event.event_attendees.exclude(pk=user_id).exclude(pk__in=liked).filter(
            profile__gender__in=Profile.preference_list[int(user.profile.preference)])
        serializer = UserSerializer(attendees, many=True)
        return Response(serializer.data)


class UserGetBestMatch(UserInEventMixin, APIView):
    def get(self, request, format=None):
        user_id = self.args[0].get("user_id")
        event_id = self.args[0].get("event_id")
        user = User.objects.get(pk=user_id)
        event = Event.objects.get(pk=event_id)
        liked = Match.objects.filter(event__match__liker=user_id).values_list('liked_id', flat=True, named=False)

        attendee = event.event_attendees.exclude(pk=user_id).exclude(pk__in=liked).filter(
            profile__gender__in=Profile.preference_list[int(user.profile.preference)]).first()
        if not attendee:
            raise ObjectDoesNotExist
        serializer = ProfileSerializer(attendee.profile)
        return Response(serializer.data)


class UserLike(LikeInEventMixin, APIView):
    def post(self, request, format=None):
        liker_id = self.args[0].get("liker_id")
        liked_id = self.args[0].get("liked_id")
        event_id = self.args[0].get("event_id")

        liker = User.objects.get(pk=liker_id)
        liked = User.objects.get(pk=liked_id)
        event = Event.objects.get(pk=event_id)

        # Liked user also previously liked the liker, match confirms
        match_qs = Match.objects.filter(liked=liker, liker=liked, skip=False)
        if match_qs:
            for match in match_qs:
                match.confirmed = True
                match.save()
        # Else create new match
        else:
            match = Match(liker=liker, liked=liked, event=event)
            match.save()

        serializer = MatchSerializer(match)
        return Response(serializer.data)


class UserSkip(SkipInEventMixin, APIView):
    def post(self, request, format=None):
        skipper_id = self.args[0].get("skipper_id")
        skipped_id = self.args[0].get("skipped_id")
        event_id = self.args[0].get("event_id")

        skipper = User.objects.get(pk=skipper_id)
        skipped = User.objects.get(pk=skipped_id)
        event = Event.objects.get(pk=event_id)

        skip_qs = Match.objects.filter(liked=skipper, liker=skipped)
        if skip_qs:
            for skip in skip_qs:
                skip.skip = True
                skip.save()
        else:
            skip = Match(liker=skipper, liked=skipped, event=event, skip=True)
            skip.save()

        serializer = MatchSerializer(skip)
        return Response(serializer.data)
