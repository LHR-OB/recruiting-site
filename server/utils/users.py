from sqlalchemy.orm import Session

from database.models import users as models
from database.schemas import users as schemas


### CRUD ###
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = user.password     # TODO: Hash properly
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
