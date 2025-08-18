from pydantic import BaseModel
from typing import Optional

class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    url: str

class VideoCreate(VideoBase):
    pass

class VideoOut(VideoBase):
    id: int
    user_id: int

class VideoResponse(VideoBase):
    id: int
    user_id: int

class Video(VideoBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True