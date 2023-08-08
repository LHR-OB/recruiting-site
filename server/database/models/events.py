from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from ..database import Base


class Event(Base):
    __tablename__ = 'events'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Event Details
    title = Column(String)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    offset = Column(Integer)    # Offset from UTC in hours
    location = Column(String)
    description = Column(String)
    is_global = Column(Boolean)

    # Relationships
    users = relationship("User", secondary="event_user_links", back_populates="events")
    interview_id = Column(UUID(as_uuid=True), ForeignKey('interviews.id'))     # If this event is for an interview
    trial_workday_team_id = Column(UUID(as_uuid=True), ForeignKey('teams.id'))   # If this event is for a trial workday
