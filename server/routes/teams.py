from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dependencies import get_db, required_admin, required_team_management, required_applicant
from database.schemas import teams as schemas
from utils import teams as utils


teams_router = APIRouter(
    prefix='/teams',
    tags=['teams']
)


@teams_router.post('/')
async def create_team(team: schemas.TeamCreate, db: Session = Depends(get_db)):
    return utils.create_team(db=db, team=team)


@teams_router.get('/')
async def get_teams(db: Session = Depends(get_db)):
    return utils.get_teams(db)


@teams_router.get('/id/{id}')
async def get_team(id: int, user=Depends(required_applicant), db: Session = Depends(get_db)):
    db_team = utils.get_team(db, team_id=id)
    if db_team is None:
        raise HTTPException(
            status_code=404, detail="Team not found")
    return db_team


@teams_router.put('/{id}')
async def update_team(id: int, team: schemas.TeamUpdate, user=Depends(required_admin), db: Session = Depends(get_db)):
    db_team = utils.update_team(
        db=db, team_id=id, team=team)
    if db_team is None:
        raise HTTPException(
            status_code=404, detail="Team not found")
    return db_team


@teams_router.delete('/{id}')
async def delete_team(id: int, user=Depends(required_admin), db: Session = Depends(get_db)):
    db_team = utils.delete_team(db=db, team_id=id)
    if db_team is None:
        raise HTTPException(
            status_code=404, detail="Team not found")
    return db_team


systems_router = APIRouter(
    prefix='/systems',
    tags=['systems']
)


@systems_router.post('/')
async def create_system(system: schemas.SystemCreate, user=Depends(required_team_management), db: Session = Depends(get_db)):
    return utils.create_system(db=db, system=system)


@systems_router.get('/')
async def get_systems(user=Depends(required_applicant), db: Session = Depends(get_db)):
    return utils.get_systems(db)


@systems_router.get('/team/{id}')
async def get_systems_by_team(id: int, user=Depends(required_applicant), db: Session = Depends(get_db)):
    return utils.get_systems_by_team(db, team_id=id)


@systems_router.get('/id/{id}')
async def get_system(id: int, user=Depends(required_applicant), db: Session = Depends(get_db)):
    db_system = utils.get_system(db, system_id=id)
    if db_system is None:
        raise HTTPException(
            status_code=404, detail="System not found")
    return db_system


@systems_router.put('/{id}')
async def update_system(id: int, system: schemas.SystemUpdate, user=Depends(required_team_management), db: Session = Depends(get_db)):
    db_system = utils.update_system(
        db=db, system_id=id, system=system)
    if db_system is None:
        raise HTTPException(
            status_code=404, detail="System not found")
    return db_system


@systems_router.delete('/{id}')
async def delete_system(id: int, user=Depends(required_team_management), db: Session = Depends(get_db)):
    db_system = utils.delete_system(db=db, system_id=id)
    if db_system is None:
        raise HTTPException(
            status_code=404, detail="System not found")
    return db_system
