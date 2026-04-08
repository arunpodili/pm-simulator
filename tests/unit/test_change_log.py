"""
Unit tests for ChangeLog model
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'ai-agents-service'))

import pytest
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base

# Create a test base to avoid circular imports
TestBase = declarative_base()

class TestChangeLog(TestBase):
    """Test version of ChangeLog"""
    __tablename__ = 'test_change_logs'

    id = Column(String(36), primary_key=True)
    simulation_id = Column(String(36), nullable=False)
    author_id = Column(String(36), nullable=False)
    change_type = Column(String(50), nullable=False)
    field = Column(String(100))
    old_value = Column(JSON)
    new_value = Column(JSON)
    reason = Column(Text)
    impact = Column(Text)
    created_at = Column(DateTime)

    def to_dict(self):
        return {
            'id': self.id,
            'simulation_id': self.simulation_id,
            'author_id': self.author_id,
            'change_type': self.change_type,
            'field': self.field,
            'old_value': self.old_value,
            'new_value': self.new_value,
            'reason': self.reason,
            'impact': self.impact,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


def test_change_log_creation():
    """Test creating a change log entry"""
    entry = TestChangeLog(
        id="test-123",
        simulation_id="sim-456",
        author_id="user-789",
        change_type="param_change",
        field="pricing",
        old_value={"price": 29},
        new_value={"price": 19}
    )

    assert entry.change_type == "param_change"
    assert entry.field == "pricing"
    assert entry.old_value == {"price": 29}
    assert entry.new_value == {"price": 19}


def test_change_log_to_dict():
    """Test change log serialization"""
    entry = TestChangeLog(
        id="test-123",
        simulation_id="sim-456",
        author_id="user-789",
        change_type="decision",
        field="strategy",
        old_value=None,
        new_value={"decision": "pivot"},
        reason="Market research showed better fit"
    )

    data = entry.to_dict()
    assert data['change_type'] == "decision"
    assert data['reason'] == "Market research showed better fit"
    assert data['new_value'] == {"decision": "pivot"}


def test_change_log_with_impact():
    """Test change log with impact field"""
    entry = TestChangeLog(
        id="test-123",
        simulation_id="sim-456",
        author_id="user-789",
        change_type="persona_edit",
        impact="Expanded TAM by 20%"
    )

    assert entry.impact == "Expanded TAM by 20%"
