from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from src.models.user import User
from src.schemas.user import UserCreate, UserCreateOAuth, Token
from src.services.auth_utils import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    create_refresh_token,
    verify_token,
    hash_refresh_token,
    verify_refresh_token_hash
)
from src.services.google_auth import google_auth_service
from src.config.auth import auth_settings

class AuthService:
    """Authentication service handling all auth operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        return self.db.query(User).filter(User.email == email).first()
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_user_by_google_id(self, google_id: str) -> Optional[User]:
        """Get user by Google ID."""
        return self.db.query(User).filter(User.google_id == google_id).first()
    
    def create_user(self, user_data: UserCreate) -> User:
        """Create new user with email/password."""
        # Check if user exists
        if self.get_user_by_email(user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            username=user_data.username,
            full_name=user_data.full_name,
            avatar_url=user_data.avatar_url,
            hashed_password=hashed_password,
            provider="email"
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    
    def create_oauth_user(self, user_data: UserCreateOAuth) -> User:
        """Create new user from OAuth (Google)."""
        db_user = User(
            email=user_data.email,
            username=user_data.username,
            full_name=user_data.full_name,
            avatar_url=user_data.avatar_url,
            google_id=user_data.google_id,
            provider=user_data.provider,
            is_verified=user_data.is_verified
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password."""
        user = self.get_user_by_email(email)
        if not user or not user.hashed_password:
            return None
        
        if not verify_password(password, user.hashed_password):
            return None
            
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated"
            )
        
        # Update last login
        user.last_login = datetime.utcnow()
        self.db.commit()
        return user
    
    async def authenticate_google_user(self, access_token: str) -> User:
        """Authenticate user with Google access token."""
        # Verify Google token
        google_user_info = await google_auth_service.verify_google_token(access_token)
        
        if not google_user_info:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token"
            )
        
        email = google_user_info["email"]
        google_id = google_user_info["google_id"]
        
        # Check if user exists by Google ID
        user = self.get_user_by_google_id(google_id)
        
        if user:
            # Update user info from Google
            user.full_name = google_user_info.get("full_name", user.full_name)
            user.avatar_url = google_user_info.get("avatar_url", user.avatar_url)
            user.last_login = datetime.utcnow()
            user.is_verified = google_user_info.get("verified_email", user.is_verified)
            self.db.commit()
            return user
        
        # Check if user exists by email (different provider)
        existing_user = self.get_user_by_email(email)
        if existing_user:
            # Link Google account to existing user
            existing_user.google_id = google_id
            existing_user.provider = "google"  # Update primary provider
            existing_user.is_verified = True
            existing_user.last_login = datetime.utcnow()
            self.db.commit()
            return existing_user
        
        # Create new user
        user_data = UserCreateOAuth(
            email=email,
            full_name=google_user_info.get("full_name"),
            avatar_url=google_user_info.get("avatar_url"),
            google_id=google_id,
            provider="google",
            is_verified=google_user_info.get("verified_email", False)
        )
        
        return self.create_oauth_user(user_data)
    
    def create_tokens(self, user: User) -> Token:
        """Create access and refresh tokens for user."""
        # Token payload
        token_data = {"user_id": user.id, "email": user.email}
        
        # Create tokens
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        # Store hashed refresh token
        user.refresh_token_hash = hash_refresh_token(refresh_token)
        self.db.commit()
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=auth_settings.access_token_expire_minutes * 60
        )
    
    def refresh_access_token(self, refresh_token: str) -> Token:
        """Refresh access token using refresh token."""
        # Verify refresh token
        payload = verify_token(refresh_token, "refresh")
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        # Get user
        user_id = payload.get("user_id")
        user = self.get_user_by_id(user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        # Verify refresh token hash
        if not user.refresh_token_hash or not verify_refresh_token_hash(refresh_token, user.refresh_token_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        # Create new tokens
        return self.create_tokens(user)
    
    def logout_user(self, user: User):
        """Logout user by clearing refresh token."""
        user.refresh_token_hash = None
        self.db.commit()
    
    def get_current_user_from_token(self, token: str) -> User:
        """Get current user from access token."""
        payload = verify_token(token, "access")
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid access token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user_id = payload.get("user_id")
        user = self.get_user_by_id(user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return user