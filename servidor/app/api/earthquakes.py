from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timedelta
import requests
from ..db.session import SessionLocal
from ..models.earthquake import Earthquake
from ..core.config import settings

earthquakes_bp = Blueprint('earthquakes', __name__)

@earthquakes_bp.route('/live', methods=['GET'])
@jwt_required()
def get_live_earthquakes():
    """Get live earthquakes from USGS API"""
    try:
        # Get query parameters
        min_magnitude = float(request.args.get('minMagnitude', 4.0))
        start_date = request.args.get('startDate')
        end_date = request.args.get('endDate')
        
        # Set default dates if not provided
        if not start_date:
            start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')
        
        # Build USGS API parameters
        params = {
            'format': 'geojson',
            'starttime': start_date,
            'endtime': end_date,
            'minmagnitude': min_magnitude,
            'limit': 1000
        }
        
        # Add geographic bounds if provided
        if request.args.get('minLatitude'):
            params['minlatitude'] = float(request.args.get('minLatitude'))
        if request.args.get('maxLatitude'):
            params['maxlatitude'] = float(request.args.get('maxLatitude'))
        if request.args.get('minLongitude'):
            params['minlongitude'] = float(request.args.get('minLongitude'))
        if request.args.get('maxLongitude'):
            params['maxlongitude'] = float(request.args.get('maxLongitude'))
        
        # Make request to USGS API
        response = requests.get(settings.USGS_API_URL, params=params, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        
        # Process and format earthquake data
        earthquakes = []
        for feature in data.get('features', []):
            props = feature.get('properties', {})
            coords = feature.get('geometry', {}).get('coordinates', [])
            
            if len(coords) >= 3 and props.get('mag') is not None:
                earthquake = {
                    'id': feature.get('id', ''),
                    'place': props.get('place', 'Unknown location'),
                    'magnitude': float(props.get('mag', 0)),
                    'depth': float(coords[2]) if coords[2] is not None else 0,
                    'latitude': float(coords[1]),
                    'longitude': float(coords[0]),
                    'event_time': datetime.fromtimestamp(props.get('time', 0) / 1000).isoformat()
                }
                earthquakes.append(earthquake)
        
        return jsonify(earthquakes), 200
        
    except requests.RequestException as e:
        return jsonify({'message': f'Failed to fetch earthquake data: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'message': f'Error processing earthquake data: {str(e)}'}), 500

@earthquakes_bp.route('/save', methods=['POST'])
@jwt_required()
def save_earthquake():
    """Save earthquake to database"""
    db: Session = SessionLocal()
    
    try:
        data = request.get_json()
        
        # Check if earthquake already exists
        existing = db.query(Earthquake).filter(
            Earthquake.source_id == data.get('id')
        ).first()
        
        if existing:
            return jsonify({'message': 'Earthquake already exists'}), 409
        
        # Create new earthquake record
        earthquake = Earthquake(
            place=data.get('place', ''),
            magnitude=float(data.get('magnitude', 0)),
            depth=float(data.get('depth', 0)),
            latitude=float(data.get('latitude', 0)),
            longitude=float(data.get('longitude', 0)),
            event_time=datetime.fromisoformat(data.get('event_time').replace('Z', '+00:00')),
            source_id=data.get('id', '')
        )
        
        db.add(earthquake)
        db.commit()
        
        return jsonify(earthquake.to_dict()), 201
        
    except Exception as e:
        db.rollback()
        return jsonify({'message': f'Failed to save earthquake: {str(e)}'}), 500
    finally:
        db.close()

@earthquakes_bp.route('/history', methods=['GET'])
@jwt_required()
def get_earthquake_history():
    """Get earthquake history from database"""
    db: Session = SessionLocal()
    
    try:
        # Build query filters
        query = db.query(Earthquake)
        
        # Filter by magnitude
        min_magnitude = request.args.get('minMagnitude')
        if min_magnitude:
            query = query.filter(Earthquake.magnitude >= float(min_magnitude))
        
        # Filter by date range
        start_date = request.args.get('startDate')
        end_date = request.args.get('endDate')
        
        if start_date:
            start_datetime = datetime.strptime(start_date, '%Y-%m-%d')
            query = query.filter(Earthquake.event_time >= start_datetime)
        
        if end_date:
            end_datetime = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1)
            query = query.filter(Earthquake.event_time < end_datetime)
        
        # Filter by geographic bounds
        min_lat = request.args.get('minLatitude')
        max_lat = request.args.get('maxLatitude')
        min_lon = request.args.get('minLongitude')
        max_lon = request.args.get('maxLongitude')
        
        if min_lat:
            query = query.filter(Earthquake.latitude >= float(min_lat))
        if max_lat:
            query = query.filter(Earthquake.latitude <= float(max_lat))
        if min_lon:
            query = query.filter(Earthquake.longitude >= float(min_lon))
        if max_lon:
            query = query.filter(Earthquake.longitude <= float(max_lon))
        
        # Order by event time (most recent first)
        earthquakes = query.order_by(Earthquake.event_time.desc()).limit(1000).all()
        
        return jsonify([eq.to_dict() for eq in earthquakes]), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to get earthquake history: {str(e)}'}), 500
    finally:
        db.close()
