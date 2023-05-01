from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dependencies import get_db, required_admin, required_interviewer, required_applicant, get_current_user
from database.schemas import events as schemas
from utils import events as utils


router = APIRouter(
    prefix='/events',
    tags=['events']
)


@router.post('/')
async def create_event(event: schemas.EventCreate, user=Depends(required_applicant), db: Session = Depends(get_db)):
    return utils.create_event(db=db, event=event)


@router.get('/')
async def get_events(user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.get_events(db)


@router.get('/id/{id}')
async def get_event(id: int, user=Depends(required_applicant), db: Session = Depends(get_db)):
    db_event = utils.get_event(db, event_id=id)
    if db_event is None:
        raise HTTPException(
            status_code=404, detail="Event not found")
    return db_event


@router.get('/user/{id}')
async def get_events_by_user(id: int, user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.get_events_by_user(db, user_id=id)


@router.get('/user')
async def get_events_current_user(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return utils.get_events_by_user(db, user_id=user.id)


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
    db_event = utils.join_event(db=db, event_id=id, user_id=user.id)
    if db_event is None:
        raise HTTPException(
            status_code=404, detail="Event not found")
    return db_event


@router.put('/leave/{id}')
async def leave_event(id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    db_event = utils.leave_event(db=db, event_id=id, user_id=user.id)
    if db_event is None:
        raise HTTPException(
            status_code=404, detail="Event not found")
    return db_event


@router.put('/add/{id}/{user_id}')
async def add_user_to_event(id: int, user_id: int, user=Depends(required_applicant), db: Session = Depends(get_db)):
    db_event = utils.join_event(db=db, event_id=id, user_id=user_id)
    if db_event is None:
        raise HTTPException(
            status_code=404, detail="Event not found")
    return db_event


@router.put('/remove/{id}/{user_id}')
async def remove_user_from_event(id: int, user_id: int, user=Depends(required_applicant), db: Session = Depends(get_db)):
    db_event = utils.leave_event(db=db, event_id=id, user_id=user_id)
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
