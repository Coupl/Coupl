import phonenumber_field.modelfields
from django.contrib.auth.models import User
from django.db import models
from phonenumber_field import modelfields
from django.utils.translation import gettext_lazy as _


# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(blank=False, max_length=30)
    surname = models.CharField(blank=False, max_length=30)
    phone = modelfields.PhoneNumberField(blank=False)
    dateOfBirth = models.DateField(blank=False, editable=False)
    description = models.CharField(default="", max_length=200)
    photos = None
    gender = models.CharField(blank=False, max_length=10)  # "Male" or "Female" written on db
    preference = models.CharField(blank=False,
                                  max_length=10)  # Will receive "Male", "Female" or "Both" from the front-end and

    # place what is received into the db
    @property
    def eventHistory(self):
        return None

    @property
    def matchHistory(self):
        return None


class Location(models.Model):
    name = models.CharField(blank=False, max_length=50)
    description = models.CharField(max_length=100)
    address = models.CharField(blank=False, max_length=150)
    # photo = models.ImageField()


class Event(models.Model):
    eventName = models.CharField(blank=False, max_length=50)
    eventDescription = models.CharField(blank=True, max_length=150)
    eventTags = models.ManyToManyField("Tag")
    eventStartTime = models.DateTimeField(blank=False)
    eventFinishTime = models.DateTimeField(blank=False)
    eventCreator = models.ForeignKey("Coordinator", on_delete=models.CASCADE)
    eventLocation = models.ForeignKey("Location", on_delete=models.CASCADE)
    eventAttendees = models.ManyToManyField(User)

    @property
    def eventQRCode(self):
        return None


class Comment(models.Model):
    commenter = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey("Event", on_delete=models.CASCADE)
    commentText = models.CharField(max_length=150)


class Rating(models.Model):
    class Stars(models.IntegerChoices):
        FIVE_STARS = 5, _('*****')
        FOUR_STARS = 4, _('****')
        THREE_STARS = 3, _('***')
        TWO_STARS = 2, _('**')
        ONE_STAR = 1, _('*')

    rating = models.IntegerField(choices=Stars.choices)
    rater = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey("Event", on_delete=models.CASCADE)


class Tag(models.Model):
    tagName = models.CharField(blank=False, max_length=50)
    tagDescription = models.CharField(max_length=100)


class SubAreas(models.Model):
    event = models.ForeignKey("Event", on_delete=models.CASCADE)
    areaName = models.CharField(blank=False, max_length=50)
    areaDescription = models.CharField(max_length=100)
    areaPicture = None


class Coordinator(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    coordinatorPhone = modelfields.PhoneNumberField(blank=False)
    coordinatorContact = None
    coordinatorRating = None


class Ticket(models.Model):
    #reporter = models.ForeignKey(User, on_delete=models.CASCADE)
    #reported = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.CharField(blank=False, max_length=250)
