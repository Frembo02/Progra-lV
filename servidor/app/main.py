import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .core.config import settings
from .db.session import engine, Base
from .api.auth import auth_bp
from .api.users import users_bp
from .api.news import news_bp
from .api.earthquakes import earthquakes_bp

def create_app():
    """Create Flask application"""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = settings.SECRET_KEY
    app.config['JWT_SECRET_KEY'] = settings.JWT_SECRET_KEY
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = settings.JWT_ACCESS_TOKEN_EXPIRES
    app.config['MAX_CONTENT_LENGTH'] = settings.MAX_CONTENT_LENGTH
    
    # Initialize extensions
    CORS(app, origins=["http://localhost:5173"])
    jwt = JWTManager(app)
    
    # Create upload directory
    os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(news_bp, url_prefix='/api/news')
    app.register_blueprint(earthquakes_bp, url_prefix='/api/earthquakes')
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return jsonify({'status': 'healthy', 'message': 'Seismic Monitoring API is running'}), 200
    
    # Root endpoint
    @app.route('/')
    def root():
        return jsonify({
            'message': 'Seismic Monitoring System API',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth',
                'users': '/api/users',
                'news': '/api/news',
                'earthquakes': '/api/earthquakes',
                'health': '/health'
            }
        }), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'message': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'message': 'Internal server error'}), 500
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'message': 'Token has expired'}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'message': 'Invalid token'}), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'message': 'Authorization token is required'}), 401
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=settings.FLASK_DEBUG
    )
