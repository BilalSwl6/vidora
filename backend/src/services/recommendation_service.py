from typing import List
from sqlalchemy.orm import Session
from src.models.video import Video
from src.models.recommendation import Recommendation

class RecommendationService:
    def __init__(self, db: Session):
        self.db = db

    async def get_recommendations(self, user_id: int) -> List[Video]:
        # Placeholder for recommendation logic
        # This should be replaced with actual recommendation algorithm
        recommended_videos = self.db.query(Video).filter(Video.user_id != user_id).all()
        return recommended_videos

    def add_user_preference(self, user_id: int, video_id: int):
        # Logic to add user preferences for recommendations
        preference = Recommendation(user_id=user_id, video_id=video_id)
        self.db.add(preference)
        self.db.commit()
        self.db.refresh(preference)
        return preference

    async def get_user_preferences(self, user_id: int) -> List[Video]:
        # Logic to fetch user preferences for recommendations
        preferences = self.db.query(Recommendation).filter(Recommendation.user_id == user_id).all()
        video_ids = [pref.video_id for pref in preferences]
        recommended_videos = self.db.query(Video).filter(Video.id.in_(video_ids)).all()
        return recommended_videos