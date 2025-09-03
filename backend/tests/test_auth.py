from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient
from src.api.auth import router as auth_router
from src.models.user import User
from services.auth.auth_service import AuthService

app = FastAPI()
app.include_router(auth_router)

client = TestClient(app)

def test_register_user():
    response = client.post("/auth/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword"
    })
    assert response.status_code == 201
    assert response.json()["username"] == "testuser"

def test_login_user():
    response = client.post("/auth/login", json={
        "username": "testuser",
        "password": "testpassword"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_invalid_user():
    response = client.post("/auth/login", json={
        "username": "invaliduser",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"