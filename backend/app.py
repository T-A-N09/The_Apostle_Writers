from flask import Flask, render_template, request, jsonify, redirect, session, g, send_from_directory
from flask_cors import CORS
import sqlite3
import os
import secrets

app = Flask(__name__, 
    static_folder=os.path.join(os.path.dirname(__file__), "../frontend/dist"),
    static_url_path='/')

app.secret_key = "paste_the_generated_value_here"
CORS(app, supports_credentials=True, origins=[
    "http://localhost:5173",
    "https://the-apostle-writers.onrender.com"])

app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True


DB_PATH = os.path.join(os.path.dirname(__file__), "the_apostles.db")

#GItHub








#Supabase backend code

from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase = create_client(url, key)


#React backend code


#Games

# ─────────────────────────────────────────────
# STEP 1: DATABASE HELPER
# Instead of opening a new connection in every route, we use one
# helper function. It sets row_factory so rows behave like
# dictionaries (row["name"]) instead of plain tuples (row[0]).
# Always call db.close() when done to avoid locking the file.
# ─────────────────────────────────────────────
def get_db():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    return db
 
 
# ─────────────────────────────────────────────
# STEP 2: DATABASE INITIALISATION
# This function creates all three tables if they don't already exist.
# "CREATE TABLE IF NOT EXISTS" means it's safe to call every time the
# server starts — it won't wipe existing data.
#
# Tables:
#   users        — stores everyone who has signed up
#   trivia_progress  — stores each user's trivia question index and score
#   hangman_progress — stores each user's current hangman word and guesses
def init_db():
    db = get_db()
    cursor = db.cursor()
 
    # Users table — one row per person who signs up
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            name    TEXT NOT NULL,
            surname TEXT NOT NULL,
            email   TEXT NOT NULL UNIQUE
        )
    """)
 
    # Trivia progress — one row per user
    # current_question: index (0-9) of where they left off
    # score: how many correct answers so far
    # completed: 1 if they finished the quiz, 0 if still in progress
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS trivia_progress (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id          INTEGER NOT NULL UNIQUE,
            current_question INTEGER DEFAULT 0,
            score            INTEGER DEFAULT 0,
            completed        INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
 
    # Hangman progress — one row per user
    # current_word: the word they are currently guessing
    # guessed_letters: a comma-separated string e.g. "A,P,T,E"
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS hangman_progress (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id          INTEGER NOT NULL UNIQUE,
            current_word     TEXT DEFAULT '',
            guessed_letters  TEXT DEFAULT '',
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
 
    db.commit()
    db.close()

@app.route("/api/trivia/progress", methods=["GET"])
def get_trivia_progress():
    # Must be logged in to save/load progress
    if "user_id" not in session:
        return jsonify({"error": "Not logged in"}), 401
 
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT * FROM trivia_progress WHERE user_id = ?",
        (session["user_id"],)
    )
    row = cursor.fetchone()
    db.close()
 
    # If no row exists yet, return fresh defaults
    if not row:
        return jsonify({
            "current_question": 0,
            "score": 0,
            "completed": False
        })
 
    return jsonify({
        "current_question": row["current_question"],
        "score":            row["score"],
        "completed":        bool(row["completed"])
    })
 
 
@app.route("/api/trivia/progress", methods=["POST"])
def save_trivia_progress():
    if "user_id" not in session:
        return jsonify({"error": "Not logged in"}), 401
 
    data             = request.get_json()
    current_question = data.get("current_question", 0)
    score            = data.get("score", 0)
    completed        = 1 if data.get("completed", False) else 0
 
    db = get_db()
    cursor = db.cursor()
 
    # "INSERT OR REPLACE" means: if a row for this user already exists,
    # replace it with the new values. Otherwise insert a fresh row.
    # This way we always have exactly one progress row per user.
    cursor.execute("""
        INSERT INTO trivia_progress (user_id, current_question, score, completed)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            current_question = excluded.current_question,
            score            = excluded.score,
            completed        = excluded.completed
    """, (session["user_id"], current_question, score, completed))
 
    db.commit()
    db.close()
 
    return jsonify({"message": "Progress saved"})

@app.route("/api/trivia/reset", methods=["POST"])
def reset_trivia_progress():
    if "user_id" not in session:
        return jsonify({"error": "Not logged in"}), 401
 
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "DELETE FROM trivia_progress WHERE user_id = ?",
        (session["user_id"],)
    )
    db.commit()
    db.close()
 
    return jsonify({"message": "Progress reset"})

    # GET  /api/hangman/progress — load saved word + guessed letters
# POST /api/hangman/progress — save current word + guessed letters
# POST /api/hangman/reset    — wipe progress for a new game
#
# Guessed letters are stored as a comma-separated string in the DB
# e.g. "A,P,O,S,T,L,E" and converted back to an array in Python.
# ─────────────────────────────────────────────
 
@app.route("/api/hangman/progress", methods=["GET"])
def get_hangman_progress():
    if "user_id" not in session:
        return jsonify({"error": "Not logged in"}), 401
 
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT * FROM hangman_progress WHERE user_id = ?",
        (session["user_id"],)
    )
    row = cursor.fetchone()
    db.close()
 
    if not row or not row["current_word"]:
        return jsonify({"current_word": None, "guessed_letters": []})
 
    # Convert the comma-separated string back into a list
    # "A,P,T" → ["A", "P", "T"]
    # The filter(None, ...) handles the edge case of an empty string
    guessed = list(filter(None, row["guessed_letters"].split(",")))
 
    return jsonify({
        "current_word":    row["current_word"],
        "guessed_letters": guessed
    })
 
 
@app.route("/api/hangman/progress", methods=["POST"])
def save_hangman_progress():
    if "user_id" not in session:
        return jsonify({"error": "Not logged in"}), 401
 
    data         = request.get_json()
    current_word = data.get("current_word", "")
    guessed      = data.get("guessed_letters", [])
 
    # Convert the list back into a comma-separated string for storage
    # ["A", "P", "T"] → "A,P,T"
    guessed_str = ",".join(guessed)
 
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO hangman_progress (user_id, current_word, guessed_letters)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            current_word    = excluded.current_word,
            guessed_letters = excluded.guessed_letters
    """, (session["user_id"], current_word, guessed_str))
 
    db.commit()
    db.close()
 
    return jsonify({"message": "Progress saved"})
 
 
