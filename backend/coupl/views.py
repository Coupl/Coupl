import phonenumbers
from django.contrib.auth.models import User
from django.db.models import Max, Count, Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from oauth2_provider.views import TokenView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.exceptions import ObjectDoesNotExist

from backend.settings import PHONENUMBER_DEFAULT_REGION
from coupl.serializers import UserSerializer, EventSerializer, TagSerializer, \
    ProfileSerializer, MatchSerializer, ProfilePictureSerializer, CoordinatorSerializer, CoordinatorPictureSerializer, \
    HobbySerializer, MatchDetailedSerializer, LocationSerializer, TicketSerializer, SubAreasSerializer, \
    ProfileWithMatchDetailsSerializer, MatchScoreSerializer, \
    EventWithMatchDetailsSerializer, MessageSerializer
from coupl.models import Event, Tag, Profile, Match, ProfilePicture, Coordinator, Hobby, Rating, Ticket, Comment, \
    Location, SubAreas, MatchScore, Message
from itertools import chain
import coupl.permissions

import numpy as np
from fancyimpute import KNN, SoftImpute, BiScaler, IterativeImputer, NuclearNormMinimization
from sklearn.impute import IterativeImputer


# region USER VIEWS
# todo Send user login token when successfully logged in
class LoginView(APIView):
    def post(self, request, format=None):
        username = request.data['username']
        password = request.data['password']
        user = get_object_or_404(User, username=username)
        if user.check_password(password):
            tk = TokenView(request=request)
            return tk.validate_authorization_request()


class UserType(APIView):
    def get(self, request, format=None):
        user_id = request.user.pk
        if Coordinator.objects.filter(user__pk=user_id):
            return JsonResponse("Coordinator", status=200, safe=False)
        else:
            return JsonResponse("User", status=200, safe=False)


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
        if (last_pic['order__max'] is None):
            order = 1
        else:
            order = last_pic['order__max'] + 1
        request.data['order'] = order
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


# region COORDINATOR EVENTS VIEWS
class CoordinatorUpcomingEvents(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsCoordinator]

    def get(self, request, format=None):
        events = Event.objects.filter(event_creator=request.user.coordinator, event_start_time__gt=timezone.now())
        serializer = EventSerializer(events, many=True)
        return Response(data=serializer.data, status=200)


class CoordinatorPreviousEvents(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsCoordinator]

    def get(self, request, format=None):
        events = Event.objects.filter(event_creator=request.user.coordinator, event_finish_time__lt=timezone.now())
        serializer = EventSerializer(events, many=True)
        return Response(data=serializer.data, status=200)


# endregion COORDINATOR EVENTS VIEWS

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
        events = Event.objects.filter(event_start_time__gt=timezone.now())
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)


class AttendedEventsListView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser]

    def get(self, request, format=None):
        user = request.user
        events = Event.objects.filter(event_attendees__id=user.pk)

        events_with_matches = []
        for event in events:
            match_as_liker = Match.objects.filter(liker=user, event=event, state=5)
            match_as_liked = Match.objects.filter(liked=user, event=event, state=5)
            if match_as_liker.exists():
                matchUser = User.objects.get(pk=match_as_liker[0].liked.pk)
                events_with_matches.append({"event": event, "profile": matchUser.profile})
            elif match_as_liked.exists():
                matchUser = User.objects.get(pk=match_as_liked[0].liker.pk)
                events_with_matches.append({"event": event, "profile": matchUser.profile})
            else:
                events_with_matches.append({"event": event, "profile": None})

        serializer = EventWithMatchDetailsSerializer(events_with_matches, many=True)
        return Response(serializer.data)


