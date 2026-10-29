@echo off
setlocal enabledelayedexpansion
title RAGora - System Setup
color 0B

echo ===================================================
echo     RAGora Study Agora - System Setup
echo ===================================================
echo.

:: 1. Check Python
set PYTHON_CMD=
python --version >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON_CMD=python
) else (
    py --version >nul 2>&1
    if %errorlevel% equ 0 (
        set PYTHON_CMD=py
    )
)

if "%PYTHON_CMD%"=="" (
    echo [ERROR] Python is not installed or not in system PATH!
    echo.
    echo Please install Python 3.10+ from:
    echo   https://www.python.org/downloads/
    echo IMPORTANT: Make sure to check "Add Python to PATH" during installation!
    echo.
    pause
    exit /b 1
)

echo [OK] Found Python:
%PYTHON_CMD% --version
echo.

:: 2. Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in system PATH!
    echo.
    echo Please install Node.js 18+ from:
    echo   https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Found Node.js:
node --version
echo.

:: 3. Setup Python Backend Environment
echo ---------------------------------------------------
echo [1/2] Setting up Backend (Python)...
echo ---------------------------------------------------
cd /d "%~dp0backend"
:: Ensure data & uploads folders exist
if not exist "data" mkdir "data"
if not exist "uploads" mkdir "uploads"

:: Try creating a dedicated virtual environment for complete isolation
if not exist "venv\Scripts\python.exe" (
    echo Creating isolated virtual environment (backend\venv)...
    %PYTHON_CMD% -m venv venv >nul 2>&1
)

:: Select which Python runner to use
if exist "venv\Scripts\python.exe" (
    echo [OK] Using dedicated virtual environment: backend\venv
    set RUN_PY="%~dp0backend\venv\Scripts\python.exe"
) else (
    echo [NOTE] Virtual environment skipped, using system Python.
    set RUN_PY=%PYTHON_CMD%
)

echo Upgrading pip and installing backend dependencies...
%RUN_PY% -m pip install --upgrade pip --quiet
%RUN_PY% -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [WARNING] Issue with full requirements, running fallback installation...
    %RUN_PY% -m pip install fastapi uvicorn python-multipart PyPDF2 python-pptx markdown
)

:: Initialize clean SQLite database schema
%RUN_PY% -c "from database import init_db; init_db(); print('[OK] SQLite Database initialized successfully!')"

echo [OK] Backend setup complete!
echo.

:: 4. Setup Next.js Frontend
echo ---------------------------------------------------
echo [2/2] Setting up Frontend (Node.js)...
echo ---------------------------------------------------
cd /d "%~dp0frontend"
echo Installing frontend dependencies via npm...
call npm install --no-audit --no-fund
if %errorlevel% neq 0 (
    echo [WARNING] Retrying with legacy-peer-deps...
    call npm install --legacy-peer-deps --no-audit --no-fund
)
echo [OK] Frontend setup complete!
echo.

cd /d "%~dp0"
echo ===================================================
echo     SETUP COMPLETE AND READY TO RUN!
echo ===================================================
echo.
echo You can now launch the application anytime by double-clicking:
echo   START.BAT
echo.
pause
