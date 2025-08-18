from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic_settings import BaseSettings
import os

class DatabaseSettings(BaseSettings):
    database_url: str
    
    class Config:
        env_file = ".env"
        extra = "ignore"

# Initialize settings
db_settings = DatabaseSettings(database_url=os.getenv("DATABASE_URL", "sqlite:///./test.db"))

# Create SQLAlchemy engine
engine = create_engine(
    db_settings.database_url,
    # Connection pool settings for production
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=300
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Function to create all tables
def create_tables():
    """Create all database tables."""
    Base.metadata.create_all(bind=engine)

# Function to drop all tables (use with caution)
def drop_tables():
    """Drop all database tables."""
    Base.metadata.drop_all(bind=engine)