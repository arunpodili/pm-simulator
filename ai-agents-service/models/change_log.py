"""
ChangeLog Model - Track changes to simulations
"""
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base


class ChangeLog(Base):
    """Track changes to simulations"""
    __tablename__ = 'change_logs'

    id = Column(String(36), primary_key=True)
    simulation_id = Column(String(36), ForeignKey('simulations.id'), nullable=False, index=True)
    author_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    change_type = Column(String(50), nullable=False)  # param_change, persona_edit, result_note, decision
    field = Column(String(100))
    old_value = Column(JSON)
    new_value = Column(JSON)
    reason = Column(Text)
    impact = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    simulation = relationship("Simulation", back_populates="change_logs")
    author = relationship("User")

    def to_dict(self):
        """Convert change log entry to dictionary"""
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
