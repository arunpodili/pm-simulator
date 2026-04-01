"""
MiroFish-inspired User Simulation Engine
Multi-agent system for simulating user behavior before product launch

Lazy imports to avoid circular dependencies and slow startup
"""

__all__ = ['SimulationEngine', 'PersonaGenerator', 'UserAgent']

# Lazy imports - only load when accessed
def __getattr__(name):
    if name == 'SimulationEngine':
        from .simulation_engine import SimulationEngine
        return SimulationEngine
    elif name == 'PersonaGenerator':
        from .persona_generator import PersonaGenerator
        return PersonaGenerator
    elif name == 'UserAgent':
        from .user_agent import UserAgent
        return UserAgent
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