class CreateEventView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsCoordinator]

    def post(self, request, format=None):
        try:
            event = Event.objects.create(event_name=request.data['event_name'],
                                         event_location_id=request.data['event_location'],
                                         event_description=request.data['event_description'],
                                         event_start_time=request.data['event_start_time'],
                                         event_finish_time=request.data['event_finish_time'],
                                         event_creator_id=request.user.coordinator.pk)
            for tag_id in request.data['event_tags']:
                tag = Tag.objects.get(pk=tag_id)
                event.event_tags.add(tag)
            event.save()
        except:
            return JsonResponse(status=400)
        serializer = EventSerializer(instance=event)
        return JsonResponse(serializer.data, status=201)


class UpdateEventView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsCoordinator,
                          coupl.permissions.CoordinatorInEvent]

    def post(self, request, format=None):
        event = Event.objects.get(pk=request.data['event_id'])
        location = Location.objects.get(pk=request.data['event_location'])
        event.event_name = request.data['event_name']
        event.event_location = location
        event.event_description = request.data['event_description']
        event.event_start_time = request.data['event_start_time']
        event.event_finish_time = request.data['event_finish_time']
        event.save()
        serializer = EventSerializer(event)
        return JsonResponse(data=serializer.data, status=200)


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
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser, coupl.permissions.UserInEvent]

    def post(self, request, format=None):
        user = request.user
        event = Event.objects.get(pk=request.data['event_id'])

        event.event_attendees.remove(user)

        return JsonResponse('Successfully left event', status=201, safe=False)


class EventAddTagView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsCoordinator,
                          coupl.permissions.CoordinatorInEvent]

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
        return JsonResponse(serializer.data, safe=False)


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
class UpdateMatchScores(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser]  # Admin permissionu var mı?

    def post(self, request, format=None):

        matches = Match.objects.all()
        userIds = Profile.objects.all().values_list('user_id', flat=True, named=False)
        userIdsDict = dict(enumerate(userIds, 0))
        reverseUserIdsDict = {v: k for k, v in userIdsDict.items()}

        numProfiles = len(userIds)
        matrix = np.zeros(shape=(numProfiles, numProfiles))

        for match in matches:
            index1 = reverseUserIdsDict[match.liker_id]
            index2 = reverseUserIdsDict[match.liked_id]
            if match.state == 6:
                matrix[index1][index2] -= 1
                matrix[index2][index1] -= 1
            else:
                matrix[index1][index2] += 1
                matrix[index2][index1] += 1

        matrix[matrix == 0] = np.nan

        # imp_mean = IterativeImputer(random_state=0)
        # matrix_iterative = imp_mean.fit_transform(matrix)
        matrix_filled_nnm = KNN(k=10).fit_transform(matrix)
        # matrix_filled_nnm = NuclearNormMinimization().fit_transform(matrix)
        # Consider running the same algorithm on the matrix_filled_nnm

        # sum = 0
        # for i in range(numProfiles):
        #    sum += np.sum(matrix_filled_nnm[i][i])

        # print(matrix)
        # print(matrix_filled_nnm)
        # print(sum, np.sum(matrix_filled_nnm))

        scoresToCreate = []
        for row in range(numProfiles):
            if np.isnan(matrix_filled_nnm[row]).all():
                continue
            rowMax = np.nanmax(matrix_filled_nnm[row])
            rowMin = np.nanmin(matrix_filled_nnm[row])

            for col in range(row):
                if matrix_filled_nnm[row][col] == 0 or np.isnan(matrix_filled_nnm[row][col]).all():
                    continue

                # Score between 0 and 1
                if rowMax == rowMin:
                    score = (np.sign(matrix_filled_nnm[row][col]) + 1) / 2
                else:
                    score = (matrix_filled_nnm[row][col] - rowMin) / (rowMax - rowMin)
                if score != 0:
                    user1 = User.objects.get(pk=userIdsDict[row])
                    user2 = User.objects.get(pk=userIdsDict[col])
                    scoresToCreate.append(
                        MatchScore(user_id=userIdsDict[row], match_id=userIdsDict[col], score=score * 100))

        MatchScore.objects.all().delete()
        MatchScore.objects.bulk_create(scoresToCreate)

        return Response("Done")


