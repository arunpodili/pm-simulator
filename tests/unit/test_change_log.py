"""
Unit tests for ChangeLog model
"""
import pytest
from datetime import datetime


def test_change_log_creation():
    """Test creating a change log entry"""
    from models.change_log import ChangeLog

    entry = ChangeLog(
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
    from models.change_log import ChangeLog

    entry = ChangeLog(
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
    from models.change_log import ChangeLog

    entry = ChangeLog(
        id="test-123",
        simulation_id="sim-456",
        author_id="user-789",
        change_type="persona_edit",
        impact="Expanded TAM by 20%"
    )

    assert entry.impact == "Expanded TAM by 20%"
