from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class EventBase(BaseModel):
    start_time: datetime
    end_time: datetime
    location: str
    description: str


class EventCreate(EventBase):
    pass


class Event(EventBase):
    id: int
    users: List[int] = []


class EventUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    location: Optional[str] = None
    description: Optional[str] = None
    users: Optional[List[int]] = None
