from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Max
from django.http import JsonResponse
from rest_framework import permissions
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.exceptions import ObjectDoesNotExist

from coupl.serializers import UserSerializer, EventSerializer, TagSerializer, \
    ProfileSerializer, MatchSerializer, ProfilePictureSerializer, CoordinatorSerializer, CoordinatorPictureSerializer, \
    HobbySerializer, MatchDetailedSerializer, LocationSerializer, TicketSerializer, SubAreasSerializer
from coupl.models import Event, Tag, Profile, Match, ProfilePicture, Coordinator, Hobby, Rating, Ticket, Comment, \
    Location, SubAreas
from itertools import chain
import coupl.permissions


# region USER VIEWS
# todo Send user login token when successfully logged in
class LoginView(APIView):
    def post(self, request, format=None):
        username = request.data['username']
        password = request.data['password']
        authenticated_user = authenticate(username=username, password=password)
        if authenticated_user is not None:
            get, create = Token.objects.get_or_create(user=authenticated_user)
            token = get if get is not None else create
            request.user = authenticated_user
            return JsonResponse(token.key, status=200, safe=False)
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


class UserReportView(APIView):
    def post(self, request, format=None):
        permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser]
        reported = User.objects.get(pk=request.data['reported'])
        description = request.data['description']
        reporter = request.user

        if Ticket.objects.filter(reporter=reporter, reported=reported, status="Pending"):
            return JsonResponse("There's already a pending ticket between users.", status=400, safe=False)

        ticket = Ticket(reporter=reporter, reported=reported, status="Pending", description=description)
        ticket.save()

        return JsonResponse("Successfully created ticket", status=201, safe=False)


# endregion USER VIEWS

# region PROFILE VIEWS
class ListProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        profiles = Profile.objects.all()
        serializer = ProfileSerializer(profiles, many=True)
        # todo
        # i broke something and i dunno what
        return Response(serializer.data)


class CreateProfileView(APIView):
    # jank fest omegalul
    def post(self, request):
        user_serializer = UserSerializer(data=request.data['user'])
        if user_serializer.is_valid():
            user = User.objects.create_user(username=user_serializer.validated_data['username'],
                                            password=user_serializer.validated_data['password'])
        else:
            return JsonResponse("Can't create user", status=400, safe=False)
        request.data.pop('user', None)
        profile_serializer = ProfileSerializer(data=request.data)
        if profile_serializer.is_valid():
            profile = Profile.objects.create(user=user, **request.data)
            data = ProfileSerializer(profile)
            return JsonResponse(data.data, status=201)
        user.delete()  # if profile is not valid the user will should be deleted from the database as well
        return JsonResponse(profile_serializer.errors, status=400)


class GetProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser]

    def get(self, request, format=None):
        profile = request.user.profile
        serializer = ProfileSerializer(profile)

        return Response(serializer.data, status=201)


class UpdateProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser]

    def post(self, request, format=None):
        profile = request.user.profile
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.update(profile, serializer.validated_data)
        return JsonResponse(serializer.data, status=201)


class AddHobbyProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser]

    def post(self, request, format=None):
        profile = Profile.objects.get(user=request.user)
        profile.hobbies.add(Hobby.objects.get(title=request.data['title']))
        serializer = ProfileSerializer(profile)
        return JsonResponse(data=serializer.data)


class RemoveHobbyProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser]

    def post(self, request, format=None):
        profile = Profile.objects.get(user=request.user)
        hobby = Hobby.objects.get(title=request.data['title'])
        if hobby in profile.hobbies.all():
            profile.hobbies.remove(hobby)
            serializer = ProfileSerializer(profile)
            return JsonResponse(data=serializer.data)
        return JsonResponse(False, safe=False)


# region PROFILE PICTURE VIEWS
class AddProfilePictureView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser]

    def post(self, request, format=None):
        profile = request.user.profile
        last_pic = ProfilePicture.objects.filter(profile_id=profile.pk).aggregate(Max('order'))
        request.data['order'] = last_pic['order__max'] + 1
        data = request.data
        data['profile'] = profile.pk
        profile_pic = ProfilePictureSerializer(data=data)
        if profile_pic.is_valid():
            profile_pic.save()
            return JsonResponse(profile_pic.data, status=201)
        return JsonResponse(profile_pic.errors, status=400)


