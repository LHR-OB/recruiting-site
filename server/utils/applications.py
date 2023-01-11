from typing import List
from sqlalchemy.orm import Session

from database.models import applications as models
from database.models import teams as team_models
from database.schemas import applications as schemas


### CRUD ###
def create_application_cycle(db: Session, application_cycle: schemas.ApplicationCycleCreate) -> models.ApplicationCycle:
    db_application_cycle = models.ApplicationCycle(**application_cycle.dict(), stage="APPLICATION")
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


def advance_application_cycle(db: Session, application_cycle_id: int) -> models.ApplicationCycle:
    db_application_cycle = db.query(models.ApplicationCycle).filter(
        models.ApplicationCycle.id == application_cycle_id).first()
    if db_application_cycle is None:
        return None
    if db_application_cycle.stage == 'APPLICATION':
        db_application_cycle.stage = 'INTERVIEW'
    elif db_application_cycle.stage == 'INTERVIEW':
        db_application_cycle.stage = 'TRIAL'
    elif db_application_cycle.stage == 'TRIAL':
        db_application_cycle.stage = 'OFFER'
    elif db_application_cycle.stage == 'OFFER':
        db_application_cycle.stage = 'COMPLETE'
    db.add(db_application_cycle)
    db.commit()
    db.refresh(db_application_cycle)
    # Update all applications to the new stage
    applications = get_applications(db=db, application_cycle_id=application_cycle_id)
    for application in applications:
        if application.stage_decision == 'ACCEPT':
            # Advance the application status
            if application.status == 'SUBMITTED':
                application.status = 'INTERVIEW'
            elif application.status == 'INTERVIEW':
                application.status = 'TRIAL'
            elif application.status == 'TRIAL':
                application.status = 'OFFER'
            application.stage_decision = 'NEUTRAL'
        else:
            # Reject the application
            application.status = 'REJECTED'
            application.stage_decision = 'NEUTRAL'
        db.add(application)
    db.commit()
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
    application_cycle = get_application_cycle_active(db=db)
    team = db.query(team_models.Team).filter(team_models.Team.id == application.team_id).first()
    del application_data['team_id']
    del application_data['systems']
    if 'status' not in application_data or application_data['status'] is None:
        application_data['status'] = 'DRAFT'
    db_application = models.Application(**application_data, user=user, application_cycle=application_cycle, team=team)
    for system_id in application.systems:
        db_application.systems.append(
            db.query(team_models.System).filter(team_models.System.id == system_id).first())
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
    applications = query.all()
    # This looks like it does nothing, but it makes sure the object has all the values
    for application in applications:
        application.team
        application.user
        application.systems
    return query.all()


def get_application(db: Session, application_id: int) -> models.Application:
    db_application = db.query(models.Application).filter(
        models.Application.id == application_id).first()
    if db_application is None:
        return None
    # This looks like it does nothing, but it makes sure the object has all the values
    db_application.team
    db_application.user
    db_application.systems
    return db_application


def update_application(db: Session, application_id: int, application: schemas.ApplicationUpdate) -> models.Application:
    db_application = db.query(models.Application).filter(
        models.Application.id == application_id).first()
    if db_application is None:
        return None
    application_data = application.dict(exclude_unset=True)
    if 'team_id' in application_data:
        team = db.query(team_models.Team).filter(team_models.Team.id == application.team_id).first()
        db_application.team = team
        del application_data['team_id']
    if 'systems' in application_data:
        db_application.systems = []
        for system_id in application.systems:
            db_application.systems.append(
                db.query(team_models.System).filter(team_models.System.id == system_id).first())
        del application_data['systems']
    for key, value in application_data.items():
        setattr(db_application, key, value)
    
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    # This looks like it does nothing, but it makes sure the object has all the values
    db_application.team
    db_application.user
    db_application.systems
    return db_application


def delete_application(db: Session, application_id: int) -> bool:
    db_application = db.query(models.Application).filter(
        models.Application.id == application_id).first()
    if db_application is None:
        return False
    db.delete(db_application)
    db.commit()
    return True
