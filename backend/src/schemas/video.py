"""Pydantic models for videoes"""
from typing import Optional
from enum import Enum
from pydantic import BaseModel

class Privacy(str, Enum):
    """Privacy settings for video"""
    PUBLIC = "public"
    UNLISTED = "unlisted"
    PRIVATE = "private"

class VideoBase(BaseModel):
    """Base Model for video"""
    title: str
    description: Optional[str] = None

class VideoCreate(VideoBase):
    """
    Create a new video
    """
    privacy: Privacy = Privacy.PUBLIC
    tags: Optional[list[str]] = None
    language: Optional[str] = None

class VideoInDb(VideoBase):
    """
    Response model for video
    """
    id: str
    signed_url: str
