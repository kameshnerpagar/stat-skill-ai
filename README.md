# STAT-SKILL AI — AI-Powered Skill Intelligence & Learning Platform

**Smart India Hackathon (SIH) 2026**
- **Organization**: Ministry of Statistics and Programme Implementation (MoSPI)
- **Problem Statement ID**: SIH26101
- **Category**: Software
- **Theme**: Smart Education

---

## 📌 Executive Summary

India's Official Statistical System is undergoing technological transformation across AI, Machine Learning, Big Data Analytics, GIS, and Cloud Computing. Officials working in survey collection, data processing, analysis, and policy dissemination require continuous, competency-based upskilling.

**STAT-SKILL AI** is an intelligent workforce development system that:
1. Assesses competency levels across 4 core domains (Statistical, Technical, Digital Governance, Behavioural & Managerial).
2. Calculates prioritized skill gaps using a multi-factor algorithm (Gap size, Role relevance, Department needs, Future demand, Career goals).
3. Recommends personalized learning paths integrated with the **iGOT Karmayogi** platform and **NSSTA** training programmes.
4. Auto-generates quizzes and Multiple Choice Questions (MCQs) from uploaded learning materials (PDF, DOCX, PPTX, TXT) with AI explanations.
5. Dynamically updates official competencies upon assessment completion and provides executive workforce analytics, heatmaps, and emerging skill demand projections.

---

## ⚡ Quick Start Instructions

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm

### 1. Backend Setup & Run
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
> The SQLite database (`statskill.db`) will automatically initialize and seed realistic Indian statistical system data on first run.

### 2. Frontend Setup & Run
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Profile Name | Division |
| :--- | :--- | :--- | :--- |
| **Official / Learner** | `official@statskill.gov.in` | Ananya Sharma | Data Analytics Division |
| **Administrator** | `admin@statskill.gov.in` | Dr. Rajesh Verma | Capacity Building Division |

---

## 🏛️ iGOT Integration Architecture

The platform uses an explicit adapter pattern:

- `IGOTServiceInterface` (Abstract Interface)
- `MockIGOTService` (Prototype implementation with 15+ statistical courses)
- Production deployment can substitute `RealIGOTService` interacting with authentic iGOT Karmayogi OAuth2 & REST APIs without changing frontend UI components.

---

## 🤖 AI Service Abstraction

Supported by `AIService`:
- Uses OpenAI API (`OPENAI_API_KEY`) when available.
- Automatically falls back to a deterministic smart statistical rule engine when offline or if no key is provided, ensuring 100% demo reliability.
