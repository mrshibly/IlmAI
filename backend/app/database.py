import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/ilmai")

# Fallback to SQLite if Postgres is unavailable (for verification/dev)
try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    # Test connection briefly
    with engine.connect() as conn:
        pass
except Exception as e:
    print(f"PostgreSQL connection failed: {e}. Falling back to SQLite for verification.")
    SQLALCHEMY_DATABASE_URL = "sqlite:///./ilmai.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
