from sqlalchemy.orm import Session
from typing import List

from database.models import teams as models
from database.schemas import teams as schemas


### CRUD ###
def create_team(db: Session, team: schemas.TeamCreate) -> models.Team:
    db_team = models.Team(**team.dict())
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team


def get_teams(db: Session, limit: int = 100) -> List[models.Team]:
    return db.query(models.Team).limit(limit).all()


def get_team(db: Session, team_id: int) -> models.Team:
    return db.query(models.Team).filter(models.Team.id == team_id).first()


def update_team(db: Session, team_id: int, team: schemas.TeamUpdate) -> models.Team:
    db_team = db.query(models.Team).filter(
        models.Team.id == team_id).first()
    if db_team is None:
        return None
    team_data = team.dict(exclude_unset=True)
    for key, value in team_data.items():
        setattr(db_team, key, value)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team


def delete_team(db: Session, team_id: int) -> bool:
    db_team = db.query(models.Team).filter(
        models.Team.id == team_id).first()
    if db_team is None:
        return False
    db.delete(db_team)
    db.commit()
    return True


def create_system(db: Session, system: schemas.SystemCreate) -> models.System:
    db_system = models.System(**system.dict())
    db.add(db_system)
    db.commit()
    db.refresh(db_system)
    return db_system


def get_systems(db: Session, limit: int = 100) -> List[models.System]:
    return db.query(models.System).limit(limit).all()


def get_systems_by_team(db: Session, team_id: int) -> List[models.System]:
    return db.query(models.System).filter(models.System.team == team_id).all()


def get_system(db: Session, system_id: int) -> models.System:
    return db.query(models.System).filter(models.System.id == system_id).first()


def update_system(db: Session, system_id: int, system: schemas.SystemUpdate) -> models.System:
    db_system = db.query(models.System).filter(
        models.System.id == system_id).first()
    if db_system is None:
        return None
    system_data = system.dict(exclude_unset=True)
    for key, value in system_data.items():
        setattr(db_system, key, value)
    db.add(db_system)
    db.commit()
    db.refresh(db_system)
    return db_system


def delete_system(db: Session, system_id: int) -> bool:
    db_system = db.query(models.System).filter(
        models.System.id == system_id).first()
    if db_system is None:
        return False
    db.delete(db_system)
    db.commit()
    return True
