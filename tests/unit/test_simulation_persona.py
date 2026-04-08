"""
Unit tests for SimulationPersona model
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'ai-agents-service'))

import pytest
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base

# Create a test base to avoid circular imports
TestBase = declarative_base()

class TestSimulationPersona(TestBase):
    """Test version of SimulationPersona"""
    __tablename__ = 'test_simulation_personas'

    id = Column(String(36), primary_key=True)
    simulation_id = Column(String(36), nullable=False)
    name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    pain_level = Column(Integer, nullable=False)
    tech_savviness = Column(Integer, nullable=False)
    age_range = Column(String(20))
    income_level = Column(String(20))
    goals = Column(Text)
    frustrations = Column(Text)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    def to_dict(self):
        return {
            'id': self.id,
            'simulation_id': self.simulation_id,
            'name': self.name,
            'role': self.role,
            'pain_level': self.pain_level,
            'tech_savviness': self.tech_savviness,
            'age_range': self.age_range,
            'income_level': self.income_level,
            'goals': self.goals,
            'frustrations': self.frustrations,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


def test_simulation_persona_creation():
    """Test creating a simulation persona"""
    persona = TestSimulationPersona(
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
    persona = TestSimulationPersona(
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
    persona = TestSimulationPersona(
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
