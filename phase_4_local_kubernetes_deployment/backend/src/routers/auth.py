from fastapi import APIRouter, HTTPException, status, Depends, Response, Request
from sqlmodel import Session, select
from typing import Annotated
from datetime import datetime, timedelta
from uuid import uuid4
import secrets

from ..models.user import User, UserCreate, UserRead
from ..schemas.auth import RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, ForgotPasswordRequest, ResetPasswordRequest
from ..utils.security import hash_password, create_access_token, verify_password
from ..utils.deps import get_current_user
from ..database import get_session_dep
from ..config import settings


router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: RegisterRequest, response: Response, session: Session = Depends(get_session_dep)):
    """Register a new user with email and password."""

    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists"
        )

    # Validate password length
    if len(user_data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters"
        )

    # Hash the password
    password_hash = hash_password(user_data.password)

    # Create new user
    user = User(
        email=user_data.email,
        password_hash=password_hash
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    # Set the token as an httpOnly cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.JWT_COOKIE_SECURE,  # True in production, False in development
        samesite=settings.JWT_COOKIE_SAMESITE,
        max_age=settings.ACCESS_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,  # Convert days to seconds
        path="/"
    )

    # Return response
    return RegisterResponse(
        id=user.id,
        email=user.email,
        message="Account created successfully"
    )


@router.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest, response: Response, session: Session = Depends(get_session_dep)):
    """Authenticate user with email and password, return JWT token."""

    # Find user by email
    user = session.exec(select(User).where(User.email == login_data.email)).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    # Set the token as an httpOnly cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.JWT_COOKIE_SECURE,  # True in production, False in development
        samesite=settings.JWT_COOKIE_SAMESITE,
        max_age=settings.ACCESS_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,  # Convert days to seconds
        path="/"
    )
    
    # Debug: Print the cookie being set
    print(f"Setting cookie: access_token={access_token}")
    print(f"Cookie attributes: httponly={True}, secure={settings.JWT_COOKIE_SECURE}, samesite={settings.JWT_COOKIE_SAMESITE}, max_age={settings.ACCESS_TOKEN_EXPIRE_DAYS * 24 * 60 * 60}")

    # Return response
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=RegisterResponse(
            id=user.id,
            email=user.email,
            message="Login successful"
        )
    )


@router.post("/logout")
def logout(request: Request, response: Response, current_user: User = Depends(get_current_user)):
    """Logout user by clearing the access token cookie."""
    # Clear the access_token cookie
    response.set_cookie(
        key="access_token",
        value="",
        httponly=True,
        secure=settings.JWT_COOKIE_SECURE,
        samesite=settings.JWT_COOKIE_SAMESITE,
        max_age=0,  # Expire immediately
        path="/"
    )
    
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=RegisterResponse)
def get_current_user_profile(request: Request, current_user: User = Depends(get_current_user)):
    """Get the current authenticated user's profile."""
    # Debug: Print the cookies received
    print(f"Received cookies: {request.cookies}")
    print(f"Access token cookie: {request.cookies.get('access_token')}")
    
    return RegisterResponse(
        id=current_user.id,
        email=current_user.email,
        message="User profile retrieved successfully"
    )


@router.post("/forgot-password")
def forgot_password(forgot_data: ForgotPasswordRequest, session: Session = Depends(get_session_dep)):
    """Initiate password reset process by verifying email exists."""
    # Check if user exists
    user = session.exec(select(User).where(User.email == forgot_data.email)).first()
    
    if not user:
        # For security reasons, we don't reveal if the email exists or not
        return {"message": "If the email exists, a reset link would be sent"}
    
    # In a real implementation, we would send an email here
    # But as per requirements, we're just simulating the process
    return {"message": "If the email exists, a reset link would be sent"}


@router.post("/reset-password")
def reset_password(reset_data: ResetPasswordRequest, session: Session = Depends(get_session_dep)):
    """Reset user password after verification."""
    # Check if user exists
    user = session.exec(select(User).where(User.email == reset_data.email)).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Validate password length
    if len(reset_data.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters"
        )
    
    # Hash the new password
    user.password_hash = hash_password(reset_data.new_password)
    
    # Update the user
    session.add(user)
    session.commit()
    
    return {"message": "Password reset successfully"}