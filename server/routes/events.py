from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import datetime

from dependencies import get_db, required_admin, required_interviewer, required_applicant, get_current_user
from database.schemas import events as schemas
from database.schemas.messages import MessageCreate
from utils import events as utils
from utils import messages as message_utils


router = APIRouter(
    prefix='/events',
    tags=['events']
)


@router.post('')
async def create_event(event: schemas.EventCreate, user=Depends(required_applicant), db: Session = Depends(get_db)):
    ret = utils.create_event(db=db, event=event)
    if ret is None:
        raise HTTPException(
            status_code=409, detail="Event conflict")
    return ret


@router.get('')
async def get_events(user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.get_events(db)


@router.get('/id/{id}')
async def get_event(id: str, user=Depends(required_applicant), db: Session = Depends(get_db)):
    db_event = utils.get_event(db, event_id=id)
    if db_event is None:
        raise HTTPException(
            status_code=404, detail="Event not found")
    return db_event


@router.get('/user/{id}')
async def get_events_by_user(id: str, user=Depends(required_applicant), db: Session = Depends(get_db)):
    return utils.get_events_by_user(db, user_id=id)


@router.get('/user')
async def get_events_current_user(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return utils.get_events_by_user(db, user_id=user.id)


@router.put('/{id}')
async def update_event(id: str, event: schemas.EventUpdate, user=Depends(required_applicant), db: Session = Depends(get_db)):
    db_event = utils.update_event(
        db=db, event_id=id, event=event)
    if db_event is None:
        raise HTTPException(
            status_code=404, detail="Event not found")
    return db_event


@router.put('/join/{id}')
async def join_event(id: str, user=Depends(get_current_user), db: Session = Depends(get_db)):
    db_event = utils.join_event(db=db, event_id=id, user_id=user.id)
    if db_event is None:
        raise HTTPException(
            status_code=404, detail="Event not found")
    if db_event == False:
        raise HTTPException(
            status_code=409, detail="User has conflicting event")
    return db_event


@router.put('/leave/{id}')
async def leave_event(id: str, user=Depends(get_current_user), db: Session = Depends(get_db)):
    db_event = utils.leave_event(db=db, event_id=id, user_id=user.id)
    if db_event is None:
        raise HTTPException(
            status_code=404, detail="Event not found")
    if db_event == False:
        raise HTTPException(
            status_code=409, detail="User has conflicting event")
    return db_event


@router.put('/add/{id}/{user_id}')
async def add_user_to_event(id: str, user_id: str, user=Depends(required_applicant), db: Session = Depends(get_db)):
    db_event = utils.join_event(db=db, event_id=id, user_id=user_id)
    if db_event is None:
        raise HTTPException(
            status_code=404, detail="Event not found")
    if db_event == False:
        raise HTTPException(
            status_code=409, detail="User has conflicting event")
    # Notify user
    message_utils.send_message(
        db=db,
        message=MessageCreate(
            title="You have been added to an event",
            message=f"You have been added to the event {db_event.title} by {user.first_name} {user.last_name} at {db_event.location} from {db_event.start_time - datetime.timedelta(hours=db_event.offset)} to {db_event.end_time - datetime.timedelta(hours=db_event.offset)}",
            timestamp=datetime.datetime.now(),
            user_id=user_id
        )
    )
    return db_event


@router.put('/remove/{id}/{user_id}')
async def remove_user_from_event(id: str, user_id: str, user=Depends(required_applicant), db: Session = Depends(get_db)):
    db_event = utils.leave_event(db=db, event_id=id, user_id=user_id)
    if db_event is None:
        raise HTTPException(
            status_code=404, detail="Event not found")
    if db_event == False:
        raise HTTPException(
            status_code=409, detail="User has conflicting event")
    return db_event


@router.delete('/{id}')
async def delete_event(id: str, user=Depends(required_applicant), db: Session = Depends(get_db)):
    if not utils.delete_event(db=db, event_id=id):
        raise HTTPException(
            status_code=404, detail="Event not found")
    return True
