from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class Availability(Base):
    __tablename__ = 'availabilities'

    id = Column(Integer, primary_key=True, index=True)
    # Availability Details
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    offset = Column(Integer)

    # Relationships
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    user = relationship("User", back_populates="availabilities")
