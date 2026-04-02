"""
Unit Tests for LLM Router

Tests multi-model routing, fallback logic, and cost tracking.
"""

import pytest
import json
import asyncio
from unittest.mock import Mock, patch, AsyncMock, MagicMock
from datetime import datetime

from llm_router import (
    LLMProvider,
    TaskComplexity,
    LLMResponse,
    OllamaClient,
    AnthropicClient,
    GeminiClient,
    CostTracker,
    LLMRouter,
    generate_text,
    generate_json,
    get_llm_stats
)


class TestLLMResponse:
    """Test LLMResponse dataclass."""

    def test_response_creation(self):
        """Test response creation."""
        response = LLMResponse(
            provider=LLMProvider.CLOUD_CLAUDE,
            content='Test content',
            model='claude-3',
            tokens_used=100,
            cost_usd=0.01,
            latency_ms=500,
            success=True
        )

        assert response.provider == LLMProvider.CLOUD_CLAUDE
        assert response.content == 'Test content'
        assert response.success is True

    def test_failed_response(self):
        """Test failed response."""
        response = LLMResponse(
            provider=LLMProvider.LOCAL,
            content='',
            model='local',
            tokens_used=0,
            cost_usd=0.0,
            latency_ms=0,
            success=False,
            error='Connection failed'
        )

        assert response.success is False
        assert response.error == 'Connection failed'


class TestOllamaClient:
    """Test Ollama local client."""

    @pytest.fixture
    def client(self):
        """Create Ollama client."""
        return OllamaClient(base_url='http://localhost:11434')

    @pytest.mark.asyncio
    async def test_generate_success(self, client):
        """Test successful generation."""
        mock_response = {'response': 'Generated text'}

        with patch('aiohttp.ClientSession.post') as mock_post:
            mock_context = AsyncMock()
            mock_context.__aenter__ = AsyncMock(return_value=MagicMock(
                status=200,
                json=AsyncMock(return_value=mock_response)
            ))
            mock_context.__aexit__ = AsyncMock(return_value=False)
            mock_post.return_value = mock_context

            result = await client.generate('Test prompt')

            assert result.success is True
            assert result.content == 'Generated text'
            assert result.cost_usd == 0.0

    @pytest.mark.asyncio
    async def test_generate_failure(self, client):
        """Test failed generation."""
        with patch('aiohttp.ClientSession.post') as mock_post:
            mock_context = AsyncMock()
            mock_context.__aenter__ = AsyncMock(return_value=MagicMock(
                status=500,
                json=AsyncMock(return_value={})
            ))
            mock_context.__aexit__ = AsyncMock(return_value=False)
            mock_post.return_value = mock_context

            result = await client.generate('Test prompt')

            assert result.success is False
            assert 'error' in result.error.lower()

    def test_extract_json(self, client):
        """Test JSON extraction from text."""
        text = '```json\n{"key": "value"}\n```'
        result = client._extract_json(text)

        assert '{"key": "value"}' in result

    def test_extract_json_inline(self, client):
        """Test JSON extraction without markdown."""
        text = 'Here is the result: {"key": "value"}'
        result = client._extract_json(text)

        assert '{"key": "value"}' in result

    def test_estimate_cost(self, client):
        """Test cost estimation."""
        assert client.estimate_cost(1000) == 0.0


