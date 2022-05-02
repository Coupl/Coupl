from django.contrib.auth.models import User
from rest_framework import serializers
from coupl.models import Profile, Event, Tag, ProfilePicture, Match, Coordinator, CoordinatorPicture, Hobby, Location, \
    Comment, Rating, SubAreas, Ticket, LocationPictures


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['pk', 'username', 'password']

    def to_representation(self, instance):
        username = instance.username
        pk = instance.pk
        return {"pk": pk, "username": username}

    def create(self, validated_data):
        return User.objects.create_user(username=validated_data.get('username'),
                                        password=validated_data.get('password'))

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username')
        instance.password = validated_data.get('password')
        instance.save()
        return instance


class UserDisplaySerializer(serializers.RelatedField):
    def to_representation(self, value):
        username = value.username
        pk = value.pk
        return {"pk": pk, "username": username}


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['tag_name', 'tag_description']

    def create(self, validated_data):
        return Tag.objects.create(tag_name=validated_data.get('tag_name'),
                                  tag_description=validated_data.get('tag_description'))

    def update(self, instance, validated_data):
        instance.tag_name = validated_data.get('tag_name')
        instance.tag_description = validated_data.get('tag_description')
        instance.save()
        return instance


class ProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilePicture
        fields = ['pk', 'title', 'description', 'profile', 'url', 'order']


class ProfilePictureDisplaySerializer(serializers.RelatedField):
    def to_representation(self, value):
        title = value.title
        description = value.description
        profile = value.profile
        url = value.url
        order = value.order
        return {"title": title, "description": description, "profile": profile, "url": url, "order": order}


class HobbySerializer(serializers.ModelSerializer):
    class Meta:
        model = Hobby
        fields = ["title", "type"]


class ProfileSerializer(serializers.ModelSerializer):
    user = UserDisplaySerializer(read_only=True)
    profile_pictures = ProfilePictureSerializer(read_only=True, many=True)
    hobbies = HobbySerializer(read_only=True, many=True)

    class Meta:
        model = Profile
        fields = ['user', 'name', 'surname', 'phone', 'date_of_birth', 'description',
                  'gender', 'sexual_orientation', 'preference', 'profile_pictures', 'hobbies']
        read_only_fields = ['user']
        depth = 1

    def create(self, validated_data):
        return Profile.objects.create(user=validated_data.get('user'), name=validated_data.get('name'),
                                      surname=validated_data.get('surname'),
                                      phone=validated_data.get('phone'),
                                      date_of_birth=validated_data.get('date_of_birth'),
                                      description=validated_data.get('description'),
                                      gender=validated_data.get('gender'), preference=validated_data.get('preference'))

    # todo
    def update(self, instance, validated_data):
        profile = Profile.objects.get(pk=instance.pk)
        profile.name = validated_data['name']
        profile.surname = validated_data['surname']
        profile.phone = validated_data['phone']
        profile.date_of_birth = validated_data['date_of_birth']
        profile.description = validated_data['description']
        profile.gender = validated_data['gender']
        profile.preference = validated_data['preference']
        return profile.save()


class TagDisplaySerializer(serializers.RelatedField):
    def to_representation(self, value):
        pk = value.pk
        tag_name = value.tag_name
        tag_description = value.tag_description
        return {"pk": pk, "tag_name": tag_name, "tag_description": tag_description}


class CommentSerializer(serializers.ModelSerializer):
    commenter = UserDisplaySerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['commenter', 'event', 'comment_text']


class RatingSerializer(serializers.ModelSerializer):
    rater = UserDisplaySerializer(read_only=True)

    class Meta:
        model = Rating
        fields = ['rating', 'rater', 'event']


class LocationPictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationPictures
        fields = ['title', 'description', 'location', 'url', 'order']


class LocationSerializer(serializers.ModelSerializer):
    location_picture = LocationPictureSerializer(read_only=True, many=True)

    class Meta:
        model = Location
        fields = ['pk', 'name', 'description', 'address', 'location_picture']


class SubAreasSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubAreas
        fields = ['pk', 'event', 'area_name', 'area_description', 'area_picture']


class EventSerializer(serializers.ModelSerializer):
    event_attendees = UserDisplaySerializer(many=True, read_only=True)
    event_tags = TagDisplaySerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    ratings = RatingSerializer(many=True, read_only=True)
    event_location = LocationSerializer(read_only=True)
    sub_areas = SubAreasSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'event_name', 'event_description', 'event_location', 'event_creator', 'event_start_time',
                  'event_finish_time', 'event_attendees', 'event_tags', 'sub_areas', 'comments', 'ratings']

    def create(self, validated_data):
        return Event.objects.create(event_name=validated_data.get('event_name'),
                                    event_description=validated_data.get('event_description'),
                                    event_creator=validated_data.get('event_creator'),
                                    event_start_time=validated_data.get('event_start_time'),
                                    event_finish_time=validated_data.get('event_finish_time'))


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['liker', 'liked', 'state', 'event', 'meeting_location']


class CoordinatorPictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoordinatorPicture
        fields = ['coordinator', 'url']


class CoordinatorSerializer(serializers.ModelSerializer):
    user = UserDisplaySerializer(read_only=True)
    coordinator_pictures = CoordinatorPictureSerializer(read_only=True)

    class Meta:
        model = Coordinator
        fields = ['user', 'coordinator_pictures', 'coordinator_name', 'coordinator_phone', 'coordinator_details',
                  'coordinator_phone']

class TagWithFrequencySerializer(serializers.Serializer):
    tag = TagSerializer(read_only=True)
    frequency = serializers.IntegerField()

class LocationWithFrequencySerializer(serializers.Serializer):
    location = LocationSerializer(read_only=True)
    frequency = serializers.IntegerField()

class MatchDetailedSerializer(serializers.Serializer):
    profile = ProfileSerializer(read_only=True)
    common_events = EventSerializer(many=True, read_only=True)
    common_hobbies = HobbySerializer(many=True, read_only=True)
    common_event_tags = TagWithFrequencySerializer(many=True, read_only=True)
    common_event_locations = LocationWithFrequencySerializer(many=True, read_only=True)


class ProfileWithMatchDetailsSerializer(serializers.Serializer):
    match = MatchSerializer(read_only=True)
    profile = ProfileSerializer(read_only=True)

class EventWithMatchDetailsSerializer(serializers.Serializer):
    event = EventSerializer(read_only=True)
    profile = ProfileSerializer(read_only=True)

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['reporter', 'reported', 'description', 'status']
