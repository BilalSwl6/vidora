from sqlalchemy.orm import Session
from src.models.video import Video
from src.schemas.video import VideoCreate, VideoResponse
from typing import Optional

class VideoService:
    def __init__(self, db: Session):
        self.db = db

    async def create_video(self, video_data: VideoCreate) -> VideoResponse:
        new_video = Video(**video_data.dict())
        self.db.add(new_video)
        self.db.commit()
        self.db.refresh(new_video)
        return VideoResponse.model_validate(new_video)

    async def get_video(self, video_id: int) -> Optional[VideoResponse]:
        video = self.db.query(Video).filter(Video.id == video_id).first()
        if video:
            return VideoResponse.model_validate(video)
        return None

    async def get_all_videos(self) -> list[VideoResponse]:
        videos = self.db.query(Video).all()
        return [VideoResponse.model_validate(video) for video in videos]