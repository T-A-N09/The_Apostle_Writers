import sqlite3

# create or connect to database
connection = sqlite3.connect("the_apostles.db")

cursor = connection.cursor()

# create table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    email TEXT NOT NULL
)
""")

connection.commit()
connection.close()

print("Database and table created successfully.")