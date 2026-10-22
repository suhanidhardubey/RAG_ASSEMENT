@echo off
title RAG Assistant - Study Companion
color 0D

echo ===================================================
echo     Launching RAG Assistant Study Companion...
echo ===================================================
echo.

:: Launch FastAPI Backend in a new window
echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "RAG Assistant - Backend (FastAPI)" cmd /k "cd /d "%~dp0backend" && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

:: Launch Next.js Frontend in a new window
echo [2/2] Starting Next.js Frontend on http://localhost:3000 ...
start "RAG Assistant - Frontend (Next.js)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Waiting 4 seconds for services to initialize...
timeout /t 4 /nobreak >nul

echo Opening browser at http://localhost:3000 ...
start http://localhost:3000

echo.
echo ===================================================
echo   RAG Assistant is now RUNNING!
echo.
echo   - Web App UI:        http://localhost:3000
echo   - Backend Swagger:   http://127.0.0.1:8000/docs
echo   - Health Check:      http://127.0.0.1:8000/api/health
echo.
echo   To stop the servers, simply close the backend and 
echo   frontend terminal windows.
echo ===================================================
echo.
pause
