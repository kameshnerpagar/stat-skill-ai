# STAT-SKILL AI — Enhancement Changelog (SIH-26)

**Ministry of Statistics and Programme Implementation (MoSPI) — Government of India**  
**Smart India Hackathon (SIH 2026) — Problem Statement ID: SIH26101**

---

## Task 1 — Real & Non-Repeating AI Quiz Generation Engine
- **`GeneratedQuestion` & Question History**: Created data model to store every generated question per source document (`material_id`), preventing identical repeats across generation sessions.
- **LLM Grounding & Avoid List**: Configured OpenAI GPT generation (`temperature=0.7`) to ground questions in specific extracted text sentences/terms. Added `avoid_questions` prompt parameter passing prior generated question texts to instruct the LLM explicitly against duplicating questions.
- **Offline NLP Fallback Generator**: Built a sentence-splitting and entity-extraction fallback engine that identifies key statistical terms/definitions in uploaded text to build fill-in-the-blank and definition-matching questions with distractors pulled from the same document.
- **Per-User Exposure Tracking**: Added `UserQuestionExposure` logging per user and document so learners rotate through different questions across repeated attempts.
- **Randomized Question & Option Ordering**: Implemented automatic option shuffling (A/B/C/D) and question order randomization on every quiz render.

---

## Task 2 — Assessment Anti-Cheating & Integrity Features
- **Tab-Switch & Blur Detection**: Implemented browser `visibilitychange` and `blur` listeners tracking violations during active quiz attempts. Displays visible warnings on each violation and auto-submits after 3 violations.
- **Anti-Copy & Context Menu Prevention**: Disabled text copying (`onCopy`) and right-click context menu (`onContextMenu`) across question and option components during active quiz attempts.
- **Per-Question Timers**: Added individual question timers (45s) alongside overall quiz timers, recording per-question time spent (`per_question_times`).
- **Integrity Scoring**: Computed derived `integrity_score` (0–100) and generated explicit `integrity_flags` (e.g., tab-switch counts, anomalous speed < 3s).
- **Authority Visibility**: Recorded integrity scores and violation flags in `QuizAttempt` models and surfaced them in Authority/Admin analytics views.
- **Proctoring Extension Point**: Added `checkIntegrity()` callback stub with detailed code comments for future biometric/webcam proctoring integrations.

---

## Task 3 — iGOT Karmayogi API Integration Adapter
- **Adapter Design Pattern**: Preserved `IGOTServiceInterface` contract to allow seamless swapping between prototype and production implementations.
- **`RealIGOTService`**: Configured OAuth2 client-credentials flow (`IGOT_CLIENT_ID`, `IGOT_CLIENT_SECRET`, `IGOT_BASE_URL`) using Python's standard `urllib` library.
- **Authentic Mock Catalog**: Updated `MockIGOTService` with 15+ authentic, accurately titled courses sourced from iGOT Karmayogi and NSSTA capacity-building listings.
- **Runtime Mode Switch**: Added `IGOT_MODE=mock|real` environment flag for zero-code runtime switching between mock and live APIs.
- **Integration Guide**: Created [`IGOT_INTEGRATION.md`](./IGOT_INTEGRATION.md) documenting environment variables and OAuth2 client credentials setup.

---

## Task 4 — Architecture Page Removal & Documentation Preservation
- **UI Route Cleanup**: Removed `/architecture` route, navbar link, and sidebar entry from both Learner and Authority modules.
- **Documentation Preservation**: Preserved all system architecture diagrams, tech stack justifications, and pitch deck notes in [`docs/architecture_notes.md`](./docs/architecture_notes.md).

---

## Task 5 — Authority Module: Individual Officer Performance Monitoring
- **Officers Directory Page (`/admin/officers`)**: Created filterable, searchable, and sortable table listing all officials with designation, division, competency score, critical gap counts, and integrity flags.
- **Individual Officer Analytics View (`/admin/officers/:id`)**: Built individual detail view featuring:
  - 4-Domain Competency Radar Chart
  - Quiz attempt history & integrity flags
  - Course enrollment and completion status
  - Comparative score badges (Officer Score vs Dept Avg vs Org-wide Avg)
  - Prioritized skill gaps
- **Persisted Administrative Actions**: Implemented "Flag for Intervention" and "Assign Course" actions that persist to the database and update officer status.
- **Role Protection**: Enforced Authority-role authorization checks.

---

## Task 6 — Enterprise UI Simplification (De-"AI-Generated" Design)
- **Restrained Color Palette**: Reduced colors across the platform to a strict 2-3 government palette (Navy `#0f172a`, Slate, and Amber/Saffron `#d97706`).
- **Flat Border Cards**: Replaced rainbow gradients and glow box-shadows with clean 1px borders (`border border-slate-200`).
- **Standardized Typography Scale**: Established uniform font hierarchy (`text-xl font-bold`, `text-base font-bold`, `text-xs text-slate-600`, `text-[11px] font-mono`).
- **Reduced Decorative Icons**: Limited icons to primary navigation and primary action buttons.
- **Unified CTA Button Style**: Applied single primary CTA style (`bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg`) across all views.

---

## Task 7 — Prototype Polish Enhancements
- **CSV Data Export**: Added CSV export buttons on Admin Analytics, Competency Heatmap, and Individual Officer Detail views.
- **Hindi / English Language Toggle**: Added UI language switcher (`English` / `हिंदी`) in the top navigation bar with dictionary translations.
- **Accessibility Enhancements**: Applied WCAG-compliant color contrast and keyboard navigation (1-4 option keys, Arrow keys, Enter to submit) in the quiz runner.
- **Admin Audit Trail (`/admin/audit-log`)**: Implemented append-only audit trail logging administrative interventions and course assignments.
