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
    interview_id: Optional[str] = None
    trial_workday_team_id: Optional[str] = None
    is_global: bool


class EventCreate(EventBase):
    pass


class Event(EventBase):
    id: str
    users: List[int] = []


class EventUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    offset: Optional[int] = None
    location: Optional[str] = None
    description: Optional[str] = None
    interview_id: Optional[str] = None
    trial_workday_team_id: Optional[str] = None
    is_global: Optional[bool] = None


class AvailabilityBase(BaseModel):
    start_time: datetime
    end_time: datetime
    offset: int


class AvailabilityCreate(AvailabilityBase):
    pass


class Availability(AvailabilityBase):
    id: str
    user_id: str


class AvailabilityUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    offset: Optional[int] = None
    user_id: Optional[str] = None
