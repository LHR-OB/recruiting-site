from sqlalchemy.orm import Session

from database.models import teams as teams_models
from database.models import users as user_models
from database.models import applications as applications_models
from database.schemas import applications as applications_schemas
from utils.users import hash_password
from utils.applications import create_application


def create_solar_team(db: Session):
    solar_team = teams_models.Team(
        name='Solar',
    )
    db.add(solar_team)
    db.commit()
    db.refresh(solar_team)
    return solar_team


def create_admin_user(db: Session, team):
    admin_user = user_models.User(
        first_name='Admin',
        last_name='Administrator',
        email='admin@admin.com',
        hashed_password=hash_password('Password').decode('utf8'),
        type='ADMIN',
        status='APPROVED',
        team=team
    )
    db.add(admin_user)
    db.commit()


def create_rand_system(db: Session, team: teams_models.Team):
    system = teams_models.System(
        name='System',
        team=team
    )
    db.add(system)
    db.commit()
    db.refresh(system)
    return system


def create_rand_application(db: Session, user: user_models.User):
    new_solar = create_solar_team(db)
    new_system = create_rand_system(db=db, team=new_solar)
    application = create_application(db, user, applications_schemas.ApplicationCreate(
        team_id=str(new_solar.id),
        system_id=str(new_system.id),
        phone_number='1234567890',
        major='asdf',
        year_entering='asdf',
        short_answer1='asdf',
        short_answer2='asdf',
        short_answer3='asdf',
        short_answer4='asdf',
        resume_link='asdf',
        portfolio_link='asdf',
    ))
    return application


def main(db: Session):
    team = create_solar_team(db)
    create_admin_user(db, team)
