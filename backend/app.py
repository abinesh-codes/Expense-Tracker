import os
import sys

# Add parent directory of backend to sys.path to enable 'backend' imports when running app.py directly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, Blueprint, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_restx import Api, Resource

# Load environmental variables
load_dotenv()

# Import Namespaces
from backend.routes.auth_routes import auth_ns
from backend.routes.expense_routes import expense_ns
from backend.routes.income_routes import income_ns
from backend.routes.analytics_routes import analytics_ns

def create_app():
    app = Flask(__name__)
    
    # Enable standard global CORS to prevent cross-origin browser blocking on Vercel
    CORS(app)
    
    # Configure JSON encoder keys
    app.config['JSON_SORT_KEYS'] = False
    
    # Create Blueprint for API
    api_bp = Blueprint("api", __name__, url_prefix="/api")
    
    # Define authorization options for JWT Bearer scheme in Swagger
    authorizations = {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "JWT Authorization header using the Bearer scheme. Format: 'Bearer {token}'"
        }
    }
    
    # Initialize Flask-RESTX Api on the Blueprint
    api = Api(
        api_bp,
        version="1.0.0",
        title="SpendWise Premium Fintech API",
        description="Comprehensive, interactive OpenAPI documentation for the SpendWise personal finance manager API. \n\n"
                    "### Authentication & Testing Instructions\n"
                    "Most endpoints require a valid JWT token in the Authorization header. To test these endpoints directly inside Swagger UI:\n"
                    "1. Call `POST /api/auth/register` or `POST /api/auth/login` using the **Try it out** button in the **Authentication** section below.\n"
                    "2. Copy the `token` string returned in the response.\n"
                    "3. Scroll to the top of this page and click the green **Authorize** button on the right.\n"
                    "4. In the text field, enter `Bearer <your_copied_token>` (make sure to include the space between 'Bearer' and the token, e.g. `Bearer eyJhbGci...`).\n"
                    "5. Click **Authorize** then close the modal.\n"
                    "6. You can now execute and test any protected endpoint seamlessly!",
        doc="/docs", # Swagger UI served at /api/docs
        authorizations=authorizations,
        security="Bearer"
    )
    
    # Heartbeat/Check Endpoint
    @api.route("/health")
    class HealthCheck(Resource):
        @api.response(200, "API is operational")
        def get(self):
            """Check SpendWise API Health Status"""
            return {
                "status": "healthy",
                "message": "SpendWise Fintech API is operational",
                "timestamp": os.getenv("FLASK_ENV", "production")
            }, 200
            
    # Register Namespaces
    api.add_namespace(auth_ns, path="/auth")
    api.add_namespace(expense_ns, path="/expenses")
    api.add_namespace(income_ns, path="/income")
    api.add_namespace(analytics_ns, path="/analytics")
    
    # Register the blueprint
    app.register_blueprint(api_bp)
    
    # Global Error Handlers registered on API
    from pymongo.errors import ServerSelectionTimeoutError
    @api.errorhandler(ServerSelectionTimeoutError)
    def handle_db_timeout(e):
        return {
            "error": "MongoDB Atlas connection timed out. This is typically caused by your current IP address not being whitelisted in your Atlas account's 'Network Access' tab. Please add your current IP or allow '0.0.0.0/0' (Allow access from anywhere) in Atlas to resolve this instantly."
        }, 503
        
    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    # Run the server
    app.run(host="0.0.0.0", port=port, debug=(os.getenv("FLASK_ENV") == "development"))
