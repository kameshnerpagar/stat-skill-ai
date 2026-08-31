# Deployment & Customization Guide — STAT-SKILL AI

**Ministry of Statistics and Programme Implementation (MoSPI)**  
**Smart India Hackathon (SIH) 2026 — Problem Statement ID: SIH26101**

---

## 🚀 Part 1: How to Deploy the Project

You can deploy STAT-SKILL AI using any of the following 3 methods:

---

### Option A: 1-Click Cloud Deployment (Render.com - Recommended & Free)

Render allows you to deploy the entire full-stack application (FastAPI + React) for free using Docker.

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial STAT-SKILL AI commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/stat-skill-ai.git
   git push -u origin main
   ```

2. **Create Web Service on Render**:
   - Go to [render.com](https://render.com) and click **"New +" -> "Web Service"**.
   - Connect your GitHub repository.
   - Select **Runtime: Docker**.
   - Render will automatically detect the `Dockerfile` in your root folder.
   - Click **"Create Web Service"**.

3. **Your Live URL**:
   - Render will build the React frontend, set up Python FastAPI, and give you a live URL like: `https://stat-skill-ai.onrender.com`.

---

### Option B: Unified Local Production Deployment (Single Port `http://localhost:8000`)

To run the entire app on a single port locally without running two separate terminals:

1. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   cd ..
   ```
2. **Start Unified FastAPI Server**:
   ```bash
   cd backend
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
   ```
3. Open **`http://localhost:8000`** in your browser. FastAPI automatically serves the built React frontend at `/` and the backend API at `/api`.

*(On Windows, you can simply double-click `run_app.bat` to automate this)*

---

### Option C: Separate Frontend & Backend Hosting (Vercel + Render)

- **Frontend (Vercel)**:
  - Connect your repository to [vercel.com](https://vercel.com).
  - Framework Preset: **Vite**.
  - Root Directory: `frontend`.
  - Build Command: `npm run build`.

- **Backend (Render / Railway)**:
  - Connect repository to Render or Railway.
  - Root Directory: `backend`.
  - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`.

---

## 🛠️ Part 2: How to Make Changes Later ("Baadme Changes Kaise Karein?")

Below is the step-by-step guide for making future edits to the project.

---

### 1. How to Add or Edit Competencies?
To add new skills (e.g., *Big Data Processing*, *PowerBI*, *Econometrics*):

- Open file: `backend/app/database_seed.py`
- Find `competencies_data = [...]` and add your new skill:
  ```python
  ("Big Data Processing", "Technical", "Spark and Hadoop survey data processing pipelines.", 0.9)
  ```
- Also add default baseline scores in `score_mapping`:
  ```python
  "Big Data Processing": 65.0,
  ```
- **Apply Changes**: Delete `backend/statskill.db` and restart the backend server so the database re-seeds automatically!

---

### 2. How to Add New iGOT Karmayogi Courses?
To add new courses to the recommendation engine:

- Open file: `backend/app/services/igot_service.py`
- Find `self.courses = [...]` and add a new course object:
  ```python
  {
      "id": 16,
      "title": "Big Data Engineering with PySpark",
      "description": "Learn scalable survey data ingestion and distributed computing for MoSPI databases.",
      "provider": "iGOT Karmayogi",
      "provider_type": "igot",
      "category": "Technical",
      "duration": "14 Hours",
      "difficulty": "Advanced",
      "rating": 4.9,
      "completion_rate": 91.0,
      "mock_url": "https://igotkarmayogi.gov.in/course/pyspark-stats",
      "skills_covered": ["Python", "Cloud Computing", "SQL"]
  }
  ```
- Save the file. The recommendation engine will immediately include the new course in rankings!

---

### 3. How to Add OpenAI API Key for Live AI Models?
By default, the platform uses a smart offline fallback engine so it works without any API keys. If you want to connect a live OpenAI GPT model:

- Open file: `backend/.env` (or create it from `backend/.env.example`)
- Add your key:
  ```env
  OPENAI_API_KEY=sk-proj-your-openai-api-key-here
  ```
- Restart the FastAPI backend server. The app will automatically switch from fallback mode to live GPT-3.5/GPT-4 models!

---

### 4. How to Edit Frontend UI, Colors, or Logos?
- **Government Branding / Header Logos**: Edit `frontend/src/components/layout/Navbar.tsx`
- **Sidebar Links**: Edit `frontend/src/components/layout/Sidebar.tsx`
- **Colors & Theme**: Edit `frontend/tailwind.config.js` or `frontend/src/index.css`
- **Dashboard Text / Layout**: Edit `frontend/src/pages/LearnerDashboard.tsx`

---

### 5. How to Re-build & Deploy After Making Changes?

Whenever you edit frontend files (`frontend/src/...`), run:
```bash
cd frontend
npm run build
```

Then restart the backend server or push to GitHub (`git push origin main`). Cloud platforms like Render and Vercel will automatically re-deploy your updated application!
