from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.orm import Session
from ..db.session import SessionLocal
from ..models.user import User

users_bp = Blueprint('users', __name__)

def is_admin(user_id: int) -> bool:
    """Check if user is admin"""
    db: Session = SessionLocal()
    try:
        user = db.query(User).get(user_id)
        return user and user.role == 'admin'
    finally:
        db.close()

@users_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    """Get all users (admin only)"""
    db: Session = SessionLocal()
    
    try:
        current_user_id = get_jwt_identity()
        
        if not is_admin(current_user_id):
            return jsonify({'message': 'Admin access required'}), 403
        
        users = db.query(User).all()
        return jsonify([user.to_dict() for user in users]), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to get users: {str(e)}'}), 500
    finally:
        db.close()

@users_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id: int):
    """Delete user (admin only, cannot delete other admins)"""
    db: Session = SessionLocal()
    
    try:
        current_user_id = get_jwt_identity()
        
        if not is_admin(current_user_id):
            return jsonify({'message': 'Admin access required'}), 403
        
        user_to_delete = db.query(User).get(user_id)
        
        if not user_to_delete:
            return jsonify({'message': 'User not found'}), 404
        
        if user_to_delete.role == 'admin':
            return jsonify({'message': 'Cannot delete admin users'}), 403
        
        if user_to_delete.id == current_user_id:
            return jsonify({'message': 'Cannot delete yourself'}), 403
        
        db.delete(user_to_delete)
        db.commit()
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except Exception as e:
        db.rollback()
        return jsonify({'message': f'Failed to delete user: {str(e)}'}), 500
    finally:
        db.close()
