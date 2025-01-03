# blog/urls.py
from django.urls import path
from views.user import user


urlpatterns = [
    path('', user, name='homepage'),
    
]
