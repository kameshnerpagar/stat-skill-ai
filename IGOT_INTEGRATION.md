# iGOT Karmayogi Production Integration Guide

**Ministry of Statistics and Programme Implementation (MoSPI)**  
**Smart India Hackathon (SIH-26) — Problem Statement ID: SIH26101**

---

## 📌 Architecture & Adapter Pattern

**STAT-SKILL AI** employs an explicit **Adapter Design Pattern** (`IGOTServiceInterface`) to decouple the application core from the underlying iGOT Karmayogi API infrastructure.

```
                         +------------------------------------------+
                         |          IGOTServiceInterface            |
                         +------------------------------------------+
                                              |
                        +---------------------+---------------------+
                        |                                           |
                        v                                           v
         +------------------------------+            +------------------------------+
         |       MockIGOTService        |            |       RealIGOTService        |
         |  (Curated MoSPI Catalog)     |            |  (Live iGOT OAuth2 Connector)|
         +------------------------------+            +------------------------------+
```

---

## ⚙️ Environment Configuration

To switch STAT-SKILL AI from prototype mode to live production mode with authentic iGOT Karmayogi endpoints, configure the following environment variables in `backend/.env` or your hosting environment (e.g., Render / MeghRaj Cloud):

| Environment Variable | Allowed Values | Description |
| :--- | :--- | :--- |
| `IGOT_MODE` | `mock` \| `real` | Controls active service adapter. Default is `mock`. |
| `IGOT_BASE_URL` | `https://igotkarmayogi.gov.in/api` | Base URL for official iGOT Karmayogi REST APIs. |
| `IGOT_CLIENT_ID` | String | OAuth2 Client Credentials ID provided by iGOT API portal. |
| `IGOT_CLIENT_SECRET` | String | OAuth2 Client Credentials Secret. |

---

## 🔑 Switching to Production Mode (Zero Code Changes)

1. Set `IGOT_MODE=real` in `backend/.env`.
2. Provide valid `IGOT_CLIENT_ID` and `IGOT_CLIENT_SECRET` issued by the Department of Personnel and Training (DoPT) / iGOT Bharat team.
3. Restart the FastAPI backend server.

The factory function `get_igot_service()` in `backend/app/services/igot_service.py` automatically initializes `RealIGOTService`, performing OAuth2 token exchanges and fetching live courses, enrollments, and completion credentials seamlessly without requiring any frontend or UI modifications.
