from fastapi import APIRouter, HTTPException, Depends
from typing import List
from src.schemas.recommendation import RecommendationList
from src.services.recommendation_service import RecommendationService
from src.config.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()
# recommendation_service = RecommendationService()

@router.get("/recommendations/", response_model=List[RecommendationList])
async def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    recommendation_service = RecommendationService(db)
    recommendations = await recommendation_service.get_recommendations(user_id)
    if not recommendations:
        raise HTTPException(status_code=404, detail="No recommendations found")
    return recommendations

@router.post("/recommendations/", response_model=RecommendationList)
async def add_recommendation(recommendation: RecommendationList, db: Session = Depends(get_db)):
    recommendation_service = RecommendationService(db)
    # Use the correct attribute from RecommendationList, e.g. recommendation.id or add video_id to the schema
    video_id = getattr(recommendation, "video_id", None)
    if video_id is None or not isinstance(video_id, int):
        raise HTTPException(status_code=400, detail="Missing or invalid video_id in recommendation")
    user_id = getattr(recommendation, "user_id", None)
    if user_id is None or not isinstance(user_id, int):
        raise HTTPException(status_code=400, detail="Missing or invalid user_id in recommendation")
    new_recommendation = await recommendation_service.add_user_preference(
        user_id, video_id
    )
    return new_recommendation