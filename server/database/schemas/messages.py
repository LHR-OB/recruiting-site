from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MessageBase(BaseModel):
    title: str
    message: str
    timestamp: datetime
    user_id: int


class MessageCreate(MessageBase):
    pass


class Message(MessageBase):
    id: int
    is_read: bool


class MessageUpdate(BaseModel):
    title: Optional[str] = None
    message: Optional[str] = None
    timestamp: Optional[datetime] = None
    is_read: Optional[bool] = None
    user_id: Optional[int] = None
