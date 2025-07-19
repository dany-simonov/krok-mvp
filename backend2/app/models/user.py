from sqlalchemy import Column, Integer, String, DateTime, func
from ..core.database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default='admin')
    created_at = Column(DateTime(timezone=True), server_default=func.now())