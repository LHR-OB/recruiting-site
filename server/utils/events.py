from sqlalchemy.orm import Session
from typing import List

from database.models import events as models
from database.models.users import User
from database.models.teams import Team
from database.schemas import events as schemas


def events_conflict(event1: models.Event, event2: models.Event) -> bool:
    return (event1.start_time < event2.end_time and event1.end_time > event2.start_time) \
        or (event2.start_time < event1.end_time and event2.end_time > event1.start_time)


### CRUD ###
def create_event(db: Session, event: schemas.EventCreate) -> models.Event:
    if event.trial_workday_team_id is not None:
        db_team = db.query(Team).filter(Team.id == event.trial_workday_team_id).first()
        if db_team is None:
            return None
        if db_team.trial_workday_event is not None:
            return None
    db_event = models.Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def get_events(db: Session, limit: int = 100) -> List[models.Event]:
    return db.query(models.Event).limit(limit).all()


def get_event(db: Session, event_id: str) -> models.Event:
    return db.query(models.Event).filter(models.Event.id == event_id).first()


def get_events_by_user(db: Session, user_id: str) -> List[models.Event]:
    user_events = db.query(User).filter(User.id == user_id).first().events
    # Add global events
    global_events = db.query(models.Event).filter(models.Event.is_global == True).all()
    return user_events + global_events


def update_event(db: Session, event_id: str, event: schemas.EventUpdate) -> models.Event:
    db_event = db.query(models.Event).filter(
        models.Event.id == event_id).first()
    if db_event is None:
        return None
    event_data = event.dict(exclude_unset=True)
    for key, value in event_data.items():
        setattr(db_event, key, value)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def join_event(db: Session, event_id: str, user_id: str) -> models.Event:
    db_event = db.query(models.Event).filter(
        models.Event.id == event_id).first()
    if db_event is None:
        return None
    db_user = db.query(User).filter(User.id == user_id).first()
    user_events = db_user.events
    for user_event in user_events:
        if events_conflict(user_event, db_event):
            return False
    db_event.users.append(db_user)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def leave_event(db: Session, event_id: str, user_id: str) -> models.Event:
    db_event = db.query(models.Event).filter(
        models.Event.id == event_id).first()
    if db_event is None:
        return None
    db_user = db.query(User).filter(User.id == user_id).first()
    user_events = db_user.events
    for user_event in user_events:
        if events_conflict(user_event, db_event):
            return False
    db_event.users.remove(db_user)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def delete_event(db: Session, event_id: str) -> bool:
    db_event = db.query(models.Event).filter(
        models.Event.id == event_id).first()
    if db_event is None:
        return False
    db.delete(db_event)
    db.commit()
    return True
