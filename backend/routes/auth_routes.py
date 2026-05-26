from flask import Blueprint
from backend.controllers.auth_controller import register_user, login_user, get_user_profile, update_user_profile
from backend.middleware.auth import token_required

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Register a new user account
    ---
    tags:
      - Authentication
    summary: Register user
    description: Create a new account with a unique username and email. Returns a JWT access token.
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - username
            - email
            - password
          properties:
            username:
              type: string
              minLength: 3
              description: Unique username (at least 3 characters)
              example: abinesh_dev
            email:
              type: string
              format: email
              description: Valid unique email address
              example: abinesh@example.com
            password:
              type: string
              minLength: 6
              description: Account password (at least 6 characters)
              example: secret123
    responses:
      201:
        description: User registered successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: User registered successfully
            token:
              type: string
              description: JWT Access Token (expires in 24 hours)
              example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
            user:
              type: object
              properties:
                id:
                  type: string
                  example: 66532d847a9efcb2f5e3df12
                username:
                  type: string
                  example: abinesh_dev
                email:
                  type: string
                  example: abinesh@example.com
                avatar:
                  type: string
                  nullable: true
                  example: null
      400:
        description: Validation error or user already exists
        schema:
          type: object
          properties:
            error:
              type: string
              example: User with this email already exists
      500:
        description: Database registration failed
    """
    return register_user()

@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Log in to an existing account
    ---
    tags:
      - Authentication
    summary: Log in user
    description: Authenticates user credentials and issues a JWT token.
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              format: email
              description: Registered email address
              example: abinesh@example.com
            password:
              type: string
              description: Account password
              example: secret123
    responses:
      200:
        description: Login successful, returns access token
        schema:
          type: object
          properties:
            message:
              type: string
              example: Login successful
            token:
              type: string
              description: JWT Access Token (expires in 24 hours)
              example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
            user:
              type: object
              properties:
                id:
                  type: string
                  example: 66532d847a9efcb2f5e3df12
                username:
                  type: string
                  example: abinesh_dev
                email:
                  type: string
                  example: abinesh@example.com
                avatar:
                  type: string
                  nullable: true
                  example: null
      400:
        description: Fields are missing
      401:
        description: Invalid credentials
        schema:
          type: object
          properties:
            error:
              type: string
              example: Invalid email or password
      500:
        description: Internal server error during login
    """
    return login_user()

@auth_bp.route("/profile", methods=["GET"])
@token_required
def profile(current_user_id):
    """
    Retrieve authenticated user profile details
    ---
    tags:
      - Authentication
    summary: Get user profile
    description: Returns details of the currently authenticated user session. Requires Bearer Token.
    security:
      - Bearer: []
    responses:
      200:
        description: Profile details retrieved successfully
        schema:
          type: object
          properties:
            id:
              type: string
              example: 66532d847a9efcb2f5e3df12
            username:
              type: string
              example: abinesh_dev
            email:
              type: string
              example: abinesh@example.com
            avatar:
              type: string
              nullable: true
              description: Base64 or Data URI string of the profile picture
              example: null
            createdAt:
              type: string
              format: date-time
              example: "2026-05-26T14:14:04.000Z"
      401:
        description: Session expired, invalid, or missing token
        schema:
          type: object
          properties:
            error:
              type: string
              example: Session expired. Please log in again.
      404:
        description: User account not found
      500:
        description: Failed to retrieve profile details
    """
    return get_user_profile(current_user_id)

@auth_bp.route("/profile", methods=["PUT"])
@token_required
def update_profile(current_user_id):
    """
    Update authenticated user's profile picture
    ---
    tags:
      - Authentication
    summary: Update profile avatar
    description: Updates the profile avatar image utilizing a Data URI. Requires Bearer Token.
    security:
      - Bearer: []
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - avatar
          properties:
            avatar:
              type: string
              description: Valid base64 image data URI (must start with data:image/)
              example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ix..."
    responses:
      200:
        description: Profile picture updated successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: Profile picture updated successfully!
            user:
              type: object
              properties:
                id:
                  type: string
                  example: 66532d847a9efcb2f5e3df12
                username:
                  type: string
                  example: abinesh_dev
                email:
                  type: string
                  example: abinesh@example.com
                avatar:
                  type: string
                  example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ix..."
      400:
        description: Invalid image format (must be standard data:image/ format)
        schema:
          type: object
          properties:
            error:
              type: string
              example: Invalid image format. Must be a valid image data URI.
      401:
        description: Session expired or invalid token
      500:
        description: Failed to update profile picture
    """
    return update_user_profile(current_user_id)

