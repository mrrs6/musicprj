from .models import User, Track, ErrorM
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'email', 'starred_tracks')

class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ('track_id_external', 'title', 'artist','album')

class ErrorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ErrorM
        fields = ('message', 'type')

class TracksPopulateSerializer(serializers.ModelSerializer):
    def saved_(self, tr):
          return tr.saved
    saved = serializers.SerializerMethodField('saved_')

    class Meta:
        model = Track
        fields = ('title','saved')
