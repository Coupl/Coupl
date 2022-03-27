import datetime

import qrcode
from django.contrib.auth.models import User
from django.db import models
from phonenumber_field import modelfields
from django.utils.translation import gettext_lazy as _
import qrcode as qr


# Create your models here.
class Profile(models.Model):
    preference_list = [["Male"], ["Female"], ["Male", "Female"]]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(blank=False, max_length=30)
    surname = models.CharField(blank=False, max_length=30)
    phone = modelfields.PhoneNumberField(blank=False)
    date_of_birth = models.DateField(blank=False)
    description = models.CharField(default="", max_length=200)
    photos = None
    gender = models.CharField(blank=False, max_length=10)       # "Male" or "Female" written on db
    preference = models.CharField(blank=False, max_length=10)   # Preference list index
    # likes = models.ManyToManyField("self", through_fields=("Match", "liker"))

    @property
    def eventHistory(self):
        return Event.objects.filter(eventAttendees__in=self)

    @property
    def matchHistory(self):
        return  # Profile.objects.filter(profile__in=self.likes).filter(likes__in=self)


class ProfilePicture(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=100)
    profile = models.ForeignKey("Profile", on_delete=models.CASCADE)
    image = models.ImageField(upload_to='user_images/')
    order = models.IntegerField()


class Match(models.Model):
    liker = models.ForeignKey(User, on_delete=models.CASCADE, related_name="liker")
    liked = models.ForeignKey(User, on_delete=models.CASCADE, related_name="liked")
    skip = models.BooleanField(default=False)
    event = models.ForeignKey("Event", on_delete=models.CASCADE)
    confirmed = models.BooleanField(default=False)

class Location(models.Model):
    name = models.CharField(blank=False, max_length=50)
    description = models.CharField(max_length=100)
    address = models.CharField(blank=False, max_length=150)
    # photo = models.ImageField()


class LocationPictures(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=100)
    location = models.ForeignKey("Location", on_delete=models.CASCADE)
    image = models.ImageField(upload_to='user_images/')
    order = models.IntegerField()


class Event(models.Model):
    event_name = models.CharField(blank=False, max_length=50)
    event_description = models.CharField(blank=True, max_length=150)
    event_tags = models.ManyToManyField("Tag")
    event_start_time = models.DateTimeField(blank=False)
    event_finish_time = models.DateTimeField(blank=False)
    event_creator = models.ForeignKey("Coordinator", on_delete=models.CASCADE)
    event_location = models.ForeignKey("Location", on_delete=models.CASCADE, null=True)
    event_attendees = models.ManyToManyField(User)

    @property
    def eventQRCode(self):
        # qr = qrcode.QRCode(version=2)
        # qr.add_data(str(self.id) + " " + self.eventName)
        # qr.make_image(fill_color="black", back_color="white").save("deneme.png")
        return 1


class Comment(models.Model):
    commenter = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey("Event", on_delete=models.CASCADE)
    comment_text = models.CharField(max_length=150)


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
    tag_name = models.CharField(blank=False, max_length=50)
    tag_description = models.CharField(max_length=100)


class SubAreas(models.Model):
    event = models.ForeignKey("Event", on_delete=models.CASCADE)
    area_name = models.CharField(blank=False, max_length=50)
    area_description = models.CharField(max_length=100)
    area_picture = None


class Coordinator(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    coordinator_phone = modelfields.PhoneNumberField(blank=False)
    coordinator_contact = None
    coordinator_rating = None


class Ticket(models.Model):
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reporter")
    reported = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reported")
    description = models.CharField(blank=False, max_length=250)
