from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    type = Column(Enum("ADMIN", "TEAM_MANAGEMENT",
                  "SYSTEM_LEAD", "INTERVIEWER", "APPLICANT", name='type_enum'), index=True)
    status = Column(Enum("UNAPPROVED", "APPROVED", name='user_status_enum'), index=True)

    # Relationships
    team_id = Column(Integer, ForeignKey("teams.id"), index=True)

    applications = relationship("Application", back_populates="user")
    team = relationship("Team", back_populates="users")
    
    events = relationship("Event", secondary="event_user_links", back_populates="users")
    systems = relationship("System", secondary="user_system_links", back_populates="users")
