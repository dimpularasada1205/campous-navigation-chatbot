import sqlite3
import os

DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'kiet_campus.db')

def get_db_connection():
    """Returns a connection to the SQLite database with row factory enabled."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn
