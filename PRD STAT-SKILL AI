# Product Requirement Document (PRD)

## STAT-SKILL AI: AI-Powered Skill Intelligence & Learning Platform
**Ministry of Statistics and Programme Implementation (MoSPI) — Government of India**  
**Smart India Hackathon (SIH) 2026 — Problem Statement ID: SIH26101**

---

| Document Attribute | Value |
| :--- | :--- |
| **Product Name** | STAT-SKILL AI |
| **Problem Statement ID** | SIH26101 |
| **Organization** | Ministry of Statistics and Programme Implementation (MoSPI) |
| **Category** | Software |
| **Theme** | Smart Education / Civil Service Capacity Building |
| **Version** | 1.0 (Enterprise Prototype & SIH 2026 Release) |
| **Status** | Approved & Implemented Prototype |

---

## 1. Executive Summary & Vision Statement

### 1.1 Context & Background
India’s Official Statistical System is undergoing rapid technological advancement. Modern data collection, processing, econometric analysis, and public dissemination increasingly rely on **Artificial Intelligence, Machine Learning, Big Data Analytics, Geographic Information Systems (GIS), Cloud Computing, and Microdata Anonymization**.

While the **iGOT Karmayogi** platform provides a massive repository of civil service training content, officials working within MoSPI often struggle to identify courses specifically relevant to:
- Their exact statistical job role (e.g., Statistical Officer, Director, Survey Auditor)
- Their current baseline competency level
- Their division/department operational requirements (e.g., Data Analytics, National Accounts, Survey Operations)
- Future responsibilities and career progression goals

### 1.2 Product Mission
To build an **AI-Enabled Skill Intelligence & Learning Platform** specifically tailored for India's Official Statistical System that continuously answers:
1. *Who is this official?*
2. *What skills should they have?*
3. *What skills do they currently have?*
4. *What are their competency gaps?*
5. *What should they learn next?*
6. *Which iGOT courses / NSSTA programmes are relevant?*
7. *Can the system automatically generate assessments from uploaded statistical learning material?*
8. *Is the official improving over time?*
9. *Can administrators identify and address competency gaps across the workforce?*

---

## 2. User Personas & System Roles

### Persona 1: Official / Learner (Individual Level)
- **Representative User**: Ananya Sharma
- **Designation**: Statistical Officer
- **Department**: Data Analytics Division, MoSPI
- **Experience**: 4 Years | **Education**: M.Sc. Statistics
- **Pain Point**: Struggles to identify which specific technical skills (e.g., Python Pandas, Cloud ETL, DPDP 2023 compliance) are highest priority for her operational assignment. Needs targeted, bite-sized upskilling and self-assessment tools.
- **Goals**: Move into Data Science and Advanced Statistical Analytics; track skill improvement; prepare for promotional benchmarks.

### Persona 2: Administrator / Leadership (Organizational Level)
- **Representative User**: Dr. Rajesh Verma
- **Designation**: Director General (Capacity Building)
- **Department**: Training & IT Division, MoSPI
- **Pain Point**: Lacks real-time visibility into skill deficits across survey divisions, making it difficult to allocate training budgets effectively or forecast emerging skill demands.
- **Goals**: Monitor department-level competency heatmaps; evaluate training program effectiveness; forecast 2–3 year workforce skill requirements.

---

## 3. MoSPI Official Competency Framework

STAT-SKILL AI maps officials across **30+ core competencies** divided into 4 primary domains:

```
                                +-----------------------------------+
                                | MoSPI Competency Framework Matrix |
                                +-----------------+-----------------+
                                                  |
     +-------------------+-------------------+----+-------------------+-------------------+
     |                   |                   |                        |                   |
     v                   v                   v                        v                   v
+----+----+     +--------+--------+   +-----+-----+            +------+------+     +------+------+
| Domain A|     |    Domain B     |   | Domain C  |            | Domain D    |     | Future      |
|Statistical    |   Technical     |   | Digital   |            | Behavioural |     | Emerging    |
|Methods  |     |   Skills        |   | Governance|            | & Mgmt      |     | Tech Demand |
+---------+     +-----------------+   +-----------+            +-------------+     +-------------+
```

### 3.1 Domain A: Statistical Competencies
- Survey Design & Questionnaire Specification
- Sampling Methods (Stratified, Cluster, Multi-Stage Sampling)
- National Accounts Statistics (SNA, GVA, GDP Estimation)
- Price Statistics (WPI, CPI Basket & Weighting)
- Labour Statistics (PLFS, Employment Indicators)
- Agricultural Statistics & Remote Sensing
- Industrial Statistics (IIP, Annual Survey of Industries)
- SDG Indicators (National Indicator Framework - NIF)
- Metadata Standards (SDMX, Data Dictionaries)
- Data Quality Frameworks (Non-sampling error detection, Quality Audits)

