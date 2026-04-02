"""
Unit Tests for Authentication Middleware
"""

import pytest
import jwt
from datetime import datetime, timedelta
from unittest.mock import patch, MagicMock

# Import after path setup
from auth_middleware import (
    generate_tokens,
    decode_token,
    get_auth_token,
    require_auth,
    require_role,
    revoke_token,
    authenticate_user,
    JWT_SECRET,
    JWT_ALGORITHM
)


class TestTokenGeneration:
    """Test JWT token generation."""

    def test_generate_access_token(self):
        """Test access token generation."""
        tokens = generate_tokens('user123', 'user')

        assert 'access_token' in tokens
        assert 'refresh_token' in tokens
        assert tokens['token_type'] == 'Bearer'
        assert tokens['expires_in'] == 3600

    def test_token_contains_correct_claims(self):
        """Test token contains required claims."""
        tokens = generate_tokens('user123', 'admin', {'extra': 'data'})
        payload = jwt.decode(tokens['access_token'], JWT_SECRET, algorithms=[JWT_ALGORITHM])

        assert payload['sub'] == 'user123'
        assert payload['role'] == 'admin'
        assert payload['type'] == 'access'
        assert payload['extra'] == 'data'
        assert 'exp' in payload
        assert 'iat' in payload
        assert 'jti' in payload


class TestTokenDecoding:
    """Test token decoding and validation."""

    def test_decode_valid_token(self):
        """Test decoding a valid token."""
        tokens = generate_tokens('user123', 'user')
        payload = decode_token(tokens['access_token'])

        assert payload['sub'] == 'user123'
        assert payload['role'] == 'user'

    def test_decode_expired_token(self):
        """Test decoding an expired token."""
        # Create expired token
        expired_payload = {
            'sub': 'user123',
            'role': 'user',
            'type': 'access',
            'exp': datetime.utcnow() - timedelta(hours=1),
            'iat': datetime.utcnow() - timedelta(hours=2)
        }
        expired_token = jwt.encode(expired_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

        with pytest.raises(Exception) as exc_info:
            decode_token(expired_token)

        assert 'expired' in str(exc_info.value).lower()

    def test_decode_invalid_token(self):
        """Test decoding an invalid token."""
        with pytest.raises(Exception) as exc_info:
            decode_token('invalid.token.here')

        assert 'invalid' in str(exc_info.value).lower()


class TestRequireAuth:
    """Test authentication decorator."""

    def test_require_auth_with_valid_token(self):
        """Test decorator with valid token."""
        tokens = generate_tokens('user123', 'user')

        @require_auth
        def protected_endpoint():
            return {'message': 'success'}

        # Mock Flask's request and g
        with patch('auth_middleware.request') as mock_request, \
             patch('auth_middleware.g') as mock_g:
            mock_request.headers.get.return_value = f'Bearer {tokens["access_token"]}'

            result = protected_endpoint()
            assert result['message'] == 'success'
            assert mock_g.current_user is not None

    def test_require_auth_without_token(self):
        """Test decorator without token."""
        @require_auth
        def protected_endpoint():
            return {'message': 'success'}

        with patch('auth_middleware.request') as mock_request:
            mock_request.headers.get.return_value = None

            result, status = protected_endpoint()
            assert status == 401
            assert 'error' in result


class TestRoleBasedAccess:
    """Test role-based access control."""

    def test_require_role_success(self):
        """Test role check with correct role."""
        tokens = generate_tokens('admin1', 'admin')

        @require_auth
        @require_role('admin')
        def admin_endpoint():
            return {'message': 'admin success'}

        with patch('auth_middleware.request') as mock_request, \
             patch('auth_middleware.g') as mock_g:
            mock_request.headers.get.return_value = f'Bearer {tokens["access_token"]}'
            payload = jwt.decode(tokens['access_token'], JWT_SECRET, algorithms=[JWT_ALGORITHM])
            mock_g.current_user = payload

            result = admin_endpoint()
            assert result['message'] == 'admin success'

    def test_require_role_failure(self):
        """Test role check with wrong role."""
        tokens = generate_tokens('user1', 'user')

        @require_auth
        @require_role('admin')
        def admin_endpoint():
            return {'message': 'admin success'}

        with patch('auth_middleware.request') as mock_request, \
             patch('auth_middleware.g') as mock_g:
            mock_request.headers.get.return_value = f'Bearer {tokens["access_token"]}'
            payload = jwt.decode(tokens['access_token'], JWT_SECRET, algorithms=[JWT_ALGORITHM])
            mock_g.current_user = payload

            result, status = admin_endpoint()
            assert status == 403
            assert 'error' in result


class TestTokenRevocation:
    """Test token revocation."""

    def test_revoke_token(self):
        """Test token revocation."""
        tokens = generate_tokens('user123', 'user')
        access_token = tokens['access_token']

        # Revoke token
        assert revoke_token(access_token) == True

        # Try to use revoked token
        with pytest.raises(Exception) as exc_info:
            decode_token(access_token)

        assert 'revoked' in str(exc_info.value).lower()


class TestUserAuthentication:
    """Test user authentication."""

    def test_authenticate_user_success(self):
        """Test successful user authentication."""
        result = authenticate_user('user1', 'password123')
        assert result is not None
        assert result['user_id'] == 'user1'
        assert result['role'] == 'user'

    def test_authenticate_user_failure(self):
        """Test failed user authentication."""
        result = authenticate_user('user1', 'wrong_password')
        assert result is None

    def test_authenticate_nonexistent_user(self):
        """Test authentication for non-existent user."""
        result = authenticate_user('nonexistent', 'password')
        assert result is None


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
