import os
import uuid
from datetime import datetime
from typing import Optional

def generate_uuid() -> str:
    """Generate a unique UUID string"""
    return str(uuid.uuid4())

def format_datetime(dt: Optional[datetime]) -> Optional[str]:
    """Format datetime to ISO string"""
    return dt.isoformat() if dt else None

def parse_date(date_str: str) -> Optional[datetime]:
    """Parse date string to datetime object"""
    try:
        return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
    except (ValueError, AttributeError):
        return None

def validate_file_size(file_path: str, max_size_mb: int = 5) -> bool:
    """Validate file size"""
    if os.path.exists(file_path):
        file_size = os.path.getsize(file_path)
        max_size_bytes = max_size_mb * 1024 * 1024
        return file_size <= max_size_bytes
    return False

def clean_filename(filename: str) -> str:
    """Clean and secure filename"""
    # Remove path components
    filename = os.path.basename(filename)
    # Replace spaces and special characters
    filename = "".join(c for c in filename if c.isalnum() or c in "._-")
    return filename[:100]  # Limit length
