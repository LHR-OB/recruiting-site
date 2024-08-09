from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class TeamBase(BaseModel):
    name: str


class TeamCreate(TeamBase):
    pass


class Team(TeamBase):
    id: str
    users: List[int] = []
    systems: List[int] = []
    interview_time_duration: int
    interview_message: str
    trial_workday_message: str
    offer_message: str
    waitlist_message = str
    rejection_message: str
    trial_workday_event_id: str


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    interview_time_duration: Optional[int] = None
    interview_message: Optional[str] = None
    trial_workday_message: Optional[str] = None
    offer_message: Optional[str] = None
    waitlist_message: Optional[str] = None
    rejection_message: Optional[str] = None
    trial_workday_event_id: Optional[str] = None


class SystemBase(BaseModel):
    name: str
    team_id: str


class SystemCreate(SystemBase):
    pass


class System(SystemBase):
    id: str


class SystemUpdate(BaseModel):
    name: Optional[str] = None
    team_id: Optional[str] = None
    interview_default_location: Optional[str] = None
