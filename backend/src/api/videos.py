"""Manage all routes for Videos"""
from fastapi import APIRouter, HTTPException, Depends
from src.schemas.video import VideoCreate, VideoOut
from src.services.dependencies import get_current_user
from src.services.video_service import VideoService

router = APIRouter(prefix="/video", tags=["videos"])

@router.post("/add", response_model=VideoOut)
async def add_video(video: VideoCreate, current_user = Depends(get_current_user)):
    """Add new video"""
    try:
        video_service = VideoService()
        return await video_service.create_video(video, current_user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# @router.get("/videos/", response_model=List[VideoOut])
# async def get_videos(db: Session = Depends(get_db)):
#     try:
#         video_service = VideoService(db)
#         return await video_service.get_all_videos()
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))

# @router.get("/videos/{video_id}", response_model=VideoOut)
# async def get_video(video_id: int, db: Session = Depends(get_db)):
#     try:
#         video_service = VideoService(db)
#         video = await video_service.get_video(video_id)
#         if video is None:
#             raise HTTPException(status_code=404, detail="Video not found")
#         return video
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e)