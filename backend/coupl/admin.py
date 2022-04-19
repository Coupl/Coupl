from django.contrib import admin
from .models import Profile, Coordinator, Event, Comment, Rating, SubAreas, Location, Tag, Ticket, Match, \
    ProfilePicture, LocationPictures, CoordinatorPicture, Hobby

# Register your models here.
admin.site.register(Profile)
admin.site.register(ProfilePicture)
admin.site.register(Hobby)
admin.site.register(Coordinator)
admin.site.register(CoordinatorPicture)

admin.site.register(Event)
admin.site.register(SubAreas)
admin.site.register(Location)
admin.site.register(LocationPictures)
admin.site.register(Tag)
admin.site.register(Comment)

admin.site.register(Ticket)
admin.site.register(Rating)

admin.site.register(Match)
