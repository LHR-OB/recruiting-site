from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from ..database import Base


class Interview(Base):
    __tablename__ = 'interviews'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Relationships
    notes = relationship("InterviewNote", back_populates="interview")
    event = relationship("Event", backref="interviews", uselist=False)
    application = relationship("Application", backref="interviews", uselist=False)


class InterviewNote(Base):
    __tablename__ = 'interview_notes'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    note = Column(String)
    
    # Relationships
    interview_id = Column(UUID(as_uuid=True), ForeignKey('interviews.id'))
    interview = relationship("Interview", back_populates="notes")