### 3.2 Domain B: Technical Competencies
- Python for Data Analysis (Pandas, NumPy, Scripting)
- R Programming & Econometrics
- SQL Database Querying & Microdata Management
- Stata & SPSS Econometric Packages
- Geographic Information Systems (GIS) & Spatial Analytics
- Data Visualization (Interactive Dashboards, ggplot2)
- AI / Machine Learning (Anomaly Detection, Predictive Models)
- Cloud Computing (MeghRaj Government Cloud, Data Lakes)
- RESTful APIs & Microservices Integration
- Open Government Data Standards

### 3.3 Domain C: Digital Governance
- Data Privacy & Protection (DPDP Act 2023 Compliance, Anonymization)
- Cybersecurity Awareness & Network Defense
- Digital Signatures (e-Sign) & PKI Authentication
- Sovereign Government Cloud Security
- Digital Public Infrastructure (India Stack, Inter-ministerial Data Exchange)

### 3.4 Domain D: Behavioural & Managerial Competencies
- Leadership & Team Management
- Communication & Evidence-Based Policy Presentation
- Project Management & Survey Budget Control
- Professional Ethics & Data Integrity
- Strategic Decision Making
- Change Management & Digital Transformation

---

## 4. Functional Requirements & Core Features

### 4.1 Feature 1: Landing & Role-Based Authentication
- **ID**: `FR-01`
- **Description**: Secure, government-branded login interface with support for Learner (`official@statskill.gov.in`) and Administrator (`admin@statskill.gov.in`) roles.
- **Specifications**:
  - Displays MoSPI & Government of India visual identity.
  - One-click demo triggers for instant hackathon evaluation.
  - Supports role switching and session state.

### 4.2 Feature 2: Official Dashboard & Competency Radar (`/dashboard`)
- **ID**: `FR-02`
- **Description**: High-impact official dashboard summarizing competency performance.
- **Specifications**:
  - Displays **Overall Competency Score** (e.g., 66% - Intermediate Level).
  - Renders a 4-domain **Radar Chart** (Statistical: 82%, Technical: 61%, Digital Governance: 48%, Behavioural: 72%).
  - Banner rendering **AI Competency Intelligence Insight** generated contextually.
  - Summary metrics cards: Assessed Skills (30), Critical Gaps (3), Courses Completed (2), Learning Hours (38), Streak (5 Days).

### 4.3 Feature 3: Competency Profile & Benchmark Matrix (`/competencies`)
- **ID**: `FR-03`
- **Description**: Comprehensive view of all 30+ competencies.
- **Specifications**:
  - Category tabs (`All`, `Statistical`, `Technical`, `Digital Governance`, `Behavioural & Managerial`).
  - Renders current score, benchmark target (80%), gap percentage, proficiency level (Beginner / Intermediate / Advanced / Expert), and animated progress bars.

### 4.4 Feature 4: Explainable Multi-Factor AI Skill-Gap Engine (`/skill-gap`)
- **ID**: `FR-04`
- **Description**: Intelligent priority calculation algorithm ranking official skill deficits.
- **Priority Formula**:
  $$\text{PriorityScore} = (\text{GapScore} \times 0.5) + (\text{RoleDeptWeight} \times 15.0) + (\text{FutureDemand} \times 20.0) + \text{CareerBoost}$$
- **Specifications**:
  - Priority Classifications: **CRITICAL** ($\ge 70$), **HIGH** ($\ge 50$), **MEDIUM** ($\ge 30$), **LOW** ($< 30$).
  - Generates transparent, human-understandable AI priority rationale explaining *why* a skill was prioritized.
  - Renders state pipeline flow: `CURRENT STATE` → `FRAMEWORK` → `AI GAP ANALYSIS` → `PRIORITIZED GAPS` → `LEARNING PATH`.

### 4.5 Feature 5: Personalized Upskilling Pathway (`/learning-path`)
- **ID**: `FR-05`
- **Description**: Step-by-step visual roadmap recommending targeted learning resources.
- **Specifications**:
  - Distinguishes **iGOT Karmayogi Courses** and **NSSTA Recommended Training Programmes**.
  - Displays match percentages (e.g., 94% Match), expected competency improvement (+18% to +25%), and *"Why this course?"* AI rationale.

