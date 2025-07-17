import bcrypt
import jwt
import uuid
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from werkzeug.utils import secure_filename
from PIL import Image
from .config import settings

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_token(user_id: int) -> str:
    """Generate JWT token for user"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(seconds=settings.JWT_ACCESS_TOKEN_EXPIRES)
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm='HS256')

def decode_token(token: str) -> dict:
    """Decode JWT token"""
    try:
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise Exception('Token has expired')
    except jwt.InvalidTokenError:
        raise Exception('Invalid token')

def token_required(f):
    """Decorator to require JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            try:
                token = auth_header.split(' ')[1]  # Bearer <token>
            except IndexError:
                return jsonify({'message': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = decode_token(token)
            current_user_id = data['user_id']
        except Exception as e:
            return jsonify({'message': str(e)}), 401
        
        return f(current_user_id, *args, **kwargs)
    
    return decorated

def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            
            from ..models.user import User
            user = User.query.get(current_user_id)
            
            if not user or user.role != 'admin':
                return jsonify({'message': 'Admin access required'}), 403
                
        except Exception as e:
            return jsonify({'message': 'Authentication required'}), 401
        
        return f(*args, **kwargs)
    
    return decorated

def allowed_file(filename: str) -> bool:
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in settings.ALLOWED_EXTENSIONS

def save_uploaded_file(file, folder: str = 'photos') -> str:
    """Save uploaded file with unique name"""
    if file and allowed_file(file.filename):
        # Generate unique filename
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        
        # Create upload directory if it doesn't exist
        upload_path = os.path.join(settings.UPLOAD_FOLDER, folder)
        os.makedirs(upload_path, exist_ok=True)
        
        # Save file
        file_path = os.path.join(upload_path, unique_filename)
        file.save(file_path)
        
        # Optimize image if it's an image file
        try:
            with Image.open(file_path) as img:
                # Resize if too large
                if img.width > 800 or img.height > 800:
                    img.thumbnail((800, 800), Image.Resampling.LANCZOS)
                    img.save(file_path, optimize=True, quality=85)
        except Exception:
            pass  # Not an image or couldn't process
        
        return os.path.join(folder, unique_filename)
    
    return None
