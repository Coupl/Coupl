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

# router = routers.DefaultRouter()
# router.register(r'', coupl.views.UserLoginView)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('', coupl.views.UserLoginView.as_view()),
    path('login', coupl.views.LoginView.as_view()),
    path('getEvent', coupl.views.EventGetView.as_view()),
    path('addEvent/', coupl.views.EventAddView.as_view()),
    path('leaveEvent/', coupl.views.EventLeaveView.as_view()),
    path('joinEvent', coupl.views.EventJoinView.as_view()),
    path('listEvents/', coupl.views.EventListView.as_view()),
    path('createTag/', coupl.views.TagCreateView.as_view()),
    path('eventAddTag', coupl.views.EventAddTagView.as_view()),
    path('listTags/', coupl.views.TagListView.as_view()),
    path('getMatchList', coupl.views.UserGetMatches.as_view()),
    path('createProfile/', coupl.views.CreateProfileView.as_view()),
    path('updateProfile/', coupl.views.UpdateProfileView.as_view()),
    path('getProfile', coupl.views.ProfileGetView.as_view()),
    path('listProfile/', coupl.views.ListProfileView.as_view()),
    path('getBestMatch/', coupl.views.UserGetBestMatch.as_view()),
    path('getMatchList/', coupl.views.UserGetMatches.as_view()),
    path('getMutualLikes/', coupl.views.UserGetMutualLikes.as_view()),
    path('likeUser/', coupl.views.UserLike.as_view()),
    path('skipUser/', coupl.views.UserSkip.as_view()),

    path('addPicture/', coupl.views.AddProfilePicture.as_view()),
    path('removePicture/', coupl.views.RemoveProfilePicture.as_view()),
    path('swapPhotos/', coupl.views.SwapProfilePicture.as_view()),

]
