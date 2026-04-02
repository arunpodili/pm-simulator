"""
Database Models - SQLAlchemy ORM

Provides persistent storage for simulations, users, and results.
"""

from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy import (
    create_engine, Column, String, Integer, Float, DateTime,
    JSON, Boolean, ForeignKey, Text, Index
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.pool import QueuePool
import os
import logging

logger = logging.getLogger(__name__)

Base = declarative_base()


class User(Base):
    """User account model."""
    __tablename__ = 'users'

    id = Column(String(36), primary_key=True)
    username = Column(String(255), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default='user')  # user, admin
    tier = Column(String(50), default='free')  # free, paid
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    # Relationships
    simulations = relationship("Simulation", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'tier': self.tier,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }


class Simulation(Base):
    """Simulation model for persistent storage."""
    __tablename__ = 'simulations'

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey('users.id'), nullable=False, index=True)

    # Configuration
    name = Column(String(255), nullable=False)
    feature_description = Column(Text, nullable=True)
    target_industry = Column(String(50), default='saas')
    persona_count = Column(Integer, default=1000)
    simulation_days = Column(Integer, default=90)
    random_seed = Column(Integer, nullable=True)
    features = Column(JSON, default=list)
    pricing_tiers = Column(JSON, default=list)
    pain_points_solved = Column(JSON, default=list)
    differentiators = Column(JSON, default=list)
    market_saturation = Column(Float, default=0.5)
    competitor_strength = Column(Float, default=0.5)
    marketing_spend_level = Column(String(50), default='medium')

    # Status
    status = Column(String(50), default='pending')  # pending, queued, running, completed, failed
    progress = Column(Float, default=0.0)
    task_id = Column(String(255), nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="simulations")
    result = relationship("SimulationResult", back_populates="simulation", uselist=False, cascade="all, delete-orphan")
    timeline = relationship("SimulationTimeline", back_populates="simulation", cascade="all, delete-orphan")

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'feature_description': self.feature_description,
            'target_industry': self.target_industry,
            'persona_count': self.persona_count,
            'simulation_days': self.simulation_days,
            'random_seed': self.random_seed,
            'status': self.status,
            'progress': self.progress,
            'task_id': self.task_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }


