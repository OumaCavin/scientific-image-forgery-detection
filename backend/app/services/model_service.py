"""
ML Model Service for Scientific Image Forgery Detection
Author: Cavin Otieno
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms
import cv2
import numpy as np
from PIL import Image
import logging
from pathlib import Path
import asyncio
from typing import Dict, List, Tuple, Optional
import joblib

from app.core.config import settings

logger = logging.getLogger(__name__)


class ForgeryDetectionModel(nn.Module):
    """Custom CNN model for image forgery detection"""
    
    def __init__(self, num_classes=1):
        super(ForgeryDetectionModel, self).__init__()
        
        # ResNet-50 backbone (simplified for demo)
        self.backbone = nn.Sequential(
            nn.Conv2d(3, 64, 7, 2, 3),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(3, 2, 1),
            
            # Residual blocks
            self._make_layer(64, 64, 3, 1),
            self._make_layer(64, 128, 4, 2),
            self._make_layer(128, 256, 6, 2),
            self._make_layer(256, 512, 3, 2),
        )
        
        # Detection head
        self.detection_head = nn.Sequential(
            nn.AdaptiveAvgPool2d((1, 1)),
            nn.Flatten(),
            nn.Linear(512, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(256, 1),
            nn.Sigmoid()
        )
        
        # Segmentation head
        self.seg_head = nn.Sequential(
            nn.ConvTranspose2d(512, 256, 2, 2),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.ConvTranspose2d(256, 128, 2, 2),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.ConvTranspose2d(128, 64, 2, 2),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 1, 1)
        )
    
    def _make_layer(self, in_ch, out_ch, blocks, stride=1):
        """Create residual layer"""
        layers = []
        layers.append(self._block(in_ch, out_ch, stride))
        
        for _ in range(1, blocks):
            layers.append(self._block(out_ch, out_ch))
        
        return nn.Sequential(*layers)
    
    def _block(self, in_ch, out_ch, stride=1):
        """Create residual block"""
        return nn.Sequential(
            nn.Conv2d(in_ch, out_ch, 3, stride, 1),
            nn.BatchNorm2d(out_ch),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_ch, out_ch, 3, 1, 1),
            nn.BatchNorm2d(out_ch),
        )
    
    def forward(self, x):
        # Backbone features
        features = self.backbone(x)
        
        # Detection
        detection = self.detection_head(features)
        
        # Segmentation
        segmentation = self.seg_head(features)
        segmentation = F.interpolate(segmentation, size=x.shape[-2:], mode='bilinear')
        
        return detection, segmentation


class ModelService:
    """Service for managing ML models and inference"""
    
    def __init__(self):
        self.model = None
        self.device = torch.device(settings.DEVICE)
        self.transform = transforms.Compose([
            transforms.Resize((settings.IMAGE_SIZE, settings.IMAGE_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
        self.is_loaded = False
    
    async def load_models(self):
        """Load ML models"""
        try:
            logger.info("Loading ML models...")
            
            # Create model instance
            self.model = ForgeryDetectionModel()
            self.model.to(self.device)
            self.model.eval()
            
            # Try to load pretrained weights
            model_path = Path(settings.MODEL_PATH)
            if model_path.exists():
                checkpoint = torch.load(model_path, map_location=self.device)
                self.model.load_state_dict(checkpoint)
                logger.info(f"✅ Model loaded from {model_path}")
            else:
                logger.warning("⚠️  No pretrained model found, using random initialization")
            
            self.is_loaded = True
            logger.info("✅ Model service initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Model loading failed: {e}")
            raise
    
    async def analyze_image(self, image: np.ndarray) -> Dict:
        """Analyze single image for forgery detection"""
        if not self.is_loaded:
            await self.load_models()
        
        try:
            # Preprocess image
            pil_image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
            input_tensor = self.transform(pil_image).unsqueeze(0).to(self.device)
            
            # Inference
            with torch.no_grad():
                detection_score, segmentation = self.model(input_tensor)
            
            # Post-process results
            confidence = detection_score.squeeze().item()
            mask = segmentation.squeeze().cpu().numpy()
            
            # Apply threshold
            if confidence < settings.CONFIDENCE_THRESHOLD:
                result = "authentic"
                mask_encoded = ""
            else:
                result = "forged"
                mask_encoded = self._encode_run_length(mask)
            
            # Find regions
            regions = self._find_regions(mask)
            
            return {
                "result": result,
                "confidence": confidence,
                "mask": mask_encoded,
                "regions": regions,
                "processing_time": 0  # TODO: add timing
            }
            
        except Exception as e:
            logger.error(f"Image analysis failed: {e}")
            raise
    
    async def batch_analyze(self, images: List[np.ndarray]) -> List[Dict]:
        """Analyze multiple images"""
        results = []
        for i, image in enumerate(images):
            logger.info(f"Processing image {i+1}/{len(images)}")
            result = await self.analyze_image(image)
            result["case_id"] = f"img_{i:04d}"
            results.append(result)
        
        return results
    
    def _encode_run_length(self, mask: np.ndarray) -> str:
        """Convert binary mask to run-length encoding"""
        mask = (mask > settings.CONFIDENCE_THRESHOLD).astype(np.uint8)
        flat = mask.flatten()
        
        encoding = []
        count = 1
        for i in range(1, len(flat)):
            if flat[i] == flat[i-1]:
                count += 1
            else:
                if flat[i-1] == 1:
                    encoding.append((count, 1))
                count = 1
        
        # Handle last run
        if flat[-1] == 1:
            encoding.append((count, 1))
        
        return str(encoding)
    
    def _find_regions(self, mask: np.ndarray) -> List[Dict]:
        """Find and extract region information"""
        try:
            binary_mask = (mask > settings.CONFIDENCE_THRESHOLD).astype(np.uint8)
            contours, _ = cv2.findContours(binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            regions = []
            for contour in contours:
                # Get bounding box
                x, y, w, h = cv2.boundingRect(contour)
                
                # Calculate confidence (contour area relative to total mask area)
                area = cv2.contourArea(contour)
                total_area = np.sum(binary_mask)
                confidence = min(1.0, area / total_area) if total_area > 0 else 0.0
                
                regions.append({
                    "coordinates": [[x, y], [x + w, y + h]],
                    "confidence": confidence,
                    "area": area
                })
            
            return regions
            
        except Exception as e:
            logger.error(f"Region finding failed: {e}")
            return []


# Global model service instance
model_service = ModelService()
