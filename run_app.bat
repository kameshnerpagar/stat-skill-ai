@echo off
echo =========================================================
echo STAT-SKILL AI - Single Click Launcher
echo Ministry of Statistics and Programme Implementation (MoSPI)
echo =========================================================

echo Building React Frontend...
cd frontend
call npm run build
cd ..

echo Starting Full-Stack Application on http://localhost:8000 ...
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
pause
