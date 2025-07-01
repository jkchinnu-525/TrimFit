import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "TrimFit Resume Tailor"

    # Document Processing
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_EXTENSIONS: list = [".pdf", ".docx", ".doc", ".txt"]
    UPLOAD_DIR: str = "uploads"

    # AI MODEL
    SPACY_MODEL: str = "en_core_web_sm"
    SENTENCE_TRANSFORMER_MODEL: str = "all-MiniLM-L6-v2"

    # Anthropic AI
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    ANTHROPIC_MODEL: str = "claude-3-5-sonnet-20240620"
    ANTHROPIC_MAX_TOKENS: int = 1000

    # OpenAI
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = "gpt-4o"

    # Groq
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")

    class Config:
        env_file = ".env"


settings = Settings()
