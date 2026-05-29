from flask_restx import Namespace, Resource, fields
from backend.controllers.expense_controller import get_expenses, create_expense, update_expense, delete_expense
from backend.middleware.auth import token_required

# Define Expenses Namespace
expense_ns = Namespace("expenses", description="Expense Management Operations")

# Helper to unwrap Flask Tuple Responses for Flask-RESTX compatibility
def flask_response(res):
    if isinstance(res, tuple):
        response_obj, status_code = res
        response_obj.status_code = status_code
        return response_obj
    return res

# Query Parameter Parser for GET /expenses
expense_parser = expense_ns.parser()
expense_parser.add_argument("search", type=str, required=False, help="Search text in title or description", location="args")
expense_parser.add_argument("category", type=str, required=False, help="Filter by category (Food, Travel, Bills, etc. or 'All')", location="args")
expense_parser.add_argument("startDate", type=str, required=False, help="Filter starting date (YYYY-MM-DD)", location="args")
expense_parser.add_argument("endDate", type=str, required=False, help="Filter ending date (YYYY-MM-DD)", location="args")
expense_parser.add_argument("sortBy", type=str, required=False, default="date", choices=["date", "amount"], help="Sort field", location="args")
expense_parser.add_argument("order", type=str, required=False, default="desc", choices=["asc", "desc"], help="Sort order", location="args")
expense_parser.add_argument("page", type=int, required=False, default=1, help="Page number", location="args")
expense_parser.add_argument("limit", type=int, required=False, default=10, help="Items per page", location="args")

# Swagger Request Model
expense_model = expense_ns.model("ExpenseRequest", {
    "title": fields.String(required=True, description="Title/Name of the expense", example="Office Desk Chair"),
    "amount": fields.Float(required=True, description="Expense cost (must be positive)", example=120.00),
    "category": fields.String(required=True, description="Spending category (Food, Travel, Shopping, Bills, Entertainment, Health, Others)", example="Shopping"),
    "date": fields.String(required=False, description="Date in YYYY-MM-DD format (defaults to current date)", example="2026-05-26"),
    "description": fields.String(required=False, description="Details or remarks about the expense", example="Ergonomic office chair for work from home")
})

@expense_ns.route("")
class ExpenseList(Resource):
    @expense_ns.doc(security="Bearer")
    @expense_ns.expect(expense_parser)
    @expense_ns.response(200, "List of expenses retrieved successfully")
    @expense_ns.response(401, "Session expired or access token is missing/invalid")
    @token_required
    def get(self, current_user_id):
        """Fetch all expenses for the authenticated user"""
        return flask_response(get_expenses(current_user_id))

    @expense_ns.doc(security="Bearer")
    @expense_ns.expect(expense_model)
    @expense_ns.response(201, "Expense created successfully")
    @expense_ns.response(400, "Missing required fields or invalid values")
    @expense_ns.response(401, "Session expired or access token is missing/invalid")
    @token_required
    def post(self, current_user_id):
        """Create a new expense item"""
        return flask_response(create_expense(current_user_id))

@expense_ns.route("/<string:expense_id>")
class ExpenseDetail(Resource):
    @expense_ns.doc(security="Bearer")
    @expense_ns.expect(expense_model, validate=False)
    @expense_ns.response(200, "Expense updated successfully")
    @expense_ns.response(400, "Validation error or invalid expense ID")
    @expense_ns.response(401, "Session expired or access token is missing/invalid")
    @expense_ns.response(404, "Expense record not found or unauthorized")
    @token_required
    def put(self, current_user_id, expense_id):
        """Update an existing expense item"""
        return flask_response(update_expense(current_user_id, expense_id))

    @expense_ns.doc(security="Bearer")
    @expense_ns.response(200, "Expense deleted successfully")
    @expense_ns.response(401, "Session expired or access token is missing/invalid")
    @expense_ns.response(404, "Expense record not found or unauthorized")
    @token_required
    def delete(self, current_user_id, expense_id):
        """Delete an expense item"""
        return flask_response(delete_expense(current_user_id, expense_id))
