from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.orm import Session
from datetime import datetime
from ..db.session import SessionLocal
from ..models.user import User
from ..schemas.user import UserRegister, UserLogin, UserUpdate
from ..core.security import hash_password, verify_password, save_uploaded_file

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    db: Session = SessionLocal()
    
    try:
        # Get form data
        data = request.form.to_dict()
        
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'{field} is required'}), 400
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == data['email']).first()
        if existing_user:
            return jsonify({'message': 'Email already registered'}), 400
        
        # Handle photo upload
        photo_path = None
        if 'photo' in request.files:
            file = request.files['photo']
            if file.filename:
                photo_path = save_uploaded_file(file, 'photos')
        
        # Create new user
        user = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone=data.get('phone'),
            password_hash=hash_password(data['password']),
            date_of_birth=datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date() if data.get('date_of_birth') else None,
            photo_path=photo_path
        )
        
        db.add(user)
        db.commit()
        
        return jsonify({'message': 'User registered successfully'}), 201
        
    except Exception as e:
        db.rollback()
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500
    finally:
        db.close()

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    db: Session = SessionLocal()
    
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email and password are required'}), 400
        
        # Find user
        user = db.query(User).filter(User.email == data['email']).first()
        
        if not user or not verify_password(data['password'], user.password_hash):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Login failed: {str(e)}'}), 500
    finally:
        db.close()

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile"""
    db: Session = SessionLocal()
    
    try:
        user_id = get_jwt_identity()
        user = db.query(User).get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to get profile: {str(e)}'}), 500
    finally:
        db.close()

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    db: Session = SessionLocal()
    
    try:
        user_id = get_jwt_identity()
        user = db.query(User).get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Get form data
        data = request.form.to_dict()
        
        # Update basic info
        if data.get('first_name'):
            user.first_name = data['first_name']
        if data.get('last_name'):
            user.last_name = data['last_name']
        if data.get('date_of_birth'):
            user.date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
        
        # Handle password change
        if data.get('new_password'):
            if not data.get('current_password'):
                return jsonify({'message': 'Current password is required'}), 400
            
            if not verify_password(data['current_password'], user.password_hash):
                return jsonify({'message': 'Current password is incorrect'}), 400
            
            user.password_hash = hash_password(data['new_password'])
        
        # Handle photo upload
        if 'photo' in request.files:
            file = request.files['photo']
            if file.filename:
                photo_path = save_uploaded_file(file, 'photos')
                if photo_path:
                    user.photo_path = photo_path
        
        db.commit()
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        db.rollback()
        return jsonify({'message': f'Failed to update profile: {str(e)}'}), 500
    finally:
        db.close()
