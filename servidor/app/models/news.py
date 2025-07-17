from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db.session import Base

class News(Base):
    __tablename__ = 'news'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    date_posted = Column(DateTime, default=func.getdate(), nullable=False)
    author_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Relationship
    author = relationship("User", backref="news_articles")
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'date_posted': self.date_posted.isoformat() if self.date_posted else None,
            'author_id': self.author_id,
            'author_name': f"{self.author.first_name} {self.author.last_name}" if self.author else None
        }
