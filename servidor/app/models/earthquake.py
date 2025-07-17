from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from ..db.session import Base

class Earthquake(Base):
    __tablename__ = 'earthquakes'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    place = Column(String(255), nullable=False)
    magnitude = Column(Float, nullable=False)
    depth = Column(Float, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    event_time = Column(DateTime, nullable=False)
    source_id = Column(String(100), unique=True, nullable=False)
    created_at = Column(DateTime, default=func.getdate(), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.source_id,
            'place': self.place,
            'magnitude': self.magnitude,
            'depth': self.depth,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'event_time': self.event_time.isoformat() if self.event_time else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
