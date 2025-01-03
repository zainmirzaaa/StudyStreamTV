# views.py
from django.http import JsonResponse

def my_json_view(request):
    # Data to be returned as JSON
    if request.method == 'GET':
        return getMethod()
    elif request.method == 'POST':
        return postMethod()
    elif request.method =='PUT':
        return putMethod()
    elif request.method == 'DELETE':
        return deleteMethod()


def getMethod():
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

def postMethod():
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

def putMethod():
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


def deleteMethod():
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