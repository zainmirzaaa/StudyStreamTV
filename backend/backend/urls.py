# blog/urls.py
from django.urls import path
from views.user import user
from views.liveUser import liveUser


urlpatterns = [
    path('', user, name='homepage'),
    path('liveUser',liveUser, name="liveUser")
]
