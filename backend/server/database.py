
# imports
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# function to find .env file
load_dotenv()


# retrieve uri from .env
MONGODB_URI = os.getenv('MONGODB_URI')

# client is how we interact with mongos db
client = MongoClient(MONGODB_URI)

# naming our db and collections
db = client['db']
collection = db['collectionssss']

# u have to insert info in json format
mydoc = { 
    "name" : "zain",
    "food" : "chicken"
}

# instering the info into the collection
insert_doc = collection.insert_one(mydoc)

# validation check
print("successful")

# always have to close the client session
client.close()