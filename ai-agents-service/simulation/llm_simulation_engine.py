"""
LLM-Driven Simulation Engine

Runs multi-agent debates using focused personas.
Coordinates round-robin discussions, counter-arguments, and position tracking.
"""

import sys
import time
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime
import json

sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.llm_client import LLMClient, AgentSwarm
from .persona_generator_llm import FocusedPersonaGenerator, generate_personas_for_brief


class LLMSimulationEngine:
    """
    LLM-driven simulation engine for PM idea stress-testing.

    Unlike the rule-based engine (which simulates 1000s of users
    probabilistically), this engine runs deep qualitative debates
    with 30-50 focused agents.

    Flow:
    1. Parse PM brief → extract entities
    2. Generate focused personas (5 primary x 5 variants = 25-50 agents)
    3. Run debate rounds (10 rounds, ~15 min)
    4. Synthesize report with recommendations
    """

    def __init__(self, seed: Optional[int] = None):
        """
        Initialize engine.

        Args:
            seed: Random seed for reproducibility
        """
        self.seed = seed
        self.persona_generator = FocusedPersonaGenerator(seed=seed)
        self.current_swarm: Optional[AgentSwarm] = None
        self.debate_history: List[Dict[str, Any]] = []
        self.simulation_results: Dict[str, Any] = {}

    def run_simulation(
        self,
        brief: str,
        category: str = None,
        num_personas: int = 5,
        variants_per_persona: int = 5,
        debate_rounds: int = 10,
        topics: List[str] = None,
        fast_mode: bool = False
    ) -> Dict[str, Any]:
        """
        Run complete LLM simulation.

        Args:
            brief: PM brief text
            category: Product category (auto-detected if None)
            num_personas: Primary personas (4-8 recommended)
            variants_per_persona: Variants per primary (3-10)
            debate_rounds: Number of debate rounds
            topics: Debate topics (default: ["Should I build this?"])
            fast_mode: If True, use minimal settings for quick testing (~60 sec)

        Returns:
            Complete simulation results
        """
        # Override settings for fast mode
        if fast_mode:
            print("\n=== FAST MODE ===")
            print("Running mock simulation for instant results (~2 seconds)")
            return self._run_mock_simulation(brief, category)

        print(f"Starting LLM Simulation...")
        print(f"  Brief: {brief[:100]}...")
        print(f"  Category: {category or 'auto-detect'}")
        print(f"  Personas: {num_personas} primary x {variants_per_persona} variants")
        print(f"  Debate rounds: {debate_rounds}")

        # Step 1: Generate focused personas
        print("\n[1/4] Generating focused personas...")
        # Use templates in fast mode for speed
        personas = self._generate_personas(brief, category, num_personas, variants_per_persona, use_templates=fast_mode)
        print(f"  Generated {len(personas)} agents")

        # Step 2: Initialize agent swarm
        print("\n[2/4] Initializing agent swarm...")
        self.current_swarm = AgentSwarm(personas)
        print(f"  Swarm ready with {len(self.current_swarm.agents)} agents")

        # Step 3: Run debates
        print("\n[3/4] Running debates...")
        if topics is None:
            topics = self._generate_debate_topics(brief)

        debate_results = []
        for topic in topics:
            print(f"  Debate: {topic}")
            result = self.current_swarm.run_debate(
                topic=topic,
                rounds=debate_rounds,
                brief_context=brief
            )
            debate_results.append(result)
            self.debate_history.append(result)

        # Step 4: Generate report
        print("\n[4/4] Generating synthesis report...")
        report = self._generate_report(brief, debate_results)

        # Compile results
        self.simulation_results = {
            "simulation_id": f"llm_sim_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "brief": brief,
            "category": category,
            "personas": personas,
            "debate_topics": topics,
            "debate_results": debate_results,
            "report": report,
            "generated_at": datetime.now().isoformat(),
            "stats": {
                "total_agents": len(personas),
                "total_debate_rounds": debate_rounds * len(topics),
                "primary_personas": num_personas
            }
        }

        print("\nSimulation complete!")
        return self.simulation_results

    def _generate_personas(
        self,
        brief: str,
        category: str,
        num_personas: int,
        variants_per_persona: int,
        use_templates: bool = False
    ) -> List[Dict[str, Any]]:
        """Generate focused personas from brief."""
        return self.persona_generator.build_complete_persona_set(
            brief=brief,
            category=category,
            num_primary=num_personas,
            variants_per_persona=variants_per_persona,
            use_llm=not use_templates
        )

    def _generate_debate_topics(self, brief: str) -> List[str]:
        """Generate debate topics from brief."""
        client = LLMClient("extractor")

        messages = [{
            "role": "user",
            "content": f"""Based on this PM brief, generate 3-5 debate topics
that would stress-test this idea effectively.

Topics should cover:
- Product viability ("Should this be built?")
- Pricing strategy ("Is this pricing right?")
- Target market ("Are we targeting the right users?")
- Go-to-market ("How should we launch?")
- Key risks ("What could kill this?")

Brief:
{brief}

Output as JSON array of topic strings."""
        }]

        topics = client.extract_json(messages)
        if isinstance(topics, list) and len(topics) > 0:
            return topics
        elif isinstance(topics, str):
            return [topics]
        else:
            return ["Should I build this?"]

    def _generate_report(self, brief: str, debate_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate synthesis report from debate results."""
        client = LLMClient("report")

        # Prepare debate summary for context
        debate_summary = []
        for i, result in enumerate(debate_results):
            key_args = result.get("key_arguments") or []
            if isinstance(key_args, dict):
                key_args = [key_args]  # Wrap single dict in list
            debate_summary.append({
                "topic": result.get("topic"),
                "consensus_level": result.get("consensus_level"),
                "key_arguments": key_args[:5] if isinstance(key_args, list) else [],
                "evolution": result.get("evolution") or {}
            })

        messages = [{
            "role": "user",
            "content": f"""You are a senior product strategy consultant.
Synthesize these debate results into an actionable report.

Brief:
{brief}

Debate Results:
{json.dumps(debate_summary, indent=2)}

Generate a report with this structure:
{{
    "executive_summary": "2-3 sentence bottom-line",
    "go_no_go_recommendation": "GO" | "NO-GO" | "ITERATE",
    "confidence_level": 0.0-1.0,
    "key_insights": ["list of top insights from debates"],
    "top_risks": ["biggest risks identified"],
    "biggest_opportunities": ["biggest opportunities"],
    "recommended_actions": ["what to do next"],
    "persona_breakdown": {{
        "supporters": ["which personas support"],
        "opposers": ["which personas oppose"],
        "swing_voters": ["which personas are undecided"]
    }},
    "pricing_feedback": "feedback on pricing strategy",
    "market_timing": "assessment of market timing"
}}

Be direct and actionable. Don't hedge."""
        }]

        report = client.extract_json(
            messages,
            default_on_failure=None  # Will trigger fallback
        )

        # If LLM returned a list or wrong type, use fallback template
        if isinstance(report, list) or not isinstance(report, dict):
            print(f"Report generation returned {type(report)}, using fallback template")
            report = self._generate_fallback_report(brief, debate_results)
            return report

        # Ensure all required fields exist with proper defaults
        required_fields = [
            ("executive_summary", "Analysis complete based on multi-agent debate simulation."),
            ("go_no_go_recommendation", "ITERATE"),
            ("confidence_level", 0.5),
            ("key_insights", ["Product shows promise based on agent feedback"]),
            ("top_risks", ["Market competition", "User adoption challenges"]),
            ("biggest_opportunities", ["Growing demand for AI-powered solutions"]),
            ("recommended_actions", ["Conduct user interviews", "Build MVP"]),
            ("persona_breakdown", {"supporters": [], "opposers": [], "swing_voters": []})
        ]
        for field, default in required_fields:
            if field not in report or report[field] is None:
                report[field] = default

        return report

    def _generate_fallback_report(self, brief: str, debate_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate a fallback report when LLM synthesis fails."""
        # Analyze debate results manually
        total_support = 0
        total_oppose = 0
        all_arguments = []

        for result in debate_results:
            consensus = result.get("consensus_level", 0)
            arguments = result.get("key_arguments", [])
            all_arguments.extend(arguments)

            # Count support/oppose from arguments
            for arg in arguments:
                if arg.get("side") == "support":
                    total_support += 1
                elif arg.get("side") == "oppose":
                    total_oppose += 1

        # Determine recommendation based on argument balance
        total = total_support + total_oppose
        if total == 0:
            recommendation = "ITERATE"
            confidence = 0.3
        elif total_support > total_oppose * 1.5:
            recommendation = "GO"
            confidence = min(0.9, 0.5 + (total_support - total_oppose) / total * 0.4)
        elif total_oppose > total_support * 1.5:
            recommendation = "NO-GO"
            confidence = min(0.9, 0.5 + (total_oppose - total_support) / total * 0.4)
        else:
            recommendation = "ITERATE"
            confidence = 0.4

        return {
            "executive_summary": f"Analysis based on {len(debate_results)} debate rounds. {len(all_arguments)} key arguments identified.",
            "go_no_go_recommendation": recommendation,
            "confidence_level": confidence,
            "key_insights": ["Limited LLM capability - consider running with better models", "Manual review recommended for critical decisions"],
            "top_risks": ["Model limitations may affect analysis quality", "Consider validating with rule-based simulation"],
            "biggest_opportunities": ["Hybrid approach combining quantitative and qualitative analysis"],
            "recommended_actions": ["Review debate transcripts manually", "Run rule-based simulation for metrics", "Consider upgrading LLM model"],
            "persona_breakdown": {
                "supporters": [],
                "opposers": [],
                "swing_voters": []
            },
            "pricing_feedback": "N/A",
            "market_timing": "N/A"
        }

    def get_agent_transcript(self, agent_id: str) -> List[Dict[str, Any]]:
        """Get full transcript for a specific agent."""
        if not self.current_swarm:
            return []

        agent = next((a for a in self.current_swarm.agents if a["id"] == agent_id), None)
        if not agent:
            return []

        return agent.get("arguments", [])

    def get_persona_summary(self) -> List[Dict[str, Any]]:
        """Get summary of all personas in simulation."""
        if not self.current_swarm:
            return []

        # Group by primary persona
        persona_summary = {}
        for agent in self.current_swarm.agents:
            persona_name = agent["persona"]["name"]
            if persona_name not in persona_summary:
                persona_summary[persona_name] = {
                    "name": persona_name,
                    "count": 0,
                    "core_motivation": agent["persona"]["core_motivation"],
                    "key_pain_point": agent["persona"]["key_pain_point"],
                    "agents": []
                }
            persona_summary[persona_name]["count"] += 1
            persona_summary[persona_name]["agents"].append(agent["id"])

        return list(persona_summary.values())

    def export_results(self, format: str = "json") -> str:
        """Export simulation results."""
        if format == "json":
            # Remove non-serializable items
            exportable = self.simulation_results.copy()
            return json.dumps(exportable, indent=2, default=str)
        return ""

    def get_recommendations(self) -> Dict[str, Any]:
        """Get top-level recommendations from simulation."""
        if not self.simulation_results:
            return {"error": "No simulation results available"}

        report = self.simulation_results.get("report", {})
        return {
            "go_no_go": report.get("go_no_go_recommendation"),
            "confidence": report.get("confidence_level"),
            "summary": report.get("executive_summary"),
            "top_risks": report.get("top_risks", [])[:3],
            "next_actions": report.get("recommended_actions", [])[:3]
        }

    def _run_mock_simulation(self, brief: str, category: str = None) -> Dict[str, Any]:
        """Run mock simulation for instant testing (no LLM calls)."""
        import random

        # Generate template personas directly (avoiding LLM path)
        template_personas = self.persona_generator.CATEGORY_TEMPLATES.get(
            category,
            self.persona_generator.CATEGORY_TEMPLATES["productivity"]
        )["archetypes"][:3]

        personas = []
        for archetype in template_personas:
            p = archetype.copy()
            p['count'] = 10
            p['source'] = 'template'
            p['category'] = category
            p['variants'] = []
            personas.append(p)

        # Mock debate result
        support_count = random.randint(15, 25)
        oppose_count = random.randint(5, 15)
        total = support_count + oppose_count
        consensus = max(support_count, oppose_count) / total

        debate_result = {
            "topic": "Should I build this?",
            "rounds": 1,
            "initial_positions": [],
            "final_positions": [
                {"agent_id": f"a{i}", "position_label": "support" if i < support_count else "oppose"}
                for i in range(total)
            ],
            "key_arguments": [
                {"side": "support", "content": "Addresses a real pain point in the market"},
                {"side": "support", "content": "Growing demand for AI-powered solutions"},
                {"side": "oppose", "content": "Competitive market with established players"},
                {"side": "oppose", "content": "Privacy and data concerns"}
            ],
            "consensus_level": consensus
        }

        # Generate report
        report = self._generate_fallback_report(brief, [debate_result])

        # Generate agent reasoning for 3D visualization
        agent_reasoning = []
        agent_nodes = []
        agent_links = []

        # Create agents from personas with reasoning
        for persona_idx, persona in enumerate(personas):
            persona_name = persona.get('name', f'Persona {persona_idx}')
            base_position = random.choice(['support', 'oppose', 'neutral'])

            for variant_idx in range(5):  # 5 variants per persona
                agent_id = f"{persona_name.lower().replace(' ', '_')}_{variant_idx}"

                # Vary position slightly based on variant
                position_rand = random.random()
                if base_position == 'support':
                    position = 'support' if position_rand > 0.3 else 'neutral'
                elif base_position == 'oppose':
                    position = 'oppose' if position_rand > 0.3 else 'neutral'
                else:
                    position = random.choice(['support', 'oppose', 'neutral'])

                confidence = random.uniform(0.6, 0.95)

                # Generate reasoning based on persona and position
                if position == 'support':
                    reasoning = f"As a {persona_name.lower()}, I see clear value. The solution addresses my daily pain points and the pricing aligns with the time savings."
                elif position == 'oppose':
                    reasoning = f"While I understand the appeal, my experience as a {persona_name.lower()} tells me the integration complexity and change management will be significant barriers."
                else:
                    reasoning = f"I see both pros and cons. The concept is promising but I need to see more data on user adoption and ROI before committing."

                # Create debate rounds
                debate_rounds = [
                    {"round": 1, "argument": f"Initial reaction: {random.choice(['Intrigued', 'Skeptical', 'Curious'])}", "sentiment": random.choice(['positive', 'neutral', 'negative'])},
                    {"round": 2, "argument": f"After hearing others: {random.choice(['More confident', 'More concerned', 'Still unsure'])}", "sentiment": random.choice(['positive', 'neutral', 'negative'])},
                    {"round": 3, "argument": f"Final position: {reasoning[:50]}...", "sentiment": 'positive' if position == 'support' else 'negative' if position == 'oppose' else 'neutral'}
                ]

                agent_data = {
                    "agent_id": agent_id,
                    "persona": persona_name,
                    "position": position,
                    "confidence": confidence,
                    "reasoning": reasoning,
                    "influenced_by": [],
                    "influenced": [],
                    "debate_rounds": debate_rounds,
                    "final_position": position
                }

                agent_reasoning.append(agent_data)
                agent_nodes.append({
                    "id": agent_id,
                    "name": f"{persona_name} {variant_idx + 1}",
                    "group": persona_idx,
                    "position": position,
                    "confidence": confidence
                })

        # Create influence network (random connections for mock)
        for i, agent in enumerate(agent_reasoning):
            # Each agent influenced by 1-3 other agents
            num_influencers = random.randint(1, 3)
            potential_influencers = [a for j, a in enumerate(agent_reasoning) if j != i]
            influencers = random.sample(potential_influencers, min(num_influencers, len(potential_influencers)))

            for influencer in influencers:
                agent["influenced_by"].append(influencer["agent_id"])
                influencer["influenced"].append(agent["agent_id"])

                agent_links.append({
                    "source": influencer["agent_id"],
                    "target": agent["agent_id"],
                    "value": random.uniform(0.3, 1.0)
                })

        return {
            "simulation_id": f"mock_{int(time.time())}",
            "brief": brief,
            "category": category,
            "personas": personas,
            "debate_topics": ["Should I build this?"],
            "debate_results": [debate_result],
            "agent_reasoning": agent_reasoning,
            "influence_network": {
                "nodes": agent_nodes,
                "links": agent_links
            },
            "report": report,
            "generated_at": datetime.now().isoformat(),
            "stats": {
                "total_agents": len(personas) * 10,
                "total_debate_rounds": 1,
                "primary_personas": 3,
                "agents_with_reasoning": len(agent_reasoning)
            },
            "is_mock": True
        }


# ============================================================================
# HYBRID SIMULATION: Combine rule-based + LLM
# ============================================================================

class HybridSimulationEngine:
    """
    Combines rule-based (statistical) and LLM (qualitative) simulation.

    Use cases:
    - Quick pass: Rule-based only (1000 personas, 5 min)
    - Deep dive: LLM only (50 agents, 15 min)
    - Complete: Both (rule-based for metrics, LLM for insights)
    """

    def __init__(self):
        self.llm_engine = LLMSimulationEngine()
        self.rule_engine = None  # Import from simulation_engine if needed

    def run_hybrid_simulation(
        self,
        brief: str,
        mode: str = "complete",
        **kwargs
    ) -> Dict[str, Any]:
        """
        Run hybrid simulation.

        Args:
            brief: PM brief
            mode: "quick" (rule-based), "deep" (LLM), or "complete" (both)
            **kwargs: Passed to individual engines

        Returns:
            Combined results
        """
        results = {
            "mode": mode,
            "brief": brief,
            "generated_at": datetime.now().isoformat()
        }

        if mode in ["quick", "complete"]:
            # Run rule-based simulation
            print("\n=== Running Rule-Based Simulation ===")
            # TODO: Wire up existing simulation_engine
            # results["rule_based"] = self.rule_engine.run_simulation(...)
            results["rule_based_status"] = "not_yet_wired"

        if mode in ["deep", "complete"]:
            # Run LLM simulation
            print("\n=== Running LLM Simulation ===")
            results["llm_based"] = self.llm_engine.run_simulation(brief, **kwargs)

        return results


# ============================================================================
# CLI USAGE
# ============================================================================

if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python llm_simulation_engine.py <brief_text>")
        print("Example:")
        print('  python llm_simulation_engine.py "Build an AI meeting summarizer for $15/user/mo"')
        sys.exit(1)

    brief = " ".join(sys.argv[1:])

    engine = LLMSimulationEngine()
    results = engine.run_simulation(brief)

    print("\n" + "=" * 60)
    print("SIMULATION RESULTS")
    print("=" * 60)
    print(f"Recommendation: {results['report'].get('go_no_go_recommendation')}")
    print(f"Confidence: {results['report'].get('confidence_level', 0):.0%}")
    print(f"\nExecutive Summary:")
    print(results['report'].get('executive_summary'))
    print(f"\nTop Risks:")
    for risk in results['report'].get('top_risks', [])[:3]:
        print(f"  - {risk}")
    print(f"\nNext Actions:")
    for action in results['report'].get('recommended_actions', [])[:3]:
        print(f"  - {action}")
