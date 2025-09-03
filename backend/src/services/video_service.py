import uuid, datetime, os
from sqlalchemy.orm import Session
from google.cloud import storage
from fastapi import UploadFile, File
from dotenv import load_dotenv
from models.videos.video import Video
from src.schemas.video import VideoCreate, VideoInDb

load_dotenv()

BUCKET_NAME = os.getenv("GCS_BUCKET")

class VideoService:
    def __init__(self, db: Session):
        self.db = db

    async def get_signed_url(self, blob_name: str, expiration_minutes: int = 60) -> str:
        """Generate a signed URL for uploading a video."""
        client = storage.Client()
        bucket = client.bucket(BUCKET_NAME)
        blob = bucket.blob(blob_name)
        signed_url = blob.generate_signed_url(
            version="v4",
            method="PUT",
            expiration=datetime.timedelta(minutes=expiration_minutes),
            content_type="video/mp4"
        )
        return signed_url

    async def add_new_video(self, video_data: VideoCreate) -> VideoInDb:
        id = str(uuid.uuid4())
        video = Video(
            id=id,
            **video_data.model_dump()
        )
        self.db.add(video)
        self.db.commit()
        self.db.refresh(video)
        signed_url = await self.get_signed_url(f"videos/{video.id}.mp4")
        video.signed_url = signed_url
        self.db.commit()
        self.db.refresh(video)
        return VideoInDb.model_validate(video)
