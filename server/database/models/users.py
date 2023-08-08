from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from ..database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    type = Column(Enum("ADMIN", "TEAM_MANAGEMENT",
                  "SYSTEM_LEAD", "INTERVIEWER", "APPLICANT", name='type_enum'), index=True)
    status = Column(Enum("UNAPPROVED", "APPROVED", name='user_status_enum'), index=True)
    interview_location = Column(String)

    # Relationships
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), index=True)

    applications = relationship("Application", back_populates="user")
    availabilities = relationship("Availability", back_populates="user")
    messages = relationship("Message", back_populates="user")
    team = relationship("Team", back_populates="users")
    
    events = relationship("Event", secondary="event_user_links", back_populates="users")
    systems = relationship("System", secondary="user_system_links", back_populates="users")
