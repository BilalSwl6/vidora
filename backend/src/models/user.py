from typing import TYPE_CHECKING, Any
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, DateTime, Integer, func
from src.config.database import Base

if TYPE_CHECKING:
    from src.models.channel import Channel
    from src.models.videos.video import Video
    from src.models.videos.video_view import VideoView
    from src.models.videos.video_like import VideoLike
    from src.models.videos.video_comment import VideoComment
    from src.models.recommendation import Recommendation


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    full_name: Mapped[str | None] = mapped_column(String, nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String, nullable=True)

    # Authentication fields
    hashed_password: Mapped[str] = mapped_column(String, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    # OAuth fields
    google_id: Mapped[str | None] = mapped_column(String, unique=True, nullable=True, index=True)
    provider: Mapped[str] = mapped_column(String, default="email")  # "email", "google"

    # Refresh token (hashed)
    refresh_token_hash: Mapped[str | None] = mapped_column(String, nullable=True)

    # Timestamps
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )  # pylint: disable=not-callable
    updated_at: Mapped[DateTime | None] = mapped_column(
        DateTime(timezone=True), onupdate=func.now()
    )  # pylint: disable=not-callable
    last_login: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    channels: Mapped[list["Channel"]] = relationship("Channel", back_populates="owner")
    recommendations: Mapped[list["Recommendation"]] = relationship("Recommendation", back_populates="user")
    videos: Mapped[list["Video"]] = relationship("Video", back_populates="uploader", lazy="selectin")
    video_views: Mapped[list["VideoView"]] = relationship("VideoView", back_populates="user", lazy="selectin")

    # Use Any for dynamic relationships (not list)
    video_likes: Mapped[Any] = relationship("VideoLike", back_populates="user", lazy="dynamic")
    video_comments: Mapped[Any] = relationship("VideoComment", back_populates="user", lazy="dynamic")
