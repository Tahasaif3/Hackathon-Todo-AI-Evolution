from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "your-db-url-here"

    # Auth
    BETTER_AUTH_SECRET: str = "your-secret-key-change-in-production"
    JWT_SECRET_KEY: str = "your-jwt-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    JWT_COOKIE_SECURE: bool = True  # Set to True in production
    JWT_COOKIE_SAMESITE: str = "none"  # "lax" | "strict" | "none" (use "none" for cross-site cookies in production)

    # CORS
    FRONTEND_URL: str = "your-frontend-url-here"

    # AI API Keys
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"


settings = Settings()