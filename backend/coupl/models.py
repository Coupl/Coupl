from django.contrib.auth.models import User
from django.db import models
from phonenumber_field import modelfields
from django.utils.translation import gettext_lazy as _


# Create your models here.
class Profile(models.Model):
    preference_list = [["Male"], ["Female"], ["Male", "Female"]]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    name = models.CharField(blank=False, max_length=30)
    surname = models.CharField(blank=False, max_length=30)
    phone = modelfields.PhoneNumberField(blank=False)
    date_of_birth = models.DateField(blank=False)
    description = models.CharField(default="", max_length=200)
    gender = models.CharField(blank=False, max_length=10)  # "Male" or "Female" written on db
    sexual_orientation = models.CharField(max_length=100)
    preference = models.CharField(blank=False, max_length=10)  # Preference list index
    hobbies = models.ManyToManyField("Hobby", related_name="hobbies")

    @property
    def eventHistory(self):
        return  # Event.objects.filter(event_attendees__profile__in=[self])

    @property
    def matchHistory(self):
        return  # Profile.objects.filter(profile__in=self.likes).filter(likes__in=self)


class Coordinator(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    coordinator_name = models.CharField(max_length=75)
    coordinator_phone = modelfields.PhoneNumberField(blank=False)
    coordinator_details = models.CharField(max_length=250)


class Hobby(models.Model):
    title = models.CharField(max_length=50)
    type = models.CharField(max_length=100)

    def __str__(self):
        return self.title


class ProfilePicture(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=100)
    profile = models.ForeignKey("Profile", on_delete=models.CASCADE, related_name='profile_pictures')
    url = models.CharField(max_length=150)
    order = models.IntegerField()

    def __str__(self):
        return str(self.profile.pk) + " Order: " + str(self.order)


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


class LocationPictures(models.Model):
    title = models.CharField(max_length=50, blank=True)
    description = models.CharField(max_length=100, blank=True)
    location = models.ForeignKey("Location", on_delete=models.CASCADE, related_name="location_picture")
    url = models.CharField(max_length=150)
    order = models.IntegerField()


class Event(models.Model):
    event_name = models.CharField(blank=False, max_length=50)
    event_description = models.CharField(blank=True, max_length=150)
    event_tags = models.ManyToManyField("Tag")
    event_start_time = models.DateTimeField(blank=False)
    event_finish_time = models.DateTimeField(blank=False)
    event_creator = models.ForeignKey("Coordinator", on_delete=models.CASCADE)
    event_location = models.ForeignKey("Location", on_delete=models.CASCADE)
    event_attendees = models.ManyToManyField(User)

    @property
    def eventQRCode(self):
        # qr = qrcode.QRCode(version=2)
        # qr.add_data(str(self.id) + " " + self.eventName)
        # qr.make_image(fill_color="black", back_color="white").save("deneme.png")
        return 1


class Comment(models.Model):
    commenter = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey("Event", on_delete=models.CASCADE, related_name="comments")
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
    event = models.ForeignKey("Event", on_delete=models.CASCADE, related_name="ratings")


class Tag(models.Model):
    tag_name = models.CharField(blank=False, max_length=50)
    tag_description = models.CharField(max_length=100)


class SubAreas(models.Model):
    event = models.ForeignKey("Event", on_delete=models.CASCADE, related_name='sub_areas')
    area_name = models.CharField(blank=False, max_length=50)
    area_description = models.CharField(max_length=100)
    area_picture = models.CharField(max_length=100)


class CoordinatorPicture(models.Model):
    coordinator = models.OneToOneField(Coordinator, on_delete=models.CASCADE, related_name="photo")
    url = models.CharField(max_length=100)


class Ticket(models.Model):
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reporter")
    reported = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reported")
    description = models.CharField(blank=False, max_length=250)
    status = models.CharField(default="Pending", max_length=20)