class RemoveProfilePictureView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser]

    def post(self, request, format=None):
        profile = request.user.profile
        pp = ProfilePicture.objects.get(profile_id=profile.pk, order=request.data['order'])
        pp.delete()
        rest = ProfilePicture.objects.filter(profile__user_id=request.data['id'], order__gt=request.data['order'])
        for pic in rest:
            pic.order = pic.order - 1
            pic.save()
        profile = Profile.objects.get(user_id=request.data['id'])
        serializer = ProfileSerializer(profile)
        return JsonResponse(serializer.data, status=201)


class SwapProfilePictureView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser]

    def post(self, request, format=None):
        first_order = request.data['first_order']
        second_order = request.data['second_order']
        profile = request.user.profile
        first = ProfilePicture.objects.get(profile_id=profile.pk, order=first_order)
        second = ProfilePicture.objects.get(profile_id=profile.pk, order=second_order)
        first.order = second_order
        second.order = first_order
        first.save()
        second.save()
        serializer = ProfileSerializer(profile)
        return JsonResponse(serializer.data)


# endregion PROFILE PICTURE VIEWS
# region HOBBY VIEWS
class GetHobbiesView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser]

    def get(self, request, format=None):
        hobbies = Hobby.objects.all().order_by("type")
        serializer = HobbySerializer(hobbies, many=True)
        return Response(serializer.data)


class AddHobbyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        hobby = HobbySerializer(data=request.data)
        if hobby.is_valid():
            hobby.save()
            return JsonResponse(hobby.data)
        return JsonResponse(hobby.errors)


class RemoveHobbyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        hobby = Hobby.objects.get(request.data['title'])
        hobby.delete()
        return JsonResponse(True, safe=False)


# endregion HOBBY VIEWS
# endregion PROFILE VIEWS

# region COORDINATOR VIEWS
class CreateCoordinatorView(APIView):
    def post(self, request, format=None):
        user_serializer = UserSerializer(data=request.data['user'])
        if user_serializer.is_valid():
            user_serializer.save()
        else:
            return JsonResponse("Can't create user", status=400, safe=False)
        request.data.pop('user', None)
        user = User.objects.get(pk=user_serializer.data.get('pk'))
        coordinator_serializer = CoordinatorSerializer(data=request.data)
        if coordinator_serializer.is_valid():
            coordinator = Coordinator.objects.create(user=user, **request.data)
            coordinator_serializer = CoordinatorSerializer(coordinator)
            return JsonResponse(coordinator_serializer.data)
        user.delete()
        return JsonResponse(coordinator_serializer.errors, status=400)


class UpdateCoordinatorView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsCoordinator]

    def post(self, request, format=None):
        coordinator = request.user.coordinator
        serializer = CoordinatorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.update(coordinator, serializer.validated_data)
            return JsonResponse(serializer.data, status=201)


class GetCoordinatorView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsCoordinator]

    def get(self, request, format=None):
        serializer = CoordinatorSerializer(request.user.coordinator)
        return JsonResponse(serializer.data)


# region COORDINATOR PHOTO VIEWS
class CoordinatorAddPhotoView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsCoordinator]

    def post(self, request, format=None):
        request.data['coordinator'] = request.user.coordinator.pk
        serializer = CoordinatorPictureSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


class CoordinatorUpdatePhotoView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsCoordinator]

    def post(self, request, format=None):
        serializer = CoordinatorPictureSerializer(data=request.data)
        if serializer.is_valid():
            serializer.update(request.user.coordinator.photo, request.data)
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=400)


class CoordinatorRemovePhotoView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsCoordinator]

    def post(self, request, format=None):
        picture = request.user.coordinator.photo
        picture.remove()
        return JsonResponse(True, safe=False, status=200)


# endregion COORDINATOR PHOTO VIEWS
# endregion COORDINATOR VIEWS

# region EVENT VIEWS
class EventListView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser]

    def get(self, request, format=None):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)


class CreateEventView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsCoordinator]

    def post(self, request, format=None):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


class GetEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        event_id = request.data['event_id']
        event = Event.objects.get(pk=event_id)

        serializer = EventSerializer(event)

        return Response(serializer.data, status=201)


