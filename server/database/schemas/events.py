from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class EventBase(BaseModel):
    title: str
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


class AvailabilityBase(BaseModel):
    start_time: datetime
    end_time: datetime


class AvailabilityCreate(AvailabilityBase):
    pass


class Availability(AvailabilityBase):
    id: int
    user_id: int


class AvailabilityUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    user_id: Optional[int] = None
