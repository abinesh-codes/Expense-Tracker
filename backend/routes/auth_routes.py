from flask_restx import Namespace, Resource, fields
from backend.controllers.auth_controller import register_user, login_user, get_user_profile, update_user_profile
from backend.middleware.auth import token_required

# Define Authentication Namespace
auth_ns = Namespace("auth", description="Authentication & Profile Operations")

# Helper to unwrap Flask Tuple Responses for Flask-RESTX compatibility
def flask_response(res):
    if isinstance(res, tuple):
        response_obj, status_code = res
        response_obj.status_code = status_code
        return response_obj
    return res

# Swagger Request Models
register_model = auth_ns.model("RegisterRequest", {
    "username": fields.String(required=True, description="Unique username (min 3 chars)", example="abinesh_dev"),
    "email": fields.String(required=True, description="Valid unique email address", example="abinesh@example.com"),
    "password": fields.String(required=True, description="Password (min 6 chars)", example="secret123")
})

login_model = auth_ns.model("LoginRequest", {
    "email": fields.String(required=True, description="Registered email address", example="abinesh@example.com"),
    "password": fields.String(required=True, description="Account password", example="secret123")
})

profile_update_model = auth_ns.model("ProfileUpdateRequest", {
    "avatar": fields.String(required=True, description="Base64 encoded image Data URI (must start with data:image/)", example="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAY=")
})

@auth_ns.route("/register")
class AuthRegister(Resource):
    @auth_ns.expect(register_model)
    @auth_ns.response(201, "User registered successfully")
    @auth_ns.response(400, "Validation error or user already exists")
    def post(self):
        """Register a new user account"""
        return flask_response(register_user())

@auth_ns.route("/login")
class AuthLogin(Resource):
    @auth_ns.expect(login_model)
    @auth_ns.response(200, "Login successful")
    @auth_ns.response(400, "Missing fields")
    @auth_ns.response(401, "Invalid credentials")
    def post(self):
        """Log in to an existing account"""
        return flask_response(login_user())

@auth_ns.route("/profile")
class UserProfile(Resource):
    @auth_ns.doc(security="Bearer")
    @auth_ns.response(200, "Profile details retrieved successfully")
    @auth_ns.response(401, "Session expired or access token is missing/invalid")
    @auth_ns.response(404, "User account not found")
    @token_required
    def get(self, current_user_id):
        """Retrieve authenticated user profile details"""
        return flask_response(get_user_profile(current_user_id))

    @auth_ns.doc(security="Bearer")
    @auth_ns.expect(profile_update_model)
    @auth_ns.response(200, "Profile picture updated successfully")
    @auth_ns.response(400, "Invalid image format")
    @auth_ns.response(401, "Session expired or access token is missing/invalid")
    @token_required
    def put(self, current_user_id):
        """Update authenticated user's profile picture"""
        return flask_response(update_user_profile(current_user_id))
