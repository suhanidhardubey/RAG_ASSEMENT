"""
Database management for RAGora using SQLite.
Stores real users, uploaded documents, quiz history, flashcard progress, and activity logs.
"""

import sqlite3
import json
import os
import shutil
import hashlib
import uuid
from datetime import datetime, date, timedelta
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

legacy_db = DATA_DIR / "rag_assistant.db"
ragora_db = DATA_DIR / "ragora.db"

# Migrate legacy database to ragora.db if exists
if legacy_db.exists() and not ragora_db.exists():
    try:
        shutil.copy2(legacy_db, ragora_db)
    except Exception:
        pass

DB_PATH = Path(os.environ.get("DATABASE_PATH", str(ragora_db if ragora_db.exists() else legacy_db)))
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

    # 10. Conversations Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            user_id INTEGER,
            title TEXT NOT NULL,
            chat_type TEXT DEFAULT 'tutor',
            doc_id TEXT,
            subject_id TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)

    # 11. Messages Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            source TEXT,
            citations_json TEXT,
            confidence REAL DEFAULT 0.9,
            llm_used INTEGER DEFAULT 0,
            created_at TEXT NOT NULL,
            FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE
        )
    """)

    # Safe index creation
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations (user_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations (updated_at)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages (conversation_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_messages_created ON messages (created_at)")

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


# ── Bookmarks ──
def get_bookmarks(user_id: int, item_type: str | None = None):
    conn = get_db()
    if item_type:
        rows = conn.execute("SELECT * FROM bookmarks WHERE user_id = ? AND item_type = ? ORDER BY id DESC", (user_id, item_type)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM bookmarks WHERE user_id = ? ORDER BY id DESC", (user_id,)).fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        if d.get("metadata_json"):
            try:
                d["metadata"] = json.loads(d["metadata_json"])
            except Exception:
                d["metadata"] = {}
        result.append(d)
    return result


def add_bookmark(user_id: int, item_type: str, item_id: str, title: str, subtitle: str = "", metadata: dict = None):
    conn = get_db()
    cursor = conn.cursor()
    now_str = datetime.now().isoformat()
    meta_str = json.dumps(metadata or {})
    try:
        cursor.execute("""
            INSERT OR REPLACE INTO bookmarks (user_id, item_type, item_id, title, subtitle, metadata_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_id, item_type, item_id, title, subtitle, meta_str, now_str))
        conn.commit()
        return True
    finally:
        conn.close()


