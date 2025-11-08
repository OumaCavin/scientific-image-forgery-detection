"""
Application Configuration
Author: Cavin Otieno
"""

from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field
from datetime import datetime
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # App Info
    APP_NAME: str = "Scientific Image Forgery Detection System"
    VERSION: str = "1.0.0"
    AUTHOR: str = "Cavin Otieno"
    DESCRIPTION: str = "Advanced AI-powered system for detecting copy-move forgeries in biomedical research images"
    
    # Environment
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    DEBUG: bool = Field(default=True, env="DEBUG")
    
    # Security
    SECRET_KEY: str = Field(default="your-secret-key-here", env="SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    
    # Database
    SUPABASE_URL: str = Field(default="https://ygcnkooxairnavbrqblq.supabase.co", env="SUPABASE_URL")
    SUPABASE_ANON_KEY: str = Field(default="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnY25rb294YWlybmF2YnJxYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MTYzNDIsImV4cCI6MjA3ODE5MjM0Mn0.unUUGGG5ap5aeiPFsVKq1eLHRw_ok9GbrOcCLbyylIo", env="SUPABASE_ANON_KEY")
    DATABASE_URL: Optional[str] = Field(default=None, env="DATABASE_URL")
    
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Scientific Image Forgery Detection"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://localhost:3000",
        "https://your-frontend-url.com",
        "https://ygcnkooxairnavbrqblq.supabase.co",
    ]
    
    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://localhost:3000",
        "https://your-frontend-url.com",
    ]
    
    # File Upload Settings
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".tiff", ".tif", ".bmp"]
    UPLOAD_DIR: str = "uploads"
    RESULTS_DIR: str = "results"
    
    # ML Model Settings
    MODEL_PATH: str = "models/trained/best_model.pth"
    MODEL_CONFIGS_PATH: str = "models/configs"
    DEVICE: str = "cuda"  # or "cpu"
    BATCH_SIZE: int = 8
    NUM_WORKERS: int = 4
    
    # Processing Settings
    IMAGE_SIZE: int = 512
    CONFIDENCE_THRESHOLD: float = 0.5
    IOU_THRESHOLD: float = 0.5
    
    # Supabase Storage
    STORAGE_BUCKET: str = "image-forgery-detection"
    
    # Redis (for caching and queues)
    REDIS_URL: str = Field(default="redis://localhost:6379", env="REDIS_URL")
    
    # Celery (for background tasks)
    CELERY_BROKER_URL: str = Field(default="redis://localhost:6379/0", env="CELERY_BROKER_URL")
    CELERY_RESULT_BACKEND: str = Field(default="redis://localhost:6379/0", env="CELERY_RESULT_BACKEND")
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/app.log"
    
    # Competition Specific
    COMPETITION_NAME: str = "Recod.ai/LUC - Scientific Image Forgery Detection"
    COMPETITION_URL: str = "https://www.kaggle.com/competitions/recodai-luc-scientific-image-forgery-detection"
    PRIZE_POOL: str = "$55,000"
    
    # Dataset Paths
    DATASET_DIR: str = "data"
    TRAIN_IMAGES_DIR: str = "data/raw/train_images"
    TEST_IMAGES_DIR: str = "data/raw/test_images"
    TRAIN_MASKS_DIR: str = "data/raw/train_masks"
    SAMPLE_SUBMISSION_PATH: str = "data/raw/sample_submission.csv"
    
    # API Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # Cache Settings
    CACHE_TTL: int = 3600  # 1 hour
    RESULTS_CACHE_TTL: int = 86400  # 24 hours
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    def get_current_time(self) -> datetime:
        """Get current timestamp"""
        return datetime.now()
    
    @property
    def is_development(self) -> bool:
        """Check if in development mode"""
        return self.ENVIRONMENT == "development"
    
    @property
    def is_production(self) -> bool:
        """Check if in production mode"""
        return self.ENVIRONMENT == "production"
    
    def create_directories(self):
        """Create necessary directories"""
        directories = [
            self.UPLOAD_DIR,
            self.RESULTS_DIR,
            "logs",
            "models/trained",
            "models/checkpoints",
            "models/configs",
            "data/processed",
            "data/results"
        ]
        
        for directory in directories:
            os.makedirs(directory, exist_ok=True)


# Create settings instance
settings = Settings()
settings.create_directories()
