import datetime
from flask import request, jsonify
from bson.objectid import ObjectId
from backend.config.db import get_db

db = get_db()
income_collection = db["income"]

def parse_date(date_str):
    if not date_str:
        return datetime.datetime.utcnow()
    try:
        return datetime.datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        try:
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

def get_incomes(current_user_id):
    try:
        # Query parameters
        search = request.args.get("search", "").strip()
        source = request.args.get("source", "").strip()
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
                {"source": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]
            
        if source and source != "All":
            query["source"] = source
            
        if start_date_str or end_date_str:
            date_filter = {}
            if start_date_str:
                date_filter["$gte"] = parse_date(start_date_str)
            if end_date_str:
                end_date = parse_date(end_date_str)
                date_filter["$lte"] = end_date.replace(hour=23, minute=59, second=59)
            query["date"] = date_filter
            
        # Sorting
        sort_dir = -1 if order == "desc" else 1
        sort_field = sort_by
        if sort_field not in ["date", "amount"]:
            sort_field = "date"
            
        # Count total matches
        total_docs = income_collection.count_documents(query)
        
        # Pagination
        skip = (page - 1) * limit
        
        cursor = income_collection.find(query)\
            .sort(sort_field, sort_dir)\
            .skip(skip)\
            .limit(limit)
            
        incomes = [serialize_doc(doc) for doc in cursor]
        
        return jsonify({
            "incomes": incomes,
            "page": page,
            "limit": limit,
            "total": total_docs,
            "pages": (total_docs + limit - 1) // limit
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to fetch incomes: {str(e)}"}), 500

def create_income(current_user_id):
    data = request.get_json() or {}
    source = data.get("source", "").strip()
    amount = data.get("amount")
    description = data.get("description", "").strip()
    date_str = data.get("date")
    
    if not source or amount is None:
        return jsonify({"error": "Source and amount are required"}), 400
        
    try:
        amount_val = float(amount)
        if amount_val <= 0:
            return jsonify({"error": "Amount must be a positive number"}), 400
    except ValueError:
        return jsonify({"error": "Amount must be a valid number"}), 400
        
    try:
        new_income = {
            "userId": ObjectId(current_user_id),
            "source": source,
            "amount": amount_val,
            "description": description,
            "date": parse_date(date_str),
            "createdAt": datetime.datetime.utcnow()
        }
        
        result = income_collection.insert_one(new_income)
        new_income["_id"] = result.inserted_id
        
        return jsonify({
            "message": "Income record added successfully",
            "income": serialize_doc(new_income)
        }), 201
        
    except Exception as e:
        return jsonify({"error": f"Failed to add income: {str(e)}"}), 500

def update_income(current_user_id, income_id):
    data = request.get_json() or {}
    source = data.get("source", "").strip()
    amount = data.get("amount")
    description = data.get("description", "").strip()
    date_str = data.get("date")
    
    if not ObjectId.is_valid(income_id):
        return jsonify({"error": "Invalid income ID"}), 400
        
    # Build update payload
    update_data = {}
    if source:
        update_data["source"] = source
    if amount is not None:
        try:
            amount_val = float(amount)
            if amount_val <= 0:
                return jsonify({"error": "Amount must be a positive number"}), 400
            update_data["amount"] = amount_val
        except ValueError:
            return jsonify({"error": "Amount must be a valid number"}), 400
    if description is not None:
        update_data["description"] = description
    if date_str:
        update_data["date"] = parse_date(date_str)
        
    if not update_data:
        return jsonify({"error": "No update fields provided"}), 400
        
    try:
        result = income_collection.find_one_and_update(
            {"_id": ObjectId(income_id), "userId": ObjectId(current_user_id)},
            {"$set": update_data},
            return_document=True
        )
        
        if not result:
            return jsonify({"error": "Income record not found or unauthorized"}), 404
            
        return jsonify({
            "message": "Income record updated successfully",
            "income": serialize_doc(result)
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to update income record: {str(e)}"}), 500

def delete_income(current_user_id, income_id):
    if not ObjectId.is_valid(income_id):
        return jsonify({"error": "Invalid income ID"}), 400
        
    try:
        result = income_collection.delete_one(
            {"_id": ObjectId(income_id), "userId": ObjectId(current_user_id)}
        )
        
        if result.deleted_count == 0:
            return jsonify({"error": "Income record not found or unauthorized"}), 404
            
        return jsonify({"message": "Income record deleted successfully", "id": income_id}), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to delete income record: {str(e)}"}), 500
