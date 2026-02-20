from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from . import models, database, config

import bcrypt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # bcrypt (direct) requires bytes
    try:
        password_bytes = plain_password.encode("utf-8")[:72]
        # hashed_password from DB is likely string, convert to bytes
        if isinstance(hashed_password, str):
            hashed_bytes = hashed_password.encode("utf-8")
        else:
            hashed_bytes = hashed_password
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    # bcrypt (direct) requires bytes, returns bytes
    password_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=config.settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode["exp"] = expire
    return jwt.encode(to_encode, config.settings.SECRET_KEY, algorithm=config.settings.ALGORITHM)

async def get_current_user(request: Request, db: Session = Depends(database.get_db)) -> Optional[models.User]:
    """Optional auth — returns None for guests, User object for authenticated requests."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, config.settings.SECRET_KEY, algorithms=[config.settings.ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            return None
    except JWTError:
        return None
    return db.query(models.User).filter(models.User.email == email).first()

async def require_current_user(request: Request, db: Session = Depends(database.get_db)) -> models.User:
    """Required auth — raises 401 if not authenticated."""
    user = await get_current_user(request, db)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
