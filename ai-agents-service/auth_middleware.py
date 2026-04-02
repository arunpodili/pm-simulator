"""
Authentication Middleware - JWT-based API Protection

Provides:
- JWT token validation
- Role-based access control (RBAC)
- Token refresh mechanism
- Secure token storage
"""

import os
import jwt
import secrets
from functools import wraps
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, Callable
from flask import request, jsonify, g
import hashlib
import logging

logger = logging.getLogger(__name__)

# Configuration
JWT_SECRET = os.getenv('JWT_SECRET_KEY') or secrets.token_hex(32)
JWT_ALGORITHM = 'HS256'
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)

# In-memory token blacklist (use Redis in production)
token_blacklist = set()


class AuthenticationError(Exception):
    """Authentication error with status code."""
    def __init__(self, message: str, status_code: int = 401):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def generate_tokens(user_id: str, role: str = 'user', extra_claims: Optional[Dict] = None) -> Dict[str, str]:
    """
    Generate access and refresh tokens.

    Args:
        user_id: User identifier
        role: User role (user/admin)
        extra_claims: Additional claims to include

    Returns:
        Dictionary with access_token and refresh_token
    """
    now = datetime.utcnow()

    # Access token
    access_payload = {
        'sub': user_id,
        'role': role,
        'type': 'access',
        'iat': now,
        'exp': now + JWT_ACCESS_TOKEN_EXPIRES,
        'jti': secrets.token_hex(16)  # Unique token ID
    }

    if extra_claims:
        access_payload.update(extra_claims)

    # Refresh token
    refresh_payload = {
        'sub': user_id,
        'type': 'refresh',
        'iat': now,
        'exp': now + JWT_REFRESH_TOKEN_EXPIRES,
        'jti': secrets.token_hex(16)
    }

    access_token = jwt.encode(access_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    refresh_token = jwt.encode(refresh_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    return {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'token_type': 'Bearer',
        'expires_in': int(JWT_ACCESS_TOKEN_EXPIRES.total_seconds())
    }


def decode_token(token: str, token_type: str = 'access') -> Dict[str, Any]:
    """
    Decode and validate JWT token.

    Args:
        token: JWT token string
        token_type: Expected token type

    Returns:
        Decoded token payload

    Raises:
        AuthenticationError: If token is invalid
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

        # Check token type
        if payload.get('type') != token_type:
            raise AuthenticationError(f'Invalid token type. Expected {token_type}', 401)

        # Check blacklist
        if payload.get('jti') in token_blacklist:
            raise AuthenticationError('Token has been revoked', 401)

        return payload

    except jwt.ExpiredSignatureError:
        raise AuthenticationError('Token has expired', 401)
    except jwt.InvalidTokenError as e:
        raise AuthenticationError(f'Invalid token: {str(e)}', 401)


def get_auth_token() -> Optional[str]:
    """
    Extract token from Authorization header.

    Returns:
        Token string or None
    """
    auth_header = request.headers.get('Authorization')

    if not auth_header:
        return None

    parts = auth_header.split()

    if len(parts) != 2 or parts[0].lower() != 'bearer':
        return None

    return parts[1]


def require_auth(f: Callable) -> Callable:
    """
    Decorator to require authentication on an endpoint.

    Usage:
        @app.route('/api/protected')
        @require_auth
        def protected_endpoint():
            user_id = g.current_user['sub']
            return jsonify({'message': f'Hello {user_id}'})
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_auth_token()

        if not token:
            return jsonify({
                'error': 'Authentication required',
                'message': 'Please provide a valid Bearer token in the Authorization header'
            }), 401

        try:
            payload = decode_token(token)
            g.current_user = payload
            return f(*args, **kwargs)
        except AuthenticationError as e:
            logger.warning(f"Authentication failed: {e.message}")
            return jsonify({
                'error': 'Authentication failed',
                'message': 'Invalid or expired token'
            }), 401

    return decorated


def require_role(role: str):
    """
    Decorator factory to require specific role.

    Usage:
        @app.route('/api/admin')
        @require_auth
        @require_role('admin')
        def admin_endpoint():
            ...
    """
    def decorator(f: Callable) -> Callable:
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(g, 'current_user'):
                return jsonify({'error': 'Authentication required'}), 401

            user_role = g.current_user.get('role')
            if user_role != role:
                logger.warning(f"Access denied: user has role {user_role}, required {role}")
                return jsonify({
                    'error': 'Access denied',
                    'message': f'Required role: {role}'
                }), 403

            return f(*args, **kwargs)
        return decorated
    return decorator


def require_owner_or_admin(resource_user_id: str):
    """
    Check if current user owns resource or is admin.

    Usage:
        @require_auth
        def get_simulation(sim_id):
            sim = get_simulation(sim_id)
            error = require_owner_or_admin(sim['user_id'])
            if error:
                return error
            ...
    """
    if not hasattr(g, 'current_user'):
        return jsonify({'error': 'Authentication required'}), 401

    current_user_id = g.current_user.get('sub')
    user_role = g.current_user.get('role')

    if user_role != 'admin' and current_user_id != resource_user_id:
        return jsonify({
            'error': 'Access denied',
            'message': 'You do not have permission to access this resource'
        }), 403

    return None


def revoke_token(token: str) -> bool:
    """
    Revoke a token (add to blacklist).

    Args:
        token: Token to revoke

    Returns:
        True if revoked successfully
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        jti = payload.get('jti')
        if jti:
            token_blacklist.add(jti)
            logger.info(f"Token revoked: {jti[:8]}...")
            return True
    except jwt.InvalidTokenError:
        pass
    return False


def revoke_all_user_tokens(user_id: str) -> int:
    """
    Revoke all tokens for a user (call on password change, etc.).

    In production, use Redis with user_id prefix matching.

    Args:
        user_id: User ID to revoke

    Returns:
        Number of tokens revoked
    """
    # In production: scan Redis for tokens with user_id prefix
    logger.info(f"Revoking all tokens for user: {user_id}")
    return 0


# Health check endpoint
@require_auth
def auth_health_check():
    """Check authentication service health."""
    return jsonify({
        'status': 'healthy',
        'auth': 'enabled',
        'blacklist_size': len(token_blacklist)
    })


# Mock user database (replace with real database)
MOCK_USERS = {
    'user1': {
        'password_hash': hashlib.sha256('password123'.encode()).hexdigest(),
        'role': 'user'
    },
    'admin1': {
        'password_hash': hashlib.sha256('admin123'.encode()).hexdigest(),
        'role': 'admin'
    }
}


def authenticate_user(username: str, password: str) -> Optional[Dict]:
    """
    Authenticate user credentials.

    Args:
        username: Username
        password: Password

    Returns:
        User data if authenticated, None otherwise
    """
    user = MOCK_USERS.get(username)
    if not user:
        return None

    password_hash = hashlib.sha256(password.encode()).hexdigest()
    if password_hash != user['password_hash']:
        return None

    return {
        'user_id': username,
        'role': user['role']
    }


# Login endpoint handler
def handle_login():
    """Handle login request."""
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    user = authenticate_user(username, password)

    if not user:
        logger.warning(f"Failed login attempt for user: {username}")
        return jsonify({'error': 'Invalid credentials'}), 401

    tokens = generate_tokens(user['user_id'], user['role'])

    logger.info(f"User logged in: {username}")
    return jsonify({
        'success': True,
        'user': {
            'id': user['user_id'],
            'role': user['role']
        },
        **tokens
    })


# Logout endpoint handler
def handle_logout():
    """Handle logout request (revoke token)."""
    token = get_auth_token()

    if token:
        revoke_token(token)

    return jsonify({
        'success': True,
        'message': 'Logged out successfully'
    })


# Refresh token handler
def handle_refresh():
    """Handle token refresh."""
    data = request.get_json()
    refresh_token = data.get('refresh_token') if data else None

    if not refresh_token:
        return jsonify({'error': 'Refresh token required'}), 400

    try:
        payload = decode_token(refresh_token, 'refresh')
        user_id = payload.get('sub')

        # Get user role (in production, fetch from database)
        user = MOCK_USERS.get(user_id, {})
        role = user.get('role', 'user')

        # Revoke old refresh token
        revoke_token(refresh_token)

        # Generate new tokens
        tokens = generate_tokens(user_id, role)

        return jsonify({
            'success': True,
            **tokens
        })

    except AuthenticationError as e:
        return jsonify({'error': e.message}), e.status_code
