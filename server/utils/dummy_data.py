from sqlalchemy.orm import Session

from database.models import teams as teams_models
from database.models import users as user_models
from utils.users import hash_password


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



def main(db: Session):
    team = create_solar_team(db)
    create_admin_user(db, team)
