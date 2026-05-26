import os
import sys

# Add parent directory of backend to sys.path to enable 'backend' imports when running app.py directly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flasgger import Swagger

# Load environmental variables
load_dotenv()

# Import Blueprints
from backend.routes.auth_routes import auth_bp
from backend.routes.expense_routes import expenses_bp
from backend.routes.income_routes import income_bp
from backend.routes.analytics_routes import analytics_bp

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for standard React app origins
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    
    # Configure JSON encoder keys
    app.config['JSON_SORT_KEYS'] = False
    
    # Configure Swagger UI Aesthetics & Custom Paths
    app.config['SWAGGER'] = {
        'title': 'SpendWise Fintech API Docs',
        'uiversion': 3,
        'openapi': '3.0.3',
        'specs_route': '/api/docs',
        'static_url_path': '/flasgger_static',
        'swagger_ui_css': '/static/swagger-custom.css',
        'headers': []
    }
    
    # Swagger Template with JWT Authorization support
    swagger_template = {
        "openapi": "3.0.3",
        "info": {
            "title": "SpendWise Premium Fintech API",
            "description": "Comprehensive, interactive OpenAPI documentation for the SpendWise personal finance manager API. \n\n"
                           "### Authentication & Testing Instructions\n"
                           "Most endpoints require a valid JWT token in the Authorization header. To test these endpoints directly inside Swagger UI:\n"
                           "1. Call `POST /api/auth/register` or `POST /api/auth/login` using the **Try it out** button in the **Authentication** section below.\n"
                           "2. Copy the `token` string returned in the response.\n"
                           "3. Scroll to the top of this page and click the green **Authorize** button on the right.\n"
                           "4. In the text field, enter `Bearer <your_copied_token>` (make sure to include the space between 'Bearer' and the token, e.g. `Bearer eyJhbGci...`).\n"
                           "5. Click **Authorize** then close the modal.\n"
                           "6. You can now execute and test any protected endpoint seamlessly!",
            "version": "1.0.0",
            "contact": {
                "name": "SpendWise Tech Support",
                "email": "support@spendwise.fintech"
            }
        },
        "components": {
            "securitySchemes": {
                "Bearer": {
                    "type": "apiKey",
                    "name": "Authorization",
                    "in": "header",
                    "description": "JWT Authorization header using the Bearer scheme. Format: 'Bearer {token}'"
                }
            }
        },
        "security": [
            {
                "Bearer": []
            }
        ]
    }
    
    Swagger(app, template=swagger_template)
    
    # Heartbeat/Check Endpoint
    @app.route("/api/health", methods=["GET"])
    def health_check():
        """
        Check SpendWise API Health Status
        ---
        tags:
          - System
        summary: API health heartbeat check
        description: Returns the health, status, and environment settings of the SpendWise Fintech API.
        responses:
          200:
            description: API is operational
            schema:
              type: object
              properties:
                status:
                  type: string
                  example: healthy
                message:
                  type: string
                  example: SpendWise Fintech API is operational
                timestamp:
                  type: string
                  example: development
        """
        return jsonify({
            "status": "healthy",
            "message": "SpendWise Fintech API is operational",
            "timestamp": os.getenv("FLASK_ENV", "production")
        }), 200
        
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(expenses_bp, url_prefix="/api/expenses")
    app.register_blueprint(income_bp, url_prefix="/api/income")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    
    # Global Error Handlers
    from pymongo.errors import ServerSelectionTimeoutError
    @app.errorhandler(ServerSelectionTimeoutError)
    def handle_db_timeout(e):
        return jsonify({
            "error": "MongoDB Atlas connection timed out. This is typically caused by your current IP address not being whitelisted in your Atlas account's 'Network Access' tab. Please add your current IP or allow '0.0.0.0/0' (Allow access from anywhere) in Atlas to resolve this instantly."
        }), 503

    @app.errorhandler(404)
    def resource_not_found(e):
        return jsonify({"error": "Requested API endpoint not found"}), 404
        
    @app.errorhandler(500)
    def internal_server_error(e):
        return jsonify({"error": "An internal server error occurred", "details": str(e)}), 500
        
    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    # Run the server
    app.run(host="0.0.0.0", port=port, debug=(os.getenv("FLASK_ENV") == "development"))
