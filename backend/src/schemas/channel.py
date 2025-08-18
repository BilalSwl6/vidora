from pydantic import BaseModel

class ChannelBase(BaseModel):
    id: str
    name: str

class ChannelCreate(ChannelBase):
    pass

class ChannelUpdate(ChannelBase):
    pass

class Channel(ChannelBase):
    logo: str
    description: str
    links: list[str]
    location: str
    language: str


    class Config:
        from_attributes = True

class ChannelList(BaseModel):
    channels: list[Channel]

class ChannelDetails(ChannelBase):
    description: str
    subscribers_count: int
    videos_count: int
    created_at: str
    links: list[str]

    class Config:
        from_attributes = True