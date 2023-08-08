from sqlalchemy.orm import Session
from typing import List

from database.models import interviews as models
from database.models.events import Event
from database.models.users import User
from database.schemas import interviews as schemas


### CRUD ###
def create_interview(db: Session, interview: schemas.InterviewCreate) -> models.Interview:
    db_interview = models.Interview(**interview.dict())
    db.add(db_interview)
    db.commit()
    db.refresh(db_interview)
    return db_interview


def get_interviews(db: Session, limit: int = 100) -> List[models.Interview]:
    interviews = db.query(models.Interview).limit(limit).all()
    for interview in interviews:
        interview.event
    return interviews


def get_interviews_by_user(db: Session, user_id: str) -> List[models.Interview]:
    interviews = db.query(models.Interview).join(Event).filter(Event.users.any(User.id == user_id)).all()
    for interview in interviews:
        interview.event
        interview.event.users
        interview.notes
        interview.application
    return interviews


def get_interview(db: Session, interview_id: str) -> models.Interview:
    interview = db.query(models.Interview).filter(models.Interview.id == interview_id).first()
    if interview is not None:
        interview.event
        interview.notes
        interview.application
    return interview


def update_interview(db: Session, interview_id: str, interview: schemas.InterviewUpdate) -> models.Interview:
    db_interview = db.query(models.Interview).filter(
        models.Interview.id == interview_id).first()
    if db_interview is None:
        return None
    interview_data = interview.dict(exclude_unset=True)
    for key, value in interview_data.items():
        setattr(db_interview, key, value)
    db.add(db_interview)
    db.commit()
    db.refresh(db_interview)
    return db_interview


def delete_interview(db: Session, interview_id: str) -> models.Interview:
    db_interview = db.query(models.Interview).filter(
        models.Interview.id == interview_id).first()
    if db_interview is None:
        return None
    db.delete(db_interview)
    db.commit()
    return db_interview


def create_interview_note(db: Session, interview_note: schemas.InterviewNoteCreate) -> models.InterviewNote:
    db_interview_note = models.InterviewNote(**interview_note.dict())
    db.add(db_interview_note)
    db.commit()
    db.refresh(db_interview_note)
    return db_interview_note


def get_interview_notes(db: Session, interview_id: str = None, limit: int = 100) -> List[models.InterviewNote]:
    query = db.query(models.InterviewNote)
    if interview_id is not None:
        query = query.filter(models.InterviewNote.interview_id == interview_id)
    return query.limit(limit).all()


def get_interview_note(db: Session, interview_note_id: str) -> models.InterviewNote:
    return db.query(models.InterviewNote).filter(models.InterviewNote.id == interview_note_id).first()


def update_interview_note(db: Session, interview_note_id: str, interview_note: schemas.InterviewNoteUpdate) -> models.InterviewNote:
    db_interview_note = db.query(models.InterviewNote).filter(
        models.InterviewNote.id == interview_note_id).first()
    if db_interview_note is None:
        return None
    interview_note_data = interview_note.dict(exclude_unset=True)
    for key, value in interview_note_data.items():
        setattr(db_interview_note, key, value)
    db.add(db_interview_note)
    db.commit()
    db.refresh(db_interview_note)
    return db_interview_note


def delete_interview_note(db: Session, interview_note_id: str) -> models.InterviewNote:
    db_interview_note = db.query(models.InterviewNote).filter(
        models.InterviewNote.id == interview_note_id).first()
    if db_interview_note is None:
        return None
    db.delete(db_interview_note)
    db.commit()
    return db_interview_note
