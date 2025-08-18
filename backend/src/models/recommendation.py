from sqlalchemy import String, DateTime, Float, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.config.database import Base
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from src.models.user import User
    from src.models.video import Video
    from src.models.channel import Channel

class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    video_id: Mapped[int] = mapped_column(ForeignKey("videos.id"), nullable=False)
    channel_id: Mapped[int] = mapped_column(ForeignKey("channels.id"), nullable=False)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    reason: Mapped[str | None] = mapped_column(String, nullable=True)  # e.g., "similar_content", "trending"
    details: Mapped[str | None] = mapped_column(String, nullable=True)  # could store JSON string
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())    # pylint: disable=not-callable

    # Optional relationships
    user: Mapped["User"] = relationship("User", back_populates="recommendations")
    video: Mapped["Video"] = relationship("Video", back_populates="recommendations")
    channel: Mapped["Channel"] = relationship("Channel", back_populates="recommendations")
