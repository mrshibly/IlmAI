from sqlalchemy import Column, Integer, String, Text, ForeignKey, PickleType, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
try:
    from pgvector.sqlalchemy import Vector
except ImportError:
    Vector = None

from .database import Base, engine

# Helper to determine vector type
def get_vector_type(dim: int):
    if Vector and engine.dialect.name == "postgresql":
        return Vector(dim)
    return PickleType  # Store as list in SQLite

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    chat_histories = relationship("ChatHistory", back_populates="user")
    saved_citations = relationship("SavedCitation", back_populates="user")

class ChatHistory(Base):
    __tablename__ = "chat_histories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    language = Column(String, default="en")
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_histories")

class SavedCitation(Base):
    __tablename__ = "saved_citations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    source_type = Column(String)  # quran, hadith, fiqh, web
    source_id = Column(String)    # For Quran (Surah:Ayah), etc.
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="saved_citations")

class QuranVerse(Base):
    __tablename__ = "quran_verses"

    id = Column(Integer, primary_key=True, index=True)
    surah_number = Column(Integer, index=True)
    ayah_number = Column(Integer, index=True)
    arabic_text = Column(Text, nullable=False)
    english_text = Column(Text)
    bangla_text = Column(Text)
    tafsir_summary = Column(Text)
    embedding = Column(get_vector_type(384))  # Adjust dimensions based on embedding model

class Hadith(Base):
    __tablename__ = "hadiths"

    id = Column(Integer, primary_key=True, index=True)
    book_name = Column(String, index=True)
    book_number = Column(Integer)
    hadith_number = Column(Integer, index=True)
    arabic_text = Column(Text, nullable=False)
    english_text = Column(Text)
    bangla_text = Column(Text)
    grade = Column(String, index=True)
    embedding = Column(get_vector_type(384))

class FiqhSource(Base):
    __tablename__ = "fiqh_sources"

    id = Column(Integer, primary_key=True, index=True)
    madhhab = Column(String, index=True)
    ruling_title = Column(String, index=True)
    source_book = Column(String)
    reference_page = Column(String)
    arabic_text = Column(Text)
    translation = Column(Text)
    embedding = Column(get_vector_type(384))
