"""
LLM-Enhanced Persona Generator

Generates focused, context-aware personas based on PM brief analysis.
Uses LLM scaffolding to create behaviorally distinct archetypes.

Architecture:
1. Extract entities from brief (GLM-4-flash or local qwen2.5:7b)
2. Generate primary personas (Qwen2.5:14b or Kimi K2.5)
3. Create variants (local qwen2.5:14b batch processing)
"""

import sys
import os
from typing import List, Dict, Any, Optional
from pathlib import Path

# Add parent path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.llm_client import LLMClient, extract_entities, generate_personas_from_brief, generate_variants


class FocusedPersonaGenerator:
    """
    Generates focused personas for PM simulation.

    Unlike generic demographic-based personas, these are:
    - Derived from the specific PM brief
    - Behaviorally distinct (not just age/location)
    - Context-aware (industry, use case, buying context)
    - Actionable (clear decision criteria and triggers)
    """

    # Pre-built persona templates for common product categories
    CATEGORY_TEMPLATES = {
        "productivity": {
            "archetypes": [
                {
                    "name": "Time-Strapped Executive",
                    "core_motivation": "Maximize output per minute",
                    "key_pain_point": "Too many tools, not enough time",
                    "likely_objection": "Another tool to learn?",
                    "decision_criteria": "Time saved > time to learn",
                    "behavioral_trigger": "Missed deadline or meeting overload"
                },
                {
                    "name": "Workflow Optimizer",
                    "core_motivation": "Perfect system design",
                    "key_pain_point": "Fragmented workflows across tools",
                    "likely_objection": "Does it integrate with X?",
                    "decision_criteria": "Integration depth > feature count",
                    "behavioral_trigger": "Workflow breaks due to tool gap"
                },
                {
                    "name": "Simplicity Seeker",
                    "core_motivation": "Reduce cognitive load",
                    "key_pain_point": "Tool fatigue, complex UIs",
                    "likely_objection": "Is this easy to use?",
                    "decision_criteria": "Usability > power features",
                    "behavioral_trigger": "Frustration with current tool complexity"
                }
            ]
        },
        "developer_tool": {
            "archetypes": [
                {
                    "name": "Pragmatic Engineer",
                    "core_motivation": "Ship fast, maintain later",
                    "key_pain_point": "Over-engineered solutions",
                    "likely_objection": "What's the real-world perf?",
                    "decision_criteria": "Dev velocity > architectural purity",
                    "behavioral_trigger": "Deadline pressure or tech debt pain"
                },
                {
                    "name": "Quality Advocate",
                    "core_motivation": "Build it right the first time",
                    "key_pain_point": "Cutting corners creates bugs",
                    "likely_objection": "How does this handle edge cases?",
                    "decision_criteria": "Reliability > speed",
                    "behavioral_trigger": "Production incident or QA bottleneck"
                },
                {
                    "name": "Tool Collector",
                    "core_motivation": "Always try the new shiny thing",
                    "key_pain_point": "Bored with current stack",
                    "likely_objection": "Is this actually better or just new?",
                    "decision_criteria": "Novelty + utility > stability",
                    "behavioral_trigger": "Hacker News post or conference talk"
                }
            ]
        },
        "ai_ml": {
            "archetypes": [
                {
                    "name": "AI Maximalist",
                    "core_motivation": "AI can solve everything",
                    "key_pain_point": "Manual work that could be automated",
                    "likely_objection": "How smart is it really?",
                    "decision_criteria": "Automation coverage > control",
                    "behavioral_trigger": "Repetitive task frustration"
                },
                {
                    "name": "AI Skeptic",
                    "core_motivation": "Prove it works before trusting",
                    "key_pain_point": "AI hype vs reality gap",
                    "likely_objection": "What happens when it's wrong?",
                    "decision_criteria": "Reliability + explainability > magic",
                    "behavioral_trigger": "AI failure in production"
                },
                {
                    "name": "AI Integrator",
                    "core_motivation": "Augment human capability",
                    "key_pain_point": "AI tools don't fit workflows",
                    "likely_objection": "Where does this plug in?",
                    "decision_criteria": "Workflow fit > raw capability",
                    "behavioral_trigger": "Workflow gap that AI could fill"
                }
            ]
        },
        "security": {
            "archetypes": [
                {
                    "name": "Security First",
                    "core_motivation": "Never compromise on safety",
                    "key_pain_point": "Security slows us down",
                    "likely_objection": "Is this actually secure?",
                    "decision_criteria": "Security > convenience",
                    "behavioral_trigger": "Security incident or audit finding"
                },
                {
                    "name": "Compliance Driver",
                    "core_motivation": "Check the boxes",
                    "key_pain_point": "Compliance is manual work",
                    "likely_objection": "Does this cover SOC2/GDPR?",
                    "decision_criteria": "Compliance coverage > features",
                    "behavioral_trigger": "Upcoming audit or customer requirement"
                },
                {
                    "name": "Velocity Advocate",
                    "core_motivation": "Move fast, fix later",
                    "key_pain_point": "Security gates block shipping",
                    "likely_objection": "Will this slow us down?",
                    "decision_criteria": "Dev velocity > perfect security",
                    "behavioral_trigger": "Feature delay due to security review"
                }
            ]
        }
    }

    def __init__(self, seed: Optional[int] = None):
        """
        Initialize generator.

        Args:
            seed: Random seed for reproducibility
        """
        if seed:
            import random
            random.seed(seed)

        self.llm_client = None  # Lazy load

    def generate_focused_personas(
        self,
        brief: str,
        category: str = None,
        num_personas: int = 5,
        use_llm: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Generate focused personas from PM brief.

        Args:
            brief: PM brief text
            category: Product category (productivity, developer_tool, ai_ml, security)
            num_personas: Number of primary personas (4-8 recommended)
            use_llm: Whether to use LLM generation (True) or templates (False)

        Returns:
            List of persona definitions
        """
        if use_llm:
            return self._generate_llm_personas(brief, category, num_personas)
        else:
            return self._generate_template_personas(brief, category)

    def _generate_llm_personas(
        self,
        brief: str,
        category: str,
        num_personas: int
    ) -> List[Dict[str, Any]]:
        """Generate personas using LLM."""
        # Step 1: Extract entities from brief
        entities = extract_entities(brief)

        # Step 2: Generate personas with context
        context = f"""
        Category: {category or 'general'}
        Extracted entities:
        - Problem: {entities.get('problem_statement', 'N/A')}
        - Target users: {entities.get('target_users', [])}
        - Competitors: {entities.get('competitors', [])}
        - Key risks: {entities.get('key_risks', [])}
        """

        try:
            personas = generate_personas_from_brief(
                brief_text=brief,
                num_personas=num_personas,
                context=context
            )

            # Handle None return (JSON parse failure)
            if personas is None:
                print(f"Warning: LLM returned None. Using template fallback.")
                return self._generate_template_personas(brief, category)

            # Ensure it's a list
            if isinstance(personas, str):
                print(f"Warning: LLM returned string instead of list. Using template fallback.")
                return self._generate_template_personas(brief, category)

            if not isinstance(personas, list):
                print(f"Warning: LLM returned unexpected type {type(personas)}. Using template fallback.")
                return self._generate_template_personas(brief, category)

            # Filter out non-dict items
            personas = [p for p in personas if isinstance(p, dict)]

            if len(personas) == 0:
                print(f"Warning: No valid personas from LLM. Using template fallback.")
                return self._generate_template_personas(brief, category)

            # Add metadata
            for persona in personas:
                persona['source'] = 'llm_generated'
                persona['category'] = category
                persona['variants'] = []

            return personas
        except Exception as e:
            print(f"LLM persona generation failed: {e}. Falling back to templates.")
            return self._generate_template_personas(brief, category)

    def _generate_template_personas(
        self,
        brief: str,
        category: str
    ) -> List[Dict[str, Any]]:
        """Generate personas from templates (fallback when LLM unavailable)."""
        templates = self.CATEGORY_TEMPLATES.get(category, self.CATEGORY_TEMPLATES["productivity"])

        # Extract brief context
        entities = extract_entities(brief) if self.llm_client else {"problem_statement": brief}

        personas = []
        for archetype in templates["archetypes"]:
            persona = archetype.copy()
            persona['count'] = 10  # Default variant count
            persona['source'] = 'template'
            persona['category'] = category
            persona['brief_context'] = entities
            persona['variants'] = []
            personas.append(persona)

        return personas

    def generate_variants_for_persona(
        self,
        persona: Dict[str, Any],
        num_variants: int = 5,
        variation_axes: List[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Generate variant personas from a primary persona.

        Args:
            persona: Primary persona definition
            num_variants: Number of variants
            variation_axes: Dimensions to vary

        Returns:
            List of variant personas
        """
        if variation_axes is None:
            variation_axes = [
                "industry",           # SaaS, fintech, health, etc.
                "company_size",       # Startup, SMB, enterprise
                "team_maturity",      # Chaotic, process-driven, optimized
                "budget_sensitivity", # Price-sensitive vs premium
                "tech_stack",         # Modern, legacy, mixed
                "decision_urgency"    # Immediate, short-term, long-term
            ]

        variants = generate_variants(
            primary_persona=persona,
            num_variants=num_variants,
            variation_axes=variation_axes
        )

        # Add metadata
        for variant in variants:
            variant['is_variant'] = True
            variant['parent_persona'] = persona['name']
            variant['core_motivation'] = persona['core_motivation']
            variant['key_pain_point'] = persona['key_pain_point']

        return variants

    def build_complete_persona_set(
        self,
        brief: str,
        category: str = None,
        num_primary: int = 5,
        variants_per_persona: int = 5,
        use_llm: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Build complete persona set: primary + variants.

        Args:
            brief: PM brief
            category: Product category
            num_primary: Number of primary personas
            variants_per_persona: Variants per primary
            use_llm: Use LLM generation

        Returns:
            Flat list of all personas (primary + variants)
        """
        # Generate primary personas
        primary_personas = self.generate_focused_personas(
            brief=brief,
            category=category,
            num_personas=num_primary,
            use_llm=use_llm
        )

        all_personas = []

        for primary in primary_personas:
            # Add primary
            all_personas.append(primary)

            # Generate and add variants
            variants = self.generate_variants_for_persona(
                persona=primary,
                num_variants=variants_per_persona
            )
            all_personas.extend(variants)
            primary['variants'] = variants  # Link back

        return all_personas

    def categorize_brief(self, brief: str) -> str:
        """
        Auto-categorize PM brief into product category.

        Args:
            brief: PM brief text

        Returns:
            Category string (productivity, developer_tool, ai_ml, security, etc.)
        """
        client = LLMClient("extractor")

        messages = [{
            "role": "user",
            "content": f"""Categorize this PM brief into one of these categories:
- productivity: Tools for individual/team efficiency
- developer_tool: Tools for software engineers
- ai_ml: AI/ML products or features
- security: Security, compliance, risk management
- fintech: Financial services/products
- health: Healthcare, wellness
- ecommerce: Shopping, retail
- communication: Messaging, collaboration
- other: Doesn't fit above

Brief:
{brief}

Output ONLY the category name (lowercase)."""
        }]

        category = client.chat(messages, temperature=0.1).strip().lower()
        return category


# ============================================================================
# CONVENIENCE FUNCTIONS
# ============================================================================

def generate_personas_for_brief(
    brief: str,
    category: str = None,
    num_personas: int = 5,
    variants_each: int = 5
) -> List[Dict[str, Any]]:
    """
    One-line persona generation.

    Args:
        brief: PM brief text
        category: Optional category (auto-detected if None)
        num_personas: Primary personas (4-8)
        variants_each: Variants per primary (3-10)

    Returns:
        List of all personas
    """
    generator = FocusedPersonaGenerator()

    # Auto-categorize if not provided
    if category is None:
        category = generator.categorize_brief(brief)
        print(f"Auto-categorized as: {category}")

    return generator.build_complete_persona_set(
        brief=brief,
        category=category,
        num_primary=num_personas,
        variants_per_persona=variants_each,
        use_llm=True
    )


# ============================================================================
# EXAMPLE USAGE
# ============================================================================

if __name__ == "__main__":
    # Example brief
    brief = """
    Build an AI-powered meeting summarizer for remote teams.
    Automatically records, transcribes, and summarizes meetings.
    Integrates with Zoom, Google Meet, and Teams.
    Pricing: $15/user/month for teams up to 50, enterprise pricing for larger.
    Competitors: Otter.ai, Fireflies.ai, Grain
    Success: 1000 paying teams within 6 months, <5% churn
    """

    # Generate personas
    personas = generate_personas_for_brief(
        brief=brief,
        num_personas=6,
        variants_each=5
    )

    print(f"Generated {len(personas)} personas:")
    for p in personas:
        if not p.get('is_variant'):
            print(f"  PRIMARY: {p['name']} (count: {p.get('count', 10)})")
            print(f"    Motivation: {p['core_motivation']}")
            print(f"    Pain point: {p['key_pain_point']}")
            print(f"    Objection: {p['likely_objection']}")
        else:
            print(f"    → Variant: {p.get('name', 'Unnamed')}")
