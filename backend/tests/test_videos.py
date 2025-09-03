from fastapi import FastAPI
from fastapi.testclient import TestClient
from src.main import app
from models.videos.video import Video
from src.schemas.video import VideoCreate
from sqlalchemy.orm import Session
from src.config.database import get_db

client = TestClient(app)

def test_create_video():
    video_data = {
        "title": "Test Video",
        "description": "This is a test video.",
        "url": "http://testvideo.com",
        "user_id": 1
    }
    response = client.post("/videos/", json=video_data)
    assert response.status_code == 201
    assert response.json()["title"] == video_data["title"]

def test_get_video():
    response = client.get("/videos/1")
    assert response.status_code == 200
    assert "title" in response.json()

def test_get_all_videos():
    response = client.get("/videos/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_video():
    video_data = {
        "title": "Updated Test Video",
        "description": "This is an updated test video.",
        "url": "http://updatedtestvideo.com",
        "user_id": 1
    }
    response = client.put("/videos/1", json=video_data)
    assert response.status_code == 200
    assert response.json()["title"] == video_data["title"]

def test_delete_video():
    response = client.delete("/videos/1")
    assert response.status_code == 204
    response = client.get("/videos/1")
    assert response.status_code == 404