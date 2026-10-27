"""
Database management for RAG Assistant using SQLite.
Stores real users, uploaded documents, quiz history, flashcard progress, and activity logs.
"""

import sqlite3
import json
import hashlib
from datetime import datetime, date, timedelta
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "data" / "rag_assistant.db"
DB_PATH.parent.mkdir(parents=True, exist_ok=True)


def get_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # 1. Users Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            college TEXT DEFAULT 'GL Bajaj Institute of Technology',
            branch TEXT DEFAULT 'Computer Science (CSDS)',
            group_name TEXT DEFAULT 'Group 1',
            university TEXT DEFAULT 'aktu',
            course TEXT DEFAULT 'B.Tech',
            semester TEXT DEFAULT 'sem4',
            selected_subjects TEXT DEFAULT '[]',
            avatar TEXT DEFAULT 'https://api.dicebear.com/7.x/adventurer/svg?seed=Student&backgroundColor=ffd6e7',
            xp INTEGER DEFAULT 0,
            streak INTEGER DEFAULT 1,
            last_active_date TEXT,
            created_at TEXT NOT NULL
        )
    """)

    # Safe column migrations for existing SQLite databases
    user_columns = [
        ("university", "TEXT DEFAULT 'aktu'"),
        ("course", "TEXT DEFAULT 'B.Tech'"),
        ("semester", "TEXT DEFAULT 'sem4'"),
        ("selected_subjects", "TEXT DEFAULT '[]'"),
    ]
    for col_name, col_def in user_columns:
        try:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_def}")
        except sqlite3.OperationalError:
            pass  # Column already exists

    # 2. Documents Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS documents (
            id TEXT PRIMARY KEY,
            user_id INTEGER,
            filename TEXT NOT NULL,
            filepath TEXT NOT NULL,
            file_type TEXT NOT NULL,
            word_count INTEGER DEFAULT 0,
            raw_text TEXT NOT NULL,
            summary_json TEXT,
            keywords_json TEXT,
            flashcards_json TEXT,
            quiz_json TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)

    # 3. Quiz Attempts
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS quiz_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            doc_id TEXT,
            doc_name TEXT,
            score INTEGER NOT NULL,
            correct INTEGER NOT NULL,
            wrong INTEGER NOT NULL,
            total INTEGER NOT NULL,
            xp_earned INTEGER NOT NULL,
            time_taken_seconds INTEGER NOT NULL,
            review_json TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (doc_id) REFERENCES documents (id)
        )
    """)

    # 4. User Activities
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            action_type TEXT NOT NULL,
            description TEXT NOT NULL,
            xp_gained INTEGER DEFAULT 0,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)

    # 5. Flashcard Progress
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS flashcard_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            doc_id TEXT,
            card_id TEXT NOT NULL,
            status TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE(user_id, doc_id, card_id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)

    # 6. Bookmarks Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bookmarks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            item_type TEXT NOT NULL,
            item_id TEXT NOT NULL,
            title TEXT NOT NULL,
            subtitle TEXT,
            metadata_json TEXT,
            created_at TEXT NOT NULL,
            UNIQUE(user_id, item_type, item_id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)

    # 7. Study Planner Tasks
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS study_planner (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            subject_id TEXT,
            title TEXT NOT NULL,
            target_date TEXT NOT NULL,
            priority TEXT DEFAULT 'Medium',
            completed INTEGER DEFAULT 0,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)

    # 8. Game Scores & History
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS game_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            game_type TEXT NOT NULL,
            score INTEGER NOT NULL,
            stars INTEGER DEFAULT 0,
            time_seconds INTEGER DEFAULT 0,
            xp_earned INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)

    # 9. Revision Reminders
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS revision_reminders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            subject_id TEXT,
            topic_title TEXT NOT NULL,
            interval_days INTEGER DEFAULT 1,
            next_review_date TEXT NOT NULL,
            is_completed INTEGER DEFAULT 0,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)

    conn.commit()
    conn.close()


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


# ── User Helpers ────────────────────────────────────────────────────────
def get_user_by_id(user_id: int):
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    if user:
        return dict(user)
    return None


def get_user_by_username_or_email(identifier: str):
    conn = get_db()
    user = conn.execute(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        (identifier.strip().lower(), identifier.strip().lower())
    ).fetchone()
    conn.close()
    if user:
        return dict(user)
    return None


