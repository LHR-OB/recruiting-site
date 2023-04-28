from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dependencies import get_db, required_admin, required_applicant, required_interviewer, required_system_lead, required_team_management
from database.schemas import applications as schemas
from utils import applications as utils
from utils import users as user_utils


application_cycle_router = APIRouter(
    prefix='/application-cycles',
    tags=['application_cycles']
)


@application_cycle_router.post('/')
async def create_application_cycle(application_cycle: schemas.ApplicationCycleCreate, user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.create_application_cycle(db=db, application_cycle=application_cycle)


@application_cycle_router.get('/')
async def get_application_cycles(user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.get_application_cycles(db)


@application_cycle_router.get('/active')
async def get_application_cycle_active(user=Depends(required_applicant), db: Session = Depends(get_db)):
    return utils.get_application_cycle_active(db)


@application_cycle_router.put('/{id}')
async def update_application_cycle(id: int, application_cycle: schemas.ApplicationCycleUpdate, user=Depends(required_admin), db: Session = Depends(get_db)):
    db_application_cycle = utils.update_application_cycle(
        db=db, application_cycle_id=id, application_cycle=application_cycle)
    if db_application_cycle is None:
        raise HTTPException(
            status_code=404, detail="Application Cycle not found")
    return db_application_cycle


@application_cycle_router.put('/advance/{id}')
async def advance_application_cycle(id: int, user=Depends(required_admin), db: Session = Depends(get_db)):
    db_application_cycle = utils.advance_application_cycle(
        db=db, application_cycle_id=id)
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


@application_router.post('/')
async def create_application(application: schemas.ApplicationCreate, user=Depends(required_applicant), db: Session = Depends(get_db)):
    return utils.create_application(db=db, user=user, application=application)


@application_router.get('/')
async def get_applications(user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.get_applications(db=db)


@application_router.get('/{cycle_id}')
async def get_applications_by_cycle(cycle_id: int, user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.get_applications(db=db, application_cycle_id=cycle_id)


@application_router.get('/{cycle_id}/{team_id}')
async def get_applications_by_team(cycle_id: int, team_id: int, user=Depends(required_team_management), db: Session = Depends(get_db)):
    if user.type == "TEAM_MANAGEMENT" and user.team.id != team_id:
        raise HTTPException(status_code=401, detail="User not authorized for this operation")
    return utils.get_applications(db=db, application_cycle_id=cycle_id, team_id=team_id)


@application_router.get('/{cycle_id}/{team_id}/{system_id}')
async def get_applications_by_system(cycle_id: int, team_id: int, system_id: int, user=Depends(required_interviewer), db: Session = Depends(get_db)):
    if user.type != "ADMIN" and user.team.id != team_id:
        raise HTTPException(status_code=401, detail="User not authorized for this operation")
    if user.type in {"INTERVIEWER", "SYSTEM_LEAD"} and not user_utils.user_in_system(db=db, user_id=user.id, system_id=system_id):
        raise HTTPException(status_code=401, detail="User not authorized for this operation")
    return utils.get_applications(db=db, application_cycle_id=cycle_id, team_id=team_id, system_id=system_id)


@application_router.get('/{cycle_id}/user/id/{id}')
async def get_applications_by_user(cycle_id: int, id: int, user=Depends(required_applicant), db: Session = Depends(get_db)):
    if user.type == "APPLICANT" and not user.id == id:
        raise HTTPException(status_code=401, detail="User not authorized for this operation")
    return utils.get_applications(db=db, user_id=id, application_cycle_id=cycle_id)


@application_router.put('/{id}')
async def update_application(id: int, application: schemas.ApplicationUpdate, user=Depends(required_applicant), db: Session = Depends(get_db)):
    db_application = utils.get_application(db=db, application_id=id)
    if user.type == "APPLICANT" and not user.id == db_application.user_id:
        raise HTTPException(status_code=401, detail="User not authorized for this operation")
    return utils.update_application(db=db, application_id=id, application=application)


@application_router.delete('/{id}')
async def delete_application(id: int, user=Depends(required_applicant), db: Session = Depends(get_db)):
    db_application = utils.get_application(db=db, application_id=id)
    if user.type == "APPLICANT" and not user.id == db_application.id:
        raise HTTPException(status_code=401, detail="User not authorized for this operation")
    return utils.delete_application(db=db, application_id=id)
