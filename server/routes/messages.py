from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dependencies import get_db, required_admin, required_interviewer, required_applicant, get_current_user
from database.schemas import messages as schemas
from utils import messages as utils


router = APIRouter(
    prefix='/messages',
    tags=['messages']
)


@router.post('/')
async def create_message(message: schemas.MessageCreate, user=Depends(required_applicant), db: Session = Depends(get_db)):
    return utils.create_message(db=db, message=message)


@router.get('/')
async def get_messages(user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.get_messages(db)


@router.get('/id/{id}')
async def get_message(id: int, user=Depends(required_applicant), db: Session = Depends(get_db)):
    db_message = utils.get_message(db, message_id=id)
    if db_message is None:
        raise HTTPException(
            status_code=404, detail="Message not found")
    return db_message


@router.get('/user/{id}')
async def get_messages_by_user(id: int, user=Depends(required_applicant), db: Session = Depends(get_db)):
    return utils.get_messages_by_user(db, user_id=id)


@router.get('/user')
async def get_messages_current_user(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return utils.get_messages_by_user(db, user_id=user.id)


@router.put('/{id}')
async def update_message(id: int, message: schemas.MessageUpdate, user=Depends(required_applicant), db: Session = Depends(get_db)):
    db_message = utils.update_message(
        db=db, message_id=id, message=message)
    if db_message is None:
        raise HTTPException(
            status_code=404, detail="Message not found")
    return db_message


@router.put('/read/{id}')
async def read_message(id: int, user=Depends(required_applicant), db: Session = Depends(get_db)):
    db_message = utils.read_message(db=db, message_id=id)
    if db_message is None:
        raise HTTPException(
            status_code=404, detail="Message not found")
    return db_message


@router.delete('/{id}')
async def delete_message(id: int, user=Depends(required_applicant), db: Session = Depends(get_db)):
    db_message = utils.delete_message(db=db, message_id=id)
    if db_message is None:
        raise HTTPException(
            status_code=404, detail="Message not found")
    return db_message
