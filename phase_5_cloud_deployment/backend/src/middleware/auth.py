from fastapi import HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from sqlmodel import Session
import uuid

from ..models.user import User
from ..utils.security import verify_user_id_from_token
from ..database import get_session_dep
from fastapi import Depends


# Security scheme for JWT
security = HTTPBearer()


async def verify_jwt_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session_dep)
):
    """Verify JWT token and return user_id if valid."""
    token = credentials.credentials
    user_id = verify_user_id_from_token(token)

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Get user from database to ensure they still exist
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id