from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class Team(Base):
    __tablename__ = 'teams'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    interview_time_duration = Column(Integer)

    # Relationships
    users = relationship("User", back_populates="team")
    systems = relationship("System", back_populates="team")
    applications = relationship("Application", back_populates="team")


class System(Base):
    __tablename__ = 'systems'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

    # Relationships
    team_id = Column(Integer, ForeignKey("teams.id"), index=True)
    team = relationship("Team", back_populates="systems")

    users = relationship("User", secondary="user_system_links", back_populates="systems")
    applications = relationship("Application", secondary="application_system_links", back_populates="systems")
