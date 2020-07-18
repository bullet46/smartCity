from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
from urllib.parse import unquote
from api.search import core_search

def api(request):
    try:
        info = str(request).split("/?")
        info = str(info[1]).split("'>")[0]
        message = unquote(info,encoding='utf-8')
        print(message)
        trash = core_search.TrashCanShow()
        return HttpResponse(str(trash.trash_message(message)).replace("'",'"'))
    except:
        return HttpResponse('None')