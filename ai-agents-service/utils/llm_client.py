"""
LLM Client with Role-Based Routing

Premium Ollama Setup - Local models where possible, cloud for heavy reasoning.
Supports both Ollama (local) and direct API calls (cloud models).
"""

import os
import requests
from typing import Dict, Any, List, Optional, Tuple
from openai import OpenAI

# ============================================================================
# MODEL CONFIGURATION
# ============================================================================

# Local Ollama models (you have premium setup - can run large models)
OLLAMA_BASE = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
OLLAMA_KEY = os.getenv("OLLAMA_API_KEY", "ollama")  # Dummy key for local

# Cloud API endpoints (for models you can't/won't run locally)
CLOUD_ENDPOINTS = {
    "kimi": {
        "base": os.getenv("KIMI_API_BASE", "https://api.moonshot.cn/v1"),
        "key": os.getenv("KIMI_API_KEY", ""),
        "models": {"agents": "kimi-k2.5-instruct", "orchestrator": "kimi-k2.5-instruct"}
    },
    "qwen": {
        "base": os.getenv("QWEN_API_BASE", "https://dashscope.aliyuncs.com/compatible-mode/v1"),
        "key": os.getenv("QWEN_API_KEY", ""),
        "models": {"report": "qwen-plus", "extraction": "qwen-turbo"}
    },
    "glm": {
        "base": os.getenv("GLM_API_BASE", "https://open.bigmodel.cn/api/paas/v4"),
        "key": os.getenv("GLM_API_KEY", ""),
        "models": {"extraction": "glm-4-flash", "fast": "glm-4-flash"}
    }
}

# Role-based routing: which model handles which task
# Priority: Local > Cloud (cost/latency optimization)
# Using llama3.2:latest (3.2B) - fits in available memory (6.9GB)
# Note: qwen3.5:latest needs 7GB+ which exceeds available RAM
ROLE_ROUTING = {
    # Extract entities from PM brief - fast, cheap
    "extractor": ("ollama", "llama3.2:latest"),

    # Generate focused personas - uses template fallback for reliability
    "persona_architect": ("ollama", "llama3.2:latest"),

    # Agent swarm debate - heavy reasoning, multi-turn
    "agent_swarm": ("ollama", "llama3.2:latest"),

    # Variant generation - uses template fallback
    "variant_generator": ("ollama", "llama3.2:latest"),

    # Report synthesis - structured output
    "report": ("ollama", "llama3.2:latest"),

    # Embeddings for semantic matching
    "embedder": ("ollama", "llama3.2:latest"),

    # Fast reactions / simple decisions
    "reactor": ("ollama", "llama3.2:latest"),
}

# Use cloud fallback if local fails or for specific high-stakes tasks
CLOUD_FALLBACK = {
    "agent_swarm": ("kimi", "kimi-k2.5-instruct"),  # Best for multi-agent
    "report": ("qwen", "qwen-plus"),  # Best for structured output
    "extractor": ("glm", "glm-4-flash"),  # Fast + cheap
}


