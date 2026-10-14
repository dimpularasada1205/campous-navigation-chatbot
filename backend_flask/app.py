from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

from database import get_db_connection
from route_algorithm import calculate_shortest_path
from chatbot_nlp import process_campus_chat_message
from intent_classifier import classify_intent

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from React frontend

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "status": "online",
        "institution": "Kakinada Institute of Engineering and Technology (KIET)",
        "project": "KIET Campus Navigation Chatbot API",
        "version": "2.0.0",
        "flow": "Student Query -> Java Chatbot Shell -> Python Intent Classifier -> Directions/Timing/General -> Java Receives Intent -> AI Intelligent Agent -> ADSA Campus Graph -> BFS/DFS -> Response",
        "endpoints": [
            "/api/locations",
            "/api/locations/<id>",
            "/api/route?from=<from_id>&to=<to_id>&algo=BFS",
            "/api/classify-intent",
            "/api/chat",
            "/api/auth/login",
            "/api/auth/register",
            "/api/search-history"
        ]
    })

# 0. POST /api/classify-intent - Python Keyword-Based Intent Classifier
@app.route('/api/classify-intent', methods=['POST'])
def handle_classify_intent():
    data = request.get_json() or {}
    text = data.get('query', '').strip()
    result = classify_intent(text)
    return jsonify(result)

# 1. GET /api/locations - Fetch all campus locations
@app.route('/api/locations', methods=['GET'])
def get_locations():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM locations ORDER BY name ASC;").fetchall()
    conn.close()

    locations = [dict(row) for row in rows]
    return jsonify({"success": True, "count": len(locations), "data": locations})

# 2. GET /api/locations/<id> - Fetch single location details
@app.route('/api/locations/<loc_id>', methods=['GET'])
def get_location_detail(loc_id):
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM locations WHERE id = ?;", (loc_id,)).fetchone()
    conn.close()

    if not row:
        return jsonify({"success": False, "error": "Location not found"}), 404

    return jsonify({"success": True, "data": dict(row)})

# 3. GET /api/route?from=<id>&to=<id> - Calculate shortest path
@app.route('/api/route', methods=['GET'])
def calculate_route():
    from_id = request.args.get('from', '').strip()
    to_id = request.args.get('to', '').strip()
    algo = request.args.get('algo', 'BFS').strip()

    if not from_id or not to_id:
        return jsonify({"success": False, "error": "Both 'from' and 'to' parameters are required"}), 400

    conn = get_db_connection()
    loc_rows = conn.execute("SELECT * FROM locations;").fetchall()
    conn_rows = conn.execute("SELECT * FROM connections;").fetchall()
    conn.close()

    locations_dict = {row['id']: dict(row) for row in loc_rows}
    connections_list = [dict(row) for row in conn_rows]

    route_result = calculate_shortest_path(from_id, to_id, locations_dict, connections_list, algorithm=algo)

    if not route_result:
        return jsonify({
            "success": False,
            "error": "No connected pathway found between these two locations in the prototype graph."
        }), 404

    # Optional: Log to search_history
    user_id = request.args.get('user_id', 'anonymous')
    try:
        conn = get_db_connection()
        conn.execute(
            "INSERT INTO search_history (id, user_id, from_location_id, to_location_id, search_query) VALUES (?, ?, ?, ?, ?);",
            (f"sh-{os.urandom(4).hex()}", user_id, from_id, to_id, f"{from_id} -> {to_id}")
        )
        conn.commit()
        conn.close()
    except Exception:
        pass

    return jsonify({"success": True, "data": route_result})

# 4. POST /api/chat - Natural language query for campus navigation
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    user_message = data.get('message', '').strip()
    start_point = data.get('start_location', 'main-gate')

    if not user_message:
        return jsonify({"success": False, "error": "Query message cannot be empty"}), 400

    conn = get_db_connection()
    loc_rows = conn.execute("SELECT * FROM locations;").fetchall()
    conn_rows = conn.execute("SELECT * FROM connections;").fetchall()
    conn.close()

    locations_list = [dict(row) for row in loc_rows]
    connections_list = [dict(row) for row in conn_rows]

    bot_reply = process_campus_chat_message(user_message, locations_list, connections_list, start_point)
    return jsonify({"success": True, "reply": bot_reply})

# 5. POST /api/auth/login - Prototype authentication
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(student_id) = ?;", (email, email)).fetchone()
    conn.close()

    if not user:
        return jsonify({"success": False, "error": "User account not found"}), 404

    if user['password_hash'] != password:
        return jsonify({"success": False, "error": "Incorrect password"}), 401

    user_dict = dict(user)
    del user_dict['password_hash']
    return jsonify({"success": True, "user": user_dict})

# 6. POST /api/auth/register - Register new student or faculty account
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    role = data.get('role', 'student')
    department = data.get('department', 'General')
    student_id = data.get('student_id')

    if not name or not email or not password:
        return jsonify({"success": False, "error": "Name, email, and password are required"}), 400

    conn = get_db_connection()
    existing = conn.execute("SELECT id FROM users WHERE LOWER(email) = ?;", (email,)).fetchone()
    if existing:
        conn.close()
        return jsonify({"success": False, "error": "An account with this email already exists"}), 409

    user_id = f"usr-{os.urandom(4).hex()}"
    conn.execute(
        "INSERT INTO users (id, name, email, password_hash, role, department, student_id) VALUES (?, ?, ?, ?, ?, ?, ?);",
        (user_id, name, email, password, role, department, student_id)
    )
    conn.commit()
    conn.close()

    return jsonify({"success": True, "user": {
        "id": user_id,
        "name": name,
        "email": email,
        "role": role,
        "department": department,
        "student_id": student_id
    }})

if __name__ == '__main__':
    # Run development server on port 5000
    print("=" * 60)
    print("KIET Campus Navigation Chatbot - Flask Server")
    print("Institution: Kakinada Institute of Engineering & Technology, Korangi")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5000, debug=True)