class JoinEventView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser]

    def post(self, request, format=None):
        event_id = request.data['event_id']
        user = request.user
        try:
            event = Event.objects.get(pk=event_id)
        except ObjectDoesNotExist:
            return JsonResponse('Event with the given id is not found.', status=400, safe=False)
        event.event_attendees.add(user)
        return JsonResponse('Successfully joined the event', status=201, safe=False)


class LeaveEventView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser]

    def post(self, request, format=None):
        user = request.user
        event = Event.objects.get(pk=request.data['event_id'])

        event.event_attendees.remove(user)

        return JsonResponse('Successfully left event', status=201, safe=False)


class EventAddTagView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsCoordinator]

    def post(self, request, format=None):
        event_id = request.data['event_id']
        tag_id = request.data['tag_id']
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


class RateEventView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser, coupl.permissions.UserInEvent]

    def post(self, request, format=None):
        event_id = request.data['event_id']
        user = request.user
        event = Event.objects.get(pk=event_id)

        # Check if the user has already rated the event
        if Rating.objects.filter(rater=user, event=event):
            return JsonResponse('User has already rated the event', status=400, safe=False)

        stars = request.data['rating']
        if stars not in range(1, 6):
            return JsonResponse('Invalid rating', status=400, safe=False)

        rating = Rating(rater=user, event=event, rating=stars)
        rating.save()
        return JsonResponse('Successfully rated the event', status=201, safe=False)


class CommentEventView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser, coupl.permissions.UserInEvent]

    def post(self, request, format=None):
        event_id = request.data['event_id']
        user = request.user
        event = Event.objects.get(pk=event_id)
        comment_text = request.data['comment_text']

        # Check if user has already commented on the event
        if Comment.objects.filter(commenter=user, event=event):
            return JsonResponse('User has already commented on the event', status=400, safe=False)

        comment = Comment(commenter=user, event=event, comment_text=comment_text)
        comment.save()
        return JsonResponse('Successfully commented on the event', status=201, safe=False)


# region TAG VIEWS
class TagListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)


class CreateTagView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        serializer = TagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


# endregion TAG VIEWS
# region LOCATION VIEWS
class LocationListView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsCoordinator]

    def get(self, request, format=None):
        location = Location.objects.all()
        serializer = LocationSerializer(location, many=True)
        return Response(serializer.data)


class CreateLocationView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsCoordinator]

    def post(self, request, format=None):
        serializer = LocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


# endregion LOCATION VIEWS
# region SUBAREA VIEWS
class GetSubAreaView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsCoordinator]

    def post(self, request, format=None):
        sub_areas = SubAreas.objects.filter(event_id=request.data['event'])
        serializer = SubAreasSerializer(sub_areas, many=True)
        return JsonResponse(serializer.data)


class AddSubArea(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsCoordinator]

    def post(self, request, format=None):
        serializer = SubAreasSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


class RemoveSubArea(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsCoordinator]

    def post(self, request, format=None):
        SubAreas.objects.get(pk=request.data['area']).delete()
        return JsonResponse(True, safe=False)
# endregion SUBAREA VIEWS
# endregion EVENT VIEWS

# region LIKE SKIP VIEWS
class GetUserMatches(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.UserInEvent]

    def post(self, request, format=None):
        user = request.user
        event = Event.objects.get(pk=request.data["event_id"])
        liked = Match.objects.filter(event__match__liker=user.pk).values_list('liked_id', flat=True,
                                                                              named=False)

        matches = []

        # List of all potential matches
        attendees = event.event_attendees.exclude(pk=user.pk).exclude(pk__in=liked).filter(
            profile__gender__in=Profile.preference_list[int(user.profile.preference)])

        user_hobbies = user.profile.hobbies.all()
        for attendee in attendees:
            past_events = Event.objects.filter(event_attendees__in=[user.pk, attendee.pk]).distinct().exclude(
                pk=event.pk)

            attendee_hobbies = attendee.profile.hobbies.all()
            common_hobbies = user_hobbies.intersection(attendee_hobbies)

            common_tags = []
            common_locations = []

            matches.append({"user": attendee, "past_events": past_events, "common_hobbies": common_hobbies,
                            "common_event_tags": common_tags, "common_event_locations": common_locations})
        serializer = MatchDetailedSerializer(matches, many=True)
        return Response(serializer.data)


