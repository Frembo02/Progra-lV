from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EarthquakeFilters(BaseModel):
    minMagnitude: Optional[float] = 4.0
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    minLatitude: Optional[float] = None
    maxLatitude: Optional[float] = None
    minLongitude: Optional[float] = None
    maxLongitude: Optional[float] = None

class EarthquakeResponse(BaseModel):
    id: str
    place: str
    magnitude: float
    depth: float
    latitude: float
    longitude: float
    event_time: datetime

    class Config:
        from_attributes = True
