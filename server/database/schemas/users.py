from pydantic import BaseModel
from typing import Optional


class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    type: str


class UserCreate(UserBase):
    password: str


class ApplicantCreate(UserCreate):
    pass


class MemberCreate(UserCreate):
    team_id: str


class MemberUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    interview_location: Optional[str] = None
    type: Optional[str] = None
    team_id: Optional[str] = None


class User(UserBase):
    id: str

    class Config:
        orm_mode = True
