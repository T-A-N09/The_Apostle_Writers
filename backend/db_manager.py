import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "the_apostles.db")

# ─────────────────────────────────────────────
# HELPER: connect to the database
# ─────────────────────────────────────────────
def get_db():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    return db


# ─────────────────────────────────────────────
# OPTION 1: SHOW ALL USERS
# Lets you see what's in the database before
# deciding what to delete.
# ─────────────────────────────────────────────
def show_users():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id, name, surname, email FROM users")
    rows = cursor.fetchall()
    db.close()

    if not rows:
        print("\n No users found in the database.")
        return

    print(f"\n {'ID':<5} {'Name':<15} {'Surname':<15} {'Email'}")
    print("-" * 55)
    for row in rows:
        print(f" {row['id']:<5} {row['name']:<15} {row['surname']:<15} {row['email']}")
    print(f"\n Total: {len(rows)} user(s)\n")


# ─────────────────────────────────────────────
# OPTION 2: DELETE A SINGLE USER BY ID
# Also deletes their trivia and hangman progress
# so no orphaned rows are left behind.
# ─────────────────────────────────────────────
def delete_user_by_id(user_id):
    db = get_db()
    cursor = db.cursor()

    # Check the user exists first
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()

    if not user:
        print(f"\n No user found with ID {user_id}.\n")
        db.close()
        return

    # Delete their progress rows first (foreign key integrity)
    cursor.execute("DELETE FROM trivia_progress WHERE user_id = ?", (user_id,))
    cursor.execute("DELETE FROM hangman_progress WHERE user_id = ?", (user_id,))
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    db.commit()
    db.close()

    print(f"\n Deleted user '{user['name']} {user['surname']}' (ID: {user_id}) and their progress.\n")


# ─────────────────────────────────────────────
# OPTION 3: CLEAR ALL PROGRESS (keep users)
# Wipes trivia and hangman progress for everyone
# but leaves the user accounts intact.
# ─────────────────────────────────────────────
def clear_all_progress():
    confirm = input("\n This will delete ALL trivia and hangman progress for every user. Type YES to confirm: ")
    if confirm.strip() != "YES":
        print(" Cancelled.\n")
        return

    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM trivia_progress")
    cursor.execute("DELETE FROM hangman_progress")
    db.commit()
    db.close()

    print(" All game progress cleared. User accounts are untouched.\n")


# ─────────────────────────────────────────────
# OPTION 4: CLEAR EVERYTHING
# Deletes all rows from every table.
# User accounts, trivia progress, hangman progress — all gone.
# The tables themselves stay so the app still works.
# ─────────────────────────────────────────────
def clear_everything():
    confirm = input("\n This will delete ALL users and ALL progress. Type YES to confirm: ")
    if confirm.strip() != "YES":
        print(" Cancelled.\n")
        return

    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM trivia_progress")
    cursor.execute("DELETE FROM hangman_progress")
    cursor.execute("DELETE FROM users")

    # Reset the auto-increment ID counter back to 1
    # so new signups start from ID 1 again
    cursor.execute("DELETE FROM sqlite_sequence WHERE name='users'")
    cursor.execute("DELETE FROM sqlite_sequence WHERE name='trivia_progress'")
    cursor.execute("DELETE FROM sqlite_sequence WHERE name='hangman_progress'")

    db.commit()
    db.close()

    print(" Database fully cleared. Fresh start!\n")


# ─────────────────────────────────────────────
# MENU
# Runs in a loop so you can do multiple actions
# without re-running the script each time.
# ─────────────────────────────────────────────
def menu():
    print("\n=============================")
    print("   Apostles DB Manager")
    print("=============================")

    while True:
        print("\n What would you like to do?")
        print("  1. Show all users")
        print("  2. Delete a specific user by ID")
        print("  3. Clear all game progress (keep users)")
        print("  4. Clear everything (users + progress)")
        print("  5. Exit")

        choice = input("\n Enter choice (1-5): ").strip()

        if choice == "1":
            show_users()

        elif choice == "2":
            show_users()
            try:
                user_id = int(input(" Enter the ID of the user to delete: ").strip())
                delete_user_by_id(user_id)
            except ValueError:
                print(" Invalid ID — please enter a number.\n")

        elif choice == "3":
            clear_all_progress()

        elif choice == "4":
            clear_everything()

        elif choice == "5":
            print("\n Goodbye!\n")
            break

        else:
            print(" Invalid choice — please enter a number between 1 and 5.\n")


if __name__ == "__main__":
    menu()
