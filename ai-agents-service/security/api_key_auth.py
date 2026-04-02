"""
API Key Authentication Module

Provides API key-based authentication for service-to-service communication.
"""

import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from flask import request, g
import logging

from database import db_manager

logger = logging.getLogger(__name__)


class APIKeyManager:
    """Manage API keys for users."""

    @staticmethod
    def generate_key() -> tuple:
        """Generate a new API key and its hash."""
        key = secrets.token_urlsafe(32)
        key_hash = hashlib.sha256(key.encode()).hexdigest()
        return key, key_hash

    @staticmethod
    def validate_key(api_key: str) -> Optional[Dict[str, Any]]:
        """Validate API key and return user info."""
        if not api_key:
            return None

        key_hash = hashlib.sha256(api_key.encode()).hexdigest()

        session = db_manager.get_session()
        try:
            from database import User
            user = session.query(User).filter_by(api_key=key_hash, is_active=True).first()

            if user and user.ip_whitelist:
                # Check IP whitelist
                client_ip = request.remote_addr
                if client_ip not in user.ip_whitelist:
                    logger.warning(f"API key used from unauthorized IP: {client_ip}")
                    return None

            return user.to_dict() if user else None
        finally:
            session.close()

    @staticmethod
    def revoke_key(user_id: str) -> bool:
        """Revoke user's API key."""
        session = db_manager.get_session()
        try:
            from database import User
            user = session.query(User).filter_by(id=user_id).first()
            if user:
                user.api_key = None
                session.commit()
                return True
            return False
        except Exception as e:
            session.rollback()
            logger.error(f"Failed to revoke API key: {e}")
            return False
        finally:
            session.close()


def require_api_key(f):
    """Decorator to require API key authentication."""
    from functools import wraps

    @wraps(f)
    def decorated(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')

        if not api_key:
            return {'error': 'API key required'}, 401

        user_data = APIKeyManager.validate_key(api_key)

        if not user_data:
            return {'error': 'Invalid or revoked API key'}, 401

        g.current_user = user_data
        return f(*args, **kwargs)

    return decorated


def create_api_key_for_user(user_id: str, ip_whitelist: Optional[list] = None) -> Optional[str]:
    """Create new API key for user."""
    key, key_hash = APIKeyManager.generate_key()

    session = db_manager.get_session()
    try:
        from database import User
        user = session.query(User).filter_by(id=user_id).first()
        if user:
            user.api_key = key_hash
            if ip_whitelist:
                user.ip_whitelist = ip_whitelist
            session.commit()
            return key
        return None
    except Exception as e:
        session.rollback()
        logger.error(f"Failed to create API key: {e}")
        return None
    finally:
        session.close()
