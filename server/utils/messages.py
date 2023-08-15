from sqlalchemy.orm import Session
from typing import List
import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

from database.models import messages as models
from database.models.users import User
from database.schemas import messages as schemas
from utils import users as user_utils


def send_message(db: Session, message: schemas.MessageCreate) -> models.Message:
    # # Send email
    # recipient = user_utils.get_user(db, message.user_id)
    # port = 465  # For SSL
    # smtp_server = "smtp.gmail.com"
    # sender_email = os.environ.get('GMAIL_EMAIL')
    # receiver_email = recipient.email
    # password = os.environ.get('GMAIL_PASSWORD')
    
    # email = MIMEMultipart("alternative")
    # email["Subject"] = message.title
    # email["From"] = sender_email
    # email["To"] = receiver_email
    # email.attach(MIMEText(message.message, "plain"))

    # context = ssl.create_default_context()
    # with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
    #     server.login(sender_email, password)
    #     server.sendmail(sender_email, receiver_email, email.as_string())

    # Save message to database
    return create_message(db, message)


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
