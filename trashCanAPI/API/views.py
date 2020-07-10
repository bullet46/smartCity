from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.http import HttpResponse
from urllib.parse import unquote
from API.search import core_search

def index(request):
    trash = core_search.TrashCanShow()
    info = str(request).split("/?")
    info = str(info[1]).split("'>")[0]
    message = unquote(info,encoding='utf-8')
    print(message)
    return HttpResponse(str(trash.trash_message(message)))