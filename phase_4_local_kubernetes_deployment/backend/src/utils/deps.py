from fastapi import Depends, HTTPException, status, Request
from sqlmodel import Session
from typing import Generator
from ..database import get_session_dep
from ..models.user import User
from .security import verify_user_id_from_token
from uuid import UUID


def get_current_user(
    request: Request,
    session: Session = Depends(get_session_dep)
) -> User:
    """Dependency to get the current authenticated user from JWT token in cookie or Authorization header."""
    # Debug: Print all cookies and headers
    print(f"All cookies received: {request.cookies}")
    print(f"All headers received: {request.headers}")
    
    # First try to get the token from the cookie
    token = request.cookies.get("access_token")
    print(f"Access token from cookie: {token}")
    
    # If no token in cookie, try to get it from Authorization header
    if not token:
        auth_header = request.headers.get("authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:]  # Remove "Bearer " prefix
            print(f"Access token from Authorization header: {token}")
    
    if not token:
        print("No access token found in cookies or Authorization header")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = verify_user_id_from_token(token)
    print(f"User ID from token: {user_id}")
    
    if not user_id:
        print("Invalid user ID from token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = session.get(User, user_id)
    print(f"User from database: {user}")
    
    if not user:
        print("User not found in database")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


def get_user_by_id(
    user_id: UUID,
    session: Session = Depends(get_session_dep)
) -> User:
    """Dependency to get a user by ID from the database."""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user