from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Reference: https://stackoverflow.com/questions/58685601/postgresql-cannot-connect-to-fastapi-applicaiton-via-sqlalchemy-utilizing-docker
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@db/postgres"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Import all models
from .models.users import User
from .models.events import Event
from .models.applications import Application, ApplicationCycle
from .models.links import EventUserLink
