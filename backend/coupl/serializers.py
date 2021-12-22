from django.contrib.auth.models import User
from rest_framework import serializers
from coupl.models import Profile, Event



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        print(validated_data)
        return User.objects.create(username=validated_data.get('username'), password=validated_data.get('password'))

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username')
        instance.password = validated_data.get('password')
        instance.save()
        return instance


class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
        fields = ['eventName', 'eventDescription', 'eventCreator', 'eventStartTime', 'eventFinishTime']

    def create(self, validated_data):
        print(validated_data)
        return Event.objects.create(eventName=validated_data.get('eventName'),
                                    eventDescription=validated_data.get('eventDescription'),
                                    eventCreator=validated_data.get('eventCreator'),
                                    eventStartTime=validated_data.get('eventStartTime'),
                                    eventFinishTime=validated_data.get('eventFinishTime'))
