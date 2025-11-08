"""
User Model
Author: Cavin Otieno
"""

from sqlalchemy import Column, String, DateTime, Text
from app.models.base import BaseModel


class User(BaseModel):
    """User model for system access"""
    __tablename__ = "users"
    
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(100))
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(String(10), default="true")
    role = Column(String(20), default="user")  # user, admin
    bio = Column(Text)
    profile_image = Column(String(255))
    
    def __repr__(self):
        return f"<User(username='{self.username}', email='{self.email}')>"
