from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dependencies import get_db, required_admin, required_applicant
from database.schemas import applications as schemas
from utils import applications as utils


router = APIRouter(
    prefix='/application-cycles',
    tags=['application_cycles']
)


@router.post('')
async def create_application_cycle(application_cycle: schemas.ApplicationCycleCreate, user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.create_application_cycle(db=db, application_cycle=application_cycle)


@router.get('')
async def get_application_cycles(user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.get_application_cycles(db)


@router.get('/active')
async def get_application_cycle_active(user=Depends(required_applicant), db: Session = Depends(get_db)):
    return utils.get_application_cycle_active(db)


@router.put('/{id}')
async def update_application_cycle(id: int, application_cycle: schemas.ApplicationCycleUpdate, user=Depends(required_admin), db: Session = Depends(get_db)):
    db_application_cycle = utils.update_application_cycle(
        db=db, application_cycle_id=id, application_cycle=application_cycle)
    if db_application_cycle is None:
        raise HTTPException(
            status_code=404, detail="Application Cycle not found")
    return db_application_cycle


@router.put('/advance/{id}')
async def advance_application_cycle(id: int, user=Depends(required_admin), db: Session = Depends(get_db)):
    db_application_cycle = utils.advance_application_cycle(
        db=db, application_cycle_id=id)
    if db_application_cycle is None:
        raise HTTPException(
            status_code=404, detail="Application Cycle not found")
    return db_application_cycle


@router.delete('/{id}')
async def delete_application_cycle(id: int, user=Depends(required_admin), db: Session = Depends(get_db)):
    if not utils.delete_application_cycle(db=db, application_cycle_id=id):
        raise HTTPException(
            status_code=404, detail="Application Cycle not found")
    return True
