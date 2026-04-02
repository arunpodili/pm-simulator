"""
Webhook System

Provides webhook registration, delivery, and management.
"""

import hmac
import hashlib
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from flask import Blueprint, request, jsonify, g
import requests
import logging

from database import db_manager, Webhook
from auth_middleware import require_auth

logger = logging.getLogger(__name__)

bp = Blueprint('webhooks', __name__, url_prefix='/api/v2/webhooks')


class WebhookManager:
    """Manage webhook delivery."""

    @staticmethod
    def register_webhook(user_id: str, url: str, events: List[str]) -> Optional[Dict]:
        """Register new webhook."""
        import uuid
        from database import Webhook

        webhook_id = str(uuid.uuid4())
        secret = secrets.token_urlsafe(32)

        session = db_manager.get_session()
        try:
            webhook = Webhook(
                id=webhook_id,
                user_id=user_id,
                url=url,
                events=events,
                secret=secret,
                is_active=True
            )
            session.add(webhook)
            session.commit()

            return {
                'id': webhook_id,
                'url': url,
                'events': events,
                'secret': secret,  # Show only once
                'is_active': True
            }
        except Exception as e:
            session.rollback()
            logger.error(f"Failed to register webhook: {e}")
            return None
        finally:
            session.close()

    @staticmethod
    def deliver_webhook(webhook: Webhook, event: str, payload: Dict) -> bool:
        """Deliver webhook payload."""
        try:
            # Generate signature
            payload_str = json.dumps(payload, sort_keys=True)
            signature = hmac.new(
                webhook.secret.encode(),
                payload_str.encode(),
                hashlib.sha256
            ).hexdigest()

            response = requests.post(
                webhook.url,
                json=payload,
                headers={
                    'X-Webhook-Signature': f'sha256={signature}',
                    'X-Webhook-Event': event,
                    'Content-Type': 'application/json'
                },
                timeout=30
            )

            success = response.status_code < 400

            if not success:
                logger.warning(f"Webhook delivery failed: {webhook.url} - {response.status_code}")

            return success

        except Exception as e:
            logger.error(f"Webhook delivery error: {e}")
            return False

    @staticmethod
    def get_webhooks_for_user(user_id: str) -> List[Dict]:
        """Get all webhooks for user."""
        session = db_manager.get_session()
        try:
            webhooks = session.query(Webhook).filter_by(user_id=user_id).all()
            return [
                {
                    'id': w.id,
                    'url': w.url,
                    'events': w.events,
                    'is_active': w.is_active,
                    'created_at': w.created_at.isoformat()
                }
                for w in webhooks
            ]
        finally:
            session.close()


def trigger_webhook(event: str, payload: Dict, user_id: Optional[str] = None):
    """Trigger webhooks for an event."""
    session = db_manager.get_session()
    try:
        query = session.query(Webhook).filter(
            Webhook.is_active == True,
            Webhook.events.contains([event])
        )

        if user_id:
            query = query.filter(Webhook.user_id == user_id)

        webhooks = query.all()

        for webhook in webhooks:
            # Deliver asynchronously (in production, use Celery)
            WebhookManager.deliver_webhook(webhook, event, payload)

    except Exception as e:
        logger.error(f"Failed to trigger webhooks: {e}")
    finally:
        session.close()


# Webhook Routes
@bp.route('', methods=['GET'])
@require_auth
def list_webhooks():
    """List user's webhooks."""
    user_id = g.current_user.get('sub')
    webhooks = WebhookManager.get_webhooks_for_user(user_id)
    return jsonify({'success': True, 'data': webhooks})


@bp.route('', methods=['POST'])
@require_auth
def create_webhook():
    """Create new webhook."""
    user_id = g.current_user.get('sub')
    data = request.get_json()

    if not data or 'url' not in data or 'events' not in data:
        return jsonify({'error': 'URL and events required'}), 400

    webhook = WebhookManager.register_webhook(
        user_id,
        data['url'],
        data['events']
    )

    if webhook:
        return jsonify({'success': True, 'data': webhook}), 201
    else:
        return jsonify({'error': 'Failed to create webhook'}), 500


@bp.route('/<webhook_id>', methods=['DELETE'])
@require_auth
def delete_webhook(webhook_id: str):
    """Delete webhook."""
    user_id = g.current_user.get('sub')

    session = db_manager.get_session()
    try:
        webhook = session.query(Webhook).filter_by(id=webhook_id, user_id=user_id).first()
        if not webhook:
            return jsonify({'error': 'Webhook not found'}), 404

        session.delete(webhook)
        session.commit()

        return jsonify({'success': True, 'message': 'Webhook deleted'})
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()
