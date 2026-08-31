import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.database import engine, Base
from app.database_seed import seed_db
from app.api.routes import router as api_router

# Initialize Database and seed tables
seed_db()

app = FastAPI(
    title="STAT-SKILL AI Backend API",
    description="AI-Powered Skill Intelligence & Learning Platform for India's Official Statistical System (MoSPI)",
    version="1.0.0"
)

# Enable CORS for React frontend (localhost:5173 / Vite default)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/api-info")
def root():
    return {
        "title": "STAT-SKILL AI API Engine",
        "organization": "Ministry of Statistics and Programme Implementation (MoSPI)",
        "status": "Healthy & Operational",
        "documentation": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "STAT-SKILL AI Backend"}

# Mount frontend production build if dist directory exists
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/dist"))
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
