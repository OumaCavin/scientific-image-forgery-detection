"""
Analysis Model
Author: Cavin Otieno
"""

from sqlalchemy import Column, String, Float, Integer, Text, Boolean
from app.models.base import BaseModel


class Analysis(BaseModel):
    """Analysis model for image forgery detection results"""
    __tablename__ = "analyses"
    
    case_id = Column(String(50), unique=True, index=True, nullable=False)
    batch_id = Column(String(50), nullable=True)
    filename = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=False)
    
    # Analysis results
    result = Column(String(20), nullable=False)  # authentic, forged
    confidence = Column(Float, nullable=False)
    regions_count = Column(Integer, default=0)
    
    # Optional mask data
    mask_data = Column(Text, nullable=True)  # Run-length encoded mask
    
    # Status
    status = Column(String(20), default="completed")  # pending, processing, completed, failed
    
    def __repr__(self):
        return f"<Analysis(case_id='{self.case_id}', result='{self.result}', confidence={self.confidence})>"
