from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from routes import users
from database.database import Base, engine
from utils.users import authenticate_user, create_access_token
from dependencies import get_db, required_admin, required_applicant, required_interviewer

# Main app configuration
Base.metadata.create_all(bind=engine)
app = FastAPI()

# Routers
app.include_router(users.router)


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
