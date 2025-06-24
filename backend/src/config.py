import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "TrimFit Resume Tailor"
    
    # Document Processing
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_EXTENSIONS: list = [".pdf", ".docx", ".doc",".txt"]
    UPLOAD_DIR: str = "uploads"
    
    #AI MODEL
    SPACY_MODEL: str = "en_core_web_sm"
    SENTENCE_TRANSFORMER_MODEL: str = "all-MiniLM-L6-v2"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    
    class Config:
        env_file = ".env"

settings = Settings()
