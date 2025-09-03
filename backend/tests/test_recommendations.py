from fastapi.testclient import TestClient
from src.main import app
from src.models.recommendation import Recommendation
from src.schemas.recommendation import RecommendationCreate
from sqlalchemy.orm import Session
from src.config.database import get_db

client = TestClient(app)

def test_create_recommendation(db: Session):
    recommendation_data = {
        "user_id": 1,
        "video_id": 1,
        "preference_score": 0.9
    }
    response = client.post("/recommendations/", json=recommendation_data)
    assert response.status_code == 201
    assert response.json()["user_id"] == recommendation_data["user_id"]
    assert response.json()["video_id"] == recommendation_data["video_id"]

def test_get_recommendations(db: Session):
    response = client.get("/recommendations/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_recommendation_by_id(db: Session):
    response = client.get("/recommendations/1")
    assert response.status_code == 200
    assert "user_id" in response.json()
    assert "video_id" in response.json()

def test_get_recommendation_not_found(db: Session):
    response = client.get("/recommendations/999")
    assert response.status_code == 404