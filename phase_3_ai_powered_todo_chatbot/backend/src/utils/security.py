from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional, Union
import uuid
from jose import JWTError, jwt
from ..config import settings

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt, truncating to 72 bytes if necessary."""
    # Truncate password to 72 bytes to comply with bcrypt's limitation
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    # Decode back to string, replacing any invalid bytes
    password = password_bytes.decode('utf-8', 'ignore')
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash, truncating to 72 bytes if necessary."""
    # Truncate password to 72 bytes to comply with bcrypt's limitation
    password_bytes = plain_password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    # Decode back to string, replacing any invalid bytes
    plain_password = password_bytes.decode('utf-8', 'ignore')
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        # Default to 7 days if no expiration is provided
        expire = datetime.utcnow() + timedelta(days=settings.ACCESS_TOKEN_EXPIRE_DAYS)

    to_encode.update({"exp": expire, "iat": datetime.utcnow()})

    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """Verify a JWT token and return the payload if valid."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None


def verify_user_id_from_token(token: str) -> Optional[uuid.UUID]:
    """Extract user_id from JWT token."""
    payload = verify_token(token)
    if payload:
        user_id_str = payload.get("sub")
        if user_id_str:
            try:
                return uuid.UUID(user_id_str)
            except ValueError:
                return None
    return None