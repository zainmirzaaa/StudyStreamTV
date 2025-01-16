import json
from django.http import JsonResponse
from api.mongoAPI import addFollower, removeFollower

def followers(request):
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

#This is the add method
def putMethod(request):
    try:
        data = json.loads(request.body)
        follower = data.get('userFollower')
        following = data.get('userFollowing')
        addFollower(follower=follower, following=following)
        return JsonResponse({"status": "Follower and following added successfully"})
    except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)

#this is the delete method
def postMethod(request):
    try: 
        data = json.loads(request.body)
        follower = data.get('userFollower')
        following = data.get('userFollowing')
        removeFollower(follower=follower, following=following)
        return JsonResponse({"status": "Follower and following removed successfully"})
    except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)

        


def deleteMethod(request):
    try:
        print("first")
        data = json.loads(request.body)
        print("second")
        username = data.get('username')
        category = data.get('category')
        description = data.get('description')
        print("made it here")
        # Check if all the required fields are present
        if not username or not category or not description:
            return JsonResponse({"status": "error", "message": "Missing required fields"}, status=400)

        # Assuming removeLiveUser is a function that handles the deletion logic
        removeLiveUser(username=username, category=category, description=description)

        # Return success response
        return JsonResponse({"status": "success", "message": "Live User removed successfully"})

    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
    except Exception as e:
        # Handle other exceptions (for example, database errors)
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