class GetUserMatches(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser, coupl.permissions.UserInEvent]

    def post(self, request, format=None):
        user = request.user
        gender_id = Profile.preference_list.index([user.profile.gender])
        event = Event.objects.get(pk=request.data["event_id"])
        liked = Match.objects.filter(event__match__liker=user.pk).values_list('liked_id', flat=True,
                                                                              named=False)
        skips = Match.objects.filter(liked=user, event=event.pk, state=6).values_list('liker_id', flat=True,
                                                                                      named=False)
        matches = Match.objects.filter(event=event.pk, state=5)
        matches_liked = matches.values_list('liked_id', flat=True, named=False)
        matches_liker = matches.values_list('liker_id', flat=True, named=False)

        # List of all potential matches
        attendees = event.event_attendees.exclude(pk=user.pk).exclude(pk__in=liked).exclude(pk__in=skips).exclude(
            pk__in=matches_liked).exclude(pk__in=matches_liker).filter(
            profile__gender__in=Profile.preference_list[int(user.profile.preference)],
            profile__preference__in=[gender_id, 2])

        user_past_events = Event.objects.filter(event_attendees__id=user.pk).exclude(
            pk=event.pk)

        user_location_freqs = Location.objects.filter(event__in=user_past_events).annotate(frequency=Count("id"))
        user_tag_freqs = Tag.objects.filter(event__in=user_past_events).annotate(frequency=Count("id"))

        user_hobbies = user.profile.hobbies.all()
        match = []
        for attendee in attendees:
            attendee_past_events = Event.objects.filter(event_attendees__id=attendee.pk).exclude(
                pk=event.pk)
            common_events = user_past_events.filter(pk__in=attendee_past_events)

            attendee_hobbies = attendee.profile.hobbies.all()
            common_hobbies = user_hobbies.intersection(attendee_hobbies)

            attendee_tag_freqs = Tag.objects.filter(event__in=attendee_past_events).annotate(frequency=Count("id"))
            common_tags = []
            for tag in user_tag_freqs:
                if tag in attendee_tag_freqs:
                    attendee_tag = next((tag for tag in attendee_tag_freqs if ...), None)
                    minFreq = min(tag.frequency, attendee_tag.frequency)
                    common_tags.append({"tag": tag, "frequency": minFreq})

            # Find the common event locations of user and attendee
            common_locations = []
            attendee_location_freqs = Location.objects.filter(event__in=attendee_past_events).annotate(
                frequency=Count("id"))

            for location in user_location_freqs:
                if location in attendee_location_freqs:
                    attendee_location = next((location for location in attendee_location_freqs if ...), None)
                    minFreq = min(location.frequency, attendee_location.frequency)
                    common_locations.append({"location": location, "frequency": minFreq})

            hobbies_score = (2 * len(common_hobbies)) / (len(user_hobbies) + len(attendee_hobbies))
            tags_score = (2 * sum(tag["frequency"] for tag in common_tags)) / (
                    sum(tag.frequency for tag in user_tag_freqs) + sum(tag.frequency for tag in attendee_tag_freqs))

            get_score = MatchScore.objects.filter(
                Q(user_id=user.pk, match_id=attendee.pk) | Q(user_id=attendee.pk, match_id=user.pk)).first()
            if get_score is not None:
                past_matches_score = get_score.score / 100
            else:
                past_matches_score = 0
            scores = [hobbies_score, tags_score, past_matches_score]
            total_score = sum(scores) * 0.4 - min(scores) * 0.2

            match_scores = {"hobbies_score": hobbies_score, "tags_score": tags_score,
                            "past_matches_score": past_matches_score, "total_score": total_score}

            match.append(
                {"profile": attendee.profile, "common_events": common_events, "common_hobbies": common_hobbies,
                 "common_event_tags": common_tags, "common_event_locations": common_locations,
                 "match_scores": match_scores})
        serializer = MatchDetailedSerializer(match, many=True)
        return Response(serializer.data)