@app.route("/api/hangman/reset", methods=["POST"])
def reset_hangman_progress():
    if "user_id" not in session:
        return jsonify({"error": "Not logged in"}), 401
 
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "DELETE FROM hangman_progress WHERE user_id = ?",
        (session["user_id"],)
    )
    db.commit()
    db.close()
 
    return jsonify({"message": "Progress reset"})

#End of Game















from werkzeug.security import generate_password_hash, check_password_hash

#User profiling

@app.route("/api/user")
def user():
    if "user_id" in session:
        return jsonify({
            "user": {
                "id": session["user_id"],
                "name": session["name"]
            }
        })
    return jsonify({"user": None})

@app.route("/api/logout")
def logout():
    session.clear()
    return jsonify({"success": True})

@app.route("/signup" , methods = ["POST"])
def signup():
    data = request.get_json()

    name = data.get("name")
    surname = data.get("surname")
    username = data.get("username")
    password = data.get("password")

    if not name or not surname or not username or not password:
        return jsonify({"error": "Missing fields"}), 400

    # Check if username already registered
    existing = supabase.table("users").select("*").eq("username", username).execute()

    if existing.data:
        return jsonify({"error": "Username already exists"}), 400
 
    # Hash the password before storing it
    hashed_password = generate_password_hash(password)

    # Insert new user into Supabase
    response = supabase.table("users").insert({
        "name":     name,
        "surname":  surname,
        "username": username,
        "password": hashed_password
    }).execute()
 
    new_user = response.data[0]
 
    # Save their real ID and name into the session
    session["user_id"] = new_user["id"]
    session["name"]    = new_user["name"]

    return jsonify({"message": "Signup successful"})


@app.route("/login" , methods = ["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Missing fields"}), 400

    db = get_db()
    cursor = db.cursor()
 
    # Fetch user by username
    response = supabase.table("users").select("*").eq("username", username).execute()
    if not response.data:
        return jsonify({"error": "Username OR Password is incorrect"}), 400
 
    new_user = response.data[0]
 
    # Check the hashed password
    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Username OR Password is incorrect"}), 400
 
    # Save their real ID and name into the session
    session["user_id"] = new_user["id"]
    session["name"]    = new_user["name"]

    return jsonify({"message": "Login successful"})

#End of React





#Flask code
    
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    file_path = os.path.join(app.static_folder, path)
    if path != "" and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

@app.route("/Matthew.html")
def Matthew():
    return render_template("Matthew.html")

@app.route("/John.html")
def John():
    return render_template("John.html")

@app.route("/Peter.html")
def Peter():
    return render_template("Peter.html")

@app.route("/Paul.html")
def Paul():
    return render_template("Paul.html")

@app.route("/Games.html")
def Games():
    return render_template("Games.html")

@app.route("/Trivia.html")
def Trivia():
    return render_template("Trivia.html")

@app.route("/Hangman.html")
def Hangman():
    return render_template("Hangman.html")

@app.route("/Login.html")
def Signup():
    return render_template("Login.html")

@app.route("/Logout")
def Logout():
    session.clear()
    return redirect("/")

@app.route("/Feedback", methods = ["GET", "POST"])
def Feedback():

    name = request.form.get("name")
    surname = request.form.get("surname")
    email = request.form.get("email")

    if request.method == "POST":
        if not name or not surname or not email:
            return render_template("failure.html")
            
        db_path = os.path.abspath("the_apostles.db")
        print("Database path:", db_path)

        db = sqlite3.connect("the_apostles.db", check_same_thread=False)
        db.row_factory = sqlite3.Row
        cursor = db.cursor()

        cursor.execute( "INSERT INTO users (name, surname, email) VALUES (?, ?, ?)",(name, surname, email))
        db.commit()

        print("Submitting:", name, surname, email)
        
        
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        rows = cursor.fetchall()
        db.close()

        session["user_id"] = rows[0]["id"]
        session["name"] = rows[0]["name"]

        

        return redirect("/")
    else:
        return redirect("/Login.html")

init_db()

if __name__ == "__main__":
     
    app.run(debug=True)