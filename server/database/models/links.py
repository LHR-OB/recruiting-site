from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from ..database import Base


class EventUserLink(Base):
    __tablename__ = 'event_user_links'

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), primary_key=True)


class UserSystemLink(Base):
    __tablename__ = 'user_system_links'

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    system_id = Column(UUID(as_uuid=True), ForeignKey("systems.id"), primary_key=True)
