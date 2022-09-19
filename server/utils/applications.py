from typing import List
from sqlalchemy.orm import Session

from database.models import applications as models
from database.schemas import applications as schemas


### CRUD ###
def create_application_cycle(db: Session, application_cycle: schemas.ApplicationCycleCreate) -> models.ApplicationCycle:
    db_application_cycle = models.ApplicationCycle(**application_cycle.dict())
    db.add(db_application_cycle)
    db.commit()
    db.refresh(db_application_cycle)
    return db_application_cycle


def get_application_cycles(db: Session, limit: int = 100) -> List[models.ApplicationCycle]:
    return db.query(models.ApplicationCycle).limit(limit).all()


def get_application_cycle_active(db: Session) -> models.ApplicationCycle:
    return db.query(models.ApplicationCycle).filter(models.ApplicationCycle.is_active == True).first()


def update_application_cycle(db: Session, application_cycle_id: int, application_cycle: schemas.ApplicationCycleUpdate) -> models.ApplicationCycle:
    db_application_cycle = db.query(models.ApplicationCycle).filter(
        models.ApplicationCycle.id == application_cycle_id).first()
    if db_application_cycle is None:
        return None
    application_cycle_data = application_cycle.dict(exclude_unset=True)
    for key, value in application_cycle_data.items():
        setattr(db_application_cycle, key, value)
    db.add(db_application_cycle)
    db.commit()
    db.refresh(db_application_cycle)
    return db_application_cycle


def delete_application_cycle(db: Session, application_cycle_id: int) -> bool:
    db_application_cycle = db.query(models.ApplicationCycle).filter(
        models.ApplicationCycle.id == application_cycle_id).first()
    if db_application_cycle is None:
        return False
    db.delete(db_application_cycle)
    db.commit()
    return True


def create_application(db: Session, user, application: schemas.Application) -> models.Application:
    application_data = application.dict()
    application_data['user_id'] = user.id
    application_data['application_cycle_id'] = get_application_cycle_active(
        db=db).id
    db_application = models.Application(**application_data)
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application


def get_applications(db: Session, application_cycle_id: int = None, team: str = None, system: str = None, user_id: int = None) -> List[models.Application]:
    query = db.query(models.Application)
    if application_cycle_id:
        query = query.filter(
            models.Application.application_cycle_id == application_cycle_id)
    if team:
        query = query.filter(models.Application.team == team)
    if system:
        query = query.filter(models.Application.systems.contains(system))
    if user_id:
        query = query.filter(models.Application.user_id == user_id)
    return query.all()


def update_application(db: Session, application_id: int, application: schemas.ApplicationUpdate) -> models.Application:
    db_application = db.query(models.Application).filter(
        models.Application.id == application_id).first()
    if db_application is None:
        return None
    application_data = application.dict(exclude_unset=True)
    for key, value in application_data.items():
        setattr(db_application, key, value)
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application


def delete_application(db: Session, application_id: int) -> bool:
    db_application = db.query(models.Application).filter(
        models.Application.id == application_id).first()
    if db_application is None:
        return False
    db.delete(db_application)
    db.commit()
    return True
