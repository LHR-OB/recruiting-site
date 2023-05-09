from sqlalchemy.orm import Session
from typing import List

from database.models import availabilities as models
from database.models.users import User
from database.models.teams import System
from database.schemas import availabilities as schemas


### CRUD ###
def create_availability(db: Session, availability: schemas.AvailabilityCreate, user: User) -> models.Availability:
    db_availability = models.Availability(**availability.dict())
    db_availability.user = user
    db.add(db_availability)
    db.commit()
    db.refresh(db_availability)
    return db_availability


def get_availabilities(db: Session, limit: int = 100) -> List[models.Availability]:
    availabilities = db.query(models.Availability).limit(limit).all()
    for availability in availabilities:
        availability.user
    return availabilities


def get_availability(db: Session, availability_id: int) -> models.Availability:
    availability = db.query(models.Availability).filter(models.Availability.id == availability_id).first()
    if availability:
        availability.user
    return availability


def get_availabilities_by_user(db: Session, user_id: int) -> List[models.Availability]:
    print("HERE UTILS")
    availabilities = db.query(User).filter(User.id == user_id).first().availabilities
    for availability in availabilities:
        availability.user
    return availabilities


def get_availabilities_by_system(db: Session, system_id: int) -> List[models.Availability]:
    interviewers = db.query(User).filter(User.systems.contains(
        db.query(System).filter(System.id == system_id).first()
    )).all()
    availabilities = [availability for interviewer in interviewers for availability in interviewer.availabilities]
    for availability in availabilities:
        availability.user
    return availabilities


def update_availability(db: Session, availability_id: int, availability: schemas.AvailabilityUpdate) -> models.Availability:
    db_availability = db.query(models.Availability).filter(
        models.Availability.id == availability_id).first()
    if db_availability is None:
        return None
    availability_data = availability.dict(exclude_unset=True)
    for key, value in availability_data.items():
        setattr(db_availability, key, value)
    db.add(db_availability)
    db.commit()
    db.refresh(db_availability)
    return db_availability


def delete_availability(db: Session, availability_id: int) -> bool:
    db_availability = db.query(models.Availability).filter(
        models.Availability.id == availability_id).first()
    if db_availability is None:
        return False
    db.delete(db_availability)
    db.commit()
    return True
