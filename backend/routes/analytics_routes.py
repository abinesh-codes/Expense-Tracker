from flask_restx import Namespace, Resource
from backend.controllers.analytics_controller import get_summary, get_monthly_data, download_csv, download_pdf
from backend.middleware.auth import token_required

# Define Analytics Namespace
analytics_ns = Namespace("analytics", description="Visual Analytics & Financial Insights")

# Helper to unwrap Flask Tuple Responses for Flask-RESTX compatibility
def flask_response(res):
    if isinstance(res, tuple):
        response_obj, status_code = res
        response_obj.status_code = status_code
        return response_obj
    return res

@analytics_ns.route("/summary")
class AnalyticsSummary(Resource):
    @analytics_ns.doc(security="Bearer")
    @analytics_ns.response(200, "Dashboard summary metrics and AI insights retrieved successfully")
    @analytics_ns.response(401, "Session expired or access token is missing/invalid")
    @token_required
    def get(self, current_user_id):
        """Retrieve visual financial summary dashboard metrics and AI insights"""
        return flask_response(get_summary(current_user_id))

@analytics_ns.route("/monthly")
class AnalyticsMonthly(Resource):
    @analytics_ns.doc(security="Bearer")
    @analytics_ns.response(200, "Monthly income vs expense trend data retrieved successfully")
    @analytics_ns.response(401, "Session expired or access token is missing/invalid")
    @token_required
    def get(self, current_user_id):
        """Retrieve historical monthly income vs expense trends"""
        return flask_response(get_monthly_data(current_user_id))

@analytics_ns.route("/export/csv")
class AnalyticsExportCSV(Resource):
    @analytics_ns.doc(security="Bearer")
    @analytics_ns.produces(["text/csv"])
    @analytics_ns.response(200, "A CSV file stream download containing transactional data")
    @analytics_ns.response(401, "Session expired or access token is missing/invalid")
    @token_required
    def get(self, current_user_id):
        """Export financial transaction data as a CSV file"""
        return flask_response(download_csv(current_user_id))

@analytics_ns.route("/export/pdf")
class AnalyticsExportPDF(Resource):
    @analytics_ns.doc(security="Bearer")
    @analytics_ns.produces(["application/pdf"])
    @analytics_ns.response(200, "A binary PDF stream download of the premium report")
    @analytics_ns.response(401, "Session expired or access token is missing/invalid")
    @token_required
    def get(self, current_user_id):
        """Export detailed financial report as a beautifully generated PDF"""
        return flask_response(download_pdf(current_user_id))
