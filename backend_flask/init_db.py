import os
import sqlite3

def initialize_database():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(current_dir, 'kiet_campus.db')
    schema_path = os.path.join(current_dir, 'schema.sql')

    print(f"[*] Initializing SQLite database at: {db_path}")

    with open(schema_path, 'r', encoding='utf-8') as f:
        schema_sql = f.read()

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.executescript(schema_sql)
    conn.commit()

    # Verify counts
    cursor.execute("SELECT COUNT(*) FROM locations;")
    loc_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM connections;")
    conn_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM users;")
    user_count = cursor.fetchone()[0]

    conn.close()

    print(f"[✓] Database created successfully!")
    print(f"    - Locations seeded: {loc_count}")
    print(f"    - Connections seeded: {conn_count}")
    print(f"    - Users seeded: {user_count}")

if __name__ == '__main__':
    initialize_database()
