"""
Simulation Engine - Orchestrates multi-agent user simulation
Manages the day-by-day simulation loop, social graph, and result aggregation
"""
import random
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
from collections import defaultdict
import numpy as np

from .models import (
    SimulationConfig, SimulationResult, UserPersona, UserAction,
    SocialConnection
)
from .persona_generator import PersonaGenerator
from .user_agent import UserAgent


class SimulationEngine:
    """
    Main engine for running user simulations
    Inspired by MiroFish's parallel digital world concept
    """

    def __init__(self):
        self.agents: Dict[str, UserAgent] = {}
        self.social_graph: Dict[str, List[SocialConnection]] = defaultdict(list)
        self.timeline: List[Dict[str, Any]] = []
        self.current_day = 0

    def run_simulation(self, config: SimulationConfig) -> SimulationResult:
        """
        Run a complete simulation based on the configuration

        Args:
            config: SimulationConfig with all parameters

        Returns:
            SimulationResult with full results and metrics
        """
        # Initialize
        self._initialize_simulation(config)

        # Run day-by-day simulation
        for day in range(config.simulation_days):
            self.current_day = day
            daily_events = self._process_day(config)
            self.timeline.append({
                'day': day,
                'events': daily_events,
                'metrics': self._calculate_daily_metrics()
            })

        # Generate results
        result = self._compile_results(config)
        return result

    def _initialize_simulation(self, config: SimulationConfig):
        """Initialize the simulation state"""
        # Generate personas
        generator = PersonaGenerator(seed=config.random_seed)

        self.personas = generator.generate_personas(
            count=config.persona_count,
            industry=config.target_industry,
            feature_description=config.feature_description
        )

        # Create agents
        self.agents = {}
        for persona in self.personas:
            agent = UserAgent(persona)
            self.agents[persona.id] = agent

        # Generate social graph
        connections = generator.generate_social_graph(
            self.personas,
            connection_density=0.1
        )

        self.social_graph = defaultdict(list)
        for source_id, target_id, influence in connections:
            connection = SocialConnection(
                source_id=source_id,
                target_id=target_id,
                relationship_type=random.choice(['friend', 'colleague', 'influencer']),
                influence_strength=influence,
                trust_level=random.uniform(0.3, 0.9)
            )
            self.social_graph[source_id].append(connection)

        # Reset timeline
        self.timeline = []
        self.current_day = 0

    def _process_day(self, config: SimulationConfig) -> List[Dict[str, Any]]:
        """Process one day of simulation"""
        events = []
        feature_state = self._get_feature_state(config)
        market_conditions = self._get_market_conditions(config)

        # Process each agent
        for agent_id, agent in self.agents.items():
            action = agent.process_day(
                self.current_day,
                feature_state,
                market_conditions
            )

            if action:
                events.append({
                    'agent_id': agent_id,
                    'action': action.value,
                    'previous_state': self._get_previous_state(agent_id),
                    'current_state': agent.persona.current_state,
                    'satisfaction': agent.persona.satisfaction_score
                })

                # Propagate social influence
                if action in [UserAction.ADVOCATE, UserAction.CHURN, UserAction.COMPLAIN]:
                    self._propagate_influence(agent_id, action)

        # Apply viral effects (word of mouth)
        if self.current_day > 7:  # Give time for discovery first
            self._apply_viral_effects()

        return events

    def _propagate_influence(self, agent_id: str, action: UserAction):
        """Propagate agent's action to connected agents"""
        agent = self.agents[agent_id]
        connections = self.social_graph.get(agent_id, [])

        for connection in connections:
            target_agent = self.agents.get(connection.target_id)
            if target_agent:
                # Calculate influence strength
                sentiment = 1.0 if action == UserAction.ADVOCATE else -0.5
                if action == UserAction.CHURN:
                    sentiment = -0.3

                influence = connection.influence_strength * connection.trust_level * sentiment

                target_agent.receive_influence(
                    agent_id,
                    action,
                    influence
                )

    def _apply_viral_effects(self):
        """Apply viral/word-of-mouth effects"""
        # Count active advocates
        advocates = [
            a for a in self.agents.values()
            if a.persona.current_state in ['engaged', 'advocate', 'premium']
            and a.persona.satisfaction_score > 5
        ]

        # Each advocate has chance to bring in new users
        for advocate in advocates:
            viral_prob = 0.001 * advocate.persona.satisfaction_score / 10

            if random.random() < viral_prob:
                # Create a new user through word of mouth
                # This simulates organic growth
                pass  # In a full implementation, would add new agents

    def _get_feature_state(self, config: SimulationConfig) -> Dict[str, Any]:
        """Get current feature state"""
        return {
            'features': config.features,
            'pain_points_solved': config.pain_points_solved,
            'feature_quality': 7,  # Could vary over time
            'has_friction': self.current_day < 14,  # Early friction
            'has_premium': len(config.pricing_tiers) > 1,
            'has_guided_onboarding': self.current_day > 7,
            'win_back_campaign': self.current_day > 60,
            'primary_benefit': config.differentiators[0] if config.differentiators else 'convenience',
            'pain_relief': 7,
        }

    def _get_market_conditions(self, config: SimulationConfig) -> Dict[str, Any]:
        """Get current market conditions"""
        return {
            'marketing_spend': config.marketing_spend_level,
            'market_saturation': config.market_saturation,
            'competitor_strength': config.competitor_strength,
            'competitor_promotion': self.current_day % 30 == 0,  # Monthly promotions
        }

    def _get_previous_state(self, agent_id: str) -> str:
        """Get agent's previous state from timeline"""
        if not self.timeline:
            return 'unaware'
        last_day = self.timeline[-1]
        for event in last_day['events']:
            if event['agent_id'] == agent_id:
                return event['current_state']
        return self.agents[agent_id].persona.current_state

    def _calculate_daily_metrics(self) -> Dict[str, Any]:
        """Calculate metrics for the current day"""
        states = defaultdict(int)
        satisfactions = []
        engagements = []

        for agent in self.agents.values():
            states[agent.persona.current_state] += 1
            satisfactions.append(agent.persona.satisfaction_score)
            engagements.append(agent.persona.engagement_level)

        return {
            'state_distribution': dict(states),
            'avg_satisfaction': np.mean(satisfactions) if satisfactions else 0,
            'avg_engagement': np.mean(engagements) if engagements else 0,
            'total_active': states.get('active', 0) + states.get('engaged', 0) + states.get('premium', 0),
            'total_signed_up': sum(v for k, v in states.items() if k != 'unaware'),
            'total_churned': states.get('churned', 0),
        }

    def _compile_results(self, config: SimulationConfig) -> SimulationResult:
        """Compile final simulation results"""
        # Calculate adoption curve
        adoption_curve = [
            day['metrics']['total_signed_up']
            for day in self.timeline
        ]

        # Cohort analysis
        cohort_analysis = self._analyze_cohorts()

        # Final metrics
        final_states = self.timeline[-1]['metrics']['state_distribution'] if self.timeline else {}
        total_personas = len(self.personas)

        # NPS calculation
        promoters = sum(1 for a in self.agents.values()
                       if a.get_satisfaction_category() == 'promoter')
        detractors = sum(1 for a in self.agents.values()
                        if a.get_satisfaction_category() == 'detractor')

        nps = ((promoters - detractors) / total_personas) * 100 if total_personas > 0 else 0

        # Predicted CLV
        avg_engagement = np.mean([a.persona.engagement_level for a in self.agents.values()])
        predicted_clv = avg_engagement * 100  # Simplified calculation

        # Churn rate
        total_signed_up = sum(1 for a in self.agents.values()
                             if a.persona.current_state not in ['unaware', 'aware'])
        churned = final_states.get('churned', 0)
        churn_rate = churned / total_signed_up if total_signed_up > 0 else 0

        final_metrics = {
            'total_personas': total_personas,
            'aware_count': final_states.get('aware', 0),
            'signed_up_count': final_states.get('signed_up', 0),
            'activated_count': final_states.get('active', 0),
            'engaged_count': final_states.get('engaged', 0),
            'premium_count': final_states.get('premium', 0),
            'churned_count': churned,
            'conversion_rate': total_signed_up / total_personas if total_personas > 0 else 0,
            'activation_rate': final_states.get('active', 0) / total_signed_up if total_signed_up > 0 else 0,
            'avg_satisfaction': np.mean([a.persona.satisfaction_score for a in self.agents.values()]),
            'avg_engagement': np.mean([a.persona.engagement_level for a in self.agents.values()]),
            'nps': nps,
        }

        return SimulationResult(
            simulation_id=f"sim_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            config=config,
            personas=list(self.agents.values()),
            timeline=self.timeline,
            final_metrics=final_metrics,
            cohort_analysis=cohort_analysis,
            predicted_adoption_curve=adoption_curve,
            predicted_churn_rate=churn_rate,
            predicted_nps=nps,
            predicted_clv=predicted_clv
        )

    def _analyze_cohorts(self) -> Dict[str, Any]:
        """Analyze performance by different cohorts"""
        cohorts = {
            'by_archetype': defaultdict(lambda: {'count': 0, 'satisfaction': [], 'engagement': []}),
            'by_tech_savviness': defaultdict(lambda: {'count': 0, 'satisfaction': [], 'engagement': []}),
            'by_price_sensitivity': defaultdict(lambda: {'count': 0, 'satisfaction': [], 'engagement': []}),
        }

        for agent in self.agents.values():
            persona = agent.persona

            # By archetype
            archetype = persona.behavioral.archetype.value
            cohorts['by_archetype'][archetype]['count'] += 1
            cohorts['by_archetype'][archetype]['satisfaction'].append(persona.satisfaction_score)
            cohorts['by_archetype'][archetype]['engagement'].append(persona.engagement_level)

            # By tech savviness
            tech_level = 'high' if persona.demographics.tech_savviness >= 7 else \
                        'medium' if persona.demographics.tech_savviness >= 4 else 'low'
            cohorts['by_tech_savviness'][tech_level]['count'] += 1
            cohorts['by_tech_savviness'][tech_level]['satisfaction'].append(persona.satisfaction_score)
            cohorts['by_tech_savviness'][tech_level]['engagement'].append(persona.engagement_level)

            # By price sensitivity
            price_level = 'high' if persona.behavioral.price_sensitivity >= 7 else \
                         'medium' if persona.behavioral.price_sensitivity >= 4 else 'low'
            cohorts['by_price_sensitivity'][price_level]['count'] += 1
            cohorts['by_price_sensitivity'][price_level]['satisfaction'].append(persona.satisfaction_score)
            cohorts['by_price_sensitivity'][price_level]['engagement'].append(persona.engagement_level)

        # Calculate averages
        for cohort_type, cohort_data in cohorts.items():
            for group, data in cohort_data.items():
                if data['count'] > 0:
                    data['avg_satisfaction'] = np.mean(data['satisfaction'])
                    data['avg_engagement'] = np.mean(data['engagement'])
                    del data['satisfaction']
                    del data['engagement']

        return {k: dict(v) for k, v in cohorts.items()}

    def get_agent_journey(self, agent_id: str) -> List[Dict[str, Any]]:
        """Get the journey of a specific agent through the simulation"""
        agent = self.agents.get(agent_id)
        if not agent:
            return []

        return agent.persona.actions_taken

    def export_results(self, result: SimulationResult, format: str = 'json') -> str:
        """Export simulation results"""
        if format == 'json':
            return json.dumps({
                'simulation_id': result.simulation_id,
                'config': {
                    'name': result.config.name,
                    'target_industry': result.config.target_industry,
                    'persona_count': result.config.persona_count,
                    'simulation_days': result.config.simulation_days,
                },
                'final_metrics': result.final_metrics,
                'predictions': {
                    'churn_rate': result.predicted_churn_rate,
                    'nps': result.predicted_nps,
                    'clv': result.predicted_clv,
                },
                'adoption_curve': result.predicted_adoption_curve,
                'cohort_analysis': result.cohort_analysis,
            }, indent=2)
        return ""