class GetUserBestMatch(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser, coupl.permissions.UserInEvent]

    def post(self, request, format=None):
        user = request.user
        event = Event.objects.get(pk=request.data["event_id"])
        liked = Match.objects.filter(event__match__liker=user.pk).values_list('liked_id', flat=True,
                                                                              named=False)
        matched = Match.objects.filter(state=5).values_list('liked_id', flat=True, named=False)
        attendee = event.event_attendees.exclude(pk=user.pk).exclude(pk__in=liked).filter(
            profile__gender__in=Profile.preference_list[int(user.profile.preference)]).first()
        if not attendee:
            return JsonResponse('No matches found.', status=400, safe=False)
        serializer = ProfileSerializer(attendee.profile)
        return Response(serializer.data)


class UserLike(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser, coupl.permissions.UserInEvent]

    def post(self, request, format=None):
        liked_id = request.data["liked_id"]
        event_id = request.data["event_id"]

        liker = request.user
        liked = User.objects.get(pk=liked_id)
        event = Event.objects.get(pk=event_id)

        # Liked user also previously liked the liker, match confirms
        match = Match.objects.filter(liked=liker, liker=liked, event=event, state=0)
        if match:
            match = match[0]

            # Check if one of the users have an active match
            active_match = Match.objects.filter(liked_id__in=[liker.pk, liked_id], liker_id__in=[liker.pk, liked_id],
                                                event=event, state__in=[2, 3, 4, 5])
            if active_match:  # If so keep this at a passive match
                match.state = 1
            else:  # Else make this an active match
                match.state = 2
            match.save()
        # Else create new match
        else:
            # Check if a match with a progressed state exists
            match = Match.objects.filter(liked_id__in=[liker.pk, liked_id], liker_id__in=[liker.pk, liked_id],
                                         event=event,
                                         state__gt=0)
            if match:
                return JsonResponse('User not in likeable state', status=400, safe=False)
            match = Match(liker=liker, liked=liked, event=event, state=0)
            match.save()

        serializer = MatchSerializer(match)
        return Response(serializer.data)


# Will make this beautiful later
class UserSkip(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.UserInEvent]

    def post(self, request, format=None):
        skipped_id = request.data["skipped_id"]
        event_id = request.data["event_id"]

        skipper = request.user
        skipped = User.objects.get(pk=skipped_id)
        event = Event.objects.get(pk=event_id)

        # If the skipped person previously liked the skipper
        match = Match.objects.filter(liker=skipped, liked=skipper, event=event)
        if match:
            match = match[0]
            match.state = 6
            match.save()
            activate = Match.objects.filter(liker_id__in=[request.user.pk], liked_id__in=[request.user.id], event=event,
                                            state=1)
            if activate:
                activate = activate.first()
                activate.state = 2
                activate.save()
                serializer = MatchSerializer(activate)
                return JsonResponse(data=serializer.data, status=200)
            else:
                serializer = MatchSerializer(match)
                return JsonResponse(data=serializer.data, status=200)

        match = Match(liker=skipper, liked=skipped, event=event, state=6)
        match.save()
        serializer = MatchSerializer(match)
        return Response(data=serializer.data)


