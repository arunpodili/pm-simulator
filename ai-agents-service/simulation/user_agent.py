"""
User Agent - Simulates individual user behavior and decision making
Each agent has memory, preferences, and can take actions based on their state
"""
import random
from typing import Dict, Any, List, Optional
from datetime import datetime
from .models import UserPersona, UserAction, AdoptionArchetype


class UserAgent:
    """
    An autonomous agent representing a simulated user
    Makes decisions based on persona attributes and memory
    """

    def __init__(self, persona: UserPersona):
        self.persona = persona
        self.connections: List[str] = []  # IDs of connected agents
        self.received_influences: List[Dict[str, Any]] = []

    def process_day(
        self,
        day: int,
        feature_state: Dict[str, Any],
        market_conditions: Dict[str, Any]
    ) -> Optional[UserAction]:
        """
        Process a day in the simulation
        Returns an action if the agent takes one, None otherwise
        """
        # Update days since discovery if already aware
        if self.persona.current_state != 'unaware':
            self.persona.days_since_discovery += 1

        # Determine current behavior based on state
        action = None

        if self.persona.current_state == 'unaware':
            action = self._consider_discovery(feature_state, market_conditions)
        elif self.persona.current_state == 'aware':
            action = self._consider_signup(feature_state, market_conditions)
        elif self.persona.current_state == 'signed_up':
            action = self._consider_activation(feature_state, market_conditions)
        elif self.persona.current_state == 'active':
            action = self._consider_engagement(feature_state, market_conditions)
        elif self.persona.current_state == 'engaged':
            action = self._consider_upgrade_or_churn(feature_state, market_conditions)
        elif self.persona.current_state == 'churned':
            # Churned users might return
            action = self._consider_return(feature_state, market_conditions)

        # Apply influences from other agents
        self._process_social_influences()

        if action:
            self._record_action(action, day)
            self._update_state(action)

        return action

    def _consider_discovery(
        self,
        feature_state: Dict[str, Any],
        market_conditions: Dict[str, Any]
    ) -> Optional[UserAction]:
        """Consider discovering the product"""
        # Base probability depends on marketing spend and archetype
        base_prob = {
            AdoptionArchetype.INNOVATOR: 0.15,
            AdoptionArchetype.EARLY_ADOPTER: 0.10,
            AdoptionArchetype.EARLY_MAJORITY: 0.05,
            AdoptionArchetype.LATE_MAJORITY: 0.02,
            AdoptionArchetype.LAGGARD: 0.01,
        }.get(self.persona.behavioral.archetype, 0.05)

        # Adjust for marketing
        marketing_multiplier = {
            'high': 2.0,
            'medium': 1.0,
            'low': 0.5,
        }.get(market_conditions.get('marketing_spend', 'medium'), 1.0)

        # Tech savviness increases discovery chance
        tech_multiplier = 0.5 + (self.persona.demographics.tech_savviness / 10)

        discovery_prob = base_prob * marketing_multiplier * tech_multiplier

        if random.random() < discovery_prob:
            return UserAction.DISCOVER
        return None

    def _consider_signup(
        self,
        feature_state: Dict[str, Any],
        market_conditions: Dict[str, Any]
    ) -> Optional[UserAction]:
        """Consider signing up after discovery"""
        # Calculate interest score based on pain level and feature fit
        pain_match = self._calculate_pain_feature_match(feature_state)
        interest_score = (
            self.persona.context.current_pain_level * 0.4 +
            pain_match * 0.3 +
            self._get_social_influence_score() * 0.2 +
            (10 - self.persona.behavioral.price_sensitivity) * 0.1
        ) / 10

        # Archetype adjustments
        signup_prob = interest_score * {
            AdoptionArchetype.INNOVATOR: 0.8,
            AdoptionArchetype.EARLY_ADOPTER: 0.6,
            AdoptionArchetype.EARLY_MAJORITY: 0.4,
            AdoptionArchetype.LATE_MAJORITY: 0.2,
            AdoptionArchetype.LAGGARD: 0.1,
        }.get(self.persona.behavioral.archetype, 0.4)

        # Friction factors
        if feature_state.get('has_friction', False):
            signup_prob *= 0.7

        if random.random() < signup_prob:
            return UserAction.SIGNUP

        # Might lose interest over time
        if self.persona.days_since_discovery > 14:
            if random.random() < 0.1:  # 10% chance to forget
                self.persona.current_state = 'unaware'

        return None

    def _consider_activation(
        self,
        feature_state: Dict[str, Any],
        market_conditions: Dict[str, Any]
    ) -> Optional[UserAction]:
        """Consider completing onboarding/activation"""
        # Onboarding difficulty affects activation
        onboarding_difficulty = feature_state.get('onboarding_difficulty', 5)

        # Tech savviness helps with difficult onboarding
        effective_difficulty = max(1, onboarding_difficulty - self.persona.demographics.tech_savviness / 2)

        activation_prob = 1.0 - (effective_difficulty / 10)

        # Support preference
        if self.persona.behavioral.support_expectation == 'hand-holding':
            if not feature_state.get('has_guided_onboarding', False):
                activation_prob *= 0.6

        # Time to activate varies by patience
        days_needed = max(1, int(effective_difficulty / 2))
        if self.persona.days_since_discovery < days_needed:
            return None

        if random.random() < activation_prob:
            self.persona.engagement_level = 0.3
            return UserAction.ACTIVATE

        return None

    def _consider_engagement(
        self,
        feature_state: Dict[str, Any],
        market_conditions: Dict[str, Any]
    ) -> Optional[UserAction]:
        """Consider regular engagement"""
        # Engagement builds over time
        engagement_increase = random.uniform(0.05, 0.15)

        # Feature quality matters
        if feature_state.get('feature_quality', 5) > 7:
            engagement_increase *= 1.3

        # Match with preferences
        if self._feature_matches_preference(feature_state):
            engagement_increase *= 1.2

        self.persona.engagement_level = min(1.0, self.persona.engagement_level + engagement_increase)

        # Update satisfaction
        self._update_satisfaction(feature_state)

        if self.persona.engagement_level > 0.6:
            # Become engaged user
            self.persona.current_state = 'engaged'

            # Chance to advocate
            if self.persona.satisfaction_score > 7:
                advocate_prob = {
                    AdoptionArchetype.INNOVATOR: 0.3,
                    AdoptionArchetype.EARLY_ADOPTER: 0.25,
                    AdoptionArchetype.EARLY_MAJORITY: 0.15,
                }.get(self.persona.behavioral.archetype, 0.05)

                if random.random() < advocate_prob:
                    return UserAction.ADVOCATE

        return UserAction.ENGAGE

    def _consider_upgrade_or_churn(
        self,
        feature_state: Dict[str, Any],
        market_conditions: Dict[str, Any]
    ) -> Optional[UserAction]:
        """Consider upgrading or churning"""
        satisfaction = self.persona.satisfaction_score
        engagement = self.persona.engagement_level

        # Churn probability
        churn_prob = 0.0
        if satisfaction < 3:
            churn_prob = 0.3
        elif satisfaction < 5:
            churn_prob = 0.1
        elif engagement < 0.3:
            churn_prob = 0.15

        # Competitor offers
        if market_conditions.get('competitor_promotion', False):
            churn_prob += 0.1

        if random.random() < churn_prob:
            self.persona.engagement_level = 0
            return UserAction.CHURN

        # Upgrade consideration
        if feature_state.get('has_premium', False):
            upgrade_prob = 0.0
            if satisfaction > 7 and self.persona.context.current_pain_level > 7:
                upgrade_prob = 0.15
            elif satisfaction > 6:
                upgrade_prob = 0.05

            # Price sensitivity affects upgrade
            upgrade_prob *= (10 - self.persona.behavioral.price_sensitivity) / 10

            if random.random() < upgrade_prob:
                return UserAction.UPGRADE

        # Continue engaging
        return UserAction.ENGAGE

    def _consider_return(
        self,
        feature_state: Dict[str, Any],
        market_conditions: Dict[str, Any]
    ) -> Optional[UserAction]:
        """Consider returning after churn"""
        # Win-back campaigns
        if feature_state.get('win_back_campaign', False):
            return_prob = 0.15
        else:
            return_prob = 0.02

        # Higher if pain still exists
        if self.persona.context.current_pain_level > 7:
            return_prob *= 1.5

        if random.random() < return_prob:
            self.persona.current_state = 'aware'
            self.persona.days_since_discovery = 0
            return UserAction.DISCOVER

        return None

    def receive_influence(self, source_id: str, action: UserAction, sentiment: float):
        """Receive social influence from another agent"""
        self.received_influences.append({
            'source_id': source_id,
            'action': action,
            'sentiment': sentiment,
            'timestamp': datetime.now().isoformat()
        })

    def _process_social_influences(self):
        """Process accumulated social influences"""
        if not self.received_influences:
            return

        for influence in self.received_influences:
            # Social proof affects decision making
            if influence['action'] == UserAction.ADVOCATE:
                if self.persona.current_state == 'unaware':
                    # Word of mouth discovery
                    if random.random() < influence['sentiment'] * 0.3:
                        self.persona.current_state = 'aware'
                        self.persona.memory.add_experience({
                            'type': 'social_discovery',
                            'source': influence['source_id'],
                            'sentiment': influence['sentiment']
                        })

        self.received_influences = []

    def _get_social_influence_score(self) -> float:
        """Calculate current social influence score"""
        if not self.received_influences:
            return 5.0

        # Average sentiment from recent influences
        sentiments = [i['sentiment'] for i in self.received_influences]
        return sum(sentiments) / len(sentiments) * 10

    def _calculate_pain_feature_match(self, feature_state: Dict[str, Any]) -> float:
        """Calculate how well the feature matches user's pain points"""
        solved_pains = feature_state.get('pain_points_solved', [])
        user_pain_level = self.persona.context.current_pain_level

        # Simple scoring - could be enhanced with NLP matching
        return min(10, user_pain_level * (1 + len(solved_pains) * 0.1))

    def _feature_matches_preference(self, feature_state: Dict[str, Any]) -> bool:
        """Check if feature matches user preferences"""
        preference = self.persona.behavioral.feature_preference
        feature_type = feature_state.get('primary_benefit', '')

        matches = {
            'simplicity': ['easy', 'simple', 'intuitive'],
            'power': ['advanced', 'powerful', 'comprehensive'],
            'speed': ['fast', 'quick', 'rapid', 'efficient'],
            'security': ['secure', 'safe', 'protected', 'private'],
        }

        keywords = matches.get(preference, [])
        return any(kw in feature_type.lower() for kw in keywords)

    def _update_satisfaction(self, feature_state: Dict[str, Any]):
        """Update satisfaction score based on experience"""
        quality = feature_state.get('feature_quality', 5)
        delta = (quality - 5) / 10  # -0.5 to +0.5

        # Preferences affect satisfaction
        if self._feature_matches_preference(feature_state):
            delta += 0.3

        # Pain relief satisfaction
        pain_relief = feature_state.get('pain_relief', 5)
        delta += (pain_relief - 5) / 20

        self.persona.satisfaction_score = max(-10, min(10,
            self.persona.satisfaction_score + delta
        ))

    def _update_state(self, action: UserAction):
        """Update agent state after taking an action"""
        state_transitions = {
            UserAction.DISCOVER: 'aware',
            UserAction.SIGNUP: 'signed_up',
            UserAction.ACTIVATE: 'active',
            UserAction.ENGAGE: 'active',
            UserAction.UPGRADE: 'premium',
            UserAction.CHURN: 'churned',
            UserAction.ADVOCATE: 'advocate',
        }

        if action in state_transitions:
            self.persona.current_state = state_transitions[action]

    def _record_action(self, action: UserAction, day: int):
        """Record the action in persona history"""
        self.persona.actions_taken.append({
            'action': action.value,
            'day': day,
            'satisfaction': self.persona.satisfaction_score,
            'engagement': self.persona.engagement_level,
        })

    def get_satisfaction_category(self) -> str:
        """Get satisfaction category for analytics"""
        if self.persona.satisfaction_score >= 7:
            return 'promoter'
        elif self.persona.satisfaction_score >= 4:
            return 'passive'
        elif self.persona.satisfaction_score >= 0:
            return 'neutral'
        else:
            return 'detractor'

    def to_dict(self) -> Dict[str, Any]:
        """Serialize agent state"""
        return {
            'id': self.persona.id,
            'name': self.persona.name,
            'archetype': self.persona.behavioral.archetype.value,
            'state': self.persona.current_state,
            'satisfaction': self.persona.satisfaction_score,
            'engagement': self.persona.engagement_level,
            'days_active': self.persona.days_since_discovery,
            'actions_count': len(self.persona.actions_taken),
            'demographics': {
                'age': self.persona.demographics.age,
                'tech_savviness': self.persona.demographics.tech_savviness,
                'income': self.persona.demographics.income_level,
            },
            'behavioral': {
                'price_sensitivity': self.persona.behavioral.price_sensitivity,
                'feature_preference': self.persona.behavioral.feature_preference,
            }
        }
