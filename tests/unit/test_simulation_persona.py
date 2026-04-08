"""
Unit tests for SimulationPersona model
"""
import pytest
from datetime import datetime


def test_simulation_persona_creation():
    """Test creating a simulation persona"""
    from models.simulation_persona import SimulationPersona

    persona = SimulationPersona(
        id="test-123",
        simulation_id="sim-456",
        name="Test User",
        role="Developer",
        pain_level=8,
        tech_savviness=9
    )

    assert persona.name == "Test User"
    assert persona.pain_level == 8
    assert persona.tech_savviness == 9


def test_simulation_persona_to_dict():
    """Test persona serialization"""
    from models.simulation_persona import SimulationPersona

    persona = SimulationPersona(
        id="test-123",
        simulation_id="sim-456",
        name="Test User",
        role="Developer",
        pain_level=8,
        tech_savviness=9,
        age_range="25-34",
        income_level="high"
    )

    data = persona.to_dict()
    assert data['name'] == "Test User"
    assert data['pain_level'] == 8
    assert data['age_range'] == "25-34"


def test_simulation_persona_optional_fields():
    """Test persona with optional fields"""
    from models.simulation_persona import SimulationPersona

    persona = SimulationPersona(
        id="test-123",
        simulation_id="sim-456",
        name="Test User",
        role="Developer",
        pain_level=5,
        tech_savviness=5,
        goals="Increase productivity",
        frustrations="Manual processes"
    )

    assert persona.goals == "Increase productivity"
    assert persona.frustrations == "Manual processes"
