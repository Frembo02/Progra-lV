from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..db.session import SessionLocal
from ..models.news import News
from ..models.user import User

news_bp = Blueprint('news', __name__)

def is_admin(user_id: int) -> bool:
    """Check if user is admin"""
    db: Session = SessionLocal()
    try:
        user = db.query(User).get(user_id)
        return user and user.role == 'admin'
    finally:
        db.close()

@news_bp.route('/', methods=['GET'])
def get_news():
    """Get all news articles"""
    db: Session = SessionLocal()
    
    try:
        news_articles = db.query(News).order_by(desc(News.date_posted)).all()
        return jsonify([article.to_dict() for article in news_articles]), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to get news: {str(e)}'}), 500
    finally:
        db.close()

@news_bp.route('/', methods=['POST'])
@jwt_required()
def create_news():
    """Create news article (admin only)"""
    db: Session = SessionLocal()
    
    try:
        current_user_id = get_jwt_identity()
        
        if not is_admin(current_user_id):
            return jsonify({'message': 'Admin access required'}), 403
        
        data = request.get_json()
        
        if not data.get('title') or not data.get('content'):
            return jsonify({'message': 'Title and content are required'}), 400
        
        news_article = News(
            title=data['title'],
            content=data['content'],
            author_id=current_user_id
        )
        
        db.add(news_article)
        db.commit()
        
        return jsonify(news_article.to_dict()), 201
        
    except Exception as e:
        db.rollback()
        return jsonify({'message': f'Failed to create news: {str(e)}'}), 500
    finally:
        db.close()

@news_bp.route('/<int:news_id>', methods=['PUT'])
@jwt_required()
def update_news(news_id: int):
    """Update news article (admin only)"""
    db: Session = SessionLocal()
    
    try:
        current_user_id = get_jwt_identity()
        
        if not is_admin(current_user_id):
            return jsonify({'message': 'Admin access required'}), 403
        
        news_article = db.query(News).get(news_id)
        
        if not news_article:
            return jsonify({'message': 'News article not found'}), 404
        
        data = request.get_json()
        
        if data.get('title'):
            news_article.title = data['title']
        if data.get('content'):
            news_article.content = data['content']
        
        db.commit()
        
        return jsonify(news_article.to_dict()), 200
        
    except Exception as e:
        db.rollback()
        return jsonify({'message': f'Failed to update news: {str(e)}'}), 500
    finally:
        db.close()

@news_bp.route('/<int:news_id>', methods=['DELETE'])
@jwt_required()
def delete_news(news_id: int):
    """Delete news article (admin only)"""
    db: Session = SessionLocal()
    
    try:
        current_user_id = get_jwt_identity()
        
        if not is_admin(current_user_id):
            return jsonify({'message': 'Admin access required'}), 403
        
        news_article = db.query(News).get(news_id)
        
        if not news_article:
            return jsonify({'message': 'News article not found'}), 404
        
        db.delete(news_article)
        db.commit()
        
        return jsonify({'message': 'News article deleted successfully'}), 200
        
    except Exception as e:
        db.rollback()
        return jsonify({'message': f'Failed to delete news: {str(e)}'}), 500
    finally:
        db.close()
