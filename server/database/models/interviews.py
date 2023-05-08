from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class Interview(Base):
    __tablename__ = 'interviews'

    id = Column(Integer, primary_key=True, index=True)

    # Relationships
    notes = relationship("InterviewNote", back_populates="interview")
    event = relationship("Event", backref="interviews", uselist=False)
    application = relationship("Application", backref="interviews", uselist=False)


class InterviewNote(Base):
    __tablename__ = 'interview_notes'

    id = Column(Integer, primary_key=True, index=True)
    note = Column(String)
    
    # Relationships
    interview_id = Column(Integer, ForeignKey('interviews.id'))
    interview = relationship("Interview", back_populates="notes")