def create_user(username, name, email, password, college="", branch="", group_name=""):
    conn = get_db()
    cursor = conn.cursor()
    pwd_hash = hash_password(password)
    now_str = datetime.now().isoformat()
    avatar = f"https://api.dicebear.com/7.x/adventurer/svg?seed={username}&backgroundColor=ffd6e7"

    try:
        cursor.execute("""
            INSERT INTO users (username, name, email, password_hash, college, branch, group_name, avatar, xp, streak, last_active_date, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            username.strip().lower(),
            name.strip(),
            email.strip().lower(),
            pwd_hash,
            college.strip() or "GL Bajaj Institute of Technology",
            branch.strip() or "Computer Science (CSDS)",
            group_name.strip() or "Group 1",
            avatar,
            50,  # Welcome bonus XP
            1,
            date.today().isoformat(),
            now_str
        ))
        user_id = cursor.lastrowid
        cursor.execute("""
            INSERT INTO user_activities (user_id, action_type, description, xp_gained, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, "signup", "Created student profile (+50 XP)", 50, now_str))
        conn.commit()
        return get_user_by_id(user_id)
    except sqlite3.IntegrityError as e:
        conn.close()
        raise e
    finally:
        conn.close()


def add_user_xp(user_id: int, xp_to_add: int, activity_desc: str = "", action_type: str = "study"):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET xp = xp + ? WHERE id = ?", (xp_to_add, user_id))
    if activity_desc:
        cursor.execute("""
            INSERT INTO user_activities (user_id, action_type, description, xp_gained, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, action_type, activity_desc, xp_to_add, datetime.now().isoformat()))
    conn.commit()
    conn.close()


def update_user_streak(user_id: int):
    conn = get_db()
    cursor = conn.cursor()
    user = cursor.execute("SELECT last_active_date, streak FROM users WHERE id = ?", (user_id,)).fetchone()
    if not user:
        conn.close()
        return

    today = date.today()
    today_str = today.isoformat()
    last_str = user["last_active_date"]

    if last_str:
        last_date = date.fromisoformat(last_str)
        diff = (today - last_date).days
        if diff == 1:
            # increment streak
            cursor.execute("UPDATE users SET streak = streak + 1, last_active_date = ? WHERE id = ?", (today_str, user_id))
        elif diff > 1:
            # streak broken, reset to 1
            cursor.execute("UPDATE users SET streak = 1, last_active_date = ? WHERE id = ?", (today_str, user_id))
        # diff == 0: already active today, streak unchanged
    else:
        cursor.execute("UPDATE users SET streak = 1, last_active_date = ? WHERE id = ?", (today_str, user_id))

    conn.commit()
    conn.close()


def get_leaderboard_list():
    conn = get_db()
    rows = conn.execute("""
        SELECT u.id, u.name, u.username, u.avatar, u.xp, u.streak, u.college, u.group_name,
               (SELECT COUNT(*) FROM quiz_attempts qa WHERE qa.user_id = u.id) as quizzes_count
        FROM users u
        ORDER BY u.xp DESC
    """).fetchall()
    conn.close()

    result = []
    for idx, r in enumerate(rows):
        d = dict(r)
        d["rank"] = idx + 1
        d["quizzes"] = d["quizzes_count"]
        result.append(d)
    return result


def get_user_activities(user_id: int, limit: int = 6):
    conn = get_db()
    rows = conn.execute("""
        SELECT * FROM user_activities
        WHERE user_id = ?
        ORDER BY id DESC
        LIMIT ?
    """, (user_id, limit)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_weekly_study_tracker(user_id: int):
    """Calculate real activity frequency for Mon-Sun this week."""
    conn = get_db()
    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())  # Monday

    days = ["M", "T", "W", "T", "F", "S", "S"]
    activity_counts = [0] * 7

    rows = conn.execute("""
        SELECT created_at FROM user_activities
        WHERE user_id = ? AND created_at >= ?
    """, (user_id, start_of_week.isoformat())).fetchall()
    conn.close()

    for r in rows:
        try:
            dt = datetime.fromisoformat(r["created_at"])
            day_idx = dt.weekday()
            activity_counts[day_idx] += 1
        except Exception:
            pass

    max_val = max(1, max(activity_counts))
    result = []
    for i, count in enumerate(activity_counts):
        height_pct = max(20, min(100, int((count / max_val) * 100))) if count > 0 else 15
        result.append({
            "day": days[i],
            "count": count,
            "height_pct": height_pct,
            "is_today": (i == today.weekday())
        })
    return result


# Initialize tables when module is imported
init_db()