class LLMClient:
    """
    Unified LLM client with role-based routing.

    Automatically routes requests to optimal model based on task.
    Supports both local Ollama and cloud APIs.
    """

    def __init__(self, role: str = "extractor"):
        """
        Initialize client for a specific role.

        Args:
            role: Task role (extractor, persona_architect, agent_swarm, report, etc.)
        """
        self.role = role
        self.client, self.model = self._get_client_for_role(role)

    def _get_client_for_role(self, role: str) -> Tuple[OpenAI, str]:
        """Get the appropriate client and model for a role."""
        routing = ROLE_ROUTING.get(role, ROLE_ROUTING["extractor"])
        source, model_name = routing

        if source == "ollama":
            return OpenAI(base_url=OLLAMA_BASE, api_key=OLLAMA_KEY, timeout=30.0), model_name

        elif source in CLOUD_ENDPOINTS:
            endpoint = CLOUD_ENDPOINTS[source]
            model = endpoint["models"].get(role, list(endpoint["models"].values())[0])
            return OpenAI(base_url=endpoint["base"], api_key=endpoint["key"]), model

        # Default to Ollama
        return OpenAI(base_url=OLLAMA_BASE, api_key=OLLAMA_KEY), "qwen2.5:7b"

    def chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        json_mode: bool = False,
        **kwargs
    ) -> str:
        """
        Send chat completion request.
        Uses requests library for Ollama (more reliable than OpenAI client).

        Args:
            messages: List of {role, content} dicts
            temperature: Sampling temperature (0.0-1.0)
            max_tokens: Max response tokens
            json_mode: If True, request JSON output
            **kwargs: Additional OpenAI-compatible params

        Returns:
            Response content string
        """
        # Use requests for Ollama (more reliable)
        if str(self.client.base_url).rstrip('/') == OLLAMA_BASE.rstrip('/'):
            payload = {
                "model": self.model,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": temperature,
                }
            }
            if max_tokens:
                payload["options"]["num_predict"] = max_tokens
            if json_mode:
                payload["format"] = "json"

            try:
                resp = requests.post(
                    f"{OLLAMA_BASE}/chat/completions",
                    json=payload,
                    timeout=60
                )
                resp.raise_for_status()
                return resp.json()["choices"][0]["message"]["content"]
            except Exception as e:
                print(f"Ollama requests failed: {e}, falling back to OpenAI client")
                # Fallback to OpenAI client
                pass

        # Fallback to OpenAI client
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            response_format={"type": "json_object"} if json_mode else None,
            **kwargs
        )
        return response.choices[0].message.content

    def chat_with_retry(
        self,
        messages: List[Dict[str, str]],
        retries: int = 2,
        **kwargs
    ) -> str:
        """Chat with automatic retry on failure."""
        last_error = None

        for attempt in range(retries + 1):
            try:
                return self.chat(messages, **kwargs)
            except Exception as e:
                last_error = e
                # Try cloud fallback on last attempt
                if attempt == retries and self.role in CLOUD_FALLBACK:
                    fallback_source, fallback_model = CLOUD_FALLBACK[self.role]
                    print(f"Local failed, falling back to {fallback_source}/{fallback_model}")
                    self._switch_to_fallback(fallback_source, fallback_model)

        raise last_error

    def _switch_to_fallback(self, source: str, model: str):
        """Switch to cloud fallback."""
        if source in CLOUD_ENDPOINTS:
            endpoint = CLOUD_ENDPOINTS[source]
            self.client = OpenAI(base_url=endpoint["base"], api_key=endpoint["key"])
            self.model = model

    def extract_json(self, messages: List[Dict[str, str]], schema_hint: str = None, default_on_failure: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Extract structured JSON from LLM response.

        Enhanced for llama3.2 with:
        - Stronger system prompting
        - Multi-stage regex extraction
        - Optional default value on failure

        Args:
            messages: Chat messages
            schema_hint: Optional JSON schema hint
            default_on_failure: Return this dict if extraction fails (instead of None)
        """
        import json
        import re

        # Build system message with stronger instructions
        system_content = """You are a JSON-only API. Rules:
1. Output ONLY valid JSON - no text before or after
2. No markdown, no code blocks, no explanations
3. Use double quotes for all strings
4. Follow the exact schema provided"""

        if schema_hint:
            system_content += f"\n\nREQUIRED JSON SCHEMA:\n{schema_hint}"

        # System message FIRST (llama3.2 pays more attention to it)
        messages = [{"role": "system", "content": system_content}] + messages

        response_text = self.chat(messages, json_mode=False)

        # === Stage 1: Clean response ===
        response_text = response_text.strip()

        # Remove markdown wrappers
        for prefix in ["```json", "```"]:
            if response_text.startswith(prefix):
                response_text = response_text[len(prefix):]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
        response_text = response_text.strip()

        # Remove leading text before first JSON character
        for start_char in ['{', '[']:
            idx = response_text.find(start_char)
            if idx >= 0:
                response_text = response_text[idx:]
                break

        # === Stage 2: Try direct parse first ===
        try:
            result = json.loads(response_text)
            if isinstance(result, (dict, list)):
                return result
        except json.JSONDecodeError:
            pass

        # === Stage 3: Find complete JSON objects using balanced brace matching ===
        # Find all potential JSON objects by looking for { and matching }
        i = 0
        while i < len(response_text):
            if response_text[i] == '{':
                depth = 0
                in_string = False
                escape_next = False
                start = i
                for j in range(i, len(response_text)):
                    char = response_text[j]
                    if escape_next:
                        escape_next = False
                        continue
                    if char == '\\' and in_string:
                        escape_next = True
                        continue
                    if char == '"' and not escape_next:
                        in_string = not in_string
                        continue
                    if not in_string:
                        if char == '{':
                            depth += 1
                        elif char == '}':
                            depth -= 1
                            if depth == 0:
                                # Found complete object
                                try:
                                    result = json.loads(response_text[start:j+1])
                                    if isinstance(result, dict):
                                        return result
                                except:
                                    pass
                                break
                i = j + 1 if 'j' in locals() else i + 1
            else:
                i += 1

        # === Stage 4: Try simple regex for {...} ===
        simple_objects = re.findall(r'\{[^{}]*\}', response_text)
        for match in simple_objects:
            try:
                result = json.loads(match.strip())
                if isinstance(result, dict):
                    return result
            except:
                continue

        # === Stage 5: Try arrays ===
        simple_arrays = re.findall(r'\[[^\[\]]*\]', response_text)
        for match in simple_arrays:
            try:
                result = json.loads(match.strip())
                if isinstance(result, list):
                    return result
            except:
                continue

        # === Stage 6: Try to extract partial JSON for position responses ===
        # For simple schemas like {"position": "...", "reason": "..."}
        # try to extract values even from incomplete JSON
        pos_match = re.search(r'"position"\s*:\s*"([^"]+)"', response_text)
        reason_match = re.search(r'"reason"\s*:\s*"([^"]+)"', response_text)
        if pos_match:
            return {
                "position": pos_match.group(1),
                "reason": reason_match.group(1) if reason_match else "Incomplete response"
            }

        # === Stage 7: All failed - return default ===
        print(f"JSON extraction failed. Response: {response_text[:150]}...")
        return default_on_failure

    def batch_chat(
        self,
        message_sets: List[List[Dict[str, str]]],
        **kwargs
    ) -> List[str]:
        """
        Run multiple chat requests in parallel.

        Args:
            message_sets: List of message lists (one per request)
            **kwargs: Passed to chat()

        Returns:
            List of responses
        """
        import concurrent.futures

        def single_chat(messages):
            try:
                return self.chat(messages, **kwargs)
            except Exception as e:
                return f"ERROR: {str(e)}"

        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            results = list(executor.map(single_chat, message_sets))

        return results


# ============================================================================
# CONVENIENCE FUNCTIONS
# ============================================================================

def get_client(role: str) -> LLMClient:
    """Get LLM client for a specific role."""
    return LLMClient(role)


def extract_entities(brief_text: str) -> Dict[str, Any]:
    """
    Extract structured entities from PM brief.

    Args:
        brief_text: Raw PM brief text

    Returns:
        Dict with problem, users, pricing, competitors, etc. NEVER returns None.
    """
    # Default fallback - always valid
    fallback = {
        "problem_statement": brief_text[:200] if brief_text else "Unknown problem",
        "target_users": ["users"],
        "pricing_model": "subscription",
        "competitors": [],
        "success_metrics": ["adoption"],
        "key_risks": ["market competition"]
    }

    client = LLMClient("extractor")

    messages = [{
        "role": "user",
        "content": f"""Extract structured information from this PM brief.
Return JSON with these fields:
- problem_statement: What problem does this solve? (1 sentence)
- target_users: List of user types who would use this
- pricing_model: Suggested pricing approach
- competitors: List of alternative solutions
- success_metrics: How would success be measured?
- key_risks: Potential failure modes

Brief:
{brief_text}

Respond ONLY with valid JSON."""
    }]

    try:
        result = client.extract_json(messages)
        # Ensure it's a dict, not a list or None
        if result is None or not isinstance(result, dict):
            print(f"Entity extraction returned {type(result)}, using fallback.")
            return fallback
        return result
    except Exception as e:
        print(f"Entity extraction failed: {e}. Using fallback.")
        return fallback


def generate_personas_from_brief(
    brief_text: str,
    num_personas: int = 5,
    context: str = None
) -> List[Dict[str, Any]]:
    """
    Generate focused personas based on PM brief.

    These are PRIMARY personas (archetypes), not variants.
    Each represents a distinct behavioral pattern relevant to the brief.

    Args:
        brief_text: PM brief
        num_personas: Number of primary personas (4-8 recommended)
        context: Additional context (industry, market, etc.)

    Returns:
        List of persona definitions
    """
    client = LLMClient("persona_architect")

    messages = [{
        "role": "user",
        "content": f"""You are a product strategy expert. Generate {num_personas} focused user personas
for this product brief.

These personas should be BEHAVIORALLY distinct (not just demographics).
For each persona, define:
- name: Memorable name (e.g., "Meeting Fatigue Manager")
- count: How many agents to create with this persona (10-20)
- core_motivation: What drives their decisions
- key_pain_point: Specific problem they face
- likely_objection: Why they might reject this solution
- decision_criteria: What would make them say yes
- behavioral_trigger: What event/action changes their behavior

Brief:
{brief_text}

{f"Context: {context}" if context else ""}

Output ONLY a JSON array like this:
[
  {{"name": "Persona 1", "count": 15, "core_motivation": "...", "key_pain_point": "...", "likely_objection": "...", "decision_criteria": "...", "behavioral_trigger": "..."}},
  {{"name": "Persona 2", "count": 15, "core_motivation": "...", "key_pain_point": "...", "likely_objection": "...", "decision_criteria": "...", "behavioral_trigger": "..."}}
]"""
    }]

    result = client.extract_json(messages)

    # If single dict returned, wrap in list
    if isinstance(result, dict):
        return [result]

    return result if isinstance(result, list) else []


def generate_variants(
    primary_persona: Dict[str, Any],
    num_variants: int = 5,
    variation_axes: List[str] = None
) -> List[Dict[str, Any]]:
    """
    Generate variant personas from a primary persona.

    Variants share core DNA but differ in specific dimensions.

    Args:
        primary_persona: Base persona definition
        num_variants: Number of variants to create
        variation_axes: Dimensions to vary (industry, team_size, budget, etc.)

    Returns:
        List of variant personas
    """
    client = LLMClient("variant_generator")

    if variation_axes is None:
        variation_axes = ["industry", "team_size", "budget_sensitivity", "tech_maturity"]

    messages = [{
        "role": "user",
        "content": f"""Generate {num_variants} variants of this primary persona.
Vary them along these axes: {variation_axes}

Each variant should:
- Share the core motivation and pain point
- Differ in context (industry, company size, resources, etc.)
- Have slightly different objections based on their context
- Be realistic and specific

Primary Persona:
{primary_persona}

Output as JSON array."""
    }]

    result = client.extract_json(messages)

    # Handle None or non-list returns
    if result is None or not isinstance(result, list):
        # Fallback: generate simple template variants
        print(f"Variant generation failed, using template fallback")
        return _generate_template_variants(primary_persona, num_variants, variation_axes)

    # Filter out non-dict items
    result = [v for v in result if isinstance(v, dict)]

    return result if result else _generate_template_variants(primary_persona, num_variants, variation_axes)


def _generate_template_variants(
    primary_persona: Dict[str, Any],
    num_variants: int,
    variation_axes: List[str]
) -> List[Dict[str, Any]]:
    """Generate simple template-based variants when LLM fails."""
    import random

    industries = ["SaaS", "Fintech", "Healthcare", "E-commerce", "Manufacturing", "Education", "Media", "Consulting"]
    company_sizes = ["Startup (5-20)", "SMB (50-200)", "Mid-market (500-2000)", "Enterprise (5000+)"]
    tech_maturities = ["Modern cloud-native", "Mixed legacy/cloud", "Legacy on-prem", "Early digital transformation"]

    variants = []
    for i in range(num_variants):
        variant = primary_persona.copy()
        variant['name'] = f"{primary_persona['name']} - {random.choice(industries)}"
        variant['industry'] = random.choice(industries)
        variant['company_size'] = random.choice(company_sizes)
        variant['tech_maturity'] = random.choice(tech_maturities)
        variant['is_variant'] = True
        variant['parent_persona'] = primary_persona['name']
        variant['context'] = f"{variant['industry']} {variant['company_size']} company with {variant['tech_maturity']} stack"
        variants.append(variant)

    return variants


# ============================================================================
# AGENT SWARM ORCHESTRATION
# ============================================================================

class AgentSwarm:
    """
    Orchestrates multi-agent debate/discussion.

    Uses Kimi K2.5 or equivalent for swarm coordination.
    """

    def __init__(self, personas: List[Dict[str, Any]]):
        """
        Initialize swarm with personas.

        Args:
            personas: List of persona definitions with count
        """
        self.personas = personas
        self.agents = self._create_agents()
        self.client = LLMClient("agent_swarm")
        self.debate_history = []

    def _create_agents(self) -> List[Dict[str, Any]]:
        """Create individual agent instances from personas."""
        agents = []
        for persona in self.personas:
            for i in range(persona.get("count", 10)):
                agents.append({
                    "id": f"{persona['name']}_{i}",
                    "persona": persona,
                    "position": None,  # Will be set during debate
                    "arguments": [],
                    "influenced_by": []
                })
        return agents

    def run_debate(
        self,
        topic: str,
        rounds: int = 10,
        brief_context: str = None
    ) -> Dict[str, Any]:
        """
        Run multi-round agent debate.

        Args:
            topic: Debate topic (e.g., "Should I build this feature?")
            rounds: Number of debate rounds
            brief_context: Original PM brief for context

        Returns:
            Debate summary with positions and evolution
        """
        # Phase 1: Initial positions
        initial_positions = self._get_initial_positions(topic, brief_context)

        # Phase 2: Debate rounds
        for round_num in range(rounds):
            round_results = self._run_debate_round(round_num, topic, brief_context)
            self.debate_history.append(round_results)

        # Phase 3: Position evolution analysis
        evolution = self._analyze_evolution()

        return {
            "topic": topic,
            "rounds": rounds,
            "initial_positions": initial_positions,
            "final_positions": self._get_current_positions(),
            "evolution": evolution,
            "key_arguments": self._extract_key_arguments(),
            "consensus_level": self._calculate_consensus()
        }

    def _get_initial_positions(self, topic: str, context: str) -> List[Dict[str, Any]]:
        """Get each agent's initial position on the topic."""
        def get_position(agent):
            messages = [{
                "role": "user",
                "content": f"""You are {agent['persona']['name']}.
Core motivation: {agent['persona']['core_motivation']}
Key pain point: {agent['persona']['key_pain_point']}
Likely objection: {agent['persona']['likely_objection']}

Topic: {topic}
Context: {context or ''}

Respond with JSON: {{"position": "support|oppose|neutral", "reason": "2-3 sentence explanation"}}"""
            }]
            # Use default value on failure instead of None
            result = self.client.extract_json(
                messages,
                default_on_failure={"position": "neutral", "reason": "No response"}
            )
            position_label = result.get("position", "neutral").lower()
            reason = result.get("reason", "")
            position_text = f"{position_label}: {reason}"
            return {"agent_id": agent["id"], "position": position_text, "position_label": position_label}

        # Batch get all positions
        import concurrent.futures
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            positions = list(executor.map(get_position, self.agents))

        return positions

    def _run_debate_round(self, round_num: int, topic: str, context: str) -> Dict[str, Any]:
        """Run one round of debate."""
        # Select speakers (diverse viewpoints)
        current_positions = self._get_current_positions()
        supporters = [a for a, p in zip(self.agents, current_positions) if p.get("position_label", "") == "support"]
        opposers = [a for a, p in zip(self.agents, current_positions) if p.get("position_label", "") == "oppose"]

        round_data = {
            "round": round_num,
            "arguments": [],
            "counter_arguments": []
        }

        # Each side presents arguments
        if supporters:
            arg_messages = [{
                "role": "user",
                "content": f"""You are {agent['persona']['name']}.
Present a NEW argument supporting: {topic}
Build on previous arguments but don't repeat.
2-3 sentences."""
            } for agent in supporters[:5]]  # Limit speakers per round

            args = self.client.batch_chat(arg_messages, temperature=0.8)
            round_data["arguments"].extend([{"side": "support", "content": a} for a in args])

        if opposers:
            arg_messages = [{
                "role": "user",
                "content": f"""You are {agent['persona']['name']}.
Present a NEW argument opposing: {topic}
Build on previous arguments but don't repeat.
2-3 sentences."""
            } for agent in opposers[:5]]

            args = self.client.batch_chat(arg_messages, temperature=0.8)
            round_data["counter_arguments"].extend([{"side": "oppose", "content": a} for a in args])

        # Agents update positions based on arguments
        self._update_agent_positions(round_data)

        return round_data

    def _update_agent_positions(self, round_data: Dict[str, Any]):
        """Let agents update positions based on debate."""
        # Simplified: agents have probability to shift based on argument strength
        for agent in self.agents:
            # In full implementation, each agent would process arguments
            # through their own LLM call and decide if position changes
            pass

    def _get_current_positions(self) -> List[Dict[str, Any]]:
        """Get all current agent positions."""
        return [
            {"agent_id": a["id"], "position": a["position"], "position_label": a.get("position_label", "neutral"), "persona": a["persona"]["name"]}
            for a in self.agents
        ]

    def _analyze_evolution(self) -> Dict[str, Any]:
        """Analyze how positions evolved during debate."""
        # Use LLM to synthesize evolution patterns
        client = LLMClient("report")

        messages = [{
            "role": "user",
            "content": f"""Analyze this debate history and summarize:
1. What were the key turning points?
2. Which arguments were most persuasive?
3. How did the overall sentiment shift?
4. What unresolved tensions remain?

Debate rounds:
{self.debate_history}

Output as structured JSON."""
        }]

        return client.extract_json(messages)

    def _extract_key_arguments(self) -> List[Dict[str, Any]]:
        """Extract the most impactful arguments from debate."""
        all_args = []
        for round_data in self.debate_history:
            all_args.extend(round_data.get("arguments", []))
            all_args.extend(round_data.get("counter_arguments", []))

        # Use LLM to rank by impact
        client = LLMClient("report")

        messages = [{
            "role": "user",
            "content": f"""Rank these debate arguments by impact/persuasiveness.
Return top 10 with brief explanation.

Arguments:
{all_args}

Output as JSON array with {{argument, side, impact_score, why}}"""
        }]

        return client.extract_json(messages)

    def _calculate_consensus(self) -> float:
        """Calculate consensus level (0.0 = no consensus, 1.0 = full consensus)."""
        positions = self._get_current_positions()
        if not positions:
            return 0.0

        support_count = sum(1 for p in positions if p.get("position_label") == "support")
        oppose_count = sum(1 for p in positions if p.get("position_label") == "oppose")
        total = len(positions)

        # Consensus = max side proportion
        return max(support_count, oppose_count) / total