### 4.6 Feature 6: iGOT Course Repository & Adapter Layer (`/igot-courses`)
- **ID**: `FR-06`
- **Description**: Mock iGOT Karmayogi catalog with search, category tabs, and enrollment triggers.
- **Specifications**:
  - 15+ curated statistical courses.
  - Implements an explicit `IGOTServiceInterface` adapter pattern for zero-code replacement with live iGOT APIs in production.

### 4.7 Feature 7: AI Document MCQ Generator (`/mcq-generator`)
- **ID**: `FR-07`
- **Description**: Upload statistical learning material to automatically generate MCQs.
- **Specifications**:
  - Accepts **PDF, DOCX, PPTX, TXT** file formats up to 25 MB.
  - Extracts raw text, detects key topics, and renders text summaries.
  - Custom parameters: 5 / 10 / 15 / 20 questions, Easy / Medium / Hard / Mixed difficulty.
  - **Dual AI Engine**: Uses OpenAI LLM when API key exists, and seamlessly switches to a high-quality deterministic fallback question generator when offline.

### 4.8 Feature 8: Quiz Runner & Dynamic Score Recalculation (`/quiz-taking`)
- **ID**: `FR-08`
- **Description**: Interactive assessment interface with instant scoring and profile updates.
- **Specifications**:
  - Question counter, timer, option selector, Next/Previous/Submit controls.
  - Generates score percentage, topic-wise accuracy breakdown, and AI learning feedback.
  - **Dynamic Re-evaluation**: Submitting quizzes automatically updates the official's competency scores and skill gap rankings in the database.

### 4.9 Feature 9: StatBot AI Assistant (`/statbot`)
- **ID**: `FR-09`
- **Description**: Conversational chatbot trained on official statistical methodologies, Python, R, SQL, cloud computing, and iGOT courses.
- **Specifications**:
  - Pre-populated quick prompt chips.
  - Contextually aware of official's designation, division, competency score, and career goal.

### 4.10 Feature 10: Learner Progress Analytics (`/progress`)
- **ID**: `FR-10`
- **Description**: Historical progress visualization.
- **Specifications**:
  - Competency score over time line chart.
  - Before vs After domain score comparison bar chart.
  - Milestones activity timeline.

### 4.11 Feature 11: Admin Workforce Intelligence Dashboard (`/admin-dashboard`)
- **ID**: `FR-11`
- **Description**: Executive dashboard for MoSPI capacity building leadership.
- **Specifications**:
  - Metrics: Total Officials (2,486), Average Competency (68.4%), Critical Skill Gaps (14), Courses Completed (8,421), Total Training Hours (24,580).
  - Department-wise average competency bar chart.
  - Workforce score distribution chart.
  - Top skill gaps table across divisions.

### 4.12 Feature 12: Admin Competency Heatmap Matrix (`/admin-heatmap`)
- **ID**: `FR-12`
- **Description**: Department vs Competency visual matrix.
- **Specifications**:
  - Displays color-coded intensity cells (Green $\ge 80\%$, Yellow $60\text{--}79\%$, Red $< 60\%$) across divisions (National Accounts, Economic Stats, Social Stats, Data Analytics, Survey Operations, IT Services).

### 4.13 Feature 13: Emerging Skill Demand Forecasting (`/admin-emerging`)
- **ID**: `FR-13`
- **Description**: Predictive forecast comparing current workforce coverage vs 2–3 year projected demand.
- **Specifications**:
  - Tracks AI/ML, Cloud Computing, Python Data Engineering, GIS & Satellite Mapping, Cybersecurity & Data Privacy.

### 4.14 Feature 14: Profile & Career Goal Customization (`/profile`)
- **ID**: `FR-14`
- **Description**: Profile management interface allowing officials to update their operational assignment and career goals.
- **Specifications**:
  - Saving an updated career goal automatically triggers backend re-calculation of skill gap priorities and course recommendations.

---

## 5. Technical Architecture & Tech Stack

### 5.1 Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite | Fast, type-safe modern SPA framework |
| **Styling** | Tailwind CSS v4, Lucide Icons | Restrained, professional Indian Government enterprise identity |
| **Analytics Visualization** | Recharts | Responsive Radar, Line, and Bar chart components |
| **Backend API** | Python 3.12, FastAPI, Uvicorn | High-performance asynchronous REST API framework |
| **Database & ORM** | SQLite, SQLAlchemy 2.0 | Portable, self-contained relational storage with full ORM schemas |
| **Document Processing** | `pypdf`, `python-docx`, `python-pptx` | Extracting raw text from uploaded statistical learning materials |
| **AI Abstraction** | OpenAI Client + Fallback Rule Engine | Flexible LLM provider abstraction with 100% offline reliability |

