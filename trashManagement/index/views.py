# Create your views here.
from django.shortcuts import HttpResponse, render


def index(request):
    return HttpResponse(render(request, 'index.html'))
