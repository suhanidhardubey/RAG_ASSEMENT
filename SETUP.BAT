@echo off
title RAG Assistant - Setup
color 0B

echo ===================================================
echo     RAG Assistant Study Companion - Setup
echo ===================================================
echo.

:: Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.10+ and add it to PATH.
    pause
    exit /b 1
)

:: Check for Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js 18+ and add it to PATH.
    pause
    exit /b 1
)

echo [1/2] Installing Backend Dependencies (Python)...
cd /d "%~dp0backend"
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [WARNING] Some python packages encountered an issue. Retrying with basic set...
    python -m pip install fastapi uvicorn python-multipart PyPDF2 python-pptx markdown
)
echo [OK] Backend setup complete!
echo.

echo [2/2] Installing Frontend Dependencies (Node.js)...
cd /d "%~dp0frontend"
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend npm install failed!
    pause
    exit /b 1
)
echo [OK] Frontend setup complete!
echo.

cd /d "%~dp0"
echo ===================================================
echo     Setup Successful! 
echo     Run START.BAT to launch the application.
echo ===================================================
pause
