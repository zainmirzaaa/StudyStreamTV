# blog/urls.py
from django.urls import path
from .views.home import my_json_view


urlpatterns = [
    path('', my_json_view, name='homepage'),
    
]