class TestAnthropicClient:
    """Test Anthropic Claude client."""

    @pytest.fixture
    def client(self):
        """Create Anthropic client."""
        return AnthropicClient(api_key='test-key')

    def test_init_with_api_key(self):
        """Test initialization with API key."""
        client = AnthropicClient(api_key='my-key')
        assert client.api_key == 'my-key'

    def test_init_from_env(self):
        """Test initialization from environment."""
        with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'env-key'}):
            client = AnthropicClient()
            assert client.api_key == 'env-key'

    @pytest.mark.asyncio
    async def test_generate_no_api_key(self):
        """Test generation without API key."""
        client = AnthropicClient(api_key=None)
        result = await client.generate('Test prompt')

        assert result.success is False
        assert 'key' in result.error.lower()

    @pytest.mark.asyncio
    async def test_generate_success(self, client):
        """Test successful generation."""
        mock_data = {
            'content': [{'text': 'Generated response'}],
            'usage': {'input_tokens': 50, 'output_tokens': 100}
        }

        with patch('aiohttp.ClientSession.post') as mock_post:
            mock_context = AsyncMock()
            mock_context.__aenter__ = AsyncMock(return_value=MagicMock(
                status=200,
                json=AsyncMock(return_value=mock_data)
            ))
            mock_context.__aexit__ = AsyncMock(return_value=False)
            mock_post.return_value = mock_context

            result = await client.generate('Test prompt')

            assert result.success is True
            assert result.content == 'Generated response'
            assert result.tokens_used == 150
            assert result.cost_usd > 0

    def test_estimate_cost(self, client):
        """Test cost estimation."""
        cost = client.estimate_cost(1000)
        assert cost > 0
        assert cost < 0.01  # Should be small for 1000 tokens


class TestGeminiClient:
    """Test Google Gemini client."""

    @pytest.fixture
    def client(self):
        """Create Gemini client."""
        return GeminiClient(api_key='test-key')

    @pytest.mark.asyncio
    async def test_generate_success(self, client):
        """Test successful generation."""
        mock_data = {
            'candidates': [{
                'content': {
                    'parts': [{'text': 'Generated text'}]
                }
            }],
            'usageMetadata': {'totalTokenCount': 150}
        }

        with patch('aiohttp.ClientSession.post') as mock_post:
            mock_context = AsyncMock()
            mock_context.__aenter__ = AsyncMock(return_value=MagicMock(
                status=200,
                json=AsyncMock(return_value=mock_data)
            ))
            mock_context.__aexit__ = AsyncMock(return_value=False)
            mock_post.return_value = mock_context

            result = await client.generate('Test prompt')

            assert result.success is True
            assert result.content == 'Generated text'

    @pytest.mark.asyncio
    async def test_generate_rate_limit(self, client):
        """Test rate limit handling."""
        with patch('aiohttp.ClientSession.post') as mock_post:
            mock_context = AsyncMock()
            mock_context.__aenter__ = AsyncMock(return_value=MagicMock(
                status=429,
                text=AsyncMock(return_value='Rate limited')
            ))
            mock_context.__aexit__ = AsyncMock(return_value=False)
            mock_post.return_value = mock_context

            result = await client.generate('Test prompt')

            assert result.success is False
            assert 'rate' in result.error.lower()


class TestCostTracker:
    """Test CostTracker class."""

    @pytest.fixture
    def tracker(self):
        """Create cost tracker."""
        return CostTracker(daily_budget=10.0)

    def test_init(self, tracker):
        """Test initialization."""
        assert tracker.daily_budget == 10.0
        assert tracker.today_spend == 0.0
        assert tracker.request_count == 0

    def test_can_afford(self, tracker):
        """Test budget checking."""
        assert tracker.can_afford(5.0) is True
        assert tracker.can_afford(15.0) is False

    def test_track_request(self, tracker):
        """Test request tracking."""
        response = LLMResponse(
            provider=LLMProvider.CLOUD_CLAUDE,
            content='Test',
            model='claude-3',
            tokens_used=100,
            cost_usd=0.01,
            latency_ms=100,
            success=True
        )

        tracker.track_request(response)

        assert tracker.today_spend == 0.01
        assert tracker.request_count == 1

    def test_get_stats(self, tracker):
        """Test statistics."""
        stats = tracker.get_stats()

        assert 'daily_budget' in stats
        assert 'today_spend' in stats
        assert 'remaining' in stats
        assert 'request_count' in stats
        assert 'percentage_used' in stats


