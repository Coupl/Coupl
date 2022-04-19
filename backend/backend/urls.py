"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers


import coupl.views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),

    path('listProfile/', coupl.views.ListProfileView.as_view()),
    path('createProfile/', coupl.views.CreateProfileView.as_view()),
    path('getMatchList/', coupl.views.GetUserMatches.as_view()),
    path('updateProfile/', coupl.views.UpdateProfileView.as_view()),
    path('getProfile/', coupl.views.GetProfileView.as_view()),
    path('addProfileHobby/', coupl.views.AddHobbyProfileView.as_view()),
    path('removeProfileHobby/', coupl.views.RemoveHobbyProfileView.as_view()),

    path('addPicture/', coupl.views.AddProfilePictureView.as_view()),
    path('removePicture/', coupl.views.RemoveProfilePictureView.as_view()),
    path('swapPhotos/', coupl.views.SwapProfilePictureView.as_view()),

    path('getHobbies/', coupl.views.GetHobbiesView.as_view()),
    path('addHobby/', coupl.views.AddHobbyView.as_view()),
    path('removeHobby/', coupl.views.RemoveHobbyView.as_view()),

    path('listEvents/', coupl.views.EventListView.as_view()),
    path('getEvent/', coupl.views.GetEventView.as_view()),
    path('addEvent/', coupl.views.CreateEventView.as_view()),
    path('leaveEvent/', coupl.views.LeaveEventView.as_view()),
    path('joinEvent/', coupl.views.JoinEventView.as_view()),

    path('createTag/', coupl.views.CreateTagView.as_view()),
    path('eventAddTag/', coupl.views.EventAddTagView.as_view()),
    path('listTags/', coupl.views.TagListView.as_view()),

    path('getBestMatch/', coupl.views.GetUserBestMatch.as_view()),
    path('likeUser/', coupl.views.UserLike.as_view()),
    path('skipUser/', coupl.views.UserSkip.as_view()),
    path('getMutualLikes/', coupl.views.GetUserMutualLikes.as_view()),

    path('createCoordinator/', coupl.views.CreateCoordinatorView.as_view()),
    path('updateCoordinator/', coupl.views.UpdateCoordinatorView.as_view()),
    path('getCoordinator/', coupl.views.GetCoordinatorView.as_view()),

    path('addCoordinatorPhoto/', coupl.views.CoordinatorAddPhotoView.as_view()),
    path('updateCoordinatorPhoto/', coupl.views.CoordinatorUpdatePhotoView.as_view()),
    path('removeCoordinatorPhoto/', coupl.views.CoordinatorRemovePhotoView.as_view()),


]
