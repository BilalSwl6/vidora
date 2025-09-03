from pydantic import BaseModel


class RecommendationBase(BaseModel):
    user_id: int
    video_id: int
    score: float

class RecommendationCreate(RecommendationBase):
    pass

class Recommendation(RecommendationBase):
    id: int

    class Config:
        from_attributes = True

class RecommendationList(BaseModel):
    recommendations: list[Recommendation]