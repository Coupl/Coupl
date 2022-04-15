from rest_framework import permissions
from coupl.models import Event


class UserInEventPermission(permissions.BasePermission):
    message = 'User is not in the event.'

    def has_permission(self, request, view):
        event_id = request.data.get('event_id')
        user_id = request.user.pk
        return Event.objects.filter(pk=event_id, event_attendees__in=[user_id])
