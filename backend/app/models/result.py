"""
Result Model
Author: Cavin Otieno
"""

from sqlalchemy import Column, String, Float, Integer, Text
from app.models.base import BaseModel


class Result(BaseModel):
    """Result model for detailed analysis results"""
    __tablename__ = "results"
    
    analysis_id = Column(Integer, nullable=False)  # Foreign key to Analysis
    region_id = Column(String(50), unique=True, index=True, nullable=False)
    
    # Region coordinates
    x1 = Column(Integer, nullable=False)
    y1 = Column(Integer, nullable=False)
    x2 = Column(Integer, nullable=False)
    y2 = Column(Integer, nullable=False)
    
    # Region properties
    confidence = Column(Float, nullable=False)
    area = Column(Integer, nullable=False)
    bbox_width = Column(Integer)
    bbox_height = Column(Integer)
    
    def __repr__(self):
        return f"<Result(region_id='{self.region_id}', confidence={self.confidence})>"
