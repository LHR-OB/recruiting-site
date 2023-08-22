from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from dependencies import get_db, get_current_user, required_team_management, required_member, required_admin
from database.schemas import users as schemas, messages as message_schemas
from utils import users as utils
from utils.messages import send_message

router = APIRouter(
    prefix="/users",
    tags=['users']
)


# Code cache for password resets
password_reset_cache = {}


@router.post('/applicant')
async def create_user_applicant(user: schemas.ApplicantCreate, db: Session = Depends(get_db)):
    db_user = utils.get_user(db=db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return utils.create_user(db=db, user=user)


@router.post('/member')
async def create_user_member(user: schemas.MemberCreate, db: Session = Depends(get_db)):
    db_user = utils.get_user(db=db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return utils.create_user(db=db, user=user)


@router.get('')
async def get_users(limit: int = 100, user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.get_users(db=db, limit=limit)


@router.get('/team/{id}')
async def get_users_by_team(id: str, limit: int = 100, db: Session = Depends(get_db)):
    return utils.get_users(db=db, team_id=id, limit=limit)


@router.get('/members')
async def get_users_members(limit: int = 100, db: Session = Depends(get_db)):
    return utils.get_users(db=db, limit=limit, members=True)


@router.get('/id/{id}')
async def get_user_by_id(id: str, db: Session = Depends(get_db)):
    db_user = utils.get_user(db=db, user_id=id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.get('/email/{email}')
async def get_user_by_email(email: str, db: Session = Depends(get_db)):
    db_user = utils.get_user(db=db, email=email)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.get('/current')
async def get_current_user(curr_user=Depends(get_current_user)):
    return curr_user


@router.get('/event/{id}')
async def get_users_by_event(id: str, limit: int = 100, db: Session = Depends(get_db)):
    return utils.get_users(db=db, event_id=id, limit=limit)


@router.put('/approve/{id}')
async def approve_user(id: str, curr_user=Depends(required_team_management), db: Session = Depends(get_db)):
    db_user = utils.get_user(db=db, user_id=id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    unauthorized_exception = HTTPException(status_code=401, detail="User not authorized to perform this action")
    if utils.user_is_at_least(user=curr_user, type="TEAM_MANAGEMENT"):
        # Team Management can authorize <= Team Management on their own team
        if (utils.user_is_at_least(user=db_user, type="ADMIN") or db_user.team != curr_user.team) and curr_user.type != "ADMIN":
            raise unauthorized_exception
    return utils.approve_user(db=db, user_id=id)


@router.put('/join-system/{id}/{system_id}')
async def join_system(id: str, system_id: str, db: Session = Depends(get_db)):
    db_user = utils.get_user(db=db, user_id=id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return utils.join_system(db=db, user_id=id, system_id=system_id)


@router.put('/leave-system/{id}/{system_id}')
async def leave_system(id: str, system_id: str, db: Session = Depends(get_db)):
    db_user = utils.get_user(db=db, user_id=id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return utils.leave_system(db=db, user_id=id, system_id=system_id)


@router.put('/{id}')
async def update_user(id: str, user: schemas.MemberUpdate, curr_user=Depends(required_member), db: Session = Depends(get_db)):
    db_user = utils.get_user(db=db, user_id=id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    unauthorized_exception = HTTPException(status_code=401, detail="User not authorized to perform this action")
    if not str(db_user.id) == str(curr_user.id):
        if utils.user_is_at_least(user=curr_user, type="TEAM_MANAGEMENT"):
            # Team Management can update <= Team Management on their own team
            if (utils.user_is_at_least(user=db_user, type="ADMIN") or db_user.team != curr_user.team) and curr_user.type != "ADMIN":
                raise unauthorized_exception
    return utils.update_user(db=db, user_id=id, user=user)


@router.put('/password/reset-code/{email}')
async def create_password_reset_code(email: str, db: Session = Depends(get_db)):
    db_user = utils.get_user(db=db, email=email)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    password_reset_cache[email] = utils.create_password_reset_code()
    # Send email with code
    send_message(db=db, message=message_schemas.MessageCreate(
        title="Password Reset Code",
        message=f"Your password reset code is {password_reset_cache[email]}",
        user_id=str(db_user.id),
        timestamp=datetime.now()
    ))
    return {"msg": "Password reset code created"}


@router.put('/password/reset')
async def reset_password(reset_data: schemas.PasswordReset, db: Session = Depends(get_db)):
    db_user = utils.get_user(db=db, email=reset_data.email)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if reset_data.email not in password_reset_cache:
        raise HTTPException(status_code=404, detail="Password reset code not found")
    if password_reset_cache[reset_data.email] != reset_data.code:
        raise HTTPException(status_code=404, detail="Password reset code incorrect")
    # Remove from cache
    del password_reset_cache[reset_data.email]
    return utils.reset_password(db=db, user=db_user, password=reset_data.password)


@router.delete('/{id}')
async def delete_user(id: str, db: Session = Depends(get_db)):
    return utils.delete_user(db=db, user_id=id)
