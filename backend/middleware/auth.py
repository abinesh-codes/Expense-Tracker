import jwt
import os
from functools import wraps
from flask import request, jsonify

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Retrieve authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({"error": "Access token is missing or invalid"}), 401
        
        try:
            jwt_secret = os.getenv("JWT_SECRET", "default_secret_key")
            # Decode the token using HS256 algorithm
            data = jwt.decode(token, jwt_secret, algorithms=["HS256"])
            current_user_id = data.get("user_id")
            if not current_user_id:
                return jsonify({"error": "Invalid token signature content"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Session expired. Please log in again."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Session signature is invalid."}), 401
            
        # Call request handler, injecting user_id
        return f(current_user_id, *args, **kwargs)
        
    return decorated
