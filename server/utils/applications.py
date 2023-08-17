from typing import List
from sqlalchemy.orm import Session
import datetime

from database.models import applications as models
from database.models import teams as team_models
from database.schemas import applications as schemas
from database.schemas import messages as message_schemas
from utils.messages import send_message


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


def update_application_cycle(db: Session, application_cycle_id: str, application_cycle: schemas.ApplicationCycleUpdate) -> models.ApplicationCycle:
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


def advance_application_cycle(db: Session, application_cycle_id: str) -> models.ApplicationCycle:
    db_application_cycle = db.query(models.ApplicationCycle).filter(
        models.ApplicationCycle.id == application_cycle_id).first()
    if db_application_cycle is None:
        return None
    
    # Update all applications to the new stage
    applications = get_applications(db=db, application_cycle_id=application_cycle_id)
    for application in applications:
        advance_application(db=db, application=application)

    # Advance the application cycle stage
    if db_application_cycle.stage == 'APPLICATION':
        db_application_cycle.stage = 'REVIEW'
    elif db_application_cycle.stage == 'REVIEW':
        db_application_cycle.stage = 'INTERVIEW'
    elif db_application_cycle.stage == 'INTERVIEW':
        db_application_cycle.stage = 'TRIAL'
    elif db_application_cycle.stage == 'TRIAL':
        db_application_cycle.stage = 'OFFER'
    elif db_application_cycle.stage == 'OFFER':
        db_application_cycle.stage = 'COMPLETE'
        db_application_cycle.is_active = False
    
    # If the application cycle now COMPLETE, send rejection messages
    if db_application_cycle.stage == 'COMPLETE':
        applications = get_applications(db=db, application_cycle_id=application_cycle_id)
        for application in applications:
            if "REJECTED" in application.status:
                # Send a message to the user
                message = message_schemas.MessageCreate(
                    title="Application Update: " + application.team.name + " " + application.system.name,
                    message=application.team.rejection_message,
                    timestamp=datetime.datetime.now(),
                    user_id=str(application.user_id)
                )
                send_message(db=db, message=message)

    db.add(db_application_cycle)
    db.commit()
    db.refresh(db_application_cycle)

    return db_application_cycle


def delete_application_cycle(db: Session, application_cycle_id: str) -> bool:
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
    system = db.query(team_models.System).filter(team_models.System.id == application.system_id).first()
    del application_data['team_id']
    del application_data['system_id']
    if 'status' not in application_data or application_data['status'] is None:
        application_data['status'] = 'SUBMITTED'
    application_data['stage_decision'] = 'NEUTRAL'
    db_application = models.Application(**application_data, user=user, application_cycle=application_cycle, team=team, system=system)
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    db_application.team
    db_application.user
    db_application.system
    return db_application


def get_applications(db: Session, application_cycle_id: str = None, team_id: str = None, system_id: str = None, user_id: str = None) -> List[models.Application]:
    query = db.query(models.Application)
    if application_cycle_id:
        query = query.filter(
            models.Application.application_cycle_id == application_cycle_id)
    if team_id:
        query = query.filter(models.Application.team_id == team_id)
    if system_id:
        query = query.filter(models.Application.system_id == system_id)
    if user_id:
        query = query.filter(models.Application.user_id == user_id)
    applications = query.all()
    # This looks like it does nothing, but it makes sure the object has all the values
    for application in applications:
        application.team
        application.user
        application.system
    return applications


def get_application(db: Session, application_id: str) -> models.Application:
    db_application = db.query(models.Application).filter(
        models.Application.id == application_id).first()
    if db_application is None:
        return None
    # This looks like it does nothing, but it makes sure the object has all the values
    db_application.team
    db_application.user
    db_application.system
    return db_application


def advance_application(db: Session, application: models.Application):
    message_body = ''
    # Auto accept if it's going from submit -> review
    if application.status == 'SUBMITTED':
        application.status = 'REVIEW'
        message_body = "Thank you for submitting an application! Your application is now being reviewed by our team. Please keep an eye on your portal for updates."
    elif application.stage_decision == 'ACCEPT':
        # Advance the application status
        application_team = application.team
        if application.status == 'REVIEW':
            application.status = 'INTERVIEW'
            message_body = application_team.interview_message
        elif application.status == 'INTERVIEW_COMPLETE':
            application.status = 'TRIAL'
            message_body = application_team.trial_workday_message
        elif application.status == 'TRIAL':
            application.status = 'OFFER'
            message_body = application_team.offer_message
        application.stage_decision = 'NEUTRAL'
    else:
        # Reject the application
        if application.status == 'REVIEW' or application.status == 'REVIEW':
            application.status = 'REJECTED_REVIEW'
        elif 'INTERVIEW' in application.status:
            application.status = 'REJECTED_INTERVIEW'
        elif application.status == 'TRIAL':
            application.status = 'REJECTED_TRIAL'
        application.stage_decision = 'NEUTRAL'
    
    # Send a message to the user
    if message_body != '':
        message = message_schemas.MessageCreate(
            title="Application Update: " + application.team.name + " " + application.system.name,
            message=message_body,
            timestamp=datetime.datetime.now(),
            user_id=str(application.user_id)
        )
        send_message(db=db, message=message)
    db.add(application)


def update_application(db: Session, application_id: str, application: schemas.ApplicationUpdate) -> models.Application:
    db_application = db.query(models.Application).filter(
        models.Application.id == application_id).first()
    if db_application is None:
        return None
    application_data = application.dict(exclude_unset=True)
    if 'team_id' in application_data:
        team = db.query(team_models.Team).filter(team_models.Team.id == application.team_id).first()
        db_application.team = team
        del application_data['team_id']
    if 'system_id' in application_data:
        system = db.query(team_models.System).filter(team_models.System.id == application.system_id).first()
        db_application.system = system
        del application_data['system_id']
    for key, value in application_data.items():
        setattr(db_application, key, value)
    
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    # This looks like it does nothing, but it makes sure the object has all the values
    db_application.team
    db_application.user
    db_application.system
    return db_application


def delete_application(db: Session, application_id: str) -> bool:
    db_application = db.query(models.Application).filter(
        models.Application.id == application_id).first()
    if db_application is None:
        return False
    db.delete(db_application)
    db.commit()
    return True
