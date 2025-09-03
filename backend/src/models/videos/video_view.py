from typing import TYPE_CHECKING
import uuid
from sqlalchemy import String, DateTime, ForeignKey, Integer, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.config.database import Base
if TYPE_CHECKING:
    from src.models.videos.video import Video
    from src.models.user import User

class VideoView(Base):
    """Represents a view of a video by a user."""
    __tablename__ = "video_views"
    __table_args__ = (UniqueConstraint("video_id", "user_id", name="uq_video_like"),)

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    video_id: Mapped[str] = mapped_column(String, ForeignKey("videos.id"), nullable=False)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False)
    watch_time: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now()) # pylint: disable=not-callable
    updated_at: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True), onupdate=func.now()) # pylint: disable=not-callable

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="video_views")
    video: Mapped["Video"] = relationship("Video", back_populates="video_views")
