from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from routes import users
from database.database import Base, engine

# Main app configuration
Base.metadata.create_all(bind=engine)
app = FastAPI()

# Routers
app.include_router(users.router)


@app.get('/')
async def root():
    return "root"
