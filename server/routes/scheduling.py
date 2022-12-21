from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dependencies import get_db, required_admin, required_interviewer, required_applicant, get_current_user
from database.schemas import scheduling as schemas
from utils import scheduling as utils


router = APIRouter(
    prefix='/scheduling',
    tags=['scheduling']
)


@router.post('/')
async def create_event(event: schemas.EventCreate, user=Depends(required_interviewer), db: Session = Depends(get_db)):
    return utils.create_event(db=db, event=event)


@router.get('/')
async def get_events(user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.get_events(db)


@router.get('/{id}')
async def get_event(id: int, user=Depends(required_applicant), db: Session = Depends(get_db)):
    db_event = utils.get_event(db, event_id=id)
    if db_event is None:
        raise HTTPException(
            status_code=404, detail="Event not found")
    return db_event


@router.put('/{id}')
async def update_event(id: int, event: schemas.EventUpdate, user=Depends(required_interviewer), db: Session = Depends(get_db)):
    db_event = utils.update_event(
        db=db, event_id=id, event=event)
    if db_event is None:
        raise HTTPException(
            status_code=404, detail="Event not found")
    return db_event


@router.put('/join/{id}')
async def join_event(id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    db_event = utils.join_event(db=db, event_id=id, user=user)
    if db_event is None:
        raise HTTPException(
            status_code=404, detail="Event not found")
    return db_event


@router.delete('/{id}')
async def delete_event(id: int, user=Depends(required_interviewer), db: Session = Depends(get_db)):
    if not utils.delete_event(db=db, event_id=id):
        raise HTTPException(
            status_code=404, detail="Event not found")
    return True
