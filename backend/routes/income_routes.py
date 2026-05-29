from flask_restx import Namespace, Resource, fields
from backend.controllers.income_controller import get_incomes, create_income, update_income, delete_income
from backend.middleware.auth import token_required

# Define Income Namespace
income_ns = Namespace("income", description="Income Management Operations")

# Helper to unwrap Flask Tuple Responses for Flask-RESTX compatibility
def flask_response(res):
    if isinstance(res, tuple):
        response_obj, status_code = res
        response_obj.status_code = status_code
        return response_obj
    return res

# Query Parameter Parser for GET /income
income_parser = income_ns.parser()
income_parser.add_argument("search", type=str, required=False, help="Search text in source or description", location="args")
income_parser.add_argument("source", type=str, required=False, help="Filter by source type (Salary, Freelance, Investments, Gifts, Others or 'All')", location="args")
income_parser.add_argument("startDate", type=str, required=False, help="Filter starting date (YYYY-MM-DD)", location="args")
income_parser.add_argument("endDate", type=str, required=False, help="Filter ending date (YYYY-MM-DD)", location="args")
income_parser.add_argument("sortBy", type=str, required=False, default="date", choices=["date", "amount"], help="Sort field", location="args")
income_parser.add_argument("order", type=str, required=False, default="desc", choices=["asc", "desc"], help="Sort order", location="args")
income_parser.add_argument("page", type=int, required=False, default=1, help="Page number", location="args")
income_parser.add_argument("limit", type=int, required=False, default=10, help="Items per page", location="args")

# Swagger Request Model
income_model = income_ns.model("IncomeRequest", {
    "source": fields.String(required=True, description="Source of the income (Salary, Freelance, Investments, Gifts, Others)", example="Freelance"),
    "amount": fields.Float(required=True, description="Income amount (must be positive)", example=750.00),
    "date": fields.String(required=False, description="Date in YYYY-MM-DD format (defaults to current date)", example="2026-05-26"),
    "description": fields.String(required=False, description="Details or remarks about the income", example="Front-end UI adjustments payment")
})

@income_ns.route("")
class IncomeList(Resource):
    @income_ns.doc(security="Bearer")
    @income_ns.expect(income_parser)
    @income_ns.response(200, "List of income records retrieved successfully")
    @income_ns.response(401, "Session expired or access token is missing/invalid")
    @token_required
    def get(self, current_user_id):
        """Fetch all income items for the authenticated user"""
        return flask_response(get_incomes(current_user_id))

    @income_ns.doc(security="Bearer")
    @income_ns.expect(income_model)
    @income_ns.response(201, "Income record added successfully")
    @income_ns.response(400, "Missing required fields or invalid values")
    @income_ns.response(401, "Session expired or access token is missing/invalid")
    @token_required
    def post(self, current_user_id):
        """Create a new income item"""
        return flask_response(create_income(current_user_id))

@income_ns.route("/<string:income_id>")
class IncomeDetail(Resource):
    @income_ns.doc(security="Bearer")
    @income_ns.expect(income_model, validate=False)
    @income_ns.response(200, "Income updated successfully")
    @income_ns.response(400, "Validation error or invalid income ID")
    @income_ns.response(401, "Session expired or access token is missing/invalid")
    @income_ns.response(404, "Income record not found or unauthorized")
    @token_required
    def put(self, current_user_id, income_id):
        """Update an existing income item"""
        return flask_response(update_income(current_user_id, income_id))

    @income_ns.doc(security="Bearer")
    @income_ns.response(200, "Income deleted successfully")
    @income_ns.response(401, "Session expired or access token is missing/invalid")
    @income_ns.response(404, "Income record not found or unauthorized")
    @token_required
    def delete(self, current_user_id, income_id):
        """Delete an income item"""
        return flask_response(delete_income(current_user_id, income_id))
