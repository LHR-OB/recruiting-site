from datetime import datetime, timedelta
import os
import random
from typing import List, Union
from sqlalchemy.orm import Session
from jose import jwt
import bcrypt

from database.models import users as models
from database.models import teams as teams_models
from database.schemas import users as schemas

ALGORITHM = 'HS256'
SECRET_KEY = os.environ['JWT_SECRET_KEY']
USER_ROLES = ["ADMIN", "TEAM_MANAGEMENT",
              "SYSTEM_LEAD", "INTERVIEWER", "APPLICANT"]


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf8'), salt)


def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf8'), hashed_password.encode('utf8'))


def authenticate_user(db: Session, email: str, password: str):
    user = get_user(db=db, email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_password_reset_code() -> str:
    # Generate random 6 digit code
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])


def reset_password(db: Session, user, password: str) -> models.User:
    hashed_password = hash_password(password)
    setattr(user, "hashed_password", hashed_password.decode('utf8'))
    db.add(user)
    db.commit()
    db.refresh(user)
    user.team
    user.systems
    return user


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(weeks=1)
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def approve_user(db: Session, user_id: str) -> models.User:
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        return None
    setattr(db_user, "status", "APPROVED")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db_user.team
    db_user.systems
    return db_user


def join_system(db: Session, user_id: str, system_id: str) -> models.User:
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    db_system = db.query(teams_models.System).filter(teams_models.System.id == system_id).first()
    if db_user is None:
        return None
    db_user.systems.append(db_system)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db_user.team
    db_user.systems
    return db_user


def leave_system(db: Session, user_id: str, system_id: str) -> models.User:
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    db_system = db.query(teams_models.System).filter(teams_models.System.id == system_id).first()
    if db_user is None:
        return None
    db_user.systems.remove(db_system)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db_user.team
    db_user.systems
    return db_user


def user_is_at_least(user: models.User, type: str) -> bool:
    return USER_ROLES.index(user.type) <= USER_ROLES.index(type)


def user_in_system(db: Session, user_id: str, system_id: str) -> bool:
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    db_system = db.query(teams_models.System).filter(teams_models.System.id == system_id).first()
    if db_user is None or db_system is None:
        return False
    return db_system in db_user.systems


### CRUD ###


def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed_password = hash_password(user.password)
    user_data = user.dict()
    del user_data['password']
    user_data['status'] = "UNAPPROVED"
    db_user = models.User(
        **user_data, hashed_password=hashed_password.decode('utf8'))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_users(db: Session, limit: int = 1000, members: bool = False, team_id: str = None, system_id: str = None, event_id: str = None) -> List[models.User]:
    query = db.query(models.User)
    if members:
        query = query.filter(models.User.type != "APPLICANT")
    if team_id is not None:
        query = query.filter(models.User.team_id == team_id)
    if system_id is not None:
        query = query.filter(models.User.systems.any(id=system_id))
    if event_id is not None:
        query = query.filter(models.User.events.any(id=event_id))
    users = query.limit(limit).all()
    for user in users:
        try:
            # This is so it shows up in the response
            user.team
            user.systems
        except AttributeError:
            pass
    return users


def get_user(db: Session, user_id: str = None, team_id: str = None, email: str = None) -> models.User:
    user = None
    if user_id is not None:
        user = db.query(models.User).filter(models.User.id == user_id).first()
    elif team_id is not None:
        user = db.query(models.User).filter(models.User.team_id == team_id).first()
    elif email is not None:
        user = db.query(models.User).filter(models.User.email.ilike(email)).first()
    else:
        return None
    try:
        # This is so it shows up in the response
        user.team
        user.systems
    except AttributeError:
        pass
    return user


def update_user(db: Session, user_id: str, user: schemas.MemberUpdate) -> models.User:
    db_user = get_user(db=db, user_id=user_id)
    if db_user is None:
        return None
    update_data = user.dict(exclude_unset=True)
    if update_data.get("type") != db_user.type or update_data.get("team_id") != str(db_user.team_id):
        update_data["status"] = "UNAPPROVED"
    for key, value in update_data.items():
        setattr(db_user, key, value)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db_user.team
    db_user.systems
    return db_user


def delete_user(db: Session, user_id: str) -> bool:
    db_user = get_user(db=db, user_id=user_id)
    if db_user is None:
        return False
    db.delete(db_user)
    db.commit()
    return True
