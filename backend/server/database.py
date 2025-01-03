import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Retrieve the MongoDB URI from the environment variables
MONGODB_URI = os.getenv('MONGODB_URI')

# Check if the URI is loaded properly
if not MONGODB_URI:
    print("MONGODB_URI not found in .env file!")
    exit(1)

# Use MongoClient to connect to MongoDB
try:
    # Establish MongoDB connection
    with MongoClient(MONGODB_URI) as client:
        print("Successfully connected to MongoDB")

        # Access the database and collection
        db = client['trial']
        collection = db['test']

        # Document to insert
        mydoc = { "name": "zain", "food": "chicken" }

        # Insert the document into the collection
        collection.insert_one(mydoc)
        print("Document inserted successfully!")

except Exception as e:
    print(f"An error occurred: {e}")