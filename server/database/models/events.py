from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class Event(Base):
    __tablename__ = 'events'

    id = Column(Integer, primary_key=True, index=True)
    # Event Details
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    location = Column(String)
    description = Column(String)

    # Relationships
    users = relationship("User", secondary="event_user_links", back_populates="events")
