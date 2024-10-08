from sqlalchemy.orm import Session
from typing import List

from database.models import messages as models
from database.models.users import User
from database.schemas import messages as schemas
from utils.users import get_user
from email_send import mail_queue


def send_message(db: Session, message: schemas.MessageCreate) -> models.Message:
    # Save message to database
    db_message = create_message(db, message)
    
    # Send email
    mail_queue.put({
        "title": message.title,
        "message": message.message,
        "email": get_user(db, message.user_id).email
    })

    return db_message


### CRUD ###
def create_message(db: Session, message: schemas.MessageCreate) -> models.Message:
    db_user = db.query(User).filter(User.id == message.user_id).first()
    message_dict = message.dict()
    db_message = models.Message(**message_dict, is_read=False)
    db.add(db_message)
    db_user.messages.append(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def get_messages(db: Session) -> List[models.Message]:
    return db.query(models.Message).all()


def get_message(db: Session, message_id: str) -> models.Message:
    return db.query(models.Message).filter(models.Message.id == message_id).first()


def get_messages_by_user(db: Session, user_id: str) -> List[models.Message]:
    return db.query(User).filter(User.id == user_id).first().messages


def update_message(db: Session, message_id: str, message: schemas.MessageUpdate) -> models.Message:
    db_message = db.query(models.Message).filter(
        models.Message.id == message_id).first()
    if db_message is None:
        return None
    message_data = message.dict(exclude_unset=True)
    for key, value in message_data.items():
        setattr(db_message, key, value)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def read_message(db: Session, message_id: str) -> models.Message:
    db_message = db.query(models.Message).filter(
        models.Message.id == message_id).first()
    if db_message is None:
        return None
    db_message.is_read = True
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def delete_message(db: Session, message_id: str) -> models.Message:
    db_message = db.query(models.Message).filter(
        models.Message.id == message_id).first()
    if db_message is None:
        return None
    db.delete(db_message)
    db.commit()
    return db_message
