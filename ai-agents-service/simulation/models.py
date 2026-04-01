"""
Data models for the simulation engine
"""
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import uuid


class AdoptionArchetype(str, Enum):
    INNOVATOR = "innovator"          # 2.5% - Tech enthusiasts
    EARLY_ADOPTER = "early_adopter"   # 13.5% - Visionaries
    EARLY_MAJORITY = "early_majority" # 34% - Pragmatists
    LATE_MAJORITY = "late_majority"   # 34% - Conservatives
    LAGGARD = "laggard"               # 16% - Skeptics


class UserAction(str, Enum):
    DISCOVER = "discover"           # Found the product
    SIGNUP = "signup"               # Created account
    ACTIVATE = "activate"           # Completed onboarding
    ENGAGE = "engage"               # Regular usage
    UPGRADE = "upgrade"             # Paid/premium
    CHURN = "churn"                 # Stopped using
    ADVOCATE = "advocate"           # Referred others
    COMPLAIN = "complain"           # Negative feedback


@dataclass
class Demographics:
    age: int
    location: str
    income_level: str  # low, medium, high
    education: str
    occupation: str
    tech_savviness: int  # 1-10
    industry: str


@dataclass
class BehavioralTraits:
    archetype: AdoptionArchetype
    price_sensitivity: int  # 1-10
    feature_preference: str  # simplicity, power, speed, security
    switching_cost_tolerance: str  # low, medium, high
    decision_making_style: str  # impulsive, analytical, social, cautious
    pain_tolerance: int  # 1-10
    support_expectation: str  # self-service, hand-holding, community


@dataclass
class Context:
    current_pain_level: int  # 1-10 - how badly they need this solution
    alternatives_used: List[str]  # Competitors they currently use
    budget_constraints: Optional[str]
    decision_making_power: str  # individual, team, enterprise
    timeline_urgency: str  # immediate, short-term, long-term


@dataclass
class Memory:
    """Agent's memory of experiences"""
    experiences: List[Dict[str, Any]] = field(default_factory=list)
    brand_sentiment: Dict[str, int] = field(default_factory=dict)
    previous_interactions: List[str] = field(default_factory=list)
    trusted_referrers: List[str] = field(default_factory=list)

    def add_experience(self, experience: Dict[str, Any]):
        self.experiences.append({
            **experience,
            'timestamp': datetime.now().isoformat()
        })

    def update_sentiment(self, brand: str, delta: int):
        current = self.brand_sentiment.get(brand, 0)
        self.brand_sentiment[brand] = max(-10, min(10, current + delta))


@dataclass
class UserPersona:
    """Complete user persona for simulation"""
    id: str
    name: str
    demographics: Demographics
    behavioral: BehavioralTraits
    context: Context
    memory: Memory = field(default_factory=Memory)

    # Simulation state
    current_state: str = "unaware"
    satisfaction_score: float = 0.0  # -10 to 10
    engagement_level: float = 0.0     # 0 to 1
    days_since_discovery: int = 0
    actions_taken: List[Dict[str, Any]] = field(default_factory=list)

    def __post_init__(self):
        if not self.id:
            self.id = str(uuid.uuid4())[:8]


@dataclass
class SimulationConfig:
    """Configuration for a simulation run"""
    name: str
    feature_description: str
    target_industry: str
    persona_count: int = 1000
    simulation_days: int = 90
    random_seed: Optional[int] = None
    features: List[str] = field(default_factory=list)
    pricing_tiers: List[Dict[str, Any]] = field(default_factory=list)
    pain_points_solved: List[str] = field(default_factory=list)
    differentiators: List[str] = field(default_factory=list)
    market_saturation: float = 0.5  # 0-1
    competitor_strength: float = 0.5  # 0-1
    marketing_spend_level: str = "medium"  # low, medium, high


@dataclass
class SimulationResult:
    """Results from a simulation run"""
    simulation_id: str
    config: SimulationConfig
    personas: List[UserPersona]
    timeline: List[Dict[str, Any]]  # Day-by-day events
    final_metrics: Dict[str, Any]
    cohort_analysis: Dict[str, Any]
    generated_at: datetime = field(default_factory=datetime.now)
    predicted_adoption_curve: List[float] = field(default_factory=list)
    predicted_churn_rate: float = 0.0
    predicted_nps: float = 0.0
    predicted_clv: float = 0.0


@dataclass
class SocialConnection:
    """Social graph connection between agents"""
    source_id: str
    target_id: str
    relationship_type: str  # friend, colleague, influencer, family
    influence_strength: float  # 0-1
    trust_level: float  # 0-1
