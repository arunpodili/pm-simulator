@echo off
echo Starting PM Simulator Interactive Visualization...
echo.
cd /d "%~dp0"

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed or not in PATH!
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

REM Install Flask if not present
pip show flask >nul 2>&1
if errorlevel 1 (
    echo Installing Flask...
    pip install flask
)

REM Run the server
echo.
echo ===========================================
echo PM Simulator Visualization
echo ===========================================
echo.
echo Open your browser and go to: http://localhost:5003
echo.
echo Features:
echo   - Click nodes to see details
echo   - Drag nodes to rearrange
echo   - Scroll to zoom in/out
echo   - Click PLAY SIMULATION to animate
echo.
echo Press Ctrl+C to stop
echo.
python app.py

pause
