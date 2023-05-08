from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship

from ..database import Base


class Message(Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    message = Column(String)
    timestamp = Column(DateTime)
    is_read = Column(Boolean)

    # Relationships
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    user = relationship("User", back_populates="messages")
