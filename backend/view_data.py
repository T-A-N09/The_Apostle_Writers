import sqlite3
import os

connection = sqlite3.connect("the_apostles.db")
cursor = connection.cursor()

cursor.execute("SELECT * FROM users")

DB_PATH = os.path.join(os.path.dirname(__file__), "the_apostles.db")

rows = cursor.fetchall()

for row in rows:
    print(row)
    
connection.close()