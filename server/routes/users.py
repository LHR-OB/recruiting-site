from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dependencies import get_db, get_current_user, required_team_management
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


@router.get('/id/{id}')
async def get_user_by_id(id: int, db: Session = Depends(get_db)):
    return utils.get_user_by_id(db=db, user_id=id)


@router.get('/current')
async def get_current_user(curr_user=Depends(get_current_user)):
    return curr_user


@router.put('/verify/{id}')
async def verify_user(id: int, verify_code: str, db: Session = Depends(get_db)):
    return utils.verify_user(db=db, user_id=id, verify_code=verify_code)


@router.put('/approve/{id}')
async def approve_user(id: int, curr_user=Depends(required_team_management), db: Session = Depends(get_db)):
    db_user = utils.get_user_by_id(db=db, user_id=id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    unauthorized_exception = HTTPException(status_code=401, detail="User not authorized to perform this action")
    if utils.user_is_at_least(user=curr_user, type="TEAM_MANAGEMENT"):
        # Team Management can authorize <= Team Management on their own team
        if utils.user_is_at_least(user=db_user, type="ADMIN") or (db_user.team != curr_user.team and curr_user.type != "ADMIN"):
            raise unauthorized_exception
    return utils.approve_user(db=db, user_id=id)

@router.delete('/{id}')
async def delete_user(id: int, db: Session = Depends(get_db)):
    return utils.delete_user(db=db, user_id=id)
