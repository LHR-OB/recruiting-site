from typing import Optional
from pydantic import BaseModel


class ApplicationCycleBase(BaseModel):
    year: int
    semester: str
    is_active: bool


class ApplicationCycleCreate(ApplicationCycleBase):
    pass


class ApplicationCycle(ApplicationCycleBase):
    id: int


class ApplicationCycleUpdate(BaseModel):
    year: Optional[int] = None
    semester: Optional[str] = None
    is_active: Optional[bool] = None


class ApplicationBase(BaseModel):
    phone_number: str
    major: str
    year_entering: str
    team: str
    systems: str
    subsystems: str
    short_answer: str
    resume_link: str


class ApplicationCreate(ApplicationBase):
    pass


class Application(ApplicationBase):
    id: int


class ApplicationUpdate(BaseModel):
    phone_number: Optional[str] = None
    major: Optional[str] = None
    year_entering: Optional[str] = None
    team: Optional[str] = None
    systems: Optional[str] = None
    subsystems: Optional[str] = None
    short_answer: Optional[str] = None
    resume_link: Optional[str] = None
