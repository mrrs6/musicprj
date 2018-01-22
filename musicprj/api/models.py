from django.db import models

# Create your models here.

class Track(models.Model):
    track_id_external = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    album = models.CharField(max_length=255)

    class Meta:
        ordering = ('title','artist',)

class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    starred_tracks = models.ManyToManyField(Track);

    class Meta:
        ordering = ('name',)

class ErrorM(models.Model):
    type = models.CharField(max_length=20)
    message = models.TextField()

    class Meta:
        managed = False         # i don't want this model to be a database table