### 5.2 System Data Flow

```
                                +-----------------------------------+
                                |    React + Vite + TS Frontend    |
                                |  Tailwind CSS + Recharts + Lucide |
                                +-----------------+-----------------+
                                                  |
                                                  v
                                +-----------------+-----------------+
                                |      FastAPI Backend (Python)     |
                                +-----------------+-----------------+
                                                  |
     +-------------------+-------------------+----+-------------------+-------------------+
     |                   |                   |                        |                   |
     v                   v                   v                        v                   v
+----+----+     +--------+--------+   +-----+-----+            +------+------+     +------+------+
| AI Service |   | Skill/Competency|   |Recommend. |            | Assessment  |     |  iGOT Mock  |
| OpenAI /|   |     Engine      |   |  Engine   |            | Engine & MCQ|     | Adapter     |
| Fallback|   |  (Weighted Gap) |   | (iGOT/NSSTA|            | Generator   |     | (15+ courses|
+---------+   +-----------------+   +-----------+            +-------------+     +-------------+
```

---

## 6. Non-Functional Requirements (NFRs)

### 6.1 Performance & Response Time
- **Dashboard Load**: $< 500 \text{ ms}$ response time for profile and competency queries.
- **Document Text Extraction**: $< 2.0 \text{ seconds}$ for documents under 25 MB.
- **AI Question Generation**: $< 3.0 \text{ seconds}$ via deterministic fallback, or live streaming via OpenAI API.

### 6.2 Security & Governance
- **Role-Based Access Control (RBAC)**: Strict segregation between Learner and Administrator API routes.
- **Data Privacy Compliance**: Aligned with the **Digital Personal Data Protection (DPDP) Act 2023**.
- **Production Integration Roadmap**:
  - **Single Sign-On (SSO)**: Planned integration with Government **Parichay / Jan Samarth SSO**.
  - **Sovereign Hosting**: Compatible with **MeghRaj Government Cloud** infrastructure.
  - **Security Audit**: CERT-In compliance readiness.

### 6.3 Reliability & Fallback Architecture
- The application MUST remain fully functional without an external internet connection or OpenAI API key via its embedded deterministic statistical intelligence engine.

---

## 7. Release & Deployment Roadmap

```
+-----------------------------------------------------------------------------------+
|                                 STAGED ROADMAP                                   |
+-----------------------------------------------------------------------------------+
| PHASE 1: Hackathon Prototype (Completed)                                         |
| - Full SPA UI/UX with dual roles (Official & Admin)                               |
| - SQLite database with 30+ competencies & 15+ courses                             |
| - Multi-factor gap algorithm & iGOT mock connector                                 |
| - Document MCQ generator (PDF/DOCX/PPTX/TXT) & StatBot assistant                  |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| PHASE 2: Live iGOT Karmayogi API Integration                                      |
| - Replace MockIGOTService with authenticated RealIGOTService OAuth2 connector     |
| - Bi-directional synchronization of course completions & certificate badges       |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| PHASE 3: Government SSO & Production Deployment                                   |
| - Integration with Parichay Government Single Sign-On                             |
| - Deployment on MeghRaj Sovereign Cloud with PostgreSQL database                  |
+-----------------------------------------------------------------------------------+
```

---

## 8. Appendix: Target API Specifications

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Sign in official or admin demo user |
| `GET` | `/api/users/me` | Fetch current user profile metadata |
| `PUT` | `/api/users/me` | Update career goals & current assignment |
| `GET` | `/api/users/{id}/competencies` | Fetch 4-domain competency scores & summaries |
| `GET` | `/api/skill-gaps` | Fetch prioritized skill gaps with AI rationale |
| `GET` | `/api/recommendations` | Fetch personalized iGOT & NSSTA recommendations |
| `GET` | `/api/courses` | Search & filter course catalog |
| `POST` | `/api/courses/{id}/enroll` | Enroll in course via iGOT adapter |
| `POST` | `/api/materials/upload` | Upload PDF/DOCX/PPTX/TXT and extract text |
| `POST` | `/api/assessments/generate` | Generate MCQs from text using AI |
| `POST` | `/api/quiz/submit` | Evaluate quiz, get AI feedback, & update competency score |
| `POST` | `/api/ai/chat` | Query StatBot AI assistant |
| `GET` | `/api/admin/analytics` | Fetch admin workforce metrics, heatmap, & emerging demand |
