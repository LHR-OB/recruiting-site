from sqlalchemy.orm import Session
import bcrypt

from database.models import users as models
from database.schemas import users as schemas


def hash_password(password: str):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf8'), salt)


def verify_password(password: str, hashed_password: str):
    return bcrypt.checkpw(password.encode('utf8'), hashed_password)


### CRUD ###
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = hash_password(user.password)
    user_dict = user.dict()
    del user_dict['password']
    db_user = models.User(**user_dict, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_users(db: Session, limit: int = 100):
    return db.query(models.User).limit(limit).all()


def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()
