from django.contrib import admin
from .models import Profile, Coordinator, Event, Comment, Rating, SubAreas, Location, Tag, Ticket

# Register your models here.
admin.site.register(Coordinator)
admin.site.register(Event)
admin.site.register(Profile)
admin.site.register(Comment)
admin.site.register(Location)
admin.site.register(Tag)
admin.site.register(Ticket)
admin.site.register(Rating)
admin.site.register(SubAreas)