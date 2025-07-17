from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NewsCreate(BaseModel):
    title: str
    content: str

class NewsUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class NewsResponse(BaseModel):
    id: int
    title: str
    content: str
    date_posted: datetime
    author_id: int
    author_name: Optional[str]

    class Config:
        from_attributes = True
