from sqlalchemy import String, Text, ForeignKey, DateTime, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.config.database import Base
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from src.models.user import User
    from src.models.video import Video
    from src.models.recommendation import Recommendation


class Channel(Base):
    __tablename__ = "channels"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())    # pylint: disable=not-callable

    # Relationships
    owner: Mapped["User"] = relationship("User", back_populates="channels") # pylint: disable=undefined-variable
    videos: Mapped[list["Video"]] = relationship("Video", back_populates="channel") # pylint: disable=undefined-variable
    recommendations: Mapped[list["Recommendation"]] = relationship("Recommendation", back_populates="channel")  # pylint: disable=undefined-variable
