from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from dependencies import get_db, required_interviewer, required_applicant
from database.schemas import availabilities as schemas
from utils import availabilities as utils


router = APIRouter(
    prefix='/availabilities',
    tags=['availabilities']
)


@router.post('/')
async def create_availability(availability: schemas.AvailabilityCreate, user=Depends(required_interviewer), db: Session = Depends(get_db)):
    return utils.create_availability(db=db, availability=availability, user=user)


@router.post('/set')
async def set_availabilities(availabilities: Optional[List[schemas.AvailabilityCreate]] = None, user=Depends(required_interviewer), db: Session = Depends(get_db)):
    old_availabilities = utils.get_availabilities_by_user(db, user_id=user.id)
    print(old_availabilities)
    print(availabilities)
    for availability in old_availabilities:
        utils.delete_availability(db, availability_id=availability.id)
    for availability in availabilities:
        utils.create_availability(db=db, availability=availability, user=user)
    return True


@router.get('/')
async def get_availabilities(user=Depends(required_interviewer), db: Session = Depends(get_db)):
    return utils.get_availabilities(db)


@router.get('/id/{id}')
async def get_availability(id: int, user=Depends(required_interviewer), db: Session = Depends(get_db)):
    db_availability = utils.get_availability(db, availability_id=id)
    if db_availability is None:
        raise HTTPException(
            status_code=404, detail="Availability not found")
    return db_availability


@router.get('/user/{id}')
async def get_availabilities_by_user(id: int, user=Depends(required_interviewer), db: Session = Depends(get_db)):
    return utils.get_availabilities_by_user(db, user_id=id)


@router.get('/user')
async def get_availabilities_current_user(user=Depends(required_interviewer), db: Session = Depends(get_db)):
    return utils.get_availabilities_by_user(db, user_id=user.id)


@router.get('/applicant')
async def get_availabilities_applicant(user=Depends(required_applicant), db: Session = Depends(get_db)):
    return utils.get_availabilities_applicant(db, user_id=user.id)


@router.put('/{id}')
async def update_availability(id: int, availability: schemas.AvailabilityUpdate, user=Depends(required_interviewer), db: Session = Depends(get_db)):
    db_availability = utils.update_availability(
        db=db, availability_id=id, availability=availability)
    if db_availability is None:
        raise HTTPException(
            status_code=404, detail="Availability not found")
    return db_availability


@router.delete('/{id}')
async def delete_availability(id: int, user=Depends(required_interviewer), db: Session = Depends(get_db)):
    db_availability = utils.delete_availability(db=db, availability_id=id)
    if db_availability is None:
        raise HTTPException(
            status_code=404, detail="Availability not found")
    return True
