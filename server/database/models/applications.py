from sqlalchemy import Column, DateTime, Integer, String, Boolean, Enum, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class ApplicationCycle(Base):
    __tablename__ = 'application_cycles'

    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer, index=True)
    semester = Column(String, index=True)
    application_open_date = Column(DateTime, index=True)
    application_close_date = Column(DateTime, index=True)
    interview_start_date = Column(DateTime, index=True)
    interview_end_date = Column(DateTime, index=True)
    is_active = Column(Boolean, index=True)
    stage = Column(Enum("APPLICATION", "INTERVIEW", "TRIAL", "OFFER", "COMPLETE", name="application_cycle_stage_enum"), index=True)

    applications = relationship(
        "Application", back_populates="application_cycle")


class Application(Base):
    __tablename__ = 'applications'

    id = Column(Integer, primary_key=True, index=True)
    # Application Details
    phone_number = Column(String)
    major = Column(String, index=True)
    year_entering = Column(String, index=True)
    subsystems = Column(String)
    short_answer = Column(String)
    resume_link = Column(String)
    status = Column(Enum("DRAFT", "SUBMITTED", "INTERVIEW", "INTERVIEW_COMPLETE", "TRIAL", "OFFER", "ACCEPTED", "REJECTED", name="application_status_enum"), index=True)
    stage_decision = Column(Enum("ACCEPT", "REJECT", "NEUTRAL", name="application_stage_decision_enum"), index=True)

    # Relationships
    application_cycle_id = Column(Integer, ForeignKey("application_cycles.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    team_id = Column(Integer, ForeignKey("teams.id"))

    application_cycle = relationship(
        "ApplicationCycle", back_populates="applications")
    user = relationship("User", back_populates="applications")
    team = relationship("Team", back_populates="applications")

    systems = relationship("System", secondary="application_system_links", back_populates="applications")
