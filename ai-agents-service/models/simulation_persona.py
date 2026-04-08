"""
SimulationPersona Model - Custom personas defined by users for simulation
"""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class SimulationPersona(Base):
    """Custom personas defined by users for simulation"""
    __tablename__ = 'simulation_personas'

    id = Column(String(36), primary_key=True)
    simulation_id = Column(String(36), ForeignKey('simulations.id'), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    pain_level = Column(Integer, nullable=False)  # 1-10
    tech_savviness = Column(Integer, nullable=False)  # 1-10
    age_range = Column(String(20))
    income_level = Column(String(20))
    goals = Column(Text)
    frustrations = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    # Relationship
    simulation = relationship("Simulation", back_populates="custom_personas")

    def to_dict(self):
        """Convert persona to dictionary"""
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
