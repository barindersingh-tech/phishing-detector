import sqlite3

def init_db():
    conn = sqlite3.connect("history.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT,
        result TEXT
    )
    """)

    conn.commit()
    conn.close()


def insert_data(url, result):
    conn = sqlite3.connect("history.db")
    cursor = conn.cursor()

    cursor.execute("INSERT INTO history (url, result) VALUES (?, ?)", (url, result))

    conn.commit()
    conn.close()


def get_history():
    conn = sqlite3.connect("history.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM history ORDER BY id DESC")
    data = cursor.fetchall()

    conn.close()
    return data