# STAT-SKILL AI — System Architecture Overview

**Smart India Hackathon (SIH 2026) — Problem ID: SIH26101**  
**Organization**: Ministry of Statistics and Programme Implementation (MoSPI)  
**Theme**: Smart Education / Capacity Building  

---

## 📌 Executive Architecture Summary

**STAT-SKILL AI** is an intelligent workforce development system designed for India's Official Statistical System. It connects official competency frameworks, explainable AI gap analysis, an explicit iGOT Karmayogi API adapter, document MCQ generation, and executive workforce analytics.

---

## ⚡ End-to-End Intelligence Pipeline

```
┌────────────────────────────────┐
│  01. User Profile & Framework  │ (MoSPI 4 Competency Domains)
└──────────────┬─────────────────┘
               │
┌──────────────▼─────────────────┐
│  02. Baseline AI Assessment    │ (Statistical, Technical, Governance, Behavioural)
└──────────────┬─────────────────┘
               │
┌──────────────▼─────────────────┐
│  03. Multi-Factor Gap Engine   │ (Priority = f(Gap, RoleWeight, DeptWeight, Demand, Goals))
└──────────────┬─────────────────┘
               │
┌──────────────▼─────────────────┐
│  04. iGOT Karmayogi Adapter    │ (Ranks 15+ curated iGOT & NSSTA programmes)
└──────────────┬─────────────────┘
               │
┌──────────────▼─────────────────┐
│  05. Document MCQ Generator    │ (Extracts PDF/DOCX text & builds non-repeating MCQs)
└──────────────┬─────────────────┘
               │
┌──────────────▼─────────────────┐
│  06. Dynamic Re-evaluation    │ (Updates official competency scores & workforce heatmaps)
└────────────────────────────────┘
```

---

## 🏛️ Modular Codebase Architecture

### FastAPI Backend Services (`/backend/app/services`)
- `competency_service`: Multi-factor priority algorithm.
- `recommendation_service`: Hybrid course ranker.
- `igot_service`: Adapter interface (`IGOTServiceInterface`, `MockIGOTService`, `RealIGOTService`).
- `ai_service`: OpenAI client + sentence-extraction fallback engine.
- `document_service`: PyPDF, python-docx, and python-pptx extractors.
- `analytics_service`: Executive workforce heatmaps & skill forecasting.

### React TypeScript Frontend (`/frontend/src`)
- **Core**: Vite + React 18 + TypeScript.
- **Styling**: Clean Tailwind CSS government design system.
- **Charts**: Recharts (Radar, Bar, Line charts).
- **Role Interfaces**: Dual Learner Module & Authority Admin Module.
