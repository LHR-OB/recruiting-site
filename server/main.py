from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from routes import users, applications, application_cycles, events, teams, availabilities, interviews, messages
from database.database import Base, engine
from utils.users import authenticate_user, create_access_token
from utils.dummy_data import main as create_dummy_data
from dependencies import get_db, required_interviewer

# Main app configuration
Base.metadata.create_all(bind=engine)
app = FastAPI()

# Routers
app.include_router(users.router)
app.include_router(applications.router)
app.include_router(application_cycles.router)
app.include_router(events.router)
app.include_router(teams.teams_router)
app.include_router(teams.systems_router)
app.include_router(availabilities.router)
app.include_router(interviews.interview_router)
app.include_router(interviews.interview_note_router)
app.include_router(messages.router)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

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


# TODO: Remove this route after dev
@app.get('/protected')
async def protected(user=Depends(required_interviewer)):
    return user


@app.post('/dummy-data')
async def dummy_data(db: Session = Depends(get_db)):
    create_dummy_data(db)
    return {'status': 'ok'}
