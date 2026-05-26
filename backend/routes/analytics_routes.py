from flask import Blueprint
from backend.controllers.analytics_controller import get_summary, get_monthly_data, download_csv, download_pdf
from backend.middleware.auth import token_required

analytics_bp = Blueprint("analytics", __name__)

@analytics_bp.route("/summary", methods=["GET"])
@token_required
def summary(current_user_id):
    """
    Retrieve visual financial summary dashboard metrics and AI insights
    ---
    tags:
      - Analytics
    summary: Financial dashboard summary
    description: Generates total income, total expenses, net balance, category totals, and AI insights. Requires Bearer Token.
    security:
      - Bearer: []
    responses:
      200:
        description: Dashboard summary metrics retrieved successfully
        schema:
          type: object
          properties:
            totalIncome:
              type: number
              example: 4500.00
            totalExpenses:
              type: number
              example: 1250.50
            balance:
              type: number
              example: 3249.50
            categoryTotals:
              type: object
              additionalProperties:
                type: number
              example:
                Food: 85.50
                Shopping: 120.00
                Bills: 500.00
            insights:
              type: array
              items:
                type: string
              example: [
                "🟢 **Excellent Saving Rate**: You saved 72.2% of your income this month! This exceeds the recommended 20% savings rule.",
                "🍕 **Concentrated Spending**: **Bills** represents 40.0% of all expenses. Audit your active subscriptions."
              ]
      401:
        description: Session expired or invalid token
      500:
        description: Failed to generate dashboard summary metrics
    """
    return get_summary(current_user_id)

@analytics_bp.route("/monthly", methods=["GET"])
@token_required
def monthly(current_user_id):
    """
    Retrieve historical monthly income vs expense trends
    ---
    tags:
      - Analytics
    summary: Monthly income vs expense trends
    description: Aggregates total income and total expenses grouped by year and month. Ideal for charting. Requires Bearer Token.
    security:
      - Bearer: []
    responses:
      200:
        description: Monthly trend data retrieved successfully
        schema:
          type: array
          items:
            type: object
            properties:
              month:
                type: string
                description: Calendar Month (format YYYY-MM)
                example: "2026-05"
              income:
                type: number
                example: 4500.00
              expense:
                type: number
                example: 1250.50
      401:
        description: Session expired or invalid token
      500:
        description: Failed to aggregate monthly trend data
    """
    return get_monthly_data(current_user_id)

@analytics_bp.route("/export/csv", methods=["GET"])
@token_required
def csv_export(current_user_id):
    """
    Export financial transaction data as a CSV file
    ---
    tags:
      - Analytics
    summary: Export to CSV
    description: Downloads a CSV file containing all income and expense items. Requires Bearer Token.
    security:
      - Bearer: []
    produces:
      - text/csv
    responses:
      200:
        description: A CSV file stream download containing transactional data
        headers:
          Content-Disposition:
            type: string
            description: Attachment file header
            example: attachment; filename=spendwise_report_20260526.csv
      401:
        description: Session expired or invalid token
      500:
        description: Failed to generate CSV report
    """
    return download_csv(current_user_id)

@analytics_bp.route("/export/pdf", methods=["GET"])
@token_required
def pdf_export(current_user_id):
    """
    Export detailed financial report as a beautifully generated PDF
    ---
    tags:
      - Analytics
    summary: Export to PDF
    description: Downloads a fully structured, professionally formatted PDF financial report containing transaction tables and summaries. Requires Bearer Token.
    security:
      - Bearer: []
    produces:
      - application/pdf
    responses:
      200:
        description: A binary PDF stream download of the premium report
        headers:
          Content-Disposition:
            type: string
            description: Attachment file header
            example: attachment; filename=spendwise_financial_report.pdf
      401:
        description: Session expired or invalid token
      500:
        description: Failed to generate PDF report
    """
    return download_pdf(current_user_id)

