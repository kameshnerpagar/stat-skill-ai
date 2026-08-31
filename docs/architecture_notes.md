# STAT-SKILL AI — Architecture & Technical Pitch Notes

**Ministry of Statistics and Programme Implementation (MoSPI)**  
**Smart India Hackathon (SIH-26) — Problem Statement ID: SIH26101**

---

## 🏗️ Technical Architecture Overview

STAT-SKILL AI follows a clean, decoupled 3-tier government enterprise architecture:

```
+-----------------------------------------------------------------------------------+
|                            PRESENTATION LAYER                                     |
|  React 18 + Vite + TypeScript + Tailwind CSS v4 + Recharts + Lucide Icons         |
+-----------------------------------------------------------------------------------+
                                          |
                                    REST API (JSON)
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                            BUSINESS & AI SERVICE LAYER                            |
|  FastAPI (Python 3.12) + Uvicorn                                                  |
|  - Competency Engine: Priority = f(Gap, RoleWeight, DeptWeight, Demand)           |
|  - iGOT Adapter: IGOTServiceInterface -> MockIGOTService / RealIGOTService        |
|  - AI Assessment Engine: OpenAI GPT-3.5/4 + Offline Real Extraction Fallback      |
|  - Assessment Integrity: Tab-switch detection & Per-question timing               |
+-----------------------------------------------------------------------------------+
                                          |
                                     SQLAlchemy ORM
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                            PERSISTENCE LAYER                                      |
|  SQLite (Relational Database with Seeded MoSPI Competency Matrix & Audit Logs)     |
+-----------------------------------------------------------------------------------+
```

---

## 🎯 Key Design Patterns & Engineering Highlights

1. **Adapter Design Pattern for iGOT Karmayogi**:
   - `IGOTServiceInterface` provides a strict contract for fetching course catalogs and enrollments.
   - `MockIGOTService` powers demo execution with 15+ curated statistical courses.
   - `RealIGOTService` connects to authentic iGOT OAuth2 endpoints when `IGOT_MODE=real`.

2. **Dual-Engine AI Assessment & Question Exposure Bank**:
   - Primary: OpenAI GPT model (`temperature=0.7`) generating grounded MCQs, scenarios, and True/False questions.
   - Fallback: NLP sentence splitting and entity extraction for 100% offline hackathon execution.
   - Exposure Tracking: `UserQuestionExposure` ensures learners never see repeating questions across repeated attempts.

3. **Assessment Integrity & Anti-Cheating**:
   - Tab-switch & window-blur detection (`visibilitychange`, `blur`).
   - Anti-copy (`onCopy`) & Anti-context-menu (`onContextMenu`).
   - Per-question timer tracking anomalous fast responses (< 3s).
   - Dynamic integrity score (0–100) recorded in `QuizAttempt` and surfaced in Admin views.
   - Proctoring extension point: `checkIntegrity()` for future biometric/webcam proctoring.

4. **Authority Officer Monitoring**:
   - `/admin/officers` & `/admin/officers/:id` providing individual radar charts, score deltas vs department averages, quiz history, course status, and persisted admin intervention / course assignment actions.
