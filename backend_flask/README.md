# KIET Campus Navigation Chatbot - Python Flask & SQLite Backend

**Institution:** Kakinada Institute of Engineering and Technology (KIET)  
**Location:** Korangi, Kakinada District, Andhra Pradesh - 533461, India  
**Academic Level:** 2nd / 3rd Year B.Tech Computer Science & Engineering (CSE / CAI)  
**Curriculum Subjects Covered:**
- Discrete Mathematics & Graph Theory (Graph modeling, Nodes $V$, Edges $E$)
- Advanced Data Structures & Algorithm Analysis (Shortest Path Algorithm, Min-Heap Priority Queue)
- Object-Oriented Programming (Modular design, domain models)

---

## 📁 Directory Structure

```
backend_flask/
│
├── app.py              # Main Flask application and REST API routes
├── database.py         # SQLite connection utility
├── route_algorithm.py  # Graph representation and shortest-path calculation logic
├── chatbot_nlp.py      # Rule-based NLP campus query parser
├── init_db.py          # Script to create and seed the SQLite database
├── schema.sql          # Database schema (users, locations, connections, search_history)
├── requirements.txt    # Python dependencies
└── README.md           # Setup and Viva demonstration guide
```

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- Python 3.9+ installed on your computer.

### Step 1: Open Terminal / Command Prompt
Navigate to the `backend_flask` folder:
```bash
cd backend_flask
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Initialize the SQLite Database
This creates `kiet_campus.db` and populates it with prototype KIET locations (CSE, CAI, Central Library, Labs, Canteen, Admin Block) and weighted pathways:
```bash
python init_db.py
```
*Expected output:*
```
[*] Initializing SQLite database at: .../kiet_campus.db
[✓] Database created successfully!
    - Locations seeded: 16
    - Connections seeded: 19
    - Users seeded: 3
```

### Step 4: Start the Flask API Server
```bash
python app.py
```
The server will start running at `http://127.0.0.1:5000`.

---

## 📡 REST API Documentation

### 1. Fetch All Locations
- **Method:** `GET /api/locations`
- **Response:** JSON list of campus buildings, departments, and amenities.

### 2. Calculate Shortest Path
- **Method:** `GET /api/route?from=main-gate&to=central-library`
- **Response:**
```json
{
  "success": true,
  "data": {
    "from": { "name": "Main Campus Entrance Gate", ... },
    "to": { "name": "Central Knowledge Resource Centre", ... },
    "total_distance": 260,
    "estimated_time": 3.8,
    "steps": [
      "Start from Main Campus Entrance Gate (Main Security Pavilion).",
      "Walk toward Administrative Office (~140m): Walk directly north along Central Boulevard.",
      "Walk toward Central Library (~120m): Proceed north past the central circle.",
      "Arrived at destination: Central Knowledge Resource Centre."
    ]
  }
}
```

### 3. Query Campus Chatbot
- **Method:** `POST /api/chat`
- **Request Body:**
```json
{
  "message": "I am at main gate. How do I reach the library?",
  "start_location": "main-gate"
}
```
- **Response:** Turn-by-turn directions, stored walking distance in meters, and estimated time.

---

## 🎓 Academic Notice
All distance values, walking times, and schematic campus node coordinates in this database are **prototype student records** created for academic demonstration and viva defense at KIET.
