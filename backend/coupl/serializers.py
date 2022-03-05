from django.contrib.auth.models import User
from django.forms import model_to_dict
from rest_framework import serializers
from coupl.models import Profile, Event, Tag


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['pk', 'username', 'password']

    def create(self, validated_data):
        print(validated_data)
        return User.objects.create_user(username=validated_data.get('username'), password=validated_data.get('password'))

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username')
        instance.password = validated_data.get('password')
        instance.save()
        return instance


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['tagName', 'tagDescription']

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


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ['user', 'name', 'surname', 'phone', 'date_of_birth', 'description',
                  'photos', 'gender', 'preference']

    def create(self, validated_data):
        return Profile.objects.create(user=validated_data.get('user'), name=validated_data.get('name'),
                                      surname=validated_data.get('surname'),
                                      phone=validated_data.get('phone'), date_of_birth=validated_data.get('dateOfBirth'),
                                      description=validated_data.get('description'),
                                      gender=validated_data.get('gender'), preference=validated_data.get('preference'))
    #def update TO BE IMPLEMENTED


class TagDisplaySerializer(serializers.RelatedField):
    def to_representation(self, value):
        pk = value.pk
        tag_name = value.tagName
        tag_description = value.tagDescription
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
