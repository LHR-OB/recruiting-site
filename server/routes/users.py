from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dependencies import get_db
from database.schemas import users as schemas
from utils import users as utils

router = APIRouter(
    prefix="/users",
    tags=['users']
)


@router.post('/applicant')
async def create_user_applicant(user: schemas.ApplicantCreate, db: Session = Depends(get_db)):
    db_user = utils.get_user_by_email(db=db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return utils.create_user(db=db, user=user)


@router.post('/member')
async def create_user_member(user: schemas.MemberCreate, db: Session = Depends(get_db)):
    db_user = utils.get_user_by_email(db=db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return utils.create_user(db=db, user=user)


@router.get('/')
async def get_users(limit: int = 100, db: Session = Depends(get_db)):
    return utils.get_users(db=db, limit=limit)


@router.get('/{id}')
async def get_user_by_id(id: int, db: Session = Depends(get_db)):
    return utils.get_user_by_id(db=db, user_id=id)


@router.delete('/{id}')
async def delete_user(id: int, db: Session = Depends(get_db)):
    return utils.delete_user(db=db, user_id=id)
