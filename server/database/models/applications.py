from sqlalchemy import Column, DateTime, Integer, String, Boolean, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from ..database import Base


class ApplicationCycle(Base):
    __tablename__ = 'application_cycles'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    year = Column(Integer, index=True)
    semester = Column(String, index=True)
    application_open_date = Column(DateTime, index=True)
    application_close_date = Column(DateTime, index=True)
    interview_start_date = Column(DateTime, index=True)
    interview_end_date = Column(DateTime, index=True)
    is_active = Column(Boolean, index=True)
    stage = Column(Enum("APPLICATION", "REVIEW", "INTERVIEW", "TRIAL", "OFFER", "COMPLETE", name="application_cycle_stage_enum"), index=True)

    applications = relationship(
        "Application", back_populates="application_cycle")


class Application(Base):
    __tablename__ = 'applications'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Application Details
    phone_number = Column(String)
    major = Column(String, index=True)
    year_entering = Column(String, index=True)
    short_answer = Column(String)
    resume_link = Column(String)
    portfolio_link = Column(String)
    status = Column(Enum("SUBMITTED", "REVIEW", "REJECTED_REVIEW", "INTERVIEW", "INTERVIEW_SCHEDULED", "INTERVIEW_COMPLETE", "REJECTED_INTERVIEW", "TRIAL", "REJECTED_TRIAL", "OFFER", "ACCEPTED", "REJECTED", name="application_status_enum"), index=True)
    stage_decision = Column(Enum("ACCEPT", "REJECT", "NEUTRAL", name="application_stage_decision_enum"), index=True)

    # Relationships
    application_cycle_id = Column(UUID(as_uuid=True), ForeignKey("application_cycles.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"))
    system_id = Column(UUID(as_uuid=True), ForeignKey("systems.id"))
    interview_id = Column(UUID(as_uuid=True), ForeignKey('interviews.id'))

    application_cycle = relationship(
        "ApplicationCycle", back_populates="applications")
    user = relationship("User", back_populates="applications")
    team = relationship("Team", back_populates="applications")
    system = relationship("System", back_populates="applications")
