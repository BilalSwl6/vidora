""" Channel API """
from sqlalchemy.orm import Session
from fastapi import APIRouter,HTTPException, Depends
from src.schemas.channel import ChannelCreate, ChannelDetails, Channel
from src.services.channel_service import ChannelService
from src.config.database import get_db

router = APIRouter()

@router.post("/channels/", response_model=Channel)
async def create_channel(channel: ChannelCreate, db: Session = Depends(get_db)):
    """Create a new channel."""
    channel_service = ChannelService(db)
    return channel_service.create_channel(channel)

@router.get("/channels/", response_model=list[ChannelDetails])
async def get_channels(db: Session = Depends(get_db)):
    """Get all channels."""
    channel_service = ChannelService(db)
    return await channel_service.get_all_channels()

@router.get("/channels/{channel_id}", response_model=ChannelDetails)
async def get_channel(channel_id: int, db: Session = Depends(get_db)):
    """Get a channel by ID."""
    channel_service = ChannelService(db)
    channel = await channel_service.get_channel(channel_id)
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    return channel
