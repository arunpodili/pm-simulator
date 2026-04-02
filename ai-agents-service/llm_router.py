"""
LLM Router - Multi-Model Strategy with Fallback

Intelligently routes LLM requests to appropriate providers:
- Local Ollama (fast, free, for simple tasks)
- Cloud Claude (reliable JSON, for complex tasks)
- Cloud Gemini (cost-effective, for medium tasks)

Implements fallback and cost tracking.
"""

import os
import json
from enum import Enum
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
from abc import ABC, abstractmethod
import logging

logger = logging.getLogger(__name__)


class LLMProvider(Enum):
    """Available LLM providers."""
    LOCAL = "local"
    CLOUD_CLAUDE = "claude"
    CLOUD_GEMINI = "gemini"
    CLOUD_OPENAI = "openai"


class TaskComplexity(Enum):
    """Task complexity levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


@dataclass
class LLMResponse:
    """Standardized LLM response."""
    provider: LLMProvider
    content: str
    model: str
    tokens_used: int
    cost_usd: float
    latency_ms: int
    success: bool
    error: Optional[str] = None


class BaseLLMClient(ABC):
    """Abstract base class for LLM clients."""

    @abstractmethod
    async def generate(
        self,
        prompt: str,
        require_json: bool = False,
        temperature: float = 0.7,
        max_tokens: int = 1024
    ) -> LLMResponse:
        """Generate response from LLM."""
        pass

    @abstractmethod
    def estimate_cost(self, tokens: int) -> float:
        """Estimate cost for token count."""
        pass


class OllamaClient(BaseLLMClient):
    """Local Ollama client."""

    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.model = "qwen2.5:latest"  # Default model
        self.cost_per_token = 0.0  # Free

    async def generate(
        self,
        prompt: str,
        require_json: bool = False,
        temperature: float = 0.7,
        max_tokens: int = 1024
    ) -> LLMResponse:
        """Generate using local Ollama."""
        import aiohttp
        import time

        start_time = time.time()

        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": temperature,
                        "num_predict": max_tokens
                    }
                }

                async with session.post(
                    f"{self.base_url}/api/generate",
                    json=payload
                ) as response:
                    if response.status != 200:
                        raise Exception(f"Ollama error: {response.status}")

                    data = await response.json()
                    content = data.get("response", "")

                    # Try to extract JSON if required
                    if require_json:
                        content = self._extract_json(content)

                    latency = int((time.time() - start_time) * 1000)
                    tokens = len(content.split())  # Rough estimate

                    return LLMResponse(
                        provider=LLMProvider.LOCAL,
                        content=content,
                        model=self.model,
                        tokens_used=tokens,
                        cost_usd=0.0,
                        latency_ms=latency,
                        success=True
                    )

        except Exception as e:
            logger.error(f"Ollama generation failed: {e}")
            return LLMResponse(
                provider=LLMProvider.LOCAL,
                content="",
                model=self.model,
                tokens_used=0,
                cost_usd=0.0,
                latency_ms=0,
                success=False,
                error=str(e)
            )

    def _extract_json(self, text: str) -> str:
        """Extract JSON from text."""
        import re

        # Try to find JSON in markdown code blocks
        json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
        if json_match:
            return json_match.group(1).strip()

        # Try to find JSON between curly braces
        json_match = re.search(r'\{[\s\S]*\}', text)
        if json_match:
            return json_match.group(0)

        return text

    def estimate_cost(self, tokens: int) -> float:
        return 0.0


class AnthropicClient(BaseLLMClient):
    """Anthropic Claude client."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        self.model = "claude-3-haiku-20240307"
        self.cost_per_input_token = 0.00025 / 1000
        self.cost_per_output_token = 0.00125 / 1000

    async def generate(
        self,
        prompt: str,
        require_json: bool = False,
        temperature: float = 0.7,
        max_tokens: int = 1024
    ) -> LLMResponse:
        """Generate using Claude API."""
        import aiohttp
        import time

        if not self.api_key:
            return LLMResponse(
                provider=LLMProvider.CLOUD_CLAUDE,
                content="",
                model=self.model,
                tokens_used=0,
                cost_usd=0.0,
                latency_ms=0,
                success=False,
                error="ANTHROPIC_API_KEY not set"
            )

        start_time = time.time()

        try:
            system_prompt = ""
            if require_json:
                system_prompt = "You must respond with valid JSON only. No markdown, no explanation."

            async with aiohttp.ClientSession() as session:
                headers = {
                    "x-api-key": self.api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                }

                payload = {
                    "model": self.model,
                    "max_tokens": max_tokens,
                    "temperature": temperature,
                    "messages": [
                        {"role": "user", "content": prompt}
                    ]
                }

                if system_prompt:
                    payload["system"] = system_prompt

                async with session.post(
                    "https://api.anthropic.com/v1/messages",
                    headers=headers,
                    json=payload
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise Exception(f"Claude API error: {response.status} - {error_text}")

                    data = await response.json()
                    content = data["content"][0]["text"]

                    input_tokens = data.get("usage", {}).get("input_tokens", 0)
                    output_tokens = data.get("usage", {}).get("output_tokens", 0)
                    total_tokens = input_tokens + output_tokens

                    cost = (input_tokens * self.cost_per_input_token +
                           output_tokens * self.cost_per_output_token)

                    latency = int((time.time() - start_time) * 1000)

                    return LLMResponse(
                        provider=LLMProvider.CLOUD_CLAUDE,
                        content=content,
                        model=self.model,
                        tokens_used=total_tokens,
                        cost_usd=cost,
                        latency_ms=latency,
                        success=True
                    )

        except Exception as e:
            logger.error(f"Claude generation failed: {e}")
            return LLMResponse(
                provider=LLMProvider.CLOUD_CLAUDE,
                content="",
                model=self.model,
                tokens_used=0,
                cost_usd=0.0,
                latency_ms=0,
                success=False,
                error=str(e)
            )

    def estimate_cost(self, tokens: int) -> float:
        return tokens * (self.cost_per_input_token + self.cost_per_output_token) / 2


class GeminiClient(BaseLLMClient):
    """Google Gemini client."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model = "gemini-1.5-flash"
        self.cost_per_input_token = 0.000075 / 1000
        self.cost_per_output_token = 0.0003 / 1000

    async def generate(
        self,
        prompt: str,
        require_json: bool = False,
        temperature: float = 0.7,
        max_tokens: int = 1024
    ) -> LLMResponse:
        """Generate using Gemini API."""
        import aiohttp
        import time

        if not self.api_key:
            return LLMResponse(
                provider=LLMProvider.CLOUD_GEMINI,
                content="",
                model=self.model,
                tokens_used=0,
                cost_usd=0.0,
                latency_ms=0,
                success=False,
                error="GEMINI_API_KEY not set"
            )

        start_time = time.time()

        try:
            async with aiohttp.ClientSession() as session:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"

                payload = {
                    "contents": [{
                        "parts": [{"text": prompt}]
                    }],
                    "generationConfig": {
                        "temperature": temperature,
                        "maxOutputTokens": max_tokens
                    }
                }

                async with session.post(
                    url,
                    params={"key": self.api_key},
                    json=payload
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise Exception(f"Gemini API error: {response.status} - {error_text}")

                    data = await response.json()
                    content = data["candidates"][0]["content"]["parts"][0]["text"]

                    tokens = data.get("usageMetadata", {}).get("totalTokenCount", 0)
                    cost = (tokens * (self.cost_per_input_token + self.cost_per_output_token) / 2)

                    latency = int((time.time() - start_time) * 1000)

                    return LLMResponse(
                        provider=LLMProvider.CLOUD_GEMINI,
                        content=content,
                        model=self.model,
                        tokens_used=tokens,
                        cost_usd=cost,
                        latency_ms=latency,
                        success=True
                    )

        except Exception as e:
            logger.error(f"Gemini generation failed: {e}")
            return LLMResponse(
                provider=LLMProvider.CLOUD_GEMINI,
                content="",
                model=self.model,
                tokens_used=0,
                cost_usd=0.0,
                latency_ms=0,
                success=False,
                error=str(e)
            )

    def estimate_cost(self, tokens: int) -> float:
        return tokens * (self.cost_per_input_token + self.cost_per_output_token) / 2


class CostTracker:
    """Tracks LLM usage costs."""

    def __init__(self, daily_budget: float = 10.0):
        self.daily_budget = daily_budget
        self.today_spend = 0.0
        self.request_count = 0

    def can_afford(self, estimated_cost: float) -> bool:
        """Check if request is within budget."""
        return (self.today_spend + estimated_cost) <= self.daily_budget

    def track_request(self, response: LLMResponse):
        """Track a request's cost."""
        self.today_spend += response.cost_usd
        self.request_count += 1

    def get_stats(self) -> Dict[str, Any]:
        """Get spending statistics."""
        return {
            'daily_budget': self.daily_budget,
            'today_spend': round(self.today_spend, 4),
            'remaining': round(self.daily_budget - self.today_spend, 4),
            'request_count': self.request_count,
            'percentage_used': round((self.today_spend / self.daily_budget) * 100, 2)
        }


class LLMRouter:
    """
    Intelligent LLM router with fallback and cost management.

    Routes requests to appropriate provider based on:
    - Task complexity
    - JSON requirements
    - Budget constraints
    - Provider availability
    """

    def __init__(self, daily_budget: float = 10.0):
        self.clients = {
            LLMProvider.LOCAL: OllamaClient(),
            LLMProvider.CLOUD_CLAUDE: AnthropicClient(),
            LLMProvider.CLOUD_GEMINI: GeminiClient()
        }
        self.cost_tracker = CostTracker(daily_budget)

    def route(
        self,
        task: str,
        complexity: TaskComplexity = TaskComplexity.MEDIUM,
        require_json: bool = False,
        allow_cloud: bool = True
    ) -> LLMProvider:
        """
        Determine best provider for task.

        Args:
            task: Task description
            complexity: Task complexity level
            require_json: Whether response must be valid JSON
            allow_cloud: Whether cloud providers are allowed

        Returns:
            Selected provider
        """
        # If cloud not allowed, use local
        if not allow_cloud:
            return LLMProvider.LOCAL

        # If JSON required and medium/high complexity, use Claude (most reliable)
        if require_json and complexity in [TaskComplexity.MEDIUM, TaskComplexity.HIGH]:
            if self._is_available(LLMProvider.CLOUD_CLAUDE):
                return LLMProvider.CLOUD_CLAUDE

        # High complexity tasks need best model
        if complexity == TaskComplexity.HIGH:
            if self._is_available(LLMProvider.CLOUD_CLAUDE):
                return LLMProvider.CLOUD_CLAUDE
            if self._is_available(LLMProvider.CLOUD_GEMINI):
                return LLMProvider.CLOUD_GEMINI
            return LLMProvider.LOCAL

        # Low complexity: try local first (free)
        if complexity == TaskComplexity.LOW:
            if self._is_available(LLMProvider.LOCAL):
                return LLMProvider.LOCAL
            if self._is_available(LLMProvider.CLOUD_GEMINI):
                return LLMProvider.CLOUD_GEMINI
            return LLMProvider.CLOUD_CLAUDE

        # Medium complexity: balance cost and quality
        if self._is_available(LLMProvider.CLOUD_GEMINI):
            return LLMProvider.CLOUD_GEMINI
        if self._is_available(LLMProvider.LOCAL):
            return LLMProvider.LOCAL
        return LLMProvider.CLOUD_CLAUDE

    def _is_available(self, provider: LLMProvider) -> bool:
        """Check if provider is available and within budget."""
        if provider == LLMProvider.LOCAL:
            # Check if Ollama is running (assume yes for now)
            return True

        # Check API key and budget for cloud providers
        client = self.clients.get(provider)
        if not client:
            return False

        # Check budget for cloud providers
        estimated_cost = client.estimate_cost(1000)  # Rough estimate
        return self.cost_tracker.can_afford(estimated_cost)

    async def generate(
        self,
        prompt: str,
        task: str,
        complexity: TaskComplexity = TaskComplexity.MEDIUM,
        require_json: bool = False,
        preferred_provider: Optional[LLMProvider] = None
    ) -> LLMResponse:
        """
        Generate with appropriate provider and fallback.

        Args:
            prompt: Input prompt
            task: Task description
            complexity: Task complexity
            require_json: Whether JSON is required
            preferred_provider: Optional preferred provider

        Returns:
            LLM response with metadata
        """
        # Select provider
        if preferred_provider:
            provider = preferred_provider
        else:
            provider = self.route(task, complexity, require_json)

        # Try primary provider
        client = self.clients[provider]
        response = await client.generate(prompt, require_json)

        # Track cost
        self.cost_tracker.track_request(response)

        # If failed or JSON parsing failed, try fallback
        if not response.success or (require_json and not self._is_valid_json(response.content)):
            fallback_provider = self._get_fallback(provider)
            if fallback_provider:
                logger.warning(f"Primary {provider.value} failed, trying {fallback_provider.value}")
                fallback_client = self.clients[fallback_provider]
                response = await fallback_client.generate(prompt, require_json)
                self.cost_tracker.track_request(response)

        return response

    def _get_fallback(self, current_provider: LLMProvider) -> Optional[LLMProvider]:
        """Get fallback provider."""
        fallback_order = {
            LLMProvider.LOCAL: LLMProvider.CLOUD_CLAUDE,
            LLMProvider.CLOUD_GEMINI: LLMProvider.CLOUD_CLAUDE,
            LLMProvider.CLOUD_CLAUDE: LLMProvider.CLOUD_GEMINI
        }
        return fallback_order.get(current_provider)

    def _is_valid_json(self, text: str) -> bool:
        """Check if text is valid JSON."""
        try:
            json.loads(text)
            return True
        except (json.JSONDecodeError, ValueError):
            return False

    def get_cost_stats(self) -> Dict[str, Any]:
        """Get cost tracking statistics."""
        return self.cost_tracker.get_stats()


# Singleton router
llm_router = LLMRouter(daily_budget=float(os.getenv('LLM_DAILY_BUDGET', '10.0')))


# Convenience functions
async def generate_text(
    prompt: str,
    task: str = "general",
    complexity: str = "medium"
) -> str:
    """
    Generate text using appropriate provider.

    Args:
        prompt: Input prompt
        task: Task type
        complexity: low/medium/high

    Returns:
        Generated text
    """
    complexity_enum = TaskComplexity(complexity)
    response = await llm_router.generate(prompt, task, complexity_enum, require_json=False)
    return response.content if response.success else ""


async def generate_json(
    prompt: str,
    task: str = "json_extraction",
    complexity: str = "medium"
) -> Dict[str, Any]:
    """
    Generate JSON using appropriate provider.

    Args:
        prompt: Input prompt
        task: Task type
        complexity: low/medium/high

    Returns:
        Parsed JSON dict
    """
    complexity_enum = TaskComplexity(complexity)
    response = await llm_router.generate(prompt, task, complexity_enum, require_json=True)

    if response.success:
        try:
            return json.loads(response.content)
        except json.JSONDecodeError:
            logger.error(f"Failed to parse JSON from {response.provider.value}")
            return {"error": "JSON parsing failed", "raw": response.content}

    return {"error": "Generation failed", "message": response.error}


def get_llm_stats() -> Dict[str, Any]:
    """Get LLM usage statistics."""
    return {
        'cost_stats': llm_router.get_cost_stats(),
        'providers': {
            'local_available': True,  # Ollama
            'claude_available': bool(os.getenv('ANTHROPIC_API_KEY')),
            'gemini_available': bool(os.getenv('GEMINI_API_KEY'))
        }
    }