class TestLLMRouter:
    """Test LLMRouter class."""

    @pytest.fixture
    def router(self):
        """Create LLM router."""
        return LLMRouter(daily_budget=10.0)

    def test_init(self, router):
        """Test initialization."""
        assert len(router.clients) == 3
        assert router.cost_tracker is not None

    def test_route_local_for_low_complexity(self, router):
        """Test routing low complexity to local."""
        provider = router.route('Simple task', TaskComplexity.LOW)
        assert provider == LLMProvider.LOCAL

    def test_route_claude_for_high_complexity_json(self, router):
        """Test routing high complexity + JSON to Claude."""
        provider = router.route('Complex task', TaskComplexity.HIGH, require_json=True)
        assert provider == LLMProvider.CLOUD_CLAUDE

    def test_route_gemini_for_medium_complexity(self, router):
        """Test routing medium complexity to Gemini."""
        provider = router.route('Medium task', TaskComplexity.MEDIUM)
        # Should prefer Gemini for medium complexity
        assert provider in [LLMProvider.CLOUD_GEMINI, LLMProvider.LOCAL]

    def test_route_no_cloud(self, router):
        """Test routing with cloud disabled."""
        provider = router.route('Any task', TaskComplexity.HIGH, allow_cloud=False)
        assert provider == LLMProvider.LOCAL

    def test_get_fallback(self, router):
        """Test fallback provider selection."""
        fallback = router._get_fallback(LLMProvider.LOCAL)
        assert fallback == LLMProvider.CLOUD_CLAUDE

        fallback = router._get_fallback(LLMProvider.CLOUD_GEMINI)
        assert fallback == LLMProvider.CLOUD_CLAUDE

    def test_is_valid_json(self, router):
        """Test JSON validation."""
        assert router._is_valid_json('{"key": "value"}') is True
        assert router._is_valid_json('invalid json') is False

    @pytest.mark.asyncio
    async def test_generate_with_fallback(self, router):
        """Test generation with fallback."""
        # Mock primary client to fail
        with patch.object(router.clients[LLMProvider.LOCAL], 'generate',
                         return_value=LLMResponse(
                             provider=LLMProvider.LOCAL,
                             content='',
                             model='local',
                             tokens_used=0,
                             cost_usd=0.0,
                             latency_ms=0,
                             success=False,
                             error='Failed'
                         )):
            # Mock fallback to succeed
            with patch.object(router.clients[LLMProvider.CLOUD_CLAUDE], 'generate',
                             return_value=LLMResponse(
                                 provider=LLMProvider.CLOUD_CLAUDE,
                                 content='Success',
                                 model='claude-3',
                                 tokens_used=100,
                                 cost_usd=0.01,
                                 latency_ms=500,
                                 success=True
                             )):
                result = await router.generate('Test', 'task', TaskComplexity.LOW)

                assert result.success is True
                assert result.content == 'Success'


class TestConvenienceFunctions:
    """Test convenience functions."""

    @pytest.mark.asyncio
    async def test_generate_text(self):
        """Test generate_text function."""
        with patch('llm_router.llm_router.generate') as mock_generate:
            mock_generate.return_value = LLMResponse(
                provider=LLMProvider.LOCAL,
                content='Generated',
                model='local',
                tokens_used=10,
                cost_usd=0.0,
                latency_ms=100,
                success=True
            )

            result = await generate_text('Prompt')
            assert result == 'Generated'

    @pytest.mark.asyncio
    async def test_generate_json(self):
        """Test generate_json function."""
        with patch('llm_router.llm_router.generate') as mock_generate:
            mock_generate.return_value = LLMResponse(
                provider=LLMProvider.CLOUD_CLAUDE,
                content='{"key": "value"}',
                model='claude-3',
                tokens_used=50,
                cost_usd=0.01,
                latency_ms=200,
                success=True
            )

            result = await generate_json('Prompt')
            assert result['key'] == 'value'

    @pytest.mark.asyncio
    async def test_generate_json_failure(self):
        """Test generate_json with invalid JSON."""
        with patch('llm_router.llm_router.generate') as mock_generate:
            mock_generate.return_value = LLMResponse(
                provider=LLMProvider.CLOUD_CLAUDE,
                content='invalid json',
                model='claude-3',
                tokens_used=50,
                cost_usd=0.01,
                latency_ms=200,
                success=True
            )

            result = await generate_json('Prompt')
            assert 'error' in result

    def test_get_llm_stats(self):
        """Test get_llm_stats function."""
        stats = get_llm_stats()

        assert 'cost_stats' in stats
        assert 'providers' in stats


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
