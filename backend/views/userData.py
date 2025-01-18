# views.py
import json
from django.http import JsonResponse
from api.mongoAPI import addDescriptionAndLinks

def userData(request):
    # Data to be returned as JSON
    if request.method == 'GET':
        return getMethod(request)
    elif request.method == 'POST':
        return postMethod(request)
    elif request.method =='PUT':
        return putMethod(request)
    elif request.method == 'DELETE':
        return deleteMethod(request)


def getMethod(request):
    data = {
            "status": "success",
            "message": "This is a JSON response from a normal view",
            "data": {
                "id": 1,
                "name": "Sample Item",
                "description": "This is a sample item."
            }
        }
    
        # Return data as JSON
    return JsonResponse(data)

def postMethod(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        description = data.get('description')
        links = data.get('links')

        addDescriptionAndLinks(username, description, links)

        return JsonResponse({"status": "User added successfully"})
    except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)

def putMethod(request):
    data = {
            "status": "success",
            "message": "This is a JSON response from a normal view",
            "data": {
                "id": 1,
                "name": "Sample Item",
                "description": "This is a sample item."
            }
        }
    
        # Return data as JSON
    return JsonResponse(data)


def deleteMethod(request):
    data = {
                "status": "success",
                "message": "This is a JSON response from a normal view",
                "data": {
                    "id": 1,
                    "name": "Sample Item",
                    "description": "This is a sample item."
                }
            }
        
            # Return data as JSON
    return JsonResponse(data)