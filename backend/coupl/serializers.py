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
        return User.objects.create(username=validated_data.get('username'), password=validated_data.get('password'))

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
        return Tag.objects.create(tagName=validated_data.get('tagName'),
                                  tagDescription=validated_data.get('tagDescription'))

    def update(self, instance, validated_data):
        instance.tagName = validated_data.get('tagName')
        instance.tagDescription = validated_data.get('tagDescription')
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
        fields = ['user', 'name', 'surname', 'phone', 'dateOfBirth', 'description',
                  'photos', 'gender', 'preference']

    def create(self, validated_data):
        return Profile.objects.create(user=validated_data.get('user'), name=validated_data.get('name'),
                                      surname=validated_data.get('surname'),
                                      phone=validated_data.get('phone'), dateOfBirth=validated_data.get('dateOfBirth'),
                                      description=validated_data.get('description'),
                                      gender=validated_data.get('gender'), preference=validated_data.get('preference'))
    #def update TO BE IMPLEMENTED


class TagDisplaySerializer(serializers.RelatedField):
    def to_representation(self, value):
        pk = value.pk
        tagName = value.tagName
        tagDescription = value.tagDescription
        return {"pk": pk, "tagName": tagName, "tagDescription": tagDescription}


class EventSerializer(serializers.ModelSerializer):
    eventAttendees = UserDisplaySerializer(many=True, read_only=True)
    eventTags = TagDisplaySerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'eventName', 'eventDescription', 'eventCreator', 'eventStartTime',
                  'eventFinishTime', 'eventAttendees', 'eventTags']

    def create(self, validated_data):
        print(validated_data)
        return Event.objects.create(eventName=validated_data.get('eventName'),
                                    eventDescription=validated_data.get('eventDescription'),
                                    eventCreator=validated_data.get('eventCreator'),
                                    eventStartTime=validated_data.get('eventStartTime'),
                                    eventFinishTime=validated_data.get('eventFinishTime'))
