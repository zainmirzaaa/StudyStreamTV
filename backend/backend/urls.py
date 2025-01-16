# blog/urls.py
from django.urls import path
from views.user import user
from views.liveUser import liveUser
from views.followers import followers


urlpatterns = [
    path('', user, name='homepage'),
    path('liveUser',liveUser, name="liveUser"),
    path('followers', followers, name="followers")
]
