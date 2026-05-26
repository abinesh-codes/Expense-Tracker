import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

mongo_uri = os.getenv("MONGO_URI")
db_name = "spendwise"

if not mongo_uri:
    print("WARNING: MONGO_URI environment variable not found in .env. Falling back to localhost.")
    mongo_uri = "mongodb://localhost:27017/spendwise"

try:
    # Initialize MongoDB client
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    # Validate the connection string by fetching server info
    client.server_info()
    db = client[db_name]
    print(f"Successfully connected to MongoDB Atlas database: '{db_name}'")
except Exception as e:
    print(f"MongoDB connection error: {e}")
    print("Attempting local database fallback (mongodb://localhost:27017/spendwise)...")
    try:
        client = MongoClient("mongodb://localhost:27017/spendwise", serverSelectionTimeoutMS=2000)
        client.server_info()
        db = client[db_name]
        print("Connected to local MongoDB fallback.")
    except Exception as fallback_err:
        print(f"Local fallback failed: {fallback_err}")
        print("Using standard client connection. Ensure MongoDB is running.")
        client = MongoClient("mongodb://localhost:27017/spendwise")
        db = client[db_name]

def get_db():
    return db
