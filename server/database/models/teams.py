from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from ..database import Base


class Team(Base):
    __tablename__ = 'teams'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    application_questions = Column(String)
    interview_time_duration = Column(Integer, default=30)
    interview_message = Column(String)
    trial_workday_message = Column(String)
    offer_message = Column(String)
    rejection_message = Column(String)

    # Relationships
    users = relationship("User", back_populates="team")
    systems = relationship("System", back_populates="team")
    applications = relationship("Application", back_populates="team")
    trial_workday_event = relationship("Event", backref="teams", uselist=False)


class System(Base):
    __tablename__ = 'systems'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    interview_default_location = Column(String, default="ETC")

    # Relationships
    team_id = Column(Integer, ForeignKey("teams.id"), index=True)
    team = relationship("Team", back_populates="systems")

    applications = relationship("Application", back_populates="system")
    users = relationship("User", secondary="user_system_links", back_populates="systems")

