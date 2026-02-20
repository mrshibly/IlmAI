from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import text
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import timedelta

from .database import engine, get_db
from . import models, auth, config
from .llm import llm_provider
from .rag import rag_engine
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="TruthAI API", 
    description="RAG-based Islamic Knowledge Assistant Backend",
    version="2.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    email: str
    full_name: Optional[str]
    id: int

    class Config:
        from_attributes = True

@app.get("/")
def read_root():
    return {"message": "Welcome to IlmAI API", "status": "operational"}

@app.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.post("/query")
async def process_query(
    query: str = Query(...), 
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(auth.get_current_user)
):
    # current_user is optional if we want to allow guest queries
    logger.info(f"Processing query: {query} (User: {current_user.email if current_user else 'Guest'})")
    
    # 1. Retrieval
    context_parts = []
    citations = []
    
    # Simple semantic search (closest matches)
    quran_results = db.query(models.QuranVerse).all()
    hadith_results = db.query(models.Hadith).all()

    if engine.dialect.name == "sqlite":
        search_terms = {query.lower()}
        if "zakat" in query.lower(): search_terms.add("zakah")
        
        matches_quran = [v for v in quran_results if any(term in (v.english_text or "").lower() for term in search_terms)]
        matches_hadith = [h for h in hadith_results if any(term in (h.english_text or "").lower() for term in search_terms)]
                
        for v in matches_quran[:3]:
            context_parts.append(f"Quran {v.surah_number}:{v.ayah_number} - {v.english_text}")
            citations.append(f"Quran {v.surah_number}:{v.ayah_number}")
            
        for h in matches_hadith[:3]:
            context_parts.append(f"Hadith ({h.book_name}) #{h.hadith_number} - {h.english_text}")
            citations.append(f"{h.book_name} {h.hadith_number}")

    context = "\n".join(context_parts)
    
    # 2. Web Fallback
    web_context = ""
    if not context or len(context_parts) < 2:
        from .tools.tavily_search import search_tool
        web_results = search_tool.search(query)
        web_parts = [f"Source: {res['url']}\nContent: {res['content']}" for res in web_results]
        for res in web_results: citations.append(res['url'])
        web_context = "\n\n".join(web_parts)

    # 3. Generation
    system_prompt = rag_engine.construct_system_prompt(context, web_context)
    response = llm_provider.generate_response(system_prompt, query)
    
    # 4. Save History if user is authenticated
    if current_user:
        new_history = models.ChatHistory(
            user_id=current_user.id,
            query=query,
            response=response
        )
        db.add(new_history)
        db.commit()

    return {
        "response": response,
        "sources_found": bool(context or web_context),
        "citations": list(set(citations))
    }

@app.get("/history")
def get_history(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.ChatHistory).filter(models.ChatHistory.user_id == current_user.id).all()

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "version": "2.0.0"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
