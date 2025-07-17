from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str
    date_of_birth: Optional[date] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: Optional[str]
    date_of_birth: Optional[date]
    photo_path: Optional[str]
    role: str
    last_login: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
