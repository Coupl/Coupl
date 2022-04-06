from django.contrib.auth.models import User
from django.forms import model_to_dict
from rest_framework import serializers
from coupl.models import Profile, Event, Tag, ProfilePicture, Match


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['pk', 'username', 'password']

    def create(self, validated_data):
        print(validated_data)
        return User.objects.create_user(username=validated_data.get('username'),
                                        password=validated_data.get('password'))

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username')
        instance.password = validated_data.get('password')
        instance.save()
        return instance


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['tag_name', 'tag_description']

    def create(self, validated_data):
        return Tag.objects.create(tag_name=validated_data.get('tagName'),
                                  tag_description=validated_data.get('tagDescription'))

    def update(self, instance, validated_data):
        instance.tag_name = validated_data.get('tagName')
        instance.tag_description = validated_data.get('tagDescription')
        instance.save()
        return instance


class UserDisplaySerializer(serializers.RelatedField):
    def to_representation(self, value):
        username = value.username
        pk = value.pk
        return {"pk": pk, "username": username}


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


class ProfileSerializer(serializers.ModelSerializer):
    user = UserDisplaySerializer(read_only=True)
    profile_pictures = ProfilePictureSerializer(read_only=True, many=True)

    class Meta:
        model = Profile
        fields = ['user', 'profile_pictures', 'name', 'surname', 'phone', 'date_of_birth', 'description',
                  'gender', 'preference']

    def create(self, validated_data):
        return Profile.objects.create(user=validated_data.get('user'), name=validated_data.get('name'),
                                      surname=validated_data.get('surname'),
                                      phone=validated_data.get('phone'),
                                      date_of_birth=validated_data.get('dateOfBirth'),
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


class EventSerializer(serializers.ModelSerializer):
    event_attendees = UserDisplaySerializer(many=True, read_only=True)
    event_tags = TagDisplaySerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'event_name', 'event_description', 'event_creator', 'event_start_time',
                  'event_finish_time', 'event_attendees', 'event_tags']

    def create(self, validated_data):
        print(validated_data)
        return Event.objects.create(event_name=validated_data.get('eventName'),
                                    event_description=validated_data.get('eventDescription'),
                                    event_creator=validated_data.get('eventCreator'),
                                    event_start_time=validated_data.get('eventStartTime'),
                                    event_finish_time=validated_data.get('eventFinishTime'))


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['liker', 'liked', 'skip', 'event', 'confirmed']
