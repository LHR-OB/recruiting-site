from sqlalchemy import Column, Integer, ForeignKey

from ..database import Base


class EventUserLink(Base):
    __tablename__ = 'event_user_links'

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    event_id = Column(Integer, ForeignKey("events.id"), primary_key=True)
