# IlmAI - Getting Started

This guide explains how to set up and run the IlmAI RAG-based backend.

## 1. Prerequisites

- Docker & Docker Compose (for PostgreSQL + pgvector)
- Python 3.10+
- Groq API Key

## 2. Setup Database

Start the PostgreSQL database with the pgvector extension:

```bash
docker-compose up -d
```

## 3. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## 4. Environment Configuration

Create a `.env` file in the `backend/` directory:

```
DATABASE_URL=postgresql://user:password@localhost:5432/ilmai
GROQ_API_KEY=your_groq_api_key_here
```

## 5. Ingest Sample Data

To seed the database with Quranic verses and generate embeddings:

```bash
python scripts/ingest_quran.py
```

## 6. Run the API

```bash
# From the backend directory
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## 7. Test the RAG

You can test the search via `curl` or using the FastAPI Docs:

```bash
curl -X 'POST' \
  'http://127.0.0.1:8000/query' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "query": "What does the Quran say about the purpose of creation?",
  "provider": "groq"
}'
```

Or visit `http://127.0.0.1:8000/docs`.
