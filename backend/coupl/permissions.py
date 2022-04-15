from rest_framework import permissions
from coupl.models import Event, Coordinator


class UserInEvent(permissions.BasePermission):
    message = 'User is not in the event.'

    def has_permission(self, request, view):
        event_id = request.data.get('event_id')
        user_id = request.user.pk
        return Event.objects.filter(pk=event_id, event_attendees__in=[user_id])


class IsCoordinator(permissions.BasePermission):
    message = 'Is not an event coordinator.'

    def has_permission(self, request, view):
        user_id = request.user.pk
        if Coordinator.objects.filter(user__pk=user_id):
            return True
        else:
            return False


class IsUser(permissions.BasePermission):
    message = 'Is not a user(is an event coordinator).'

    def has_permission(self, request, view):
        user_id = request.user.pk
        if Coordinator.objects.filter(user__pk=user_id):
            return False
        else:
            return True
