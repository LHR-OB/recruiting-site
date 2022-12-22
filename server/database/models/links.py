from sqlalchemy import Column, Integer, ForeignKey

from ..database import Base


class EventUserLink(Base):
    __tablename__ = 'event_user_links'

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    event_id = Column(Integer, ForeignKey("events.id"), primary_key=True)


class UserSystemLink(Base):
    __tablename__ = 'user_system_links'

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    system_id = Column(Integer, ForeignKey("systems.id"), primary_key=True)


class ApplicationSystemLink(Base):
    __tablename__ = 'application_system_links'

    application_id = Column(Integer, ForeignKey("applications.id"), primary_key=True)
    system_id = Column(Integer, ForeignKey("systems.id"), primary_key=True)
