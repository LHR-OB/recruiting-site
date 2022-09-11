from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dependencies import get_db
from database.schemas import users as schemas
from utils import users as utils

router = APIRouter(
    prefix="/users"
)


@router.post('/', response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = utils.get_user_by_email(db=db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return utils.create_user(db=db, user=user)


@router.get('/', response_model=List[schemas.User])
async def get_users(limit: int = 100, db: Session = Depends(get_db)):
    return utils.get_users(db=db, limit=limit)


@router.get('/{id}', response_model=schemas.User)
async def get_user_by_id(id: int, db: Session = Depends(get_db)):
    return utils.get_user_by_id(db=db, user_id=id)
