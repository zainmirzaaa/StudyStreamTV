# mongo_utils.py
import os
from pymongo import MongoClient
from dotenv import load_dotenv

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

def addUser(username, email):
    client=get_mongo_client()
    if client:
        db = client['UserData']
        collection = db['Users']
        mydoc = { "username":username ,"email": email }
        collection.insert_one(mydoc)



def addLiveUser(username, category, description):
    client=get_mongo_client()
    if client:
        db = client['UserData']
        collection = db['liveUser']
        mydoc = { "username":username ,"category": category, "description": description }
        collection.insert_one(mydoc)


def removeLiveUser(username, category, description):
    client=get_mongo_client()
    if client:
        db = client['UserData']
        collection = db['liveUser']
        mydoc = { "username":username ,"category": category, "description": description }
        collection.insert_one(mydoc)