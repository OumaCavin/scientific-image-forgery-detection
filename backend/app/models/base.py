"""
Database Models
Author: Cavin Otieno
"""

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.sql import func
import uuid

Base = declarative_base()


class BaseModel(Base):
    """Base model class with common fields"""
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
