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
    id: str
    stage: str


class ApplicationCycleUpdate(BaseModel):
    year: Optional[int] = None
    semester: Optional[str] = None
    application_open_date: Optional[datetime] = None
    application_close_date: Optional[datetime] = None
    interview_start_date: Optional[datetime] = None
    interview_end_date: Optional[datetime] = None
    is_active: Optional[bool] = None
    stage: Optional[str] = None


class ApplicationBase(BaseModel):
    team_id: str
    system_id: str
    phone_number: str
    major: str
    year_entering: str
    short_answer1: str
    short_answer2: str
    short_answer3: str
    short_answer4: str
    resume_link: str
    portfolio_link: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    status: Optional[str] = None


class Application(ApplicationBase):
    id: str
    status: str
    stage_decision: str


class ApplicationUpdate(BaseModel):
    phone_number: Optional[str] = None
    major: Optional[str] = None
    year_entering: Optional[str] = None
    team_id: Optional[str] = None
    system_id: Optional[str] = None
    short_answer1: Optional[str] = None
    short_answer2: Optional[str] = None
    short_answer3: Optional[str] = None
    short_answer4: Optional[str] = None
    resume_link: Optional[str] = None
    portfolio_link: Optional[str] = None
    status: Optional[str] = None
    stage_decision: Optional[str] = None
    interview_id: Optional[str] = None
