from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from database.database import SessionLocal
from database.models.users import User
from utils.users import ALGORITHM, SECRET_KEY, get_user, user_is_at_least
import uuid


oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')


async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail='Could not validate credentials',
        headers={'WWW-Authenticate': 'Bearer'},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = str(payload.get('sub'))
        if user_id is None:
            raise credentials_exception
    except JWTError as e:
        raise credentials_exception
    user = get_user(db=db, user_id=user_id)
    return user


def required_role(role: str, user: User, bypass_approved: bool = False):
    if user_is_at_least(user, role) and user.status == "APPROVED":
        return user
    if role == "APPLICANT" and user.type == "APPLICANT":
        return user
    raise HTTPException(status_code=401,
                        detail='User not authorized for this operation')


def required_admin(user: User = Depends(get_current_user)):
    return required_role("ADMIN", user)


def required_team_management(user: User = Depends(get_current_user)):
    return required_role("TEAM_MANAGEMENT", user)


def required_system_lead(user: User = Depends(get_current_user)):
    return required_role("SYSTEM_LEAD", user)


def required_interviewer(user: User = Depends(get_current_user)):
    return required_role("INTERVIEWER", user)


def required_applicant(user: User = Depends(get_current_user)):
    return required_role("APPLICANT", user)


def required_member(user: User = Depends(get_current_user)):
    return required_role("INTERVIEWER", user, bypass_approved=True)
