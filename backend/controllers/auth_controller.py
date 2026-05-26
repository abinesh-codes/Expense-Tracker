import os
import datetime
import re
import jwt
import bcrypt
from flask import jsonify, request
from bson.objectid import ObjectId
from backend.config.db import get_db

db = get_db()
users_collection = db["users"]

# Regex for email validation
EMAIL_REGEX = r'^[\w\.-]+@[\w\.-]+\.\w+$'

def register_user():
    data = request.get_json() or {}
    username = data.get("username", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    
    # Validation
    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400
        
    if len(username) < 3:
        return jsonify({"error": "Username must be at least 3 characters long"}), 400
        
    if not re.match(EMAIL_REGEX, email):
        return jsonify({"error": "Please enter a valid email address"}), 400
        
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long"}), 400
        
    # Check if user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User with this email already exists"}), 400
        
    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username is already taken"}), 400
        
    try:
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Insert user
        new_user = {
            "username": username,
            "email": email,
            "password": hashed_password,
            "avatar": None,
            "createdAt": datetime.datetime.utcnow()
        }
        
        result = users_collection.insert_one(new_user)
        
        # Issue JWT token
        jwt_secret = os.getenv("JWT_SECRET", "default_secret_key")
        token = jwt.encode({
            "user_id": str(result.inserted_id),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, jwt_secret, algorithm="HS256")
        
        return jsonify({
            "message": "User registered successfully",
            "token": token,
            "user": {
                "id": str(result.inserted_id),
                "username": username,
                "email": email,
                "avatar": None
            }
        }), 201
        
    except Exception as e:
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500

def login_user():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
        
    try:
        # Find user
        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401
            
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
            return jsonify({"error": "Invalid email or password"}), 401
            
        # Issue JWT token
        jwt_secret = os.getenv("JWT_SECRET", "default_secret_key")
        token = jwt.encode({
            "user_id": str(user["_id"]),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, jwt_secret, algorithm="HS256")
        
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": str(user["_id"]),
                "username": user["username"],
                "email": user["email"],
                "avatar": user.get("avatar")
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Login failed: {str(e)}"}), 500

def get_user_profile(current_user_id):
    try:
        user = users_collection.find_one({"_id": ObjectId(current_user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        return jsonify({
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
            "avatar": user.get("avatar"),
            "createdAt": user.get("createdAt")
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch profile: {str(e)}"}), 500

def update_user_profile(current_user_id):
    data = request.get_json() or {}
    avatar = data.get("avatar")
    
    if avatar and not avatar.startswith("data:image/"):
        return jsonify({"error": "Invalid image format. Must be a valid image data URI."}), 400
        
    try:
        users_collection.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$set": {"avatar": avatar}}
        )
        
        # Fetch updated user details
        user = users_collection.find_one({"_id": ObjectId(current_user_id)})
        return jsonify({
            "message": "Profile picture updated successfully!",
            "user": {
                "id": str(user["_id"]),
                "username": user["username"],
                "email": user["email"],
                "avatar": user.get("avatar")
            }
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to update profile picture: {str(e)}"}), 500
