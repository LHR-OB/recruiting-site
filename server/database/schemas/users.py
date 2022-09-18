from pydantic import BaseModel


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
    team: str
    systems: str


class User(UserBase):
    id: int

    class Config:
        orm_mode = True
