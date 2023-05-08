from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class EventBase(BaseModel):
    title: str
    start_time: datetime
    end_time: datetime
    offset: int
    location: str
    description: str


class EventCreate(EventBase):
    pass


class Event(EventBase):
    id: int
    users: List[int] = []
    interview_id: int


class EventUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    offset: Optional[int] = None
    location: Optional[str] = None
    description: Optional[str] = None
    interview_id: Optional[int] = None


class AvailabilityBase(BaseModel):
    start_time: datetime
    end_time: datetime
    offset: int


class AvailabilityCreate(AvailabilityBase):
    pass


class Availability(AvailabilityBase):
    id: int
    user_id: int


class AvailabilityUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    offset: Optional[int] = None
    user_id: Optional[int] = None
