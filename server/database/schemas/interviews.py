from pydantic import BaseModel
from typing import Optional, List


class InterviewBase(BaseModel):
    pass


class InterviewCreate(InterviewBase):
    pass


class Interview(InterviewBase):
    id: str
    notes: List[int] = []


class InterviewUpdate(BaseModel):
    notes: Optional[List[int]] = None


class InterviewNoteBase(BaseModel):
    note: str
    interview_id: str


class InterviewNoteCreate(InterviewNoteBase):
    pass


class InterviewNote(InterviewNoteBase):
    id: str


class InterviewNoteUpdate(BaseModel):
    note: Optional[str] = None
    interview_id: Optional[str] = None
