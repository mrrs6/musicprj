from django.conf.urls import url
from api import views

urlpatterns = [
    url(r'^users/$', views.users_view_general),
    url(r'^users/filter_by_usermail/(?P<email_address>.+)/$', views.users_view_filterbyemail),
    url(r'^tracks/$', views.tracks_view_general),
    url(r'^tracks/filter_by_usermail/(?P<email_address>.+)/$', views.tracks_view_filterbyemail),
    url(r'^tracks/search/(?P<expression>.+)/$', views.tracks_view_search),
    url(r'^tracks/populate/$', views.tracks_view_populate, {'confirmation': "0"}),
    url(r'^tracks/populate/(?P<confirmation>.+)?/$', views.tracks_view_populate),
    url(r'^tracks/toggle_favorite/(?P<track_id>.+)/(?P<user_email>.+)/$', views.tracks_view_togglefavorite),
]
