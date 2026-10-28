@echo off
title RAGora - Public Live Launcher
color 0B

echo ===================================================
echo   Launching RAGora with Public HTTPS Tunnel
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

:: 2. Ensure cloudflared.exe is present
if not exist "%~dp0cloudflared.exe" (
    echo [NOTICE] Downloading Cloudflare Tunnel binary...
    curl.exe -L -o "%~dp0cloudflared.exe" https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe
)

:: 3. Determine Python Executable
set BACKEND_PY=python
if exist "%~dp0backend\venv\Scripts\python.exe" (
    set BACKEND_PY="%~dp0backend\venv\Scripts\python.exe"
)

:: 4. Launch FastAPI Backend in a new window
echo [1/3] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "RAG Assistant - Backend (FastAPI)" cmd /k "cd /d "%~dp0backend" && %BACKEND_PY% -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

:: 5. Launch Next.js Frontend in a new window
echo [2/3] Starting Next.js Frontend on http://localhost:3000 ...
start "RAG Assistant - Frontend (Next.js)" cmd /k "cd /d "%~dp0frontend" && npm run dev -- -p 3000 -H 0.0.0.0"

:: 6. Wait for servers to initialize
echo.
echo Waiting 5 seconds for local services to warm up...
timeout /t 5 /nobreak >nul

:: 7. Launch Cloudflare Tunnel
echo [3/3] Starting Public Cloudflare HTTPS Tunnel...
echo.
echo ==============================================================
echo   LOOK BELOW FOR YOUR LIVE PUBLIC HTTPS LINK:
echo   It will look like:  https://xxxx-xxxx.trycloudflare.com
echo ==============================================================
echo.

"%~dp0cloudflared.exe" tunnel --protocol http2 --url http://localhost:3000
