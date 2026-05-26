from flask import Blueprint
from backend.controllers.expense_controller import get_expenses, create_expense, update_expense, delete_expense
from backend.middleware.auth import token_required

expenses_bp = Blueprint("expenses", __name__)

@expenses_bp.route("", methods=["GET"])
@token_required
def read_all(current_user_id):
    """
    Retrieve all expenses for the authenticated user
    ---
    tags:
      - Expenses
    summary: Fetch all expenses
    description: Returns a list of all expense records created by the logged-in user. Requires Bearer Token.
    security:
      - Bearer: []
    responses:
      200:
        description: List of expenses retrieved successfully
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: string
                example: 66532e847a9efcb2f5e3df56
              title:
                type: string
                example: Weekly Grocery Shopping
              amount:
                type: number
                format: float
                example: 85.50
              category:
                type: string
                example: Food
              date:
                type: string
                format: date
                example: "2026-05-26"
              description:
                type: string
                example: Supermarket food and supplies
              createdAt:
                type: string
                format: date-time
                example: "2026-05-26T14:14:04.000Z"
      401:
        description: Session expired, invalid, or missing token
      500:
        description: Failed to retrieve expenses from the database
    """
    return get_expenses(current_user_id)

@expenses_bp.route("", methods=["POST"])
@token_required
def create(current_user_id):
    """
    Create a new expense item
    ---
    tags:
      - Expenses
    summary: Create expense
    description: Adds a new expense record to the user's account. Requires Bearer Token.
    security:
      - Bearer: []
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - title
            - amount
            - category
          properties:
            title:
              type: string
              description: Title/Name of the expense
              example: Office Desk Chair
            amount:
              type: number
              minimum: 0.01
              description: Expense cost (must be a positive number)
              example: 120.00
            category:
              type: string
              description: Spending category (e.g. Food, Bills, Entertainment, Health, Shopping, Others)
              example: Shopping
            date:
              type: string
              format: date
              description: Date of expense in YYYY-MM-DD format (defaults to current date if omitted)
              example: "2026-05-26"
            description:
              type: string
              description: Optional details about the expense
              example: Ergonomic office chair for work from home
    responses:
      201:
        description: Expense created successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: Expense added successfully!
            expense:
              type: object
              properties:
                id:
                  type: string
                  example: 66532e847a9efcb2f5e3df56
                title:
                  type: string
                  example: Office Desk Chair
                amount:
                  type: number
                  example: 120.0
                category:
                  type: string
                  example: Shopping
                date:
                  type: string
                  example: "2026-05-26"
                description:
                  type: string
                  example: Ergonomic office chair for work from home
                createdAt:
                  type: string
                  format: date-time
                  example: "2026-05-26T14:16:32.000Z"
      400:
        description: Missing required fields or invalid values
        schema:
          type: object
          properties:
            error:
              type: string
              example: Amount must be a positive number
      401:
        description: Session expired or invalid token
      500:
        description: Failed to insert expense record
    """
    return create_expense(current_user_id)

@expenses_bp.route("/<string:expense_id>", methods=["PUT"])
@token_required
def update(current_user_id, expense_id):
    """
    Update an existing expense item
    ---
    tags:
      - Expenses
    summary: Update expense
    description: Modifies details of a specific expense record. Requires Bearer Token.
    security:
      - Bearer: []
    parameters:
      - name: expense_id
        in: path
        type: string
        required: true
        description: The unique MongoDB Hexadecimal ID of the expense to update
        example: 66532e847a9efcb2f5e3df56
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
              example: Deluxe Office Desk Chair
            amount:
              type: number
              example: 135.00
            category:
              type: string
              example: Shopping
            date:
              type: string
              format: date
              example: "2026-05-26"
            description:
              type: string
              example: Upgraded ergonomics office chair with lumbar support
    responses:
      200:
        description: Expense updated successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: Expense updated successfully!
            expense:
              type: object
              properties:
                id:
                  type: string
                  example: 66532e847a9efcb2f5e3df56
                title:
                  type: string
                  example: Deluxe Office Desk Chair
                amount:
                  type: number
                  example: 135.0
                category:
                  type: string
                  example: Shopping
                date:
                  type: string
                  example: "2026-05-26"
                description:
                  type: string
                  example: Upgraded ergonomics office chair with lumbar support
      400:
        description: Validation error or not authorized to update this expense
      401:
        description: Session expired or invalid token
      404:
        description: Expense record not found
        schema:
          type: object
          properties:
            error:
              type: string
              example: Expense item not found
      500:
        description: Failed to update expense record
    """
    return update_expense(current_user_id, expense_id)

@expenses_bp.route("/<string:expense_id>", methods=["DELETE"])
@token_required
def delete(current_user_id, expense_id):
    """
    Delete an expense item
    ---
    tags:
      - Expenses
    summary: Delete expense
    description: Permanently removes a specific expense record. Requires Bearer Token.
    security:
      - Bearer: []
    parameters:
      - name: expense_id
        in: path
        type: string
        required: true
        description: The unique MongoDB Hexadecimal ID of the expense to delete
        example: 66532e847a9efcb2f5e3df56
    responses:
      200:
        description: Expense deleted successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: Expense deleted successfully!
      401:
        description: Session expired or invalid token
      404:
        description: Expense record not found
      500:
        description: Failed to delete expense record
    """
    return delete_expense(current_user_id, expense_id)

