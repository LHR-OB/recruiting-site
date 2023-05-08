from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class Event(Base):
    __tablename__ = 'events'

    id = Column(Integer, primary_key=True, index=True)
    # Event Details
    title = Column(String)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    offset = Column(Integer)    # Offset from UTC in hours
    location = Column(String)
    description = Column(String)

    # Relationships
    users = relationship("User", secondary="event_user_links", back_populates="events")
    interview_id = Column(Integer, ForeignKey('interviews.id'))