class SimulationResult(Base):
    """Simulation results model."""
    __tablename__ = 'simulation_results'

    id = Column(String(36), primary_key=True)
    simulation_id = Column(String(36), ForeignKey('simulations.id'), unique=True, nullable=False, index=True)

    # Metrics
    total_personas = Column(Integer, default=0)
    conversion_rate = Column(Float, default=0.0)
    churn_rate = Column(Float, default=0.0)
    nps = Column(Float, default=0.0)
    clv = Column(Float, default=0.0)

    # Detailed metrics
    final_metrics = Column(JSON, default=dict)
    adoption_curve = Column(JSON, default=list)
    cohort_analysis = Column(JSON, default=dict)

    # Predictions
    predicted_churn_rate = Column(Float, nullable=True)
    predicted_nps = Column(Float, nullable=True)
    predicted_clv = Column(Float, nullable=True)
    predicted_adoption_curve = Column(JSON, default=list)

    # Validation
    validation_report = Column(JSON, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    simulation = relationship("Simulation", back_populates="result")

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'simulation_id': self.simulation_id,
            'total_personas': self.total_personas,
            'conversion_rate': self.conversion_rate,
            'churn_rate': self.churn_rate,
            'nps': self.nps,
            'clv': self.clv,
            'final_metrics': self.final_metrics,
            'predicted_churn_rate': self.predicted_churn_rate,
            'predicted_nps': self.predicted_nps,
            'predicted_clv': self.predicted_clv,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class SimulationTimeline(Base):
    """Daily simulation timeline data."""
    __tablename__ = 'simulation_timeline'

    id = Column(Integer, primary_key=True, autoincrement=True)
    simulation_id = Column(String(36), ForeignKey('simulations.id'), nullable=False, index=True)
    day = Column(Integer, nullable=False)

    # Daily metrics
    new_users = Column(Integer, default=0)
    churned = Column(Integer, default=0)
    conversions = Column(Integer, default=0)
    revenue = Column(Float, default=0.0)
    satisfaction = Column(Float, default=0.0)
    active_users = Column(Integer, default=0)

    # Relationships
    simulation = relationship("Simulation", back_populates="timeline")

    __table_args__ = (
        Index('idx_simulation_day', 'simulation_id', 'day'),
    )


class APILog(Base):
    """API request logging model."""
    __tablename__ = 'api_logs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), nullable=True, index=True)
    endpoint = Column(String(255), nullable=False, index=True)
    method = Column(String(10), nullable=False)
    status_code = Column(Integer, nullable=True)
    response_time_ms = Column(Integer, nullable=True)
    ip_address = Column(String(45), nullable=True)  # IPv6 compatible
    user_agent = Column(String(512), nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


# Database connection management
class DatabaseManager:
    """Manages database connections and sessions."""

    def __init__(self, database_url: Optional[str] = None):
        self.database_url = database_url or os.getenv(
            'DATABASE_URL',
            'postgresql://postgres:postgres@localhost:5432/pm_simulator'
        )
        self.engine = None
        self.SessionLocal = None

    def init_engine(self):
        """Initialize database engine."""
        self.engine = create_engine(
            self.database_url,
            poolclass=QueuePool,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True,  # Verify connections before using
            pool_recycle=3600,   # Recycle connections after 1 hour
            echo=os.getenv('SQLALCHEMY_ECHO', 'false').lower() == 'true'
        )

        self.SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.engine
        )

        logger.info("Database engine initialized")

    def create_tables(self):
        """Create all database tables."""
        if not self.engine:
            self.init_engine()
        Base.metadata.create_all(bind=self.engine)
        logger.info("Database tables created")

    def drop_tables(self):
        """Drop all database tables (use with caution)."""
        if not self.engine:
            self.init_engine()
        Base.metadata.drop_all(bind=self.engine)
        logger.info("Database tables dropped")

    def get_session(self):
        """Get database session."""
        if not self.SessionLocal:
            self.init_engine()
        return self.SessionLocal()

    def close(self):
        """Close database connections."""
        if self.engine:
            self.engine.dispose()
            logger.info("Database connections closed")


# Singleton instance
db_manager = DatabaseManager()


def get_db_session():
    """Get database session context manager."""
    session = db_manager.get_session()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def init_database(app=None):
    """Initialize database with Flask app."""
    db_manager.init_engine()
    db_manager.create_tables()

    if app:
        # Register teardown handler
        @app.teardown_appcontext
        def shutdown_session(exception=None):
            db_manager.close()

    logger.info("Database initialized")


# Utility functions

def get_user_simulations(session, user_id: str, limit: int = 100) -> list:
    """Get user's simulations ordered by creation date."""
    return session.query(Simulation).filter(
        Simulation.user_id == user_id
    ).order_by(
        Simulation.created_at.desc()
    ).limit(limit).all()


def get_simulation_with_result(session, sim_id: str) -> Optional[Simulation]:
    """Get simulation with its result."""
    return session.query(Simulation).filter(
        Simulation.id == sim_id
    ).first()


def create_simulation_db(session, sim_id: str, user_id: str, config: Dict) -> Simulation:
    """Create simulation record in database."""
    simulation = Simulation(
        id=sim_id,
        user_id=user_id,
        name=config.get('name', 'Untitled'),
        feature_description=config.get('feature_description', ''),
        target_industry=config.get('target_industry', 'saas'),
        persona_count=config.get('persona_count', 1000),
        simulation_days=config.get('simulation_days', 90),
        random_seed=config.get('random_seed'),
        features=config.get('features', []),
        pricing_tiers=config.get('pricing_tiers', []),
        pain_points_solved=config.get('pain_points_solved', []),
        differentiators=config.get('differentiators', []),
        market_saturation=config.get('market_saturation', 0.5),
        competitor_strength=config.get('competitor_strength', 0.5),
        marketing_spend_level=config.get('marketing_spend_level', 'medium'),
        status='pending'
    )
    session.add(simulation)
    session.flush()
    return simulation


def update_simulation_status_db(session, sim_id: str, status: str, **kwargs):
    """Update simulation status and fields."""
    simulation = session.query(Simulation).filter(Simulation.id == sim_id).first()
    if simulation:
        simulation.status = status
        if status == 'running' and not simulation.started_at:
            simulation.started_at = datetime.utcnow()
        if status in ['completed', 'failed']:
            simulation.completed_at = datetime.utcnow()

        # Update other fields
        for key, value in kwargs.items():
            if hasattr(simulation, key):
                setattr(simulation, key, value)

        session.flush()
    return simulation


def create_simulation_result_db(session, sim_id: str, result_data: Dict):
    """Create simulation result record."""
    result = SimulationResult(
        id=f"{sim_id}_result",
        simulation_id=sim_id,
        total_personas=result_data.get('total_personas', 0),
        conversion_rate=result_data.get('conversion_rate', 0),
        churn_rate=result_data.get('churn_rate', 0),
        nps=result_data.get('nps', 0),
        clv=result_data.get('clv', 0),
        final_metrics=result_data.get('final_metrics', {}),
        adoption_curve=result_data.get('adoption_curve', []),
        cohort_analysis=result_data.get('cohort_analysis', {}),
        predicted_churn_rate=result_data.get('predicted_churn_rate'),
        predicted_nps=result_data.get('predicted_nps'),
        predicted_clv=result_data.get('predicted_clv'),
        predicted_adoption_curve=result_data.get('predicted_adoption_curve', [])
    )
    session.add(result)
    session.flush()
    return result


def log_api_request(session, user_id: Optional[str], endpoint: str, method: str,
                   status_code: Optional[int] = None, response_time_ms: Optional[int] = None,
                   ip_address: Optional[str] = None, user_agent: Optional[str] = None,
                   error_message: Optional[str] = None):
    """Log API request."""
    log = APILog(
        user_id=user_id,
        endpoint=endpoint,
        method=method,
        status_code=status_code,
        response_time_ms=response_time_ms,
        ip_address=ip_address,
        user_agent=user_agent,
        error_message=error_message
    )
    session.add(log)
    session.flush()
    return log
