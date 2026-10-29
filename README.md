# RAGora — Next-Gen AI Study Agora & Companion

> **RAGora** is an AI-Powered Study Agora and Learning Platform with live Google Gemini intelligence, Document RAG Extraction, SQLite Database persistence, interactive 3D Flashcards, timed MCQ Quizzes with circular meters, real XP progression, and live Leaderboard rankings.

![Tech Stack](https://img.shields.io/badge/Next.js%2016-Frontend-black) ![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green) ![Gemini%20AI](https://img.shields.io/badge/Gemini-AI%20Engine-blue) ![SQLite](https://img.shields.io/badge/SQLite-Database-purple) ![Tailwind](https://img.shields.io/badge/TailwindCSS-Styling-pink)

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
RAGora/
├── frontend/                     # Next.js 16 (App Router) + Tailwind CSS
│   └── src/app/
│       ├── page.js               # Welcome / Live Student Dashboard
│       ├── upload/page.js        # Upload & Document Extraction Pipeline
│       ├── dashboard/page.js     # Main Student Companion Dashboard
│       ├── history/page.js       # Persistent Chat History & Global Search
│       ├── summary/page.js       # Summary & TF-IDF Keywords
│       ├── flashcards/page.js    # 3D Flip Flashcards & XP Rewards
│       ├── quiz/page.js          # Timed MCQ Quiz + Progress Chart
│       ├── leaderboard/page.js   # Dynamic Podium & Live Rankings
│       ├── profile/page.js       # Student Registration, Login & Analytics
│       ├── ask/page.js           # RAG Document Q&A with Gemini AI & Topic Search
│       └── chat/page.js          # Google Gemini AI Conversational Assistant
│
├── backend/                      # FastAPI (Python)
│   ├── main.py                   # API routes & document extraction pipeline
│   ├── database.py               # SQLite schema & persistence functions
│   ├── llm.py                    # Google Gemini AI integration engine
│   ├── syllabi.py                # University curriculum data
│   ├── requirements.txt          # Python dependencies
│   ├── data/
│   │   └── ragora.db             # SQLite database (auto-created)
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
2. Double-click `START.BAT` (launches local app at http://localhost:3000).
3. **Double-click `START_PUBLIC.BAT`** (launches local app AND creates a live public HTTPS link via Cloudflare Tunnel so anyone in the world can open your app on their phone or laptop).

### Manual Terminal Run

#### Backend:
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
- API Docs: **http://127.0.0.1:8000/docs**
- Health Check: **http://127.0.0.1:8000/api/health**

#### Frontend:
```bash
cd frontend
npm run dev
```
- Web Application: **http://localhost:3000**

---

## 🌐 Making Your App Public Permanently (Cloud Hosting)

### Option 1: Live Instant Tunnel (Included & Active)
Run `START_PUBLIC.BAT` to instantly get a free, secure HTTPS URL (e.g. `https://xxxx.trycloudflare.com`) accessible worldwide with zero configuration.

### Option 2: Deploy to Vercel + Render / Railway
1. **Backend (Render / Railway / Hugging Face Spaces)**:
   - Connect your GitHub repo.
   - Root directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
2. **Frontend (Vercel)**:
   - Connect your GitHub repo.
   - Root directory: `frontend`
   - Add Environment Variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
   - Hit Deploy!

---

## 💬 Chat History, Global Search & AI Tutor Search Features

1. **Dashboard History**:
   - Available on the Dashboard (`/dashboard`) and via sidebar navigation item **Chat History** (`/history`).
   - Clean conversation cards with pastel pink avatars, conversation titles, relative timestamps ("Today", "Yesterday", "Oct 28"), last message previews, and message counts.
2. **Global Keyword Search**:
   - Live search box across all previous conversations, matching both **user questions** and **AI responses**.
   - Displays highlighted keyword snippets and match counts.
3. **AI Tutor Search**:
   - Dedicated search bar in AI Tutor (`/ask`) to find previous discussions related to a searched keyword or topic.
   - Recent study topic chips for 1-click topic switching.
4. **Open Old Chats & Continued Chatting**:
   - Clicking any conversation opens the original thread, automatically scrolls to and highlights relevant messages, and allows seamless continuation by asking follow-up questions.
5. **Persistent SQLite Storage**:
   - Stored in `backend/data/ragora.db` under `conversations` and `messages` tables with cascade deletion and indexing.


