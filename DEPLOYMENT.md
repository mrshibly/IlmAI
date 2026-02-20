# IlmAI Deployment Guide

This guide provides instructions for hosting IlmAI in a production environment.

## Hosting Options

### 1. Simple Hosting (Vercel + Railway)

Best for users who want a managed experience with minimal server configuration.

- **Frontend (Next.js)**:
  1. Connect your GitHub repository to [Vercel](https://vercel.com).
  2. **Important**: In the project settings, set the **Root Directory** to `frontend`.
  3. Under "Environment Variables", add:
     - `NEXT_PUBLIC_API_URL`: The URL of your deployed backend (e.g., `https://ilmai-api.railway.app`).
  4. Click **Deploy**.
- **Backend (FastAPI)**:
  - **Option A: Railway** (Paid/Trial): Create a "Web Service", link GitHub, point to `backend`.
  - **Option B: Render.com** (Free Tier):
    1. Sign up at [Render.com](https://render.com).
    2. Click **New** > **Web Service**.
    3. Connect your GitHub repository.
    4. Set the **Root Directory** to `backend`.
    5. Render will detect the `Dockerfile`. Change "Runtime" to **Docker**.
    6. Under **Environment Variables**, add the keys listed in the [Environment Variables](#environment-variables) section.
    7. Under **Instance Type**, select the **Free** tier (0.5 CPU, 512MB RAM).
    8. **Bonus**: Create a "Free PostgreSQL" database on Render and use its **Internal Database URL** for the `DATABASE_URL` variable.

### 2. Professional Hosting (VPS + Docker)

Best for cost-efficiency and full control. Recommended for RAG applications due to RAM requirements.

- **Prerequisites**: A VPS (DigitalOcean, AWS, etc.) with Docker and Docker Compose installed.
- **Deployment Steps**:
  1. Clone your repository to the VPS.
  2. Create a `.env` file in the root directory (use the template below).
  3. Run the orchestration command:
     ```bash
     docker-compose up -d --build
     ```
  4. Set up an Nginx reverse proxy or Cloudflare Tunnel to point to port `3000` (Frontend) and `8000` (Backend).

## Environment Variables

The following variables must be configured in your hosting provider's dashboard or a local `.env` file:

| Variable              | Description                    | Example                                |
| --------------------- | ------------------------------ | -------------------------------------- |
| `GROQ_API_KEY`        | Your Groq Cloud API Key        | `gsk_...`                              |
| `TAVILY_API_KEY`      | Your Tavily Search API Key     | `tvly-...`                             |
| `SECRET_KEY`          | Random string for JWT tokens   | `openssl rand -hex 32`                 |
| `DATABASE_URL`        | PostgreSQL connection string   | `postgresql://user:pass@db:5432/ilmai` |
| `NEXT_PUBLIC_API_URL` | The public URL of your backend | `https://api.yourdomain.com`           |

## Resource Requirements

- **RAM**: Minimum **2GB** recommended. The semantic engine (SentenceTransformers) loads models into memory.
- **Storage**: SSD recommended for fast vector operations on SQLite/Postgres.

## Database Migration

If you are moving from local development to production, use the `scripts/ingest_initial_data.py` to populate your production database with Quran and Hadith records.

---

_For support, please consult the IlmAI project maintainer._
