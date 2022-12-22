from sqlalchemy import Column, Integer, String, Enum
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
    team = Column(String, index=True)
    systems = Column(String)
    status = Column(Enum("UNVERIFIED", "UNAPPROVED", "APPROVED", name='user_status_enum'), index=True)

    # Relationships
    applications = relationship("Application", back_populates="user")
    events = relationship("Event", secondary="event_user_links", back_populates="users")
