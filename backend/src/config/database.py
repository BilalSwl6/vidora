from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from pydantic_settings import BaseSettings
import os


class DatabaseSettings(BaseSettings):
    database_url: str
    
    class Config:
        env_file = ".env"
        extra = "ignore"


# -------------------
# SETTINGS
# -------------------
db_settings = DatabaseSettings(database_url=os.getenv("DATABASE_URL", "sqlite:///./test.db"))


# -------------------
# SYNC DATABASE
# -------------------
if db_settings.database_url.startswith("sqlite"):
    engine = create_engine(
        db_settings.database_url,
        connect_args={"check_same_thread": False}
    )
else:  # PostgreSQL or others
    engine = create_engine(
        db_settings.database_url,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        pool_recycle=300
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# -------------------
# ASYNC DATABASE
# -------------------
if db_settings.database_url.startswith("postgresql://"):
    async_url = db_settings.database_url.replace("postgresql://", "postgresql+asyncpg://")
elif db_settings.database_url.startswith("sqlite:///"):
    async_url = db_settings.database_url.replace("sqlite:///", "sqlite+aiosqlite:///")
else:
    async_url = db_settings.database_url

async_engine = create_async_engine(
    async_url,
    echo=True,
    pool_pre_ping=True
)


# ASYNC
AsyncSessionLocal = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)

# -------------------
# BASE MODEL
# -------------------
Base = declarative_base()


# -------------------
# DEPENDENCIES
# -------------------
def get_db():
    """Sync dependency (normal SQLAlchemy)."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_async_db():
    """Async dependency (FastAPI async routes)."""
    async with AsyncSessionLocal() as session:
        yield session


# -------------------
# TABLE HELPERS
# -------------------
def create_tables():
    Base.metadata.create_all(bind=engine)

def drop_tables():
    Base.metadata.drop_all(bind=engine)
