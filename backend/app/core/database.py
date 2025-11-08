"""
Database Configuration and Initialization
Author: Cavin Otieno
"""

import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy import text
from app.core.config import settings
from app.models.base import Base
from app.models.user import User
from app.models.analysis import Analysis
from app.models.result import Result
from supabase import create_client, Client

logger = logging.getLogger(__name__)

# Supabase client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

# SQLAlchemy async engine
engine = create_async_engine(
    "sqlite+aiosqlite:///./scientific_image_forgery.db",
    echo=settings.DEBUG,
    future=True,
    connect_args={"check_same_thread": False}
)

# Async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def init_db():
    """Initialize database tables"""
    try:
        # Create tables
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        
        # Verify Supabase connection
        supabase_test = supabase.table('users').select('*').limit(1).execute()
        logger.info("✅ Database and Supabase connection established")
        
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        raise


async def get_db() -> AsyncSession:
    """Get database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def close_db():
    """Close database connections"""
    await engine.dispose()
    logger.info("Database connections closed")


# Supabase helper functions
async def supabase_insert(table: str, data: dict):
    """Insert data into Supabase table"""
    try:
        result = supabase.table(table).insert(data).execute()
        return result.data
    except Exception as e:
        logger.error(f"Supabase insert error: {e}")
        raise


async def supabase_select(table: str, columns: str = "*", filters: dict = None):
    """Select data from Supabase table"""
    try:
        query = supabase.table(table).select(columns)
        
        if filters:
            for key, value in filters.items():
                query = query.eq(key, value)
        
        result = query.execute()
        return result.data
    except Exception as e:
        logger.error(f"Supabase select error: {e}")
        raise


async def supabase_update(table: str, data: dict, filters: dict):
    """Update data in Supabase table"""
    try:
        query = supabase.table(table).update(data)
        
        for key, value in filters.items():
            query = query.eq(key, value)
        
        result = query.execute()
        return result.data
    except Exception as e:
        logger.error(f"Supabase update error: {e}")
        raise


async def supabase_delete(table: str, filters: dict):
    """Delete data from Supabase table"""
    try:
        query = supabase.table(table).delete()
        
        for key, value in filters.items():
            query = query.eq(key, value)
        
        result = query.execute()
        return result.data
    except Exception as e:
        logger.error(f"Supabase delete error: {e}")
        raise


# Initialize database on startup
if __name__ == "__main__":
    asyncio.run(init_db())