class GetUserBestMatch(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.UserInEvent]

    def post(self, request, format=None):
        user = request.user
        event = Event.objects.get(pk=request.data["event_id"])
        liked = Match.objects.filter(event__match__liker=user.pk).values_list('liked_id', flat=True,
                                                                              named=False)

        attendee = event.event_attendees.exclude(pk=user.pk).exclude(pk__in=liked).filter(
            profile__gender__in=Profile.preference_list[int(user.profile.preference)]).first()
        if not attendee:
            return JsonResponse('No matches found.', status=400, safe=False)
        serializer = ProfileSerializer(attendee.profile)
        return Response(serializer.data)


class UserLike(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.UserInEvent]

    def post(self, request, format=None):
        liked_id = request.data["liked_id"]
        event_id = request.data["event_id"]

        liker = request.user
        liked = User.objects.get(pk=liked_id)
        event = Event.objects.get(pk=event_id)

        # Liked user also previously liked the liker, match confirms
        match = Match.objects.filter(liked=liker, liker=liked, event=event, state=0)
        if match:
            match.state = 1
            match.save()
        # Else create new match
        else:
            # Check if a match with a progressed state exists
            match_where_liked = Match.objects.filter(liked=liker, liker=liked, event=event, state__in=[1, 2, 3, 4, 5, 6])
            match_where_liker = Match.objects.filter(liked=liked, liker=liker, event=event, state__in=[0, 1, 2, 3, 4, 5, 6])
            match = match_where_liked | match_where_liker
            if match:
                return JsonResponse('User not in likeable state', status=400, safe=False)
            match = Match(liker=liker, liked=liked, event=event, state=0)
            match.save()

        serializer = MatchSerializer(match)
        return Response(serializer.data)


class UserSkip(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.UserInEvent]

    def post(self, request, format=None):
        skipped_id = request.data["skipped_id"]
        event_id = request.data["event_id"]

        skipper = request.user
        skipped = User.objects.get(pk=skipped_id)
        event = Event.objects.get(pk=event_id)

        # If the skipped person previously liked the skipper
        match = Match.objects.filter(liker=skipped, liked=skipper, event=event, state=0)
        if match:
            match.state = 6
            match.save()
        else:
            # Check if a match with a progressed state exists
            match_where_liked = Match.objects.filter(liked=skipper, liker=skipped, event=event, state__in=[1, 2, 3, 4, 5, 6])
            match_where_liker = Match.objects.filter(liked=skipped, liker=skipper, event=event, state__in=[1, 2, 3, 4, 5, 6])
            match = match_where_liked | match_where_liker
            if match:
                return JsonResponse('User not in skippable state', status=400, safe=False)
            match = Match(liker=skipper, liked=skipped, event=event, state=6)
            match.save()

        serializer = MatchSerializer(match)
        return Response(serializer.data)


class GetActiveLikes(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.UserInEvent]

    def post(self, request, format=None):
        event_id = request.data["event_id"]
        user = request.user
        event = Event.objects.get(pk=event_id)

        mutuals_as_liker = Match.objects.filter(liker=user, event=event, confirmed=True, state__in=[2, 3, 4, 5]).values_list('liked', flat=True,
                                                                                                     named=False)
        mutuals_as_liked = Match.objects.filter(liked=user, event=event, confirmed=True, state__in=[2, 3, 4, 5]).values_list('liker', flat=True,
                                                                                                     named=False)

        mutuals = list(chain(mutuals_as_liker, mutuals_as_liked))
        mutuals = User.objects.filter(pk__in=mutuals)
        serializer = UserSerializer(mutuals, many=True)
        # mutuals = Profile.objects.filter(user_in=mutuals)
        # serializer = ProfileSerializer(mutuals, many=True)
        return Response(serializer.data)


# TO DO
class ConfirmMatchView(APIView):
    pass


# TO DO
class ChooseMatchSubareaView(APIView):
    pass


# endregion LIKE SKIP VIEWS

# region TICKET VIEWS
class CreateTicketView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        request.data['reporter'] = request.user.pk
        serializer = TicketSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

# endregion TICKET VIEWS