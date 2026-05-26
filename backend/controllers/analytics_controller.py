import datetime
from flask import Response, jsonify, send_file
from bson.objectid import ObjectId
from backend.config.db import get_db
from backend.utils.ai_insights import generate_financial_insights
from backend.utils.report_generator import generate_csv_report, generate_pdf_report

db = get_db()
expenses_collection = db["expenses"]
income_collection = db["income"]
users_collection = db["users"]

def get_summary(current_user_id):
    try:
        user_obj_id = ObjectId(current_user_id)
        
        # 1. Total Income
        income_pipeline = [
            {"$match": {"userId": user_obj_id}},
            {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
        ]
        income_res = list(income_collection.aggregate(income_pipeline))
        total_income = income_res[0]["total"] if income_res else 0.0
        
        # 2. Total Expenses
        expense_pipeline = [
            {"$match": {"userId": user_obj_id}},
            {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
        ]
        expense_res = list(expenses_collection.aggregate(expense_pipeline))
        total_expenses = expense_res[0]["total"] if expense_res else 0.0
        
        # 3. Balance
        balance = total_income - total_expenses
        
        # 4. Expenses by Category
        category_pipeline = [
            {"$match": {"userId": user_obj_id}},
            {"$group": {"_id": "$category", "amount": {"$sum": "$amount"}}}
        ]
        category_res = list(expenses_collection.aggregate(category_pipeline))
        
        category_totals = {item["_id"]: item["amount"] for item in category_res}
        # Prepopulate missing categories with 0.0
        categories = ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Others"]
        category_data = []
        for cat in categories:
            amt = category_totals.get(cat, 0.0)
            category_data.append({
                "name": cat,
                "value": amt,
                "percentage": (amt / total_expenses * 100) if total_expenses > 0 else 0.0
            })
            
        # 5. Recent 5 Transactions (Unified view)
        recent_expenses = list(expenses_collection.find({"userId": user_obj_id}).sort("date", -1).limit(5))
        recent_incomes = list(income_collection.find({"userId": user_obj_id}).sort("date", -1).limit(5))
        
        recent_txs = []
        for inc in recent_incomes:
            recent_txs.append({
                "id": str(inc["_id"]),
                "type": "income",
                "title": inc["source"],
                "amount": inc["amount"],
                "category": "Income",
                "date": inc["date"].strftime("%Y-%m-%d") if isinstance(inc["date"], datetime.datetime) else str(inc["date"]),
                "description": inc.get("description", "")
            })
        for exp in recent_expenses:
            recent_txs.append({
                "id": str(exp["_id"]),
                "type": "expense",
                "title": exp["title"],
                "amount": exp["amount"],
                "category": exp["category"],
                "date": exp["date"].strftime("%Y-%m-%d") if isinstance(exp["date"], datetime.datetime) else str(exp["date"]),
                "description": exp.get("description", "")
            })
            
        # Sort combined list by date desc and limit to 5
        recent_txs = sorted(recent_txs, key=lambda x: x["date"], reverse=True)[:5]
        
        # 6. AI Insights
        insights = generate_financial_insights(total_income, total_expenses, category_totals)
        
        return jsonify({
            "summary": {
                "totalIncome": total_income,
                "totalExpenses": total_expenses,
                "balance": balance,
            },
            "categories": category_data,
            "recentTransactions": recent_txs,
            "insights": insights
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to load dashboard summary: {str(e)}"}), 500

def get_monthly_data(current_user_id):
    try:
        user_obj_id = ObjectId(current_user_id)
        
        # Aggregate Expenses Month-by-Month
        expense_pipeline = [
            {"$match": {"userId": user_obj_id}},
            {"$group": {
                "_id": {
                    "year": {"$year": "$date"},
                    "month": {"$month": "$date"}
                },
                "total": {"$sum": "$amount"}
            }},
            {"$sort": {"_id.year": 1, "_id.month": 1}}
        ]
        expense_monthly = list(expenses_collection.aggregate(expense_pipeline))
        
        # Aggregate Incomes Month-by-Month
        income_pipeline = [
            {"$match": {"userId": user_obj_id}},
            {"$group": {
                "_id": {
                    "year": {"$year": "$date"},
                    "month": {"$month": "$date"}
                },
                "total": {"$sum": "$amount"}
            }},
            {"$sort": {"_id.year": 1, "_id.month": 1}}
        ]
        income_monthly = list(income_collection.aggregate(income_pipeline))
        
        # Merge results into a unified structure
        # Key: "YYYY-MM"
        monthly_map = {}
        
        # Populate expenses
        for item in expense_monthly:
            y = item["_id"]["year"]
            m = item["_id"]["month"]
            key = f"{y}-{m:02d}"
            monthly_map[key] = {
                "monthKey": key,
                "year": y,
                "monthNum": m,
                "monthName": datetime.date(1900, m, 1).strftime("%b"),
                "expense": item["total"],
                "income": 0.0
            }
            
        # Populate incomes
        for item in income_monthly:
            y = item["_id"]["year"]
            m = item["_id"]["month"]
            key = f"{y}-{m:02d}"
            if key in monthly_map:
                monthly_map[key]["income"] = item["total"]
            else:
                monthly_map[key] = {
                    "monthKey": key,
                    "year": y,
                    "monthNum": m,
                    "monthName": datetime.date(1900, m, 1).strftime("%b"),
                    "expense": 0.0,
                    "income": item["total"]
                }
                
        # Sort chronological
        sorted_keys = sorted(monthly_map.keys())
        trends = [monthly_map[k] for k in sorted_keys]
        
        # If empty, prefill last 3 months with zero to keep Recharts happy
        if not trends:
            today = datetime.date.today()
            for i in range(2, -1, -1):
                d = today - datetime.timedelta(days=i*30)
                trends.append({
                    "monthKey": d.strftime("%Y-%m"),
                    "year": d.year,
                    "monthNum": d.month,
                    "monthName": d.strftime("%b"),
                    "expense": 0.0,
                    "income": 0.0
                })
                
        # Cap at last 6 months
        return jsonify(trends[-6:]), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to compute monthly data: {str(e)}"}), 500

def download_csv(current_user_id):
    try:
        user_obj_id = ObjectId(current_user_id)
        
        # Retrieve all user's transactions
        expenses = list(expenses_collection.find({"userId": user_obj_id}))
        incomes = list(income_collection.find({"userId": user_obj_id}))
        
        csv_data = generate_csv_report(expenses, incomes)
        
        filename = f"SpendWise_Report_{datetime.datetime.now().strftime('%Y%m%d')}.csv"
        
        return Response(
            csv_data,
            mimetype="text/csv",
            headers={"Content-disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        return jsonify({"error": f"Failed to generate CSV download: {str(e)}"}), 500

def download_pdf(current_user_id):
    try:
        user_obj_id = ObjectId(current_user_id)
        
        # Get username
        user = users_collection.find_one({"_id": user_obj_id})
        username = user.get("username", "User") if user else "User"
        
        # Retrieve transactions
        expenses = list(expenses_collection.find({"userId": user_obj_id}))
        incomes = list(income_collection.find({"userId": user_obj_id}))
        
        # Calculate metric totals
        total_income = sum(item.get("amount", 0.0) for item in incomes)
        total_expenses = sum(item.get("amount", 0.0) for item in expenses)
        balance = total_income - total_expenses
        
        # Convert date to standard string formatting prior to PDF sorting
        for item in incomes:
            if isinstance(item.get("date"), datetime.datetime):
                item["date"] = item["date"].strftime("%Y-%m-%d")
        for item in expenses:
            if isinstance(item.get("date"), datetime.datetime):
                item["date"] = item["date"].strftime("%Y-%m-%d")
                
        from flask import request
        currency_symbol = request.args.get("currency", "₹")
        
        pdf_bytes = generate_pdf_report(
            username, expenses, incomes, total_income, total_expenses, balance, currency_symbol=currency_symbol
        )
        
        filename = f"SpendWise_Report_{datetime.datetime.now().strftime('%Y%m%d')}.pdf"
        
        return Response(
            pdf_bytes,
            mimetype="application/pdf",
            headers={"Content-disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        return jsonify({"error": f"Failed to generate PDF download: {str(e)}"}), 500
