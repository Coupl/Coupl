from django.shortcuts import redirect
from django.core.exceptions import ObjectDoesNotExist
from coupl.models import Event, User
import json


# Login required


class UserGetMatchesMixin:
    def dispatch(self, request, *args, **kwargs):
        event_id = json.loads(self.request.body)['eventId']
        user_id = json.loads(self.request.body)['userId']
        args = {"event_id": event_id, "user_id": user_id}
        if Event.objects.filter(pk=event_id, event_attendees__in=[user_id]):
            return super().dispatch(request, args, **kwargs)
        else:
            raise ObjectDoesNotExist
