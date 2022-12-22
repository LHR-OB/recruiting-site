from sqlalchemy import Column, Integer, String, Boolean, Enum, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class ApplicationCycle(Base):
    __tablename__ = 'application_cycles'

    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer, index=True)
    semester = Column(String, index=True)
    is_active = Column(Boolean, index=True)

    applications = relationship(
        "Application", back_populates="application_cycle")


class Application(Base):
    __tablename__ = 'applications'

    id = Column(Integer, primary_key=True, index=True)
    # Application Details
    phone_number = Column(String)
    major = Column(String, index=True)
    year_entering = Column(String, index=True)
    team = Column(String, index=True)
    systems = Column(String, index=True)
    subsystems = Column(String)
    short_answer = Column(String)
    resume_link = Column(String)
    status = Column(Enum("DRAFT", "SUBMITTED", "ACCEPTED", "REJECTED", name="application_status_enum"), index=True)

    # Relationships
    application_cycle_id = Column(Integer, ForeignKey("application_cycles.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    application_cycle = relationship(
        "ApplicationCycle", back_populates="applications")
    user = relationship("User", back_populates="applications")
