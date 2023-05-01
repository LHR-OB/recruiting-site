from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class TeamBase(BaseModel):
    name: str


class TeamCreate(TeamBase):
    pass


class Team(TeamBase):
    id: int
    users: List[int] = []
    systems: List[int] = []


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    interview_time_duration: Optional[int] = None


class SystemBase(BaseModel):
    name: str
    team_id: int


class SystemCreate(SystemBase):
    pass


class System(SystemBase):
    id: int


class SystemUpdate(BaseModel):
    name: Optional[str] = None
    team_id: Optional[int] = None
    interview_default_location: Optional[str] = None
