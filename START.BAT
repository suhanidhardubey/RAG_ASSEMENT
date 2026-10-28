@echo off
title RAGora - Study Agora & Companion
color 0D

echo ===================================================
echo     Launching RAGora Study Agora & Companion...
echo ===================================================
echo.

:: 1. Safety Check: If setup hasn't been run, prompt user
if not exist "%~dp0frontend\node_modules" (
    echo [NOTICE] First time launch detected! Dependencies are missing.
    echo Running SETUP.BAT automatically...
    echo.
    call "%~dp0SETUP.BAT"
    if %errorlevel% neq 0 (
        echo [ERROR] Setup failed. Please check errors above.
        pause
        exit /b 1
    )
)

:: 2. Determine Python Executable (venv or system)
set BACKEND_PY=python
if exist "%~dp0backend\venv\Scripts\python.exe" (
    set BACKEND_PY="%~dp0backend\venv\Scripts\python.exe"
)

:: 3. Launch FastAPI Backend in a new window
echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "RAG Assistant - Backend (FastAPI)" cmd /k "cd /d "%~dp0backend" && %BACKEND_PY% -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

:: 4. Launch Next.js Frontend in a new window
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
echo   Want a live public link for anyone on the internet?
echo   Double-click START_PUBLIC.BAT anytime!
echo.
echo   To stop the servers, simply close the backend and 
echo   frontend terminal windows.
echo ===================================================
echo.
pause
