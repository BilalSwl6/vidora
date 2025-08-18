# from fastapi import APIRouter, HTTPException, Depends
# from typing import List
# from sqlalchemy.orm import Session
# from src.schemas.user import UserPublic, UserCreate
# from src.services.auth_service import AuthService
# from src.config.database import get_db

# router = APIRouter()

# @router.post("/", response_model=UserPublic)
# async def create_user(user: UserCreate, db: Session = Depends(get_db)):
#     """Create a new user."""
#     auth_service = AuthService(db)
#     existing_user = auth_service.get_user_by_email(user.email)
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
#     new_user = auth_service.register_user(user.username, user.email, user.password)
#     return UserPublic(id=int(new_user.id), username=str(new_user.username), email=str(new_user.email))

# @router.get("/{user_id}", response_model=UserPublic)
# async def get_user(user_id: int, db: Session = Depends(get_db)):
#     """Get a user by their ID."""
#     auth_service = AuthService(db)
#     user = auth_service.get_user_by_id(user_id)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return UserPublic(id=int(user.id), username=str(user.username), email=str(user.email))

# @router.get("/", response_model=List[UserPublic])
# async def list_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
#     """List all users with pagination."""
#     auth_service = AuthService(db)
#     users = auth_service.list_users(skip=skip, limit=limit)
#     return [UserPublic(id=int(user.id), username=str(user.username), email=str(user.email)) for user in users]
