# mongo_utils.py
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import json
from django.http import JsonResponse

# Load environment variables (like MONGODB_URI) from .env file
load_dotenv()

# Retrieve the MongoDB URI from the environment
MONGODB_URI = os.getenv('MONGODB_URI')

# Function to establish MongoDB connection
def get_mongo_client():
    try:
        client = MongoClient(MONGODB_URI)
        print("MongoDB connection established.")
        return client
    except Exception as e:
        print(f"Error while connecting to MongoDB: {e}")
        return None


# Function to get a specific collection
def get_collection(db_name, collection_name):
    client = get_mongo_client()
    if client:
        db = client[db_name]
        collection = db[collection_name]
        return collection
    else:
        return None


def addLiveUser(username, category, description):
    client=get_mongo_client()
    if client:
        db = client['UserData']
        collection = db['liveUser']
        mydoc = { "username":username ,"category": category, "description": description }
        collection.insert_one(mydoc)


def removeLiveUser(username, category, description):
    client = get_mongo_client()
    if client:
        db = client['UserData']
        collection = db['liveUser']
        mydoc = { "username": username, "category": category, "description": description }
        result = collection.delete_one(mydoc)
        if result.deleted_count > 0:
            print(f"Successfully removed user: {username}")
        else:
            print(f"No user found with the specified details.")

def sanitize_username(username):
    # MongoDB doesn't allow '$', '.' or other characters in collection names
    return username.replace('$', '').replace('.', '')

def createUserInDB(username, email):
    # Connect to the MongoDB client
    client = get_mongo_client()
    
    if client: 
        db = client['UserData']
        username = sanitize_username(username)
        collection = db['UserData']
        mydoc = { 
            "username": username, 
            "email": email,
            "followers": 0,
            "following": 0,
            "description": "",
            "links": [],
            "pastStreams": [],
            "hoursWatched": 0,
            "previousWatchedStream": [],
            "categoriesWatched": []
        }
        try:
            collection.insert_one(mydoc)
            print(f"User '{username}' created successfully in the database.")
        except Exception as e:
            print(f"Error creating user: {e}")


def getUserInDB(username):
    client = get_mongo_client()
    db = client['UserData']

    username = sanitize_username(username)  # Ensure username is valid for MongoDB
    collection = db['UserData']  # Collection name should match the sanitized username
    
    # Query to find the document with the matching username
    user = collection.find_one({"username": username})

    # Return the document, or None if not found
    if user:
        user.pop('_id', None)
        return JsonResponse(user)
    else:
        return None

