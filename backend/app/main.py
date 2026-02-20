from fastapi import FastAPI, Depends, HTTPException, Query, status, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import text
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timedelta

from .database import engine, get_db
from . import models, auth, config
from .llm import llm_provider
from .rag import rag_engine
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="IlmAI API", 
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

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    preferred_madhhab: Optional[str] = None
    ui_language: Optional[str] = None

class UserResponse(BaseModel):
    email: str
    full_name: Optional[str]
    preferred_madhhab: str
    ui_language: str
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
async def read_users_me(request: Request, db: Session = Depends(get_db)):
    current_user = await auth.require_current_user(request, db)
    return current_user

@app.patch("/me", response_model=UserResponse)
async def update_user(request: Request, user_update: UserUpdate, db: Session = Depends(get_db)):
    current_user = await auth.require_current_user(request, db)
    
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.preferred_madhhab is not None:
        current_user.preferred_madhhab = user_update.preferred_madhhab
    if user_update.ui_language is not None:
        current_user.ui_language = user_update.ui_language
        
    db.commit()
    db.refresh(current_user)
    return current_user

@app.get("/sessions")
async def get_sessions(request: Request, db: Session = Depends(get_db)):
    current_user = await auth.require_current_user(request, db)
    return db.query(models.ChatSession).filter(models.ChatSession.user_id == current_user.id).order_by(models.ChatSession.created_at.desc()).all()

@app.post("/sessions")
async def create_session(request: Request, title: str = "New Conversation", db: Session = Depends(get_db)):
    current_user = await auth.require_current_user(request, db)
    new_session = models.ChatSession(user_id=current_user.id, title=title)
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

