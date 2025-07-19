from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = 'admin'

class User(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    created_at: Optional[datetime]

    class Config:
        orm_mode = True