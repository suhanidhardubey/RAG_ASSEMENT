# RAG Assistant — Study Companion

> **AI-Powered Study Companion Web Application** with live Document Processing, SQLite Database persistence, interactive 3D Flashcards, timed MCQ Quizzes with circular meters, real score tracking, and live Leaderboard rankings.

![Tech Stack](https://img.shields.io/badge/Next.js%2015-Frontend-black) ![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green) ![SQLite](https://img.shields.io/badge/SQLite-Database-blue) ![Tailwind](https://img.shields.io/badge/TailwindCSS-Styling-pink)

---

## 🌟 Real Full-Working Architecture (No Fake/Mock Data)

1. **Authentication & Profile System**: Real student registration (`/profile`), credential hashing (SHA-256), login sessions via JWT/Bearer token, profile editing, and daily streak tracking.
2. **Document Extraction Pipeline (`/upload`)**: Upload your own real AKTU syllabus PDFs, lecture slides (`.pptx`), or markdown notes. Extracts raw text and calculates real word and chunk counts.
3. **Pure-Python TF-IDF Keyword Extraction (`/summary`)**: Real TF-IDF term scoring, frequency counts, and estimated exam weighting directly from uploaded document text.
4. **AI Document Summary (`/summary`)**: High-yield key points and structured section breakdowns extracted from uploaded material.
5. **3D Interactive Study Flashcards (`/flashcards`)**: 3D perspective flip cards with confidence rating (+10 XP per mastered card), review queue, and deck shuffling.
6. **Adaptive Timed Quiz & Analytics (`/quiz`)**: Live 5-minute countdown, circular score meter, instant grading (+15 XP per correct), missed answer analysis, and SQLite historical score progression chart.
7. **Live Class Leaderboard & Podium (`/leaderboard`)**: Real top 3 podium (Gold 👑, Silver 🥈, Bronze 🥉) dynamically placed based on earned XP points in SQLite, with personal ranking highlight.
8. **LLM Chatbot Integration Slot (`/chat`)**: Clean configuration panel ready to connect Google Gemini API or OpenAI API keys when available.

---

## 📁 Project Structure

```
RAG_ASSEMENT/
├── frontend/                     # Next.js 15 (App Router) + Tailwind CSS
│   └── src/app/
│       ├── page.js               # Welcome / Live Student Dashboard
│       ├── upload/page.js        # Upload & Document Extraction Pipeline
│       ├── dashboard/page.js     # Main Student Companion Dashboard
│       ├── summary/page.js       # Summary & TF-IDF Keywords
│       ├── flashcards/page.js    # 3D Flip Flashcards & XP Rewards
│       ├── quiz/page.js          # Timed MCQ Quiz + Progress Chart
│       ├── leaderboard/page.js   # Dynamic Podium & Live Rankings
│       ├── profile/page.js       # Student Registration, Login & Analytics
│       └── chat/page.js          # LLM API Key Configuration
│
├── backend/                      # FastAPI (Python)
│   ├── main.py                   # API routes & document extraction pipeline
│   ├── database.py               # SQLite schema & persistence functions
│   ├── requirements.txt          # Python dependencies
│   ├── data/
│   │   └── rag_assistant.db      # SQLite database (auto-created)
│   └── uploads/                  # Extracted study files
│
├── SETUP.BAT                     # 1-Click setup for dependencies
├── START.BAT                     # 1-Click launcher (starts backend + frontend)
└── README.md
```

---

## 🚀 How to Run

### 1-Click Windows Launch (Recommended)
1. Double-click `SETUP.BAT` (only needed once to install Python and npm packages).
2. Double-click `START.BAT` (launches FastAPI backend on port 8000, Next.js frontend on port 3000, and opens http://localhost:3000 in your browser).

### Manual Terminal Run

#### Backend:
```bash
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- API Docs: **http://127.0.0.1:8000/docs**
- Health Check: **http://127.0.0.1:8000/api/health**

#### Frontend:
```bash
cd frontend
npm run dev
```
- Web Application: **http://localhost:3000**
