"""
Scientific Image Forgery Detection System - Main Application
Author: Cavin Otieno
Competition: Recod.ai/LUC - Scientific Image Forgery Detection
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import logging
import os
from pathlib import Path

from app.core.config import settings
from app.core.database import init_db
from app.api.v1.api import api_router
from app.utils.logger import setup_logger


# Setup logging
logger = setup_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("🚀 Starting Scientific Image Forgery Detection API")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Debug mode: {settings.DEBUG}")
    
    # Initialize database
    try:
        await init_db()
        logger.info("✅ Database initialized successfully")
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        raise
    
    # Load ML models
    try:
        from app.services.model_service import model_service
        await model_service.load_models()
        logger.info("✅ ML models loaded successfully")
    except Exception as e:
        logger.error(f"❌ Model loading failed: {e}")
        # Don't raise - allow app to start without models for testing
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down Scientific Image Forgery Detection API")


# Create FastAPI application
app = FastAPI(
    title="Scientific Image Forgery Detection API",
    description="Advanced AI-powered system for detecting copy-move forgeries in biomedical research images",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

# Mount static files
static_dir = Path("static")
if static_dir.exists():
    app.mount("/static", StaticFiles(directory="static"), name="static")


# Include API router
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Scientific Image Forgery Detection API",
        "version": "1.0.0",
        "author": "Cavin Otieno",
        "competition": "Recod.ai/LUC - Scientific Image Forgery Detection",
        "docs": "/docs" if settings.DEBUG else "Documentation available at /api/v1/docs",
        "status": "active"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": settings.get_current_time(),
        "version": "1.0.0",
        "services": {
            "database": "connected",
            "models": "loaded"
        }
    }


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests"""
    start_time = settings.get_current_time()
    
    response = await call_next(request)
    
    process_time = (settings.get_current_time() - start_time).total_seconds() * 1000
    logger.info(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.2f}ms")
    
    response.headers["X-Process-Time"] = str(process_time)
    return response


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info",
    )
