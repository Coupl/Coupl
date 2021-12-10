import phonenumber_field.modelfields
from django.contrib.auth.models import User
from django.db import models
from phonenumber_field import modelfields


# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField("User", on_delete=models.CASCADE)
    profileName = models.CharField(blank=False, max_length=30)
    profileSurname = models.CharField(blank=False, max_length=30)
    profilePhone = modelfields.PhoneNumberField(blank=False)
    profileDateOfBirth = models.DateField(blank=False, editable=False)
    profileEventHistory = None
    profileMatchHistory = None
    profileDescription = models.CharField(default="", max_length=200)
    profilePhotos = None
    profileGender = models.CharField(blank=False)  # "Male" or "Female" written on db
    profilePreference = models.CharField(blank=False)  # Will receive "Male", "Female" or "Both" from the front-end and
    # place what is received into the db


class Event(models.Model):
    eventName = models.CharField(blank=False, max_length=50)
    eventDescription = models.CharField(blank=True, max_length=150)
    eventTags = models.ManyToManyField("Tag")
    eventStartTime = models.DateTimeField(blank=False)
    eventFinishTime = models.DateTimeField(blank=False)
    eventCreator = models.ForeignKey("User", on_delete=models.CASCADE)
    eventLocation = models.ForeignKey("Location", on_delete=models.CASCADE)
    eventSubAreas = None
    eventRating = None
    eventComment = None
    eventQRCode = None
    eventAttendees = models.ManyToManyField("User")


class Coordinator(models.Model):
    user = models.OneToOneField("User", on_delete=models.CASCADE)
    coordinatorPhone = modelfields.PhoneNumberField(blank=False)
    coordinatorContact = None
    coordinatorRating = None