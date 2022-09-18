from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dependencies import get_db, required_admin, required_applicant, required_system_lead, required_team_management
from database.schemas import applications as schemas
from utils import applications as utils


application_cycle_router = APIRouter(
    prefix='/application_cycles',
    tags=['application_cycles']
)


@application_cycle_router.post('/')
async def create_application_cycle(application_cycle: schemas.ApplicationCycleCreate, user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.create_application_cycle(db=db, application_cycle=application_cycle)


@application_cycle_router.get('/')
async def get_application_cycles(user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.get_application_cycles(db)


@application_cycle_router.get('/active')
async def get_application_cycle_active(user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.get_application_cycle_active(db)


@application_cycle_router.put('/{id}')
async def update_application_cycle(id: int, application_cycle: schemas.ApplicationCycleUpdate, user=Depends(required_admin), db: Session = Depends(get_db)):
    db_application_cycle = utils.update_application_cycle(
        db=db, application_cycle_id=id, application_cycle=application_cycle)
    if db_application_cycle is None:
        raise HTTPException(
            status_code=404, detail="Application Cycle not found")
    return db_application_cycle


@application_cycle_router.delete('/{id}')
async def delete_application_cycle(id: int, user=Depends(required_admin), db: Session = Depends(get_db)):
    if not utils.delete_application_cycle(db=db, application_cycle_id=id):
        raise HTTPException(
            status_code=404, detail="Application Cycle not found")
    return True


application_router = APIRouter(
    prefix='/applications',
    tags=['applications']
)


@application_router.put('/')
async def create_application(application: schemas.ApplicationCreate, user=Depends(required_applicant), db: Session = Depends(get_db)):
    return utils.create_application(db=db, user=user, application=application)


@application_router.get('/')
async def get_applications(user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.get_applications(db=db)


@application_router.get('/{cycle_id}')
async def get_applications_by_cycle(cycle_id: int, user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.get_applications(db=db, application_cycle_id=cycle_id)


@application_router.get('/{cycle_id}/{team}')
async def get_applications_by_team(cycle_id: int, team: str, user=Depends(required_team_management), db: Session = Depends(get_db)):
    return utils.get_applications(db=db, application_cycle_id=cycle_id, team=team)


@application_router.get('/{cycle_id}/{team}/{system}')
async def get_applications_by_system(cycle_id: int, team: str, system: str, user=Depends(required_system_lead), db: Session = Depends(get_db)):
    return utils.get_applications(db=db, application_cycle_id=cycle_id, team=team, system=system)


@application_router.put('/{id}')
async def update_application(id: int, application: schemas.ApplicationUpdate, user=Depends(required_applicant), db: Session = Depends(get_db)):
    return utils.update_application(db=db, application_id=id, application=application)


@application_router.delete('/{id}')
async def delete_application(id: int, user=Depends(required_applicant), db: Session = Depends(get_db)):
    return utils.delete_application(db=db, application_id=id)
