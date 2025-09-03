from sqlalchemy.orm import Session
from src.models.channel import Channel as ChannelModel   # ORM model
from src.schemas.channel import (
    ChannelCreate,
    ChannelUpdate,
    ChannelDetails,
    Channel as ChannelSchema,   # Pydantic schema
)
class ChannelService:
    def __init__(self, db: Session):
        self.db = db

    def create_channel(self, channel_data: ChannelCreate) -> ChannelModel:
        new_channel = ChannelModel(**channel_data.dict())
        self.db.add(new_channel)
        self.db.commit()
        self.db.refresh(new_channel)
        return new_channel

    async def get_channel(self, channel_id: int) -> ChannelModel | None:
        return self.db.query(ChannelModel).filter(ChannelModel.id == channel_id).first()

    async def get_all_channels(self, limit=10) -> list[ChannelModel]:
        return self.db.query(ChannelModel).limit(limit).all()

    async def update_channel(self, channel_id: int, channel_data: ChannelUpdate) -> ChannelModel | None:
        channel = await self.get_channel(channel_id)
        if channel:
            for key, value in channel_data.dict(exclude_unset=True).items():
                setattr(channel, key, value)
            self.db.commit()
            self.db.refresh(channel)
        return channel

    def delete_channel(self, channel_id: int) -> bool:
        channel = self.get_channel(channel_id)
        if channel:
            self.db.delete(channel)
            self.db.commit()
            return True
        return False
