from datetime import datetime, timedelta
import os
from typing import List, Union
from sqlalchemy.orm import Session
from jose import jwt
import bcrypt

from database.models import users as models
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
    user = get_user_by_email(db=db, email=email)
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

def user_is_at_least(user: models.User, type: str) -> bool:
    return USER_ROLES.index(user.type) <= USER_ROLES.index(type)

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


def get_users(db: Session, limit: int = 100) -> List[models.User]:
    return db.query(models.User).limit(limit).all()


def get_users_members(db: Session, limit: int = 100) -> List[models.User]:
    return db.query(models.User).filter(models.User.type != "APPLICANT").limit(limit).all()


def get_users_by_team(db: Session, team_id: int, limit: int = 100) -> List[models.User]:
    return db.query(models.User).filter(models.User.team_id == team_id).limit(limit).all()


def get_user_by_id(db: Session, user_id: int) -> models.User:
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> models.User:
    return db.query(models.User).filter(models.User.email == email).first()


def delete_user(db: Session, user_id: int) -> bool:
    db_user = get_user_by_id(db=db, user_id=user_id)
    if db_user is None:
        return False
    db.delete(db_user)
    db.commit()
    return True
