from sqlalchemy import Column, Integer, String, DateTime, Date
from sqlalchemy.sql import func
from ..db.session import Base

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    phone = Column(String(20), nullable=True)
    password_hash = Column(String(255), nullable=False)
    date_of_birth = Column(Date, nullable=True)
    photo_path = Column(String(255), nullable=True)
    role = Column(String(50), default='visitor', nullable=False)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.getdate(), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'photo_path': self.photo_path,
            'role': self.role,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
