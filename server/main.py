from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
import threading

from routes import users, applications, events, teams, availabilities, interviews, messages
from database.database import Base, engine
from utils.users import authenticate_user, create_access_token
from utils.dummy_data import main as create_dummy_data, create_rand_application
from dependencies import get_db, get_current_user
from email_send import mail_worker, mail_queue

from utils.messages import send_message
from database.schemas.messages import MessageCreate
from datetime import datetime

# Main app configuration
Base.metadata.create_all(bind=engine)
app = FastAPI()

# Lifespan tasks
worker = threading.Thread(target=mail_worker, daemon=True)

@app.on_event("startup")
async def startup_event():
    print("Starting up")
    worker.start()


@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down")
    mail_queue.put(None)
    worker.join()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Routers
app.include_router(users.router)
app.include_router(applications.application_cycles_router)
app.include_router(applications.applications_router)
app.include_router(events.router)
app.include_router(teams.teams_router)
app.include_router(teams.systems_router)
app.include_router(availabilities.router)
app.include_router(interviews.interview_router)
app.include_router(interviews.interview_note_router)
app.include_router(messages.router)

@app.post('/token')
async def token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(
        db=db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail='Incorrect email or password',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    access_token = create_access_token(data={'sub': str(user.id)})
    return {'access_token': access_token, 'token_type': 'bearer'}


@app.post('/dummy-data')
async def dummy_data(db: Session = Depends(get_db)):
    create_dummy_data(db)
    return {'status': 'ok'}


@app.post('/send-email')
async def send_email(db: Session = Depends(get_db), curr_user=Depends(get_current_user), n: int = 1):
    for i in range(n):
        send_message(db=db, message=MessageCreate(
            title='Test',
            message=f'This is test message {i}',
            timestamp=datetime.now(),
            user_id=str(curr_user.id)
        ))
    return {'status': 'ok'}


@app.post('/flood-applications')
async def flood_applications(db: Session = Depends(get_db), curr_user=Depends(get_current_user), n: int = 1):
    for i in range(n):
        create_rand_application(db=db, user=curr_user)
    return {'status': 'ok'}
