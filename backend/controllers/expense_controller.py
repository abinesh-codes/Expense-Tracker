import datetime
from flask import request, jsonify
from bson.objectid import ObjectId
from backend.config.db import get_db

db = get_db()
expenses_collection = db["expenses"]

def parse_date(date_str):
    if not date_str:
        return datetime.datetime.utcnow()
    try:
        # Expecting YYYY-MM-DD
        return datetime.datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        try:
            # Fallback ISO string
            return datetime.datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        except ValueError:
            return datetime.datetime.utcnow()

def serialize_doc(doc):
    if not doc:
        return None
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    if "userId" in doc:
        doc["userId"] = str(doc["userId"])
    if isinstance(doc.get("date"), datetime.datetime):
        doc["date"] = doc["date"].strftime("%Y-%m-%d")
    if isinstance(doc.get("createdAt"), datetime.datetime):
        doc["createdAt"] = doc["createdAt"].isoformat()
    return doc

def get_expenses(current_user_id):
    try:
        # Query parameters
        search = request.args.get("search", "").strip()
        category = request.args.get("category", "").strip()
        start_date_str = request.args.get("startDate", "").strip()
        end_date_str = request.args.get("endDate", "").strip()
        
        sort_by = request.args.get("sortBy", "date") # date or amount
        order = request.args.get("order", "desc") # asc or desc
        
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        
        # Build query
        query = {"userId": ObjectId(current_user_id)}
        
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]
            
        if category and category != "All":
            query["category"] = category
            
        if start_date_str or end_date_str:
            date_filter = {}
            if start_date_str:
                date_filter["$gte"] = parse_date(start_date_str)
            if end_date_str:
                # Set time to end of day
                end_date = parse_date(end_date_str)
                date_filter["$lte"] = end_date.replace(hour=23, minute=59, second=59)
            query["date"] = date_filter
            
        # Sorting
        sort_dir = -1 if order == "desc" else 1
        sort_field = sort_by
        if sort_field not in ["date", "amount"]:
            sort_field = "date"
            
        # Count total matches
        total_docs = expenses_collection.count_documents(query)
        
        # Pagination
        skip = (page - 1) * limit
        
        cursor = expenses_collection.find(query)\
            .sort(sort_field, sort_dir)\
            .skip(skip)\
            .limit(limit)
            
        expenses = [serialize_doc(doc) for doc in cursor]
        
        return jsonify({
            "expenses": expenses,
            "page": page,
            "limit": limit,
            "total": total_docs,
            "pages": (total_docs + limit - 1) // limit
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to fetch expenses: {str(e)}"}), 500

def create_expense(current_user_id):
    data = request.get_json() or {}
    title = data.get("title", "").strip()
    amount = data.get("amount")
    category = data.get("category", "").strip()
    description = data.get("description", "").strip()
    date_str = data.get("date")
    
    if not title or amount is None or not category:
        return jsonify({"error": "Title, amount, and category are required"}), 400
        
    try:
        amount_val = float(amount)
        if amount_val <= 0:
            return jsonify({"error": "Amount must be a positive number"}), 400
    except ValueError:
        return jsonify({"error": "Amount must be a valid number"}), 400
        
    # Categories validation
    valid_categories = ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Others"]
    if category not in valid_categories:
        return jsonify({"error": f"Category must be one of: {', '.join(valid_categories)}"}), 400
        
    try:
        new_expense = {
            "userId": ObjectId(current_user_id),
            "title": title,
            "amount": amount_val,
            "category": category,
            "description": description,
            "date": parse_date(date_str),
            "createdAt": datetime.datetime.utcnow()
        }
        
        result = expenses_collection.insert_one(new_expense)
        new_expense["_id"] = result.inserted_id
        
        return jsonify({
            "message": "Expense created successfully",
            "expense": serialize_doc(new_expense)
        }), 201
        
    except Exception as e:
        return jsonify({"error": f"Failed to create expense: {str(e)}"}), 500

def update_expense(current_user_id, expense_id):
    data = request.get_json() or {}
    title = data.get("title", "").strip()
    amount = data.get("amount")
    category = data.get("category", "").strip()
    description = data.get("description", "").strip()
    date_str = data.get("date")
    
    if not ObjectId.is_valid(expense_id):
        return jsonify({"error": "Invalid expense ID"}), 400
        
    # Build update payload
    update_data = {}
    if title:
        update_data["title"] = title
    if amount is not None:
        try:
            amount_val = float(amount)
            if amount_val <= 0:
                return jsonify({"error": "Amount must be a positive number"}), 400
            update_data["amount"] = amount_val
        except ValueError:
            return jsonify({"error": "Amount must be a valid number"}), 400
    if category:
        valid_categories = ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Others"]
        if category not in valid_categories:
            return jsonify({"error": f"Category must be one of: {', '.join(valid_categories)}"}), 400
        update_data["category"] = category
    if description is not None:
        update_data["description"] = description
    if date_str:
        update_data["date"] = parse_date(date_str)
        
    if not update_data:
        return jsonify({"error": "No update fields provided"}), 400
        
    try:
        # Perform update matching userId
        result = expenses_collection.find_one_and_update(
            {"_id": ObjectId(expense_id), "userId": ObjectId(current_user_id)},
            {"$set": update_data},
            return_document=True
        )
        
        if not result:
            return jsonify({"error": "Expense not found or unauthorized"}), 404
            
        return jsonify({
            "message": "Expense updated successfully",
            "expense": serialize_doc(result)
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to update expense: {str(e)}"}), 500

def delete_expense(current_user_id, expense_id):
    if not ObjectId.is_valid(expense_id):
        return jsonify({"error": "Invalid expense ID"}), 400
        
    try:
        result = expenses_collection.delete_one(
            {"_id": ObjectId(expense_id), "userId": ObjectId(current_user_id)}
        )
        
        if result.deleted_count == 0:
            return jsonify({"error": "Expense not found or unauthorized"}), 404
            
        return jsonify({"message": "Expense deleted successfully", "id": expense_id}), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to delete expense: {str(e)}"}), 500
