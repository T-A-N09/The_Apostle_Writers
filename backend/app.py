from flask import Flask, render_template, request, jsonify, redirect, session, g
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
app.secret_key = "a_very_secret_key_here"
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])


DB_PATH = os.path.join(os.path.dirname(__file__), "the_apostles.db")







#React backend code





#OTP system

#import random

#def generate_otp():
#    return str(random.randint(100000, 999999))  # 6-digit OTP

#import smtplib
#from email.mime.text import MIMEText

#EMAIL_ADDRESS = "tiyanearnold@gmail.com"
#EMAIL_PASSWORD = "your_app_password"  # NOT your real password

#def send_otp_email(recipient_email, otp):
#    msg = MIMEText(f"Your OTP is: {otp}")
#    msg["Subject"] = "Your Verification Code"
#    msg["From"] = EMAIL_ADDRESS
#    msg["To"] = recipient_email

#    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
#        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
#        server.send_message(msg)





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
# ─────────────────────────────────────────────
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
    email = data.get("email")

    if not name or not surname or not email:
        return jsonify({"error": "Missing fields"}), 400

    db = get_db()
    cursor = db.cursor()
 
    # Check if email already registered
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    existing = cursor.fetchone()
    if existing:
        db.close()
        return jsonify({"error": "Email already registered"}), 400
 
    # Insert new user into the database
    cursor.execute(
        "INSERT INTO users (name, surname, email) VALUES (?, ?, ?)",
        (name, surname, email)
    )
    db.commit()
 
    # Fetch the newly created user to get their real ID
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    new_user = cursor.fetchone()
    db.close()
 
    # Save their real ID and name into the session
    session["user_id"] = new_user["id"]
    session["name"]    = new_user["name"]

    return jsonify({"message": "Signup successful"})

#End of React





#Flask code
    
@app.route("/")
def homepage():
    return render_template("Apostles.html")

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

if __name__ == "__main__":
    init_db()
    app.run(debug=True)