from django.shortcuts import redirect
from django.core.exceptions import ObjectDoesNotExist
from coupl.models import Event, User
import json
from rest_framework.response import Response
from django.http import JsonResponse



# Login required


class UserInEventMixin:
    def dispatch(self, request, *args, **kwargs):
        event_id = request.GET.get('eventId')
        user_id = request.GET.get('userId')
        args = {"event_id": event_id, "user_id": user_id}
        if Event.objects.filter(pk=event_id, event_attendees__in=[user_id]):
            return super().dispatch(request, args, **kwargs)
        else:
            return JsonResponse("User is not in event", status=400, safe=False)


class EventJoinMixin:
    def dispatch(self, request, *args, **kwargs):
        event_id = request.GET.get('eventId')
        user_id = request.GET.get('userId')
        args = {"event_id": event_id, "user_id": user_id}
        if Event.objects.filter(pk=event_id, event_attendees__in=[user_id]):
            return JsonResponse("User is already in event", status=400, safe=False)
        else:
            return super().dispatch(request, args, **kwargs)


class LikeInEventMixin:
    def dispatch(self, request, *args, **kwargs):
        event_id = json.loads(self.request.body)['eventId']
        liker_id = json.loads(self.request.body)['likerId']
        liked_id = json.loads(self.request.body)['likedId']

        args = {"event_id": event_id, "liker_id": liker_id, "liked_id": liked_id, }
        if Event.objects.filter(pk=event_id, event_attendees__in=[liker_id, liked_id]):
            return super().dispatch(request, args, **kwargs)
        else:
            return JsonResponse("One of the users is not in event", status=400, safe=False)


class SkipInEventMixin:
    def dispatch(self, request, *args, **kwargs):
        event_id = json.loads(self.request.body)['eventId']
        skipper_id = json.loads(self.request.body)['skipperId']
        skipped_id = json.loads(self.request.body)['skippedId']

        args = {"event_id": event_id, "skipper_id": skipper_id, "skipped_id": skipped_id, }
        if Event.objects.filter(pk=event_id, event_attendees__in=[skipper_id, skipped_id]):
            return super().dispatch(request, args, **kwargs)
        else:
            return JsonResponse("One of the users is not in event", status=400, safe=False)
