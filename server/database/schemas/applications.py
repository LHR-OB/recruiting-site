from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel


class ApplicationCycleBase(BaseModel):
    year: int
    semester: str
    application_open_date: datetime
    application_close_date: datetime
    interview_start_date: datetime
    interview_end_date: datetime
    is_active: bool


class ApplicationCycleCreate(ApplicationCycleBase):
    pass


class ApplicationCycle(ApplicationCycleBase):
    id: int
    stage: str


class ApplicationCycleUpdate(BaseModel):
    year: Optional[int] = None
    semester: Optional[str] = None
    is_active: Optional[bool] = None
    stage: Optional[str] = None


class ApplicationBase(BaseModel):
    team_id: int
    systems: List[int]
    subsystems: str
    phone_number: str
    major: str
    year_entering: str
    short_answer: str
    resume_link: str


class ApplicationCreate(ApplicationBase):
    status: Optional[str] = None


class Application(ApplicationBase):
    id: int
    status: str
    stage_decision: str


class ApplicationUpdate(BaseModel):
    phone_number: Optional[str] = None
    major: Optional[str] = None
    year_entering: Optional[str] = None
    team_id: Optional[int] = None
    systems: Optional[List[int]] = None
    subsystems: Optional[str] = None
    short_answer: Optional[str] = None
    resume_link: Optional[str] = None
    status: Optional[str] = None
    stage_decision: Optional[str] = None
