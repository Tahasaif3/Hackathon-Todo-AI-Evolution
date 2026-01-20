from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_LsojKQF8bGn2@ep-mute-pine-a4g0wfsu-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")
    # Auth
    BETTER_AUTH_SECRET: str = os.getenv("BETTER_AUTH_SECRET", "your-secret-key-change-in-production")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-jwt-secret-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    JWT_COOKIE_SECURE: bool = False  # Set to True in production (requires HTTPS)
    JWT_COOKIE_SAMESITE: str = "lax"  # "lax" | "strict" | "none" (use "none" for cross-site cookies in production)

    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "your-frontend-url-here")

    # AI API Keys
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")

    class Config:
        env_file = ".env"


settings = Settings()