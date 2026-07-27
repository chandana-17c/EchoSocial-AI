from sqlalchemy import Column, Integer, String
from database import Base


class ScheduledPost(Base):
    __tablename__ = "scheduled_posts"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)
    platform = Column(String)
    type = Column(String)
    content = Column(String)
    date = Column(String)
    time = Column(String)
    status = Column(String)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)

    password = Column(String, nullable=False)