"""
Persona Generator - Creates diverse user personas for simulation
Uses stratified sampling and LLM-based expansion to ensure coverage
"""
import random
from typing import List, Dict, Any, Optional
from faker import Faker
from .models import (
    UserPersona, Demographics, BehavioralTraits, Context, Memory,
    AdoptionArchetype
)

fake = Faker()


class PersonaGenerator:
    """Generates diverse user personas for simulation"""

    # Distribution for adoption curve (Rogers' diffusion of innovations)
    ARCHETYPE_DISTRIBUTION = {
        AdoptionArchetype.INNOVATOR: 0.025,
        AdoptionArchetype.EARLY_ADOPTER: 0.135,
        AdoptionArchetype.EARLY_MAJORITY: 0.34,
        AdoptionArchetype.LATE_MAJORITY: 0.34,
        AdoptionArchetype.LAGGERD: 0.16,
    }

    # Industry-specific persona seeds
    INDUSTRY_PERSONAS = {
        'saas': [
            {'role': 'Startup Founder', 'pain_level': 9, 'tech_savviness': 8},
            {'role': 'Product Manager', 'pain_level': 7, 'tech_savviness': 7},
            {'role': 'Engineering Lead', 'pain_level': 6, 'tech_savviness': 9},
            {'role': 'Operations Director', 'pain_level': 8, 'tech_savviness': 5},
            {'role': 'Finance Controller', 'pain_level': 5, 'tech_savviness': 4},
        ],
        'fintech': [
            {'role': 'Retail Trader', 'pain_level': 7, 'tech_savviness': 6},
            {'role': 'Small Business Owner', 'pain_level': 8, 'tech_savviness': 4},
            {'role': 'Compliance Officer', 'pain_level': 9, 'tech_savviness': 5},
            {'role': 'Wealth Manager', 'pain_level': 5, 'tech_savviness': 5},
            {'role': 'Underbanked Consumer', 'pain_level': 10, 'tech_savviness': 3},
        ],
        'health': [
            {'role': 'Chronic Patient', 'pain_level': 10, 'tech_savviness': 4},
            {'role': 'Caregiver', 'pain_level': 8, 'tech_savviness': 5},
            {'role': 'Health Conscious', 'pain_level': 5, 'tech_savviness': 7},
            {'role': 'Senior Citizen', 'pain_level': 7, 'tech_savviness': 2},
            {'role': 'Medical Professional', 'pain_level': 6, 'tech_savviness': 6},
        ],
        'ecommerce': [
            {'role': 'Bargain Hunter', 'pain_level': 6, 'tech_savviness': 7},
            {'role': 'Luxury Shopper', 'pain_level': 4, 'tech_savviness': 6},
            {'role': 'Small Retailer', 'pain_level': 9, 'tech_savviness': 4},
            {'role': 'Dropshipper', 'pain_level': 7, 'tech_savviness': 8},
            {'role': 'Brand Loyalist', 'pain_level': 3, 'tech_savviness': 5},
        ],
        'ai_ml': [
            {'role': 'ML Engineer', 'pain_level': 7, 'tech_savviness': 10},
            {'role': 'Data Scientist', 'pain_level': 6, 'tech_savviness': 9},
            {'role': 'AI Curious Executive', 'pain_level': 5, 'tech_savviness': 4},
            {'role': 'AI Skeptic', 'pain_level': 4, 'tech_savviness': 6},
            {'role': 'Automation Seeker', 'pain_level': 8, 'tech_savviness': 5},
        ],
    }

    def __init__(self, seed: Optional[int] = None):
        if seed:
            random.seed(seed)
            fake.seed_instance(seed)

    def generate_personas(
        self,
        count: int,
        industry: str,
        feature_description: str,
        target_personas: Optional[List[Dict[str, Any]]] = None
    ) -> List[UserPersona]:
        """
        Generate diverse personas for simulation

        Args:
            count: Number of personas to generate
            industry: Target industry (saas, fintech, health, etc.)
            feature_description: Description of the feature being simulated
            target_personas: Optional seed personas from user research

        Returns:
            List of UserPersona objects
        """
        personas = []

        # Generate archetype distribution
        archetype_counts = self._calculate_archetype_counts(count)

        # Get industry-specific seeds
        seeds = self.INDUSTRY_PERSONAS.get(industry, self.INDUSTRY_PERSONAS['saas'])

        # If target personas provided, blend them in (20% exact matches, 80% variations)
        if target_personas:
            exact_match_count = int(count * 0.2)
            variation_count = int(count * 0.6)
            edge_case_count = count - exact_match_count - variation_count
        else:
            exact_match_count = 0
            variation_count = int(count * 0.8)
            edge_case_count = count - variation_count

        # Generate exact matches from target personas
        for i in range(exact_match_count):
            seed = target_personas[i % len(target_personas)]
            persona = self._create_persona_from_seed(seed, industry, archetype_counts)
            personas.append(persona)

        # Generate variations
        for i in range(variation_count):
            seed = random.choice(seeds)
            archetype = self._select_archetype(archetype_counts)
            persona = self._create_varied_persona(seed, industry, archetype)
            personas.append(persona)

        # Generate edge cases (extreme personas)
        for i in range(edge_case_count):
            persona = self._create_edge_case_persona(industry)
            personas.append(persona)

        # Shuffle to mix archetypes
        random.shuffle(personas)

        return personas

    def _calculate_archetype_counts(self, total: int) -> Dict[AdoptionArchetype, int]:
        """Calculate how many of each archetype to generate"""
        counts = {}
        remaining = total

        for archetype, proportion in self.ARCHETYPE_DISTRIBUTION.items():
            if archetype == AdoptionArchetype.LAGGERD:  # Handle the typo in enum
                continue
            count = int(total * proportion)
            counts[archetype] = count
            remaining -= count

        # Handle the laggard archetype (fixing the typo)
        if AdoptionArchetype.LAGGERD in counts:
            del counts[AdoptionArchetype.LAGGERD]
        counts[AdoptionArchetype.LAGGERD] = remaining

        return counts

    def _select_archetype(self, counts: Dict[AdoptionArchetype, int]) -> AdoptionArchetype:
        """Select an archetype based on remaining counts"""
        available = [(a, c) for a, c in counts.items() if c > 0]
        if not available:
            return random.choice(list(AdoptionArchetype))

        archetype, _ = random.choice(available)
        counts[archetype] -= 1
        return archetype

    def _create_persona_from_seed(
        self,
        seed: Dict[str, Any],
        industry: str,
        archetype_counts: Dict[AdoptionArchetype, int]
    ) -> UserPersona:
        """Create a persona directly from a seed profile"""
        return UserPersona(
            id=str(random.randint(10000, 99999)),
            name=fake.name(),
            demographics=Demographics(
                age=seed.get('age', random.randint(25, 55)),
                location=seed.get('location', fake.city()),
                income_level=seed.get('income', random.choice(['low', 'medium', 'high'])),
                education=seed.get('education', random.choice(['high_school', 'college', 'graduate'])),
                occupation=seed.get('role', 'Professional'),
                tech_savviness=seed.get('tech_savviness', 5),
                industry=industry
            ),
            behavioral=BehavioralTraits(
                archetype=self._select_archetype(archetype_counts),
                price_sensitivity=seed.get('price_sensitivity', random.randint(3, 8)),
                feature_preference=seed.get('feature_preference', 'simplicity'),
                switching_cost_tolerance=seed.get('switching_cost', 'medium'),
                decision_making_style=seed.get('decision_style', 'analytical'),
                pain_tolerance=seed.get('pain_tolerance', 5),
                support_expectation=seed.get('support_expectation', 'self-service')
            ),
            context=Context(
                current_pain_level=seed.get('pain_level', 5),
                alternatives_used=seed.get('alternatives', ['Competitor A', 'Competitor B']),
                budget_constraints=seed.get('budget'),
                decision_making_power=seed.get('decision_power', 'individual'),
                timeline_urgency=seed.get('urgency', 'short-term')
            ),
            memory=Memory()
        )

    def _create_varied_persona(
        self,
        seed: Dict[str, Any],
        industry: str,
        archetype: AdoptionArchetype
    ) -> UserPersona:
        """Create a persona with variations from a seed"""
        # Vary demographics
        age_variation = random.randint(-10, 10)
        tech_variation = random.randint(-2, 2)

        # Archetype influences behavior
        archetype_traits = self._get_archetype_traits(archetype)

        return UserPersona(
            id=str(random.randint(10000, 99999)),
            name=fake.name(),
            demographics=Demographics(
                age=max(18, min(80, seed.get('age', 35) + age_variation)),
                location=fake.city(),
                income_level=random.choice(['low', 'medium', 'high']),
                education=random.choice(['high_school', 'college', 'graduate']),
                occupation=seed.get('role', 'Professional'),
                tech_savviness=max(1, min(10, seed.get('tech_savviness', 5) + tech_variation)),
                industry=industry
            ),
            behavioral=BehavioralTraits(
                archetype=archetype,
                price_sensitivity=archetype_traits['price_sensitivity'],
                feature_preference=random.choice(['simplicity', 'power', 'speed', 'security']),
                switching_cost_tolerance=random.choice(['low', 'medium', 'high']),
                decision_making_style=archetype_traits['decision_style'],
                pain_tolerance=archetype_traits['pain_tolerance'],
                support_expectation=random.choice(['self-service', 'hand-holding', 'community'])
            ),
            context=Context(
                current_pain_level=max(1, min(10, seed.get('pain_level', 5) + random.randint(-2, 2))),
                alternatives_used=[fake.company() for _ in range(random.randint(1, 3))],
                budget_constraints=random.choice([None, 'tight', 'flexible']),
                decision_making_power=random.choice(['individual', 'team', 'enterprise']),
                timeline_urgency=random.choice(['immediate', 'short-term', 'long-term'])
            ),
            memory=Memory()
        )

    def _create_edge_case_persona(self, industry: str) -> UserPersona:
        """Create extreme/edge case personas"""
        edge_types = [
            'hyper_skeptic',      # Extremely resistant
            'tech_luddite',       # Very low tech skills
            'influencer',         # High social influence
            'power_user',         # Demands everything
            'price_shopper',      # Only cares about cost
            'security_paranoid',  # Extreme privacy concerns
        ]

        edge_type = random.choice(edge_types)

        traits = {
            'hyper_skeptic': {
                'archetype': AdoptionArchetype.LAGGERD,
                'pain_level': 2,
                'tech_savviness': 4,
                'price_sensitivity': 9,
            },
            'tech_luddite': {
                'archetype': AdoptionArchetype.LATE_MAJORITY,
                'pain_level': 7,
                'tech_savviness': 1,
                'price_sensitivity': 7,
            },
            'influencer': {
                'archetype': AdoptionArchetype.INNOVATOR,
                'pain_level': 6,
                'tech_savviness': 8,
                'price_sensitivity': 3,
            },
            'power_user': {
                'archetype': AdoptionArchetype.EARLY_ADOPTER,
                'pain_level': 8,
                'tech_savviness': 10,
                'price_sensitivity': 2,
            },
            'price_shopper': {
                'archetype': AdoptionArchetype.EARLY_MAJORITY,
                'pain_level': 5,
                'tech_savviness': 5,
                'price_sensitivity': 10,
            },
            'security_paranoid': {
                'archetype': AdoptionArchetype.LATE_MAJORITY,
                'pain_level': 6,
                'tech_savviness': 6,
                'price_sensitivity': 4,
            },
        }

        edge = traits[edge_type]

        return UserPersona(
            id=str(random.randint(10000, 99999)),
            name=fake.name(),
            demographics=Demographics(
                age=random.randint(25, 65),
                location=fake.city(),
                income_level=random.choice(['low', 'medium', 'high']),
                education=random.choice(['high_school', 'college', 'graduate']),
                occupation=f"{edge_type.replace('_', ' ').title()} User",
                tech_savviness=edge['tech_savviness'],
                industry=industry
            ),
            behavioral=BehavioralTraits(
                archetype=edge['archetype'],
                price_sensitivity=edge['price_sensitivity'],
                feature_preference='security' if edge_type == 'security_paranoid' else random.choice(['simplicity', 'power', 'speed']),
                switching_cost_tolerance='high',
                decision_making_style='cautious',
                pain_tolerance=edge['pain_level'],
                support_expectation='hand-holding'
            ),
            context=Context(
                current_pain_level=edge['pain_level'],
                alternatives_used=[fake.company() for _ in range(random.randint(1, 3))],
                budget_constraints='tight' if edge_type == 'price_shopper' else None,
                decision_making_power='individual',
                timeline_urgency='long-term'
            ),
            memory=Memory(),
            current_state='unaware'
        )

    def _get_archetype_traits(self, archetype: AdoptionArchetype) -> Dict[str, Any]:
        """Get behavioral traits based on adoption archetype"""
        traits = {
            AdoptionArchetype.INNOVATOR: {
                'price_sensitivity': random.randint(1, 4),
                'decision_style': 'impulsive',
                'pain_tolerance': 8,
            },
            AdoptionArchetype.EARLY_ADOPTER: {
                'price_sensitivity': random.randint(2, 5),
                'decision_style': 'analytical',
                'pain_tolerance': 7,
            },
            AdoptionArchetype.EARLY_MAJORITY: {
                'price_sensitivity': random.randint(4, 7),
                'decision_style': 'social',
                'pain_tolerance': 5,
            },
            AdoptionArchetype.LATE_MAJORITY: {
                'price_sensitivity': random.randint(6, 9),
                'decision_style': 'cautious',
                'pain_tolerance': 4,
            },
            AdoptionArchetype.LAGGERD: {
                'price_sensitivity': random.randint(8, 10),
                'decision_style': 'cautious',
                'pain_tolerance': 3,
            },
        }
        return traits.get(archetype, traits[AdoptionArchetype.EARLY_MAJORITY])

    def generate_social_graph(
        self,
        personas: List[UserPersona],
        connection_density: float = 0.1
    ) -> List[tuple]:
        """
        Generate social connections between personas
        Returns list of (source_id, target_id, influence_strength) tuples
        """
        connections = []
        num_personas = len(personas)

        for i, persona in enumerate(personas):
            # Number of connections based on archetype
            if persona.behavioral.archetype == AdoptionArchetype.INNOVATOR:
                num_connections = random.randint(5, 15)  # Highly connected
            elif persona.behavioral.archetype == AdoptionArchetype.EARLY_ADOPTER:
                num_connections = random.randint(8, 20)
            else:
                num_connections = random.randint(1, 8)

            for _ in range(num_connections):
                target_idx = random.randint(0, num_personas - 1)
                if target_idx != i:
                    influence = random.uniform(0.1, 0.9)
                    connections.append((persona.id, personas[target_idx].id, influence))

        return connections
