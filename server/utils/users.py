from datetime import datetime, timedelta
import os
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


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def approve_user(db: Session, user_id: int) -> models.User:
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        return None
    setattr(db_user, "status", "APPROVED")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def join_system(db: Session, user_id: int, system_id: int) -> models.User:
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    db_system = db.query(teams_models.System).filter(teams_models.System.id == system_id).first()
    if db_user is None:
        return None
    db_user.systems.append(db_system)
    if not user_is_at_least(db_user, "TEAM_MANAGEMENT"):
        setattr(db_user, "status", "UNAPPROVED")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db_user.systems
    return db_user


def leave_system(db: Session, user_id: int, system_id: int) -> models.User:
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    db_system = db.query(teams_models.System).filter(teams_models.System.id == system_id).first()
    if db_user is None:
        return None
    db_user.systems.remove(db_system)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db_user.systems
    return db_user


def user_is_at_least(user: models.User, type: str) -> bool:
    return USER_ROLES.index(user.type) <= USER_ROLES.index(type)


def user_in_system(db: Session, user_id: int, system_id: int) -> bool:
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


def get_users(db: Session, limit: int = 100, members: bool = False, team_id: int = None) -> List[models.User]:
    query = db.query(models.User)
    if members:
        query = query.filter(models.User.type != "APPLICANT")
    if team_id is not None:
        query = query.filter(models.User.team_id == team_id)
    users = query.limit(limit).all()
    for user in users:
        try:
            # This is so it shows up in the response
            user.team
            user.systems
        except AttributeError:
            pass
    return users


def get_user(db: Session, user_id: int = None, team_id: int = None, email: str = None) -> models.User:
    user = None
    if user_id is not None:
        user = db.query(models.User).filter(models.User.id == user_id).first()
    elif team_id is not None:
        user = db.query(models.User).filter(models.User.team_id == team_id).first()
    elif email is not None:
        user = db.query(models.User).filter(models.User.email == email).first()
    else:
        return None
    try:
        # This is so it shows up in the response
        user.team
        user.systems
    except AttributeError:
        pass
    return user

def delete_user(db: Session, user_id: int) -> bool:
    db_user = get_user(db=db, user_id=user_id)
    if db_user is None:
        return False
    db.delete(db_user)
    db.commit()
    return True
