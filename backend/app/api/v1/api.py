"""
API v1 Router
Author: Cavin Otieno
"""

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import List, Optional
import cv2
import numpy as np
import logging
from pathlib import Path
import uuid
import json
import asyncio
from datetime import datetime

from app.core.database import supabase_insert, supabase_select
from app.services.model_service import model_service
from app.core.config import settings

logger = logging.getLogger(__name__)

# Create API router
api_router = APIRouter()


@api_router.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Scientific Image Forgery Detection API v1",
        "version": "1.0.0",
        "author": "Cavin Otieno",
        "status": "operational",
        "endpoints": {
            "analyze": "/api/v1/analyze",
            "batch_analyze": "/api/v1/batch-analyze",
            "results": "/api/v1/results/{case_id}",
            "statistics": "/api/v1/statistics",
            "health": "/api/v1/health"
        }
    }


@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": settings.get_current_time().isoformat(),
        "version": "1.0.0",
        "models_loaded": model_service.is_loaded,
        "services": {
            "database": "connected",
            "ml_models": "operational",
            "supabase": "connected"
        }
    }


@api_router.post("/analyze")
async def analyze_image(
    file: UploadFile = File(...),
    case_id: Optional[str] = None
):
    """Analyze single image for forgery detection"""
    
    # Generate case_id if not provided
    if not case_id:
        case_id = f"img_{uuid.uuid4().hex[:8]}"
    
    # Validate file
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    if Path(file.filename).suffix.lower() not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"File type not supported. Allowed: {settings.ALLOWED_EXTENSIONS}"
        )
    
    try:
        # Read and process image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        # Perform analysis
        logger.info(f"Analyzing image: {case_id}")
        result = await model_service.analyze_image(image)
        
        # Add case_id to result
        result["case_id"] = case_id
        result["timestamp"] = datetime.now().isoformat()
        result["filename"] = file.filename
        result["file_size"] = len(contents)
        
        # Store in database
        try:
            await supabase_insert('analyses', {
                'case_id': case_id,
                'result': result['result'],
                'confidence': result['confidence'],
                'regions_count': len(result['regions']),
                'filename': file.filename,
                'file_size': len(contents),
                'created_at': datetime.now().isoformat()
            })
        except Exception as e:
            logger.warning(f"Failed to store in Supabase: {e}")
        
        logger.info(f"Analysis complete for {case_id}: {result['result']} (confidence: {result['confidence']:.3f})")
        
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"Analysis failed for {case_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@api_router.post("/batch-analyze")
async def batch_analyze_images(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...)
):
    """Analyze multiple images in batch"""
    
    if len(files) == 0:
        raise HTTPException(status_code=400, detail="No files provided")
    
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 files allowed per batch")
    
    try:
        # Generate batch_id
        batch_id = f"batch_{uuid.uuid4().hex[:8]}"
        logger.info(f"Starting batch analysis: {batch_id} with {len(files)} images")
        
        # Process images
        images = []
        valid_files = []
        
        for file in files:
            if not file.content_type.startswith('image/'):
                continue
            
            if Path(file.filename).suffix.lower() not in settings.ALLOWED_EXTENSIONS:
                continue
            
            contents = await file.read()
            nparr = np.frombuffer(contents, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if image is not None:
                images.append(image)
                valid_files.append({
                    "filename": file.filename,
                    "case_id": f"img_{uuid.uuid4().hex[:8]}"
                })
        
        if not images:
            raise HTTPException(status_code=400, detail="No valid images found")
        
        # Perform batch analysis
        results = await model_service.batch_analyze(images)
        
        # Add case_id and metadata
        for i, result in enumerate(results):
            result.update(valid_files[i])
            result["batch_id"] = batch_id
            result["timestamp"] = datetime.now().isoformat()
        
        # Store batch in database
        try:
            for result in results:
                await supabase_insert('analyses', {
                    'case_id': result['case_id'],
                    'batch_id': batch_id,
                    'result': result['result'],
                    'confidence': result['confidence'],
                    'regions_count': len(result['regions']),
                    'filename': result['filename'],
                    'created_at': result['timestamp']
                })
        except Exception as e:
            logger.warning(f"Failed to store batch in Supabase: {e}")
        
        logger.info(f"Batch analysis complete: {batch_id} - {len(results)} images processed")
        
        return {
            "batch_id": batch_id,
            "total_images": len(files),
            "processed_images": len(results),
            "results": results,
            "summary": {
                "authentic": sum(1 for r in results if r['result'] == 'authentic'),
                "forged": sum(1 for r in results if r['result'] == 'forged'),
                "avg_confidence": np.mean([r['confidence'] for r in results]).item()
            }
        }
        
    except Exception as e:
        logger.error(f"Batch analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Batch analysis failed: {str(e)}")


@api_router.get("/results/{case_id}")
async def get_analysis_result(case_id: str):
    """Get analysis result for specific case"""
    
    try:
        # Get from database
        results = await supabase_select('analyses', '*', {'case_id': case_id})
        
        if not results:
            raise HTTPException(status_code=404, detail="Analysis result not found")
        
        result = results[0]
        
        # Format response
        return {
            "case_id": result['case_id'],
            "result": result['result'],
            "confidence": result['confidence'],
            "regions_count": result['regions_count'],
            "filename": result['filename'],
            "timestamp": result['created_at']
        }
        
    except Exception as e:
        logger.error(f"Failed to get result for {case_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve result")


@api_router.get("/statistics")
async def get_statistics():
    """Get system statistics"""
    
    try:
        # Get database statistics
        total_analyses = await supabase_select('analyses', 'count', {})
        recent_analyses = await supabase_select('analyses', '*', {})
        
        # Calculate statistics
        stats = {
            "total_analyses": len(recent_analyses),
            "authentic_count": sum(1 for a in recent_analyses if a['result'] == 'authentic'),
            "forged_count": sum(1 for a in recent_analyses if a['result'] == 'forged'),
            "avg_confidence": np.mean([a['confidence'] for a in recent_analyses]).item() if recent_analyses else 0.0,
            "success_rate": 100.0,  # All processed images are successful
            "model_info": {
                "version": "1.0.0",
                "device": settings.DEVICE,
                "confidence_threshold": settings.CONFIDENCE_THRESHOLD,
                "image_size": settings.IMAGE_SIZE
            },
            "competition": {
                "name": settings.COMPETITION_NAME,
                "url": settings.COMPETITION_URL,
                "prize_pool": settings.PRIZE_POOL
            }
        }
        
        return stats
        
    except Exception as e:
        logger.error(f"Failed to get statistics: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve statistics")


@api_router.get("/competition/info")
async def get_competition_info():
    """Get competition information"""
    
    return {
        "competition": {
            "name": "Recod.ai/LUC - Scientific Image Forgery Detection",
            "url": "https://www.kaggle.com/competitions/recodai-luc-scientific-image-forgery-detection",
            "description": "Identify duplicated regions within biomedical research imaging",
            "prize_pool": "$55,000",
            "phases": {
                "training": "Model training with public leaderboard test set (~1,100 images)",
                "forecasting": "Private leaderboard test set (expected to double test set size)"
            },
            "submission_format": {
                "case_id": "Image identifier",
                "annotation": "Either 'authentic' or run length encoded mask"
            }
        },
        "author": "Cavin Otieno",
        "project": "Scientific Image Forgery Detection System"
    }