def remove_bookmark(user_id: int, item_type: str, item_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bookmarks WHERE user_id = ? AND item_type = ? AND item_id = ?", (user_id, item_type, item_id))
    conn.commit()
    conn.close()
    return True


# ── Study Planner ──
def get_planner_tasks(user_id: int):
    conn = get_db()
    rows = conn.execute("SELECT * FROM study_planner WHERE user_id = ? ORDER BY completed ASC, target_date ASC", (user_id,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def add_planner_task(user_id: int, subject_id: str, title: str, target_date: str, priority: str = "Medium"):
    conn = get_db()
    cursor = conn.cursor()
    now_str = datetime.now().isoformat()
    cursor.execute("""
        INSERT INTO study_planner (user_id, subject_id, title, target_date, priority, completed, created_at)
        VALUES (?, ?, ?, ?, ?, 0, ?)
    """, (user_id, subject_id, title, target_date, priority, now_str))
    task_id = cursor.lastrowid
    conn.commit()
    row = conn.execute("SELECT * FROM study_planner WHERE id = ?", (task_id,)).fetchone()
    conn.close()
    return dict(row)


def update_planner_task(task_id: int, user_id: int, completed: int = None, title: str = None, priority: str = None, target_date: str = None):
    conn = get_db()
    cursor = conn.cursor()
    updates = []
    params = []
    if completed is not None:
        updates.append("completed = ?")
        params.append(1 if completed else 0)
    if title is not None:
        updates.append("title = ?")
        params.append(title)
    if priority is not None:
        updates.append("priority = ?")
        params.append(priority)
    if target_date is not None:
        updates.append("target_date = ?")
        params.append(target_date)

    if updates:
        params.extend([task_id, user_id])
        cursor.execute(f"UPDATE study_planner SET {', '.join(updates)} WHERE id = ? AND user_id = ?", params)
        conn.commit()
    row = conn.execute("SELECT * FROM study_planner WHERE id = ?", (task_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def delete_planner_task(task_id: int, user_id: int):
    conn = get_db()
    conn.execute("DELETE FROM study_planner WHERE id = ? AND user_id = ?", (task_id, user_id))
    conn.commit()
    conn.close()
    return True


# ── Game Scores ──
def save_game_score(user_id: int, game_type: str, score: int, stars: int = 0, time_seconds: int = 0, xp_earned: int = 15):
    conn = get_db()
    cursor = conn.cursor()
    now_str = datetime.now().isoformat()
    cursor.execute("""
        INSERT INTO game_scores (user_id, game_type, score, stars, time_seconds, xp_earned, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (user_id, game_type, score, stars, time_seconds, xp_earned, now_str))
    conn.commit()
    conn.close()
    add_user_xp(user_id, xp_earned, f"Played {game_type.replace('_', ' ').title()} (+{xp_earned} XP)", "game")
    return {"status": "ok", "xp_earned": xp_earned}


def get_game_history(user_id: int, limit: int = 10):
    conn = get_db()
    rows = conn.execute("SELECT * FROM game_scores WHERE user_id = ? ORDER BY id DESC LIMIT ?", (user_id, limit)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


# ── Revision Reminders ──
def get_revision_reminders(user_id: int):
    conn = get_db()
    rows = conn.execute("SELECT * FROM revision_reminders WHERE user_id = ? ORDER BY is_completed ASC, next_review_date ASC", (user_id,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def add_revision_reminder(user_id: int, subject_id: str, topic_title: str, interval_days: int = 1):
    conn = get_db()
    cursor = conn.cursor()
    now_str = datetime.now().isoformat()
    next_date = (date.today() + timedelta(days=interval_days)).isoformat()
    cursor.execute("""
        INSERT INTO revision_reminders (user_id, subject_id, topic_title, interval_days, next_review_date, is_completed, created_at)
        VALUES (?, ?, ?, ?, ?, 0, ?)
    """, (user_id, subject_id, topic_title, interval_days, next_date, now_str))
    conn.commit()
    conn.close()
    return True


def toggle_revision_reminder(reminder_id: int, user_id: int):
    conn = get_db()
    cursor = conn.cursor()
    curr = conn.execute("SELECT is_completed, interval_days FROM revision_reminders WHERE id = ? AND user_id = ?", (reminder_id, user_id)).fetchone()
    if curr:
        new_val = 0 if curr["is_completed"] else 1
        if new_val == 1:
            new_interval = max(1, curr["interval_days"]) * 2
            next_date = (date.today() + timedelta(days=new_interval)).isoformat()
            cursor.execute("UPDATE revision_reminders SET is_completed = 1, interval_days = ?, next_review_date = ? WHERE id = ?", (new_interval, next_date, reminder_id))
        else:
            cursor.execute("UPDATE revision_reminders SET is_completed = 0 WHERE id = ?", (reminder_id,))
        conn.commit()
    conn.close()
    return True


# ── Conversations & Messages (Persistent History) ──
def create_conversation(conv_id: str, title: str, user_id: int | None = None, chat_type: str = "tutor", doc_id: str | None = None, subject_id: str | None = None):
    conn = get_db()
    cursor = conn.cursor()
    now_str = datetime.now().isoformat()
    clean_title = (title or "New Conversation").strip()
    if len(clean_title) > 80:
        clean_title = clean_title[:77] + "..."

    cursor.execute("""
        INSERT INTO conversations (id, user_id, title, chat_type, doc_id, subject_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET title = excluded.title, updated_at = excluded.updated_at
    """, (conv_id, user_id, clean_title, chat_type, doc_id, subject_id, now_str, now_str))
    conn.commit()
    row = conn.execute("SELECT * FROM conversations WHERE id = ?", (conv_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def get_conversation(conv_id: str):
    conn = get_db()
    row = conn.execute("SELECT * FROM conversations WHERE id = ?", (conv_id,)).fetchone()
    if not row:
        conn.close()
        return None
    conv = dict(row)
    msg_rows = conn.execute("""
        SELECT * FROM messages WHERE conversation_id = ? ORDER BY id ASC
    """, (conv_id,)).fetchall()
    conn.close()

    messages = []
    for m in msg_rows:
        md = dict(m)
        if md.get("citations_json"):
            try:
                md["citations"] = json.loads(md["citations_json"])
            except Exception:
                md["citations"] = []
        else:
            md["citations"] = []
        messages.append(md)
    conv["messages"] = messages
    return conv


def add_message(conv_id: str, role: str, content: str, source: str = "", citations: list = None, confidence: float = 0.9, llm_used: int = 0):
    conn = get_db()
    cursor = conn.cursor()
    now_str = datetime.now().isoformat()
    c_json = json.dumps(citations or [])

    # Ensure conversation exists
    existing = conn.execute("SELECT id FROM conversations WHERE id = ?", (conv_id,)).fetchone()
    if not existing:
        derived_title = content[:45] + ("..." if len(content) > 45 else "")
        cursor.execute("""
            INSERT INTO conversations (id, title, chat_type, created_at, updated_at)
            VALUES (?, ?, 'tutor', ?, ?)
        """, (conv_id, derived_title, now_str, now_str))

    cursor.execute("""
        INSERT INTO messages (conversation_id, role, content, source, citations_json, confidence, llm_used, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (conv_id, role, content.strip(), source or "", c_json, confidence, 1 if llm_used else 0, now_str))
    msg_id = cursor.lastrowid

    cursor.execute("UPDATE conversations SET updated_at = ? WHERE id = ?", (now_str, conv_id))
    conn.commit()

    row = conn.execute("SELECT * FROM messages WHERE id = ?", (msg_id,)).fetchone()
    conn.close()
    res = dict(row)
    res["citations"] = citations or []
    return res


def get_conversations(user_id: int | None = None, search: str | None = None, chat_type: str | None = None, limit: int = 50):
    conn = get_db()
    query_terms = search.strip().lower() if search and search.strip() else None

    sql = "SELECT c.* FROM conversations c WHERE 1=1"
    params = []

    if user_id is not None:
        sql += " AND (c.user_id = ? OR c.user_id IS NULL)"
        params.append(user_id)

    if chat_type:
        sql += " AND c.chat_type = ?"
        params.append(chat_type)

    if query_terms:
        sql += """
            AND (
                LOWER(c.title) LIKE ?
                OR EXISTS (
                    SELECT 1 FROM messages m
                    WHERE m.conversation_id = c.id
                    AND LOWER(m.content) LIKE ?
                )
            )
        """
        pattern = f"%{query_terms}%"
        params.extend([pattern, pattern])

    sql += " ORDER BY c.updated_at DESC LIMIT ?"
    params.append(limit)

    rows = conn.execute(sql, params).fetchall()
    results = []

    for r in rows:
        cd = dict(r)
        # Get message count
        cnt = conn.execute("SELECT COUNT(*) FROM messages WHERE conversation_id = ?", (cd["id"],)).fetchone()[0]
        cd["message_count"] = cnt

        # Get last message
        last = conn.execute("""
            SELECT id, role, content, created_at FROM messages
            WHERE conversation_id = ?
            ORDER BY id DESC LIMIT 1
        """, (cd["id"],)).fetchone()
        if last:
            cd["last_message"] = dict(last)
        else:
            cd["last_message"] = None

        # If searching, get matching messages with context previews
        if query_terms:
            m_rows = conn.execute("""
                SELECT id, role, content, created_at FROM messages
                WHERE conversation_id = ? AND LOWER(content) LIKE ?
                ORDER BY id ASC
            """, (cd["id"], f"%{query_terms}%")).fetchall()

            matching = []
            for mr in m_rows:
                md = dict(mr)
                text = md["content"]
                pos = text.lower().find(query_terms)
                if pos != -1:
                    start = max(0, pos - 40)
                    end = min(len(text), pos + len(query_terms) + 80)
                    snippet = ("..." if start > 0 else "") + text[start:end] + ("..." if end < len(text) else "")
                else:
                    snippet = text[:120] + ("..." if len(text) > 120 else "")
                md["snippet"] = snippet
                matching.append(md)
            cd["matching_messages"] = matching
        else:
            cd["matching_messages"] = []

        results.append(cd)

    conn.close()
    return results


def delete_conversation(conv_id: str, user_id: int | None = None):
    conn = get_db()
    cursor = conn.cursor()
    if user_id is not None:
        cursor.execute("DELETE FROM messages WHERE conversation_id = ? AND EXISTS (SELECT 1 FROM conversations WHERE id = ? AND (user_id = ? OR user_id IS NULL))", (conv_id, conv_id, user_id))
        cursor.execute("DELETE FROM conversations WHERE id = ? AND (user_id = ? OR user_id IS NULL)", (conv_id, user_id))
    else:
        cursor.execute("DELETE FROM messages WHERE conversation_id = ?", (conv_id,))
        cursor.execute("DELETE FROM conversations WHERE id = ?", (conv_id,))
    conn.commit()
    conn.close()
    return True


def update_conversation_title(conv_id: str, title: str):
    conn = get_db()
    cursor = conn.cursor()
    now_str = datetime.now().isoformat()
    cursor.execute("UPDATE conversations SET title = ?, updated_at = ? WHERE id = ?", (title.strip(), now_str, conv_id))
    conn.commit()
    row = conn.execute("SELECT * FROM conversations WHERE id = ?", (conv_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


# Initialize tables when module is imported
init_db()
