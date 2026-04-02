"""
Compression Middleware - GZIP Response Compression

Automatically compresses JSON responses to reduce bandwidth.
"""

import gzip
import json
from functools import wraps
from flask import request, after_this_request, make_response
import logging

logger = logging.getLogger(__name__)


def compress_response(f):
    """
    Decorator to compress response with gzip.

    Usage:
        @app.route('/api/large-data')
        @compress_response
        def get_large_data():
            return large_json_response
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        @after_this_request
        def compressor(response):
            # Check if client accepts gzip
            accept_encoding = request.headers.get('Accept-Encoding', '')

            if 'gzip' not in accept_encoding.lower():
                return response

            # Don't compress if already compressed or small
            if response.direct_passthrough or response.content_length < 500:
                return response

            try:
                # Compress response
                response.direct_passthrough = False
                data = response.get_data()
                compressed = gzip.compress(data, compresslevel=6)

                # Only use compression if it saves space
                if len(compressed) < len(data):
                    response.set_data(compressed)
                    response.headers['Content-Encoding'] = 'gzip'
                    response.headers['Content-Length'] = len(compressed)
                    logger.debug(f"Compressed response: {len(data)} -> {len(compressed)} bytes")

            except Exception as e:
                logger.error(f"Compression error: {e}")

            return response

        return f(*args, **kwargs)

    return decorated_function


class CompressedJSONResponse:
    """Helper class for compressed JSON responses."""

    @staticmethod
    def make(data, status_code=200):
        """Create compressed JSON response."""
        json_str = json.dumps(data)
        json_bytes = json_str.encode('utf-8')

        accept_encoding = request.headers.get('Accept-Encoding', '')

        if 'gzip' in accept_encoding.lower() and len(json_bytes) > 500:
            compressed = gzip.compress(json_bytes, compresslevel=6)
            response = make_response(compressed, status_code)
            response.headers['Content-Type'] = 'application/json'
            response.headers['Content-Encoding'] = 'gzip'
            response.headers['Content-Length'] = len(compressed)
        else:
            response = make_response(json_str, status_code)
            response.headers['Content-Type'] = 'application/json'

        return response


def init_compression(app):
    """Initialize compression for Flask app."""
    @app.after_request
    def after_request(response):
        # Auto-compress JSON responses > 1KB
        if response.content_type == 'application/json' and response.status_code == 200:
            if response.content_length and response.content_length > 1024:
                accept_encoding = request.headers.get('Accept-Encoding', '')

                if 'gzip' in accept_encoding.lower():
                    try:
                        data = response.get_data()
                        compressed = gzip.compress(data, compresslevel=6)

                        if len(compressed) < len(data):
                            response.set_data(compressed)
                            response.headers['Content-Encoding'] = 'gzip'
                            response.headers['Content-Length'] = len(compressed)
                    except Exception as e:
                        logger.error(f"Auto-compression error: {e}")

        return response

    logger.info("Response compression enabled")
