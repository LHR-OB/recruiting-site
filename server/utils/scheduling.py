from sqlalchemy.orm import Session
from typing import List

from database.models import scheduling as models
from database.schemas import scheduling as schemas


### CRUD ###
def create_event(db: Session, event: schemas.EventCreate) -> models.Event:
    db_event = models.Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def get_events(db: Session, limit: int = 100) -> List[models.Event]:
    return db.query(models.Event).limit(limit).all()


def get_event(db: Session, event_id: int) -> models.Event:
    return db.query(models.Event).filter(models.Event.id == event_id).first()


def update_event(db: Session, event_id: int, event: schemas.EventUpdate) -> models.Event:
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


def join_event(db: Session, event_id: int, user) -> models.Event:
    db_event = db.query(models.Event).filter(
        models.Event.id == event_id).first()
    if db_event is None:
        return None
    db_event.users.append(user)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def delete_event(db: Session, event_id: int) -> bool:
    db_event = db.query(models.Event).filter(
        models.Event.id == event_id).first()
    if db_event is None:
        return False
    db.delete(db_event)
    db.commit()
    return True
