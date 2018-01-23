from django.shortcuts import render

from django.http import HttpResponse
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser

from .models import User, Track, ErrorM
from .serializers import UserSerializer, TrackSerializer, TracksPopulateSerializer, ErrorSerializer

import urllib, json, random
from django.views.decorators.csrf import csrf_exempt


class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)

@csrf_exempt
def users_view_general(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return JSONResponse(serializer.data)

    if request.method == 'PUT':
        user=User()
        try:
            data = json.loads(request.body.decode("utf-8"))
            user = User(name=data.get("name"), email=data.get("email"))
            if user.name==None:
                raise Exception("No username provided. (1)")
            if len(user.name)==0:
                raise Exception("No username provided. (2)")
            if user.email==None:
                raise Exception("No email provided. (1)")
            if len(user.email)==0:
                raise Exception("No email provided. (2)")
            try:
                user.save()
            except Exception:
                raise Exception("E-mail already exists.")
        except Exception as e:
            print(str(e))
            error = ErrorM(type="error", message=str(e))
            serializer = ErrorSerializer(error, many=False)
            return JSONResponse(serializer.data)
        serializer = UserSerializer(user, many=False)
        return JSONResponse(serializer.data)

    if request.method == 'DELETE':
        try:
            data = json.loads(request.body.decode("utf-8"))
            try:
                user=User.objects.filter(email=data.get("email"))
                if user==None or len(user)==0:
                    raise Exception()
                user.delete()
            except Exception:
                raise Exception("E-mail not found.")
        except Exception as e:
            print(str(e))
            error = ErrorM(type="error", message=str(e))
            serializer = ErrorSerializer(error, many=False)
            return JSONResponse(serializer.data)

        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return JSONResponse(serializer.data)

@csrf_exempt
def users_view_filterbyemail(request, email_address):
    if request.method == 'GET':
        user = User.objects.filter(email=email_address)
        serializer = UserSerializer(user, many=True)
        return JSONResponse(serializer.data)


@csrf_exempt
def tracks_view_general(request):
    if request.method == 'GET':
        tracks = Track.objects.all()
        serializer = TrackSerializer(tracks, many=True)
        return JSONResponse(serializer.data)

    if request.method == 'PUT':
        track=Track()
        s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ?"
        try:
            data = json.loads(request.body.decode("utf-8"))
            track = Track(title=data.get("title"), artist=data.get("artist"), album=data.get("album"), track_id_external="".join(random.sample(s,8)))
            #NOTE: id random generation may cause future problems as ids can collide, so an additional verification should be made to re-generate random id if it already exists on the db.
            try:
                track.save()
            except Exception:
                raise Exception("ID already exists, or missing mandatory fields.")
        except Exception as e:
            print(str(e))
            error = ErrorM(type="error", message=str(e))
            serializer = ErrorSerializer(error, many=False)
            return JSONResponse(serializer.data)
        serializer = TrackSerializer(track, many=False)
        return JSONResponse(serializer.data)

    if request.method == 'DELETE':
        try:
            data = json.loads(request.body.decode("utf-8"))
            try:
                track=Track.objects.filter(track_id_external=data.get("track_id_external"))
                if track==None or len(track)==0:
                    raise Exception()
                track.delete()
            except Exception:
                raise Exception("Track not found.")
        except Exception as e:
            print(str(e))
            error = ErrorM(type="error", message=str(e))
            serializer = ErrorSerializer(error, many=False)
            return JSONResponse(serializer.data)

        tracks = Track.objects.all()
        serializer = TrackSerializer(tracks, many=True)
        return JSONResponse(serializer.data)

@csrf_exempt
def tracks_view_filterbyemail(request, email_address):
    if request.method == 'GET':
        users = User.objects.filter(email=email_address)
        tracks = []
        for user in users:
            for track in user.starred_tracks.all():
                tracks.append(track)
        serializer = TrackSerializer(tracks, many=True)
        return JSONResponse(serializer.data)

@csrf_exempt
def tracks_view_search(request, expression):
    if request.method == 'GET':
        tracks = Track.objects.filter(title__icontains=expression)
        tracks = tracks | Track.objects.filter(album__icontains=expression)
        tracks = tracks | Track.objects.filter(artist__icontains=expression)
        serializer = TrackSerializer(tracks, many=True)
        return JSONResponse(serializer.data)

@csrf_exempt
def tracks_view_populate(request, confirmation):
    if request.method == 'GET':
        url = "http://freemusicarchive.org/recent.json"
        req = urllib.request.Request(url, headers={'User-Agent' : "Magic Browser"})
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode("utf-8"))
        tracks = []
        if len(data)!=0:
            aTracks = data.get('aTracks')
            for t in aTracks:
                newTrack = Track( track_id_external=t.get('track_id'),title=t.get('track_title'),artist=t.get('artist_name'),album=t.get('album_title') )
                newTrack.saved = ("1" if confirmation=="save" else "0")
                if(confirmation=="save"):
                    try:
                        newTrack.save()
                    except Exception:
                        newTrack.saved="already"
                        print("Skipping 1 track that is already in the DB.")
                tracks.append( newTrack ) 
        serializer = TracksPopulateSerializer(tracks, many=True)
        return JSONResponse(serializer.data)
        
@csrf_exempt
def tracks_view_togglefavorite(request, track_id, user_email):
    if request.method == 'GET':
        print(track_id)
        print(user_email)
        tracks = Track.objects.filter(track_id_external=track_id)
        users = User.objects.filter(email=user_email)
        for u in users:
            for t in tracks:
                try:
                    if(not t in u.starred_tracks.all()):
                        u.starred_tracks.add(t)
                    else:
                        u.starred_tracks.remove(t)
                except Exception:
                    print("Exception occurred on line 89")
        serializer = UserSerializer(users, many=True)
        return JSONResponse(serializer.data)
    