@app.delete("/sessions/{session_id}")
async def delete_session(session_id: int, request: Request, db: Session = Depends(get_db)):
    current_user = await auth.require_current_user(request, db)
    session = db.query(models.ChatSession).filter(
        models.ChatSession.id == session_id,
        models.ChatSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    db.delete(session)
    db.commit()
    return {"message": "Session deleted"}

@app.get("/history/{session_id}")
async def get_session_history(session_id: int, request: Request, db: Session = Depends(get_db)):
    current_user = await auth.require_current_user(request, db)
    return db.query(models.ChatHistory).filter(
        models.ChatHistory.user_id == current_user.id,
        models.ChatHistory.session_id == session_id
    ).order_by(models.ChatHistory.timestamp.asc()).all()

@app.post("/query")
async def process_query(
    request: Request,
    query: str = Query(...), 
    session_id: int = Query(None),
    mode: str = Query("standard"),
    db: Session = Depends(get_db),
):
    current_user = await auth.require_current_user(request, db)
    
    # Check Usage Limit
    now = datetime.utcnow()
    # Reset usage if it's a new day
    if not current_user.last_usage_reset or current_user.last_usage_reset.date() < now.date():
        current_user.usage_count = 0
        current_user.last_usage_reset = now
        db.commit()
    
    if current_user.tier == "free" and current_user.usage_count >= current_user.usage_limit:
        raise HTTPException(
            status_code=403, 
            detail="Daily inquiry limit reached. Upgrade to Pro for unlimited research."
        )
    
    # Ensure session exists or create one
    if session_id:
        chat_session = db.query(models.ChatSession).filter(
            models.ChatSession.id == session_id,
            models.ChatSession.user_id == current_user.id
        ).first()
        if not chat_session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        # Create a new session for this query
        chat_session = models.ChatSession(user_id=current_user.id, title=query[:50] + "...")
        db.add(chat_session)
        db.commit()
        db.refresh(chat_session)
        session_id = chat_session.id

    logger.info(f"Processing query: {query} (User: {current_user.email}, Session: {session_id}, Mode: {mode})")
    
    # 1. Retrieval
    context_parts = []
    citations = []
    sources = []
    
    # Advanced neural semantic search
    query_vector = rag_engine.get_embedding(query)
    quran_results = db.query(models.QuranVerse).all()
    hadith_results = db.query(models.Hadith).all()

    matches_quran = rag_engine.search_semantic(query_vector, quran_results, top_k=3)
    matches_hadith = rag_engine.search_semantic(query_vector, hadith_results, top_k=3)
                
    for v in matches_quran:
        text = v.english_text or v.arabic_text
        context_parts.append(f"Quran {v.surah_number}:{v.ayah_number} - {text}")
        citations.append(f"Quran {v.surah_number}:{v.ayah_number}")
        sources.append({
            "type": "quran",
            "id": f"Quran {v.surah_number}:{v.ayah_number}",
            "content": text
        })
        
    for h in matches_hadith:
        text = h.english_text or h.arabic_text
        context_parts.append(f"Hadith ({h.book_name}) #{h.hadith_number} - {text}")
        citations.append(f"{h.book_name} {h.hadith_number}")
        sources.append({
            "type": "hadith",
            "id": f"{h.book_name} #{h.hadith_number}",
            "content": text
        })

    context = "\n".join(context_parts)
    
    # 2. Web Fallback
    web_context = ""
    if not context or len(context_parts) < 2:
        try:
            from .tools.tavily_search import search_tool
            web_results = search_tool.search(query)
            web_parts = [f"Source: {res['url']}\nContent: {res['content']}" for res in web_results]
            for res in web_results: 
                citations.append(res['url'])
                sources.append({
                    "type": "web",
                    "id": res['url'],
                    "content": res['content']
                })
            web_context = "\n\n".join(web_parts)
        except Exception as e:
            logger.error(f"Web search failed: {e}")

    # 3. Generation
    system_prompt = rag_engine.construct_system_prompt(
        context, 
        web_context, 
        madhhab=current_user.preferred_madhhab, 
        language=current_user.ui_language,
        mode=mode
    )
    response = llm_provider.generate_response(system_prompt, query)
    
    # 4. Save History
    new_history = models.ChatHistory(
        user_id=current_user.id,
        session_id=session_id,
        query=query,
        response=response,
        language=current_user.ui_language
    )
    db.add(new_history)
    
    # Increment usage
    current_user.usage_count += 1
    db.commit()

    return {
        "response": response,
        "sources_found": bool(context or web_context),
        "citations": list(set(citations)),
        "sources": sources,
        "session_id": session_id,
        "session_title": chat_session.title
    }

@app.delete("/history/{history_id}")
async def delete_history_item(history_id: int, request: Request, db: Session = Depends(get_db)):
    current_user = await auth.require_current_user(request, db)
    item = db.query(models.ChatHistory).filter(
        models.ChatHistory.id == history_id,
        models.ChatHistory.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="History item not found")
        
    db.delete(item)
    db.commit()
    return {"message": "Deleted successfully"}

@app.delete("/history")
async def clear_history(request: Request, db: Session = Depends(get_db)):
    current_user = await auth.require_current_user(request, db)
    db.query(models.ChatHistory).filter(models.ChatHistory.user_id == current_user.id).delete()
    db.commit()
    return {"message": "All history cleared"}

@app.post("/library/save")
async def save_citation(
    request: Request,
    source_type: str = Query(...),
    source_id: str = Query(...),
    content: str = Body(...),
    db: Session = Depends(get_db)
):
    current_user = await auth.require_current_user(request, db)
    new_citation = models.SavedCitation(
        user_id=current_user.id,
        source_type=source_type,
        source_id=source_id,
        content=content
    )
    db.add(new_citation)
    db.commit()
    db.refresh(new_citation)
    return new_citation

@app.get("/library")
async def get_library(request: Request, db: Session = Depends(get_db)):
    current_user = await auth.require_current_user(request, db)
    return db.query(models.SavedCitation).filter(models.SavedCitation.user_id == current_user.id).order_by(models.SavedCitation.timestamp.desc()).all()

@app.delete("/library/{citation_id}")
async def delete_citation(citation_id: int, request: Request, db: Session = Depends(get_db)):
    current_user = await auth.require_current_user(request, db)
    citation = db.query(models.SavedCitation).filter(
        models.SavedCitation.id == citation_id,
        models.SavedCitation.user_id == current_user.id
    ).first()
    if not citation:
        raise HTTPException(status_code=404, detail="Citation not found")
    db.delete(citation)
    db.commit()
    return {"message": "Citation deleted"}

@app.get("/usage")
async def get_usage(request: Request, db: Session = Depends(get_db)):
    current_user = await auth.require_current_user(request, db)
    
    # Check for daily reset here too for fresh data
    now = datetime.utcnow()
    if not current_user.last_usage_reset or current_user.last_usage_reset.date() < now.date():
        current_user.usage_count = 0
        current_user.last_usage_reset = now
        db.commit()
        
    return {
        "tier": current_user.tier,
        "usage_count": current_user.usage_count,
        "usage_limit": current_user.usage_limit,
        "is_unlimited": current_user.tier == "pro"
    }

@app.post("/upgrade")
async def upgrade_user(request: Request, db: Session = Depends(get_db)):
    current_user = await auth.require_current_user(request, db)
    current_user.tier = "pro"
    current_user.usage_limit = 999999 # Effectively unlimited
    db.commit()
    return {"message": "Successfully upgraded to Pro tier!", "tier": "pro"}

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
