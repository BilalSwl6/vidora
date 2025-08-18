from fastapi import APIRouter, HTTPException, Depends
from typing import List
from src.config.database import get_db
from sqlalchemy.orm import Session
from src.schemas.video import VideoCreate, VideoOut
from src.services.video_service import VideoService


router = APIRouter()
# video_service = VideoService(db: Session = Depends(get_db(db= )))

@router.post("/videos/", response_model=VideoOut)
async def add_video(video: VideoCreate, db: Session = Depends(get_db)):
    try:
        video_service = VideoService(db)
        return await video_service.create_video(video)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/videos/", response_model=List[VideoOut])
async def get_videos(db: Session = Depends(get_db)):
    try:
        video_service = VideoService(db)
        return await video_service.get_all_videos()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/videos/{video_id}", response_model=VideoOut)
async def get_video(video_id: int, db: Session = Depends(get_db)):
    try:
        video_service = VideoService(db)
        video = await video_service.get_video(video_id)
        if video is None:
            raise HTTPException(status_code=404, detail="Video not found")
        return video
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))