class GetActiveLikes(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.UserInEvent]

    def post(self, request, format=None):
        event_id = request.data["event_id"]
        user = request.user
        event = Event.objects.get(pk=event_id)

        mutuals_as_liker = Match.objects.filter(liker=user, event=event, state__in=[2, 3, 4, 5]).values_list('liked',
                                                                                                             flat=True,
                                                                                                             named=False)
        mutuals_as_liked = Match.objects.filter(liked=user, event=event, state__in=[2, 3, 4, 5]).values_list('liker',
                                                                                                             flat=True,
                                                                                                             named=False)

        mutuals = list(chain(mutuals_as_liker, mutuals_as_liked))

        if len(mutuals) == 0:
            return JsonResponse("No active likes for the user", status=400, safe=False)
        else:
            mutual = mutuals[0]  # We should not have more than 1 active like
            mutual = User.objects.filter(pk=mutual)
            mutual = mutual[0]
            profile = mutual.profile

        match_as_liker = Match.objects.filter(liker=user, event=event, state__in=[2, 3, 4, 5])
        match_as_liked = Match.objects.filter(liked=user, event=event, state__in=[2, 3, 4, 5])

        matches = list(chain(match_as_liked, match_as_liker))
        match = matches[0]
        object = {"match": match, "profile": profile}

        serializer = ProfileWithMatchDetailsSerializer(object)
        # mutuals = Profile.objects.filter(user_in=mutuals)
        # serializer = ProfileSerializer(mutuals, many=True)
        return Response(serializer.data)


class ConfirmMatchView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser, coupl.permissions.UserInEvent]

    def post(self, request, format=None):
        match = Match.objects.filter(Q(liked=request.user) | Q(liker=request.user)).filter(
            event=request.data['event_id'], state__in=[3, 4])
        if len(match) == 0:
            return JsonResponse("No match found", status=404, safe=False)
        match = match[0]
        match.state += 1
        match.save()
        serializer = MatchSerializer(match)
        return JsonResponse(data=serializer.data, status=200)


class ChooseMatchSubareaView(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.UserInEvent, coupl.permissions.IsUser]

    def post(self, request, format=None):
        users = [request.data['liked_id'], request.user.pk]
        event = Event.objects.get(pk=request.data['event_id'])
        match = Match.objects.filter(liker_id__in=users, liked_id__in=users, event_id=event, state=2)
        if len(match) == 0:
            return Response(status=404)
        match = match[0]
        sub_area = SubAreas.objects.get(pk=request.data['sub_area_id'])
        match.state = 3
        match.meeting_location = sub_area
        match.save()
        serializer = MatchSerializer(match)

        return JsonResponse(data=serializer.data, status=200)


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

# region MESSAGE VIEWS

class SendMessage(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser]

    def post(self, request, format=None):
        user = request.user
        serializer = MessageSerializer(data={'sender': user.pk, 'receiver': request.data['receiver_id'],
                                             'content': request.data['content']})
        if serializer.is_valid():
            serializer.save()

            receiver = User.objects.get(pk=request.data['receiver_id'])
            messages = Message.objects.filter(Q(sender=user, receiver=receiver) | Q(sender=receiver, receiver=user)).order_by('date')
            allMessages = MessageSerializer(messages, many=True)
            return Response(allMessages.data)

            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

class GetMessagedPeople(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser]

    def get(self, request, format=None):
        user = request.user
        receivedPeople = Message.objects.filter(receiver=user).values_list('sender', flat=True, named=False)
        sentPeople = Message.objects.filter(sender=user).values_list('receiver', flat=True, named=False)
        people = list(chain(receivedPeople, sentPeople))
        uniquePeople = list(set(people))
        profiles = Profile.objects.filter(user_id__in=uniquePeople)

        profilesWithEvent = []
        for profile in profiles:
            match = Match.objects.filter(state=5).filter(Q(liker=profile.user, liked=user) | Q(liked=profile.user, liker=user)).first() 
            matchedEvent = Event.objects.first()
            profileWithEvent = {'profile': profile, 'event': matchedEvent}
            profilesWithEvent.append(profileWithEvent)

        serializer = EventWithMatchDetailsSerializer(profilesWithEvent, many=True)
        return Response(serializer.data)

class GetChat(APIView):
    permission_classes = [permissions.IsAuthenticated, coupl.permissions.IsUser]

    def post(self, request, format=None):
        user = request.user
        otherUser = User.objects.get(pk=request.data['other_user_id'])
        messages = Message.objects.filter(Q(sender=user, receiver=otherUser) | Q(sender=otherUser, receiver=user)).order_by('date')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

# endregion MESSAGE VIEWS
