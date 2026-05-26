from flask import Blueprint
from backend.controllers.income_controller import get_incomes, create_income, update_income, delete_income
from backend.middleware.auth import token_required

income_bp = Blueprint("income", __name__)

@income_bp.route("", methods=["GET"])
@token_required
def read_all(current_user_id):
    """
    Retrieve all income records for the authenticated user
    ---
    tags:
      - Income
    summary: Fetch all income items
    description: Returns a list of all income records created by the logged-in user. Requires Bearer Token.
    security:
      - Bearer: []
    responses:
      200:
        description: List of income records retrieved successfully
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: string
                example: 66532f947a9efcb2f5e3df78
              title:
                type: string
                example: Monthly Salary
              amount:
                type: number
                format: float
                example: 4500.00
              category:
                type: string
                example: Salary
              date:
                type: string
                format: date
                example: "2026-05-01"
              description:
                type: string
                example: Fintech dev job primary salary
              createdAt:
                type: string
                format: date-time
                example: "2026-05-01T09:00:00.000Z"
      401:
        description: Session expired, invalid, or missing token
      500:
        description: Failed to retrieve income items from the database
    """
    return get_incomes(current_user_id)

@income_bp.route("", methods=["POST"])
@token_required
def create(current_user_id):
    """
    Create a new income item
    ---
    tags:
      - Income
    summary: Create income
    description: Adds a new income record to the user's account. Requires Bearer Token.
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
              description: Title/Name of the income source
              example: Freelance Project Payment
            amount:
              type: number
              minimum: 0.01
              description: Income amount (must be a positive number)
              example: 750.00
            category:
              type: string
              description: Income category (e.g. Salary, Freelance, Investments, Gifts, Others)
              example: Freelance
            date:
              type: string
              format: date
              description: Date of income receipt in YYYY-MM-DD format (defaults to current date if omitted)
              example: "2026-05-26"
            description:
              type: string
              description: Optional details about the income
              example: Front-end UI adjustments payment
    responses:
      201:
        description: Income item created successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: Income added successfully!
            income:
              type: object
              properties:
                id:
                  type: string
                  example: 66532f947a9efcb2f5e3df78
                title:
                  type: string
                  example: Freelance Project Payment
                amount:
                  type: number
                  example: 750.0
                category:
                  type: string
                  example: Freelance
                date:
                  type: string
                  example: "2026-05-26"
                description:
                  type: string
                  example: Front-end UI adjustments payment
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
        description: Failed to insert income record
    """
    return create_income(current_user_id)

@income_bp.route("/<string:income_id>", methods=["PUT"])
@token_required
def update(current_user_id, income_id):
    """
    Update an existing income item
    ---
    tags:
      - Income
    summary: Update income
    description: Modifies details of a specific income record. Requires Bearer Token.
    security:
      - Bearer: []
    parameters:
      - name: income_id
        in: path
        type: string
        required: true
        description: The unique MongoDB Hexadecimal ID of the income to update
        example: 66532f947a9efcb2f5e3df78
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
              example: Web Development Freelancing
            amount:
              type: number
              example: 800.00
            category:
              type: string
              example: Freelance
            date:
              type: string
              format: date
              example: "2026-05-26"
            description:
              type: string
              example: Front-end UI and visual improvements contract
    responses:
      200:
        description: Income updated successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: Income updated successfully!
            income:
              type: object
              properties:
                id:
                  type: string
                  example: 66532f947a9efcb2f5e3df78
                title:
                  type: string
                  example: Web Development Freelancing
                amount:
                  type: number
                  example: 800.0
                category:
                  type: string
                  example: Freelance
                date:
                  type: string
                  example: "2026-05-26"
                description:
                  type: string
                  example: Front-end UI and visual improvements contract
      400:
        description: Validation error or not authorized to update this income
      401:
        description: Session expired or invalid token
      404:
        description: Income record not found
        schema:
          type: object
          properties:
            error:
              type: string
              example: Income item not found
      500:
        description: Failed to update income record
    """
    return update_income(current_user_id, income_id)

@income_bp.route("/<string:income_id>", methods=["DELETE"])
@token_required
def delete(current_user_id, income_id):
    """
    Delete an income item
    ---
    tags:
      - Income
    summary: Delete income
    description: Permanently removes a specific income record. Requires Bearer Token.
    security:
      - Bearer: []
    parameters:
      - name: income_id
        in: path
        type: string
        required: true
        description: The unique MongoDB Hexadecimal ID of the income to delete
        example: 66532f947a9efcb2f5e3df78
    responses:
      200:
        description: Income deleted successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: Income deleted successfully!
      401:
        description: Session expired or invalid token
      404:
        description: Income record not found
      500:
        description: Failed to delete income record
    """
    return delete_income(current_user_id, income_id)

