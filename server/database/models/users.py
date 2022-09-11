from sqlalchemy import Column, Integer, String, Enum

from ..database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    type = Column(Enum("APPLICANT", "SYSTEM_LEAD",
                  "INTERVIEWER", "ADMIN", name='type_enum'), index=True)
