from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from ..database import Base


class Availability(Base):
    __tablename__ = 'availabilities'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Availability Details
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    offset = Column(Integer)

    # Relationships
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    user = relationship("User", back_populates="availabilities")
