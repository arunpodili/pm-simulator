"""
Field Mapping Engine - Transform User Inputs to Simulation Parameters

Uses NLP techniques and pattern matching to extract structured simulation
parameters from free-form user inputs.
"""

import re
from typing import Dict, Any, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class PainLevel(Enum):
    """Pain severity levels."""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class MarketSize(Enum):
    """Market size categories."""
    ENTERPRISE = "enterprise"
    MID_MARKET = "mid_market"
    SMB = "smb"
    CONSUMER = "consumer"


class PriceSensitivity(Enum):
    """Price sensitivity levels."""
    VERY_HIGH = "very_high"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    VERY_LOW = "very_low"


@dataclass
class ExtractedInsight:
    """Single extracted insight with confidence."""
    field: str
    value: Any
    confidence: float  # 0-1
    source: str  # Which extraction method found this
    raw_text: str  # Original text snippet


class FieldMappingEngine:
    """
    Transforms user product briefs into structured simulation configuration.

    Uses multiple extraction strategies:
    1. Keyword matching for known patterns
    2. Regex extraction for structured data
    3. Sentiment analysis for severity
    4. Industry-specific heuristics
    """

    def __init__(self):
        """Initialize with extraction patterns."""
        self._init_pain_patterns()
        self._init_market_patterns()
        self._init_pricing_patterns()
        self._init_viral_patterns()
        self._init_competitive_patterns()
        self._init_adoption_patterns()

    def _init_pain_patterns(self):
        """Initialize pain severity extraction patterns."""
        self.pain_keywords = {
            PainLevel.CRITICAL: [
                'critical', 'urgent', 'blocking', 'frustrated', 'desperate',
                'impossible', 'unbearable', 'crisis', 'emergency',
                'wasting hours', 'losing money', 'bleeding'
            ],
            PainLevel.HIGH: [
                'major', 'significant', 'serious', 'big problem', 'constant',
                'frequently', 'annoying', 'painful', 'difficult', 'struggling'
            ],
            PainLevel.MEDIUM: [
                'moderate', 'somewhat', 'occasionally', 'inconvenient',
                'inefficient', 'slow', 'tedious', 'manual', 'repetitive'
            ],
            PainLevel.LOW: [
                'minor', 'nice to have', 'improvement', 'optional',
                'would be good', 'convenience', 'helpful'
            ]
        }

    def _init_market_patterns(self):
        """Initialize market size extraction patterns."""
        self.market_indicators = {
            MarketSize.ENTERPRISE: [
                'enterprise', 'fortune 500', 'large organization', 'corporation',
                'big company', 'global company', 'fortune500', 'f500'
            ],
            MarketSize.MID_MARKET: [
                'mid-market', 'mid market', 'midsize', 'growing company',
                'scale up', 'scale-up', 'series', 'startup team'
            ],
            MarketSize.SMB: [
                'small business', 'smb', 'startup', 'founder', 'small team',
                'bootstrapped', 'early stage'
            ],
            MarketSize.CONSUMER: [
                'consumers', 'users', 'individuals', 'people', 'everyone',
                'general public', 'b2c', 'direct to consumer'
            ]
        }

    def _init_pricing_patterns(self):
        """Initialize pricing extraction patterns."""
        # Price extraction regex
        self.price_patterns = [
            r'\$([\d,]+(?:\.\d{2})?)\s*(?:/|\sper\s)?\s*(month|year|mo|yr|m|y)?',
            r'([\d,]+)\s*dollar',
            r'(?:price|cost|pricing).{0,20}\$?([\d,]+)',
            r'\$?([\d,]+)\s*(?:monthly|annually|per month|per year)',
        ]

        self.price_contexts = {
            'high_sensitivity': [
                'expensive', 'costly', 'budget', 'cheap', 'affordable',
                'price sensitive', 'cost conscious'
            ],
            'low_sensitivity': [
                'premium', 'enterprise pricing', 'worth it', 'roi',
                'value', 'investment', 'cheap for'
            ]
        }

    def _init_viral_patterns(self):
        """Initialize viral potential extraction patterns."""
        self.viral_indicators = {
            'high': [
                'share', 'collaborate', 'team', 'invite', 'referral',
                'network effect', 'viral', 'spread', 'word of mouth',
                'social', 'community', 'group', 'workspace'
            ],
            'medium': [
                'export', 'report', 'dashboard', 'visible', 'public',
                'showcase', 'demo', 'presentation'
            ],
            'low': [
                'personal', 'private', 'individual', 'solo',
                'confidential', 'internal use'
            ]
        }

    def _init_competitive_patterns(self):
        """Initialize competitive pressure extraction patterns."""
        self.competitive_indicators = {
            'high': [
                'competitive', 'crowded', 'saturated', 'many competitors',
                'established players', 'dominant', 'market leader',
                'intense competition', 'red ocean'
            ],
            'medium': [
                'some competition', 'few competitors', 'emerging',
                'growing market', 'new entrants'
            ],
            'low': [
                'blue ocean', 'first mover', 'no competition',
                'unique', 'only solution', 'monopoly'
            ]
        }

    def _init_adoption_patterns(self):
        """Initialize adoption speed extraction patterns."""
        self.adoption_indicators = {
            'fast': [
                'easy to adopt', 'intuitive', 'familiar', 'like',
                'similar to', 'migration', 'switch', 'quick setup',
                'minutes', 'instant', 'immediate value'
            ],
            'slow': [
                'complex', 'enterprise grade', 'setup required',
                'onboarding', 'training', 'implementation',
                'weeks', 'months', 'customization'
            ]
        }

    def map_brief_to_config(self, brief: Dict[str, str]) -> Dict[str, Any]:
        """
        Transform user brief into structured simulation parameters.

        Args:
            brief: Dictionary with user input fields:
                - problem: Problem statement
                - target_user: Target user description
                - pricing: Pricing information
                - competitors: Competitive landscape
                - success_metric: Success metrics
                - additional_context: Any other info

        Returns:
            Dictionary of extracted simulation parameters
        """
        insights = []

        # Combine all text for analysis
        full_text = self._combine_text(brief)
        problem_text = brief.get('problem', '').lower()
        target_text = brief.get('target_user', '').lower()
        pricing_text = brief.get('pricing', '').lower()
        competitor_text = brief.get('competitors', '').lower()

        # Extract each parameter
        pain_insight = self._extract_pain_severity(problem_text)
        insights.append(pain_insight)

        market_insight = self._extract_market_size(target_text)
        insights.append(market_insight)

        price_insight = self._extract_price_sensitivity(pricing_text, full_text)
        insights.append(price_insight)

        viral_insight = self._extract_viral_potential(full_text)
        insights.append(viral_insight)

        competitive_insight = self._extract_competitive_pressure(competitor_text)
        insights.append(competitive_insight)

        adoption_insight = self._extract_adoption_speed(full_text)
        insights.append(adoption_insight)

        # Build config
        config = {
            'pain_severity': {
                'value': pain_insight.value,
                'confidence': pain_insight.confidence,
                'description': self._get_pain_description(pain_insight.value)
            },
            'market_size': {
                'value': market_insight.value,
                'confidence': market_insight.confidence,
                'description': self._get_market_description(market_insight.value)
            },
            'price_sensitivity': {
                'value': price_insight.value,
                'confidence': price_insight.confidence,
                'description': self._get_price_description(price_insight.value)
            },
            'viral_potential': {
                'value': viral_insight.value,
                'confidence': viral_insight.confidence,
                'description': self._get_viral_description(viral_insight.value)
            },
            'competitive_pressure': {
                'value': competitive_insight.value,
                'confidence': competitive_insight.confidence,
                'description': self._get_competitive_description(competitive_insight.value)
            },
            'tech_adoption_speed': {
                'value': adoption_insight.value,
                'confidence': adoption_insight.confidence,
                'description': self._get_adoption_description(adoption_insight.value)
            },
            'extracted_price': self._extract_exact_price(pricing_text),
            'insights': [
                {
                    'field': i.field,
                    'value': i.value,
                    'confidence': round(i.confidence * 100, 1),
                    'source': i.source,
                    'snippet': i.raw_text[:100] + '...' if len(i.raw_text) > 100 else i.raw_text
                }
                for i in insights
            ]
        }

        return config

    def _combine_text(self, brief: Dict[str, str]) -> str:
        """Combine all brief fields into single text."""
        fields = [
            brief.get('problem', ''),
            brief.get('target_user', ''),
            brief.get('pricing', ''),
            brief.get('competitors', ''),
            brief.get('success_metric', ''),
            brief.get('additional_context', '')
        ]
        return ' '.join(fields).lower()

    def _extract_pain_severity(self, text: str) -> ExtractedInsight:
        """Extract pain severity from problem statement."""
        text_lower = text.lower()

        # Check each severity level
        for level in [PainLevel.CRITICAL, PainLevel.HIGH, PainLevel.MEDIUM, PainLevel.LOW]:
            keywords = self.pain_keywords[level]
            for keyword in keywords:
                if keyword in text_lower:
                    # Calculate confidence based on keyword match
                    confidence = 0.7 if level in [PainLevel.CRITICAL, PainLevel.HIGH] else 0.6
                    return ExtractedInsight(
                        field='pain_severity',
                        value=self._pain_to_score(level),
                        confidence=confidence,
                        source='keyword_match',
                        raw_text=text[text_lower.find(keyword):text_lower.find(keyword)+len(keyword)+20]
                    )

        # Default: medium pain
        return ExtractedInsight(
            field='pain_severity',
            value=0.5,
            confidence=0.4,
            source='default',
            raw_text=text[:50]
        )

    def _extract_market_size(self, text: str) -> ExtractedInsight:
        """Extract market size from target user description."""
        text_lower = text.lower()

        for market, indicators in self.market_indicators.items():
            for indicator in indicators:
                if indicator in text_lower:
                    return ExtractedInsight(
                        field='market_size',
                        value=market.value,
                        confidence=0.75,
                        source='keyword_match',
                        raw_text=text[text_lower.find(indicator):text_lower.find(indicator)+len(indicator)+20]
                    )

        return ExtractedInsight(
            field='market_size',
            value=MarketSize.MID_MARKET.value,
            confidence=0.4,
            source='default',
            raw_text=text[:50]
        )

    def _extract_price_sensitivity(self, pricing_text: str, full_text: str) -> ExtractedInsight:
        """Extract price sensitivity from pricing info."""
        text_lower = full_text.lower()

        # Check context indicators
        for indicator in self.price_contexts['high_sensitivity']:
            if indicator in text_lower:
                return ExtractedInsight(
                    field='price_sensitivity',
                    value=0.8,
                    confidence=0.7,
                    source='context_analysis',
                    raw_text=pricing_text[:100]
                )

        for indicator in self.price_contexts['low_sensitivity']:
            if indicator in text_lower:
                return ExtractedInsight(
                    field='price_sensitivity',
                    value=0.3,
                    confidence=0.7,
                    source='context_analysis',
                    raw_text=pricing_text[:100]
                )

        # Extract actual price
        price = self._extract_exact_price(pricing_text)
        if price:
            # Lower price = lower sensitivity (assuming it's reasonable)
            if price < 20:
                return ExtractedInsight(
                    field='price_sensitivity',
                    value=0.4,
                    confidence=0.6,
                    source='price_value',
                    raw_text=f"${price}"
                )
            elif price < 100:
                return ExtractedInsight(
                    field='price_sensitivity',
                    value=0.6,
                    confidence=0.6,
                    source='price_value',
                    raw_text=f"${price}"
                )
            else:
                return ExtractedInsight(
                    field='price_sensitivity',
                    value=0.8,
                    confidence=0.6,
                    source='price_value',
                    raw_text=f"${price}"
                )

        return ExtractedInsight(
            field='price_sensitivity',
            value=0.5,
            confidence=0.4,
            source='default',
            raw_text=pricing_text[:50]
        )

    def _extract_exact_price(self, text: str) -> Optional[float]:
        """Extract exact price value from text."""
        for pattern in self.price_patterns:
            match = re.search(pattern, text.lower())
            if match:
                try:
                    price_str = match.group(1).replace(',', '')
                    return float(price_str)
                except (ValueError, IndexError):
                    continue
        return None

    def _extract_viral_potential(self, text: str) -> ExtractedInsight:
        """Extract viral potential from full text."""
        text_lower = text.lower()

        high_score = sum(1 for w in self.viral_indicators['high'] if w in text_lower)
        medium_score = sum(1 for w in self.viral_indicators['medium'] if w in text_lower)
        low_score = sum(1 for w in self.viral_indicators['low'] if w in text_lower)

        if high_score > 0:
            return ExtractedInsight(
                field='viral_potential',
                value=min(0.9, 0.7 + (high_score * 0.05)),
                confidence=0.6 + (high_score * 0.05),
                source='viral_keywords',
                raw_text=text[:100]
            )
        elif medium_score > 0:
            return ExtractedInsight(
                field='viral_potential',
                value=0.5,
                confidence=0.5 + (medium_score * 0.05),
                source='viral_keywords',
                raw_text=text[:100]
            )

        return ExtractedInsight(
            field='viral_potential',
            value=0.3,
            confidence=0.4,
            source='default',
            raw_text=text[:50]
        )

    def _extract_competitive_pressure(self, text: str) -> ExtractedInsight:
        """Extract competitive pressure from competitor text."""
        text_lower = text.lower()

        for level, indicators in self.competitive_indicators.items():
            for indicator in indicators:
                if indicator in text_lower:
                    score = {'high': 0.9, 'medium': 0.5, 'low': 0.2}[level]
                    return ExtractedInsight(
                        field='competitive_pressure',
                        value=score,
                        confidence=0.7,
                        source='keyword_match',
                        raw_text=text[text_lower.find(indicator):text_lower.find(indicator)+len(indicator)+20]
                    )

        return ExtractedInsight(
            field='competitive_pressure',
            value=0.5,
            confidence=0.4,
            source='default',
            raw_text=text[:50] if text else 'No competitor info'
        )

    def _extract_adoption_speed(self, text: str) -> ExtractedInsight:
        """Extract tech adoption speed from full text."""
        text_lower = text.lower()

        fast_score = sum(1 for w in self.adoption_indicators['fast'] if w in text_lower)
        slow_score = sum(1 for w in self.adoption_indicators['slow'] if w in text_lower)

        if fast_score > slow_score:
            return ExtractedInsight(
                field='tech_adoption_speed',
                value=0.8,
                confidence=0.6 + (fast_score * 0.05),
                source='adoption_keywords',
                raw_text=text[:100]
            )
        elif slow_score > fast_score:
            return ExtractedInsight(
                field='tech_adoption_speed',
                value=0.3,
                confidence=0.6 + (slow_score * 0.05),
                source='adoption_keywords',
                raw_text=text[:100]
            )

        return ExtractedInsight(
            field='tech_adoption_speed',
            value=0.5,
            confidence=0.4,
            source='default',
            raw_text=text[:50]
        )

    def _pain_to_score(self, level: PainLevel) -> float:
        """Convert pain level to numerical score."""
        mapping = {
            PainLevel.CRITICAL: 0.95,
            PainLevel.HIGH: 0.75,
            PainLevel.MEDIUM: 0.5,
            PainLevel.LOW: 0.25
        }
        return mapping.get(level, 0.5)

    def _get_pain_description(self, value: float) -> str:
        """Get human-readable pain description."""
        if value >= 0.9:
            return "Critical pain - users desperate for solution"
        elif value >= 0.7:
            return "High pain - significant problem"
        elif value >= 0.4:
            return "Moderate pain - noticeable inconvenience"
        else:
            return "Low pain - nice-to-have improvement"

    def _get_market_description(self, value: str) -> str:
        """Get human-readable market description."""
        descriptions = {
            'enterprise': 'Enterprise/Fortune 500 companies',
            'mid_market': 'Mid-market growing companies',
            'smb': 'Small businesses and startups',
            'consumer': 'Consumer/individual users'
        }
        return descriptions.get(value, 'Mixed market segments')

    def _get_price_description(self, value: float) -> str:
        """Get human-readable price sensitivity description."""
        if value >= 0.7:
            return "High price sensitivity - budget conscious"
        elif value >= 0.4:
            return "Moderate price sensitivity - value focused"
        else:
            return "Low price sensitivity - premium acceptable"

    def _get_viral_description(self, value: float) -> str:
        """Get human-readable viral description."""
        if value >= 0.7:
            return "High viral potential - social/collaborative features"
        elif value >= 0.4:
            return "Moderate viral potential - some sharing"
        else:
            return "Low viral potential - individual use"

    def _get_competitive_description(self, value: float) -> str:
        """Get human-readable competitive description."""
        if value >= 0.7:
            return "High competition - crowded market"
        elif value >= 0.4:
            return "Moderate competition - some alternatives"
        else:
            return "Low competition - first mover advantage"

    def _get_adoption_description(self, value: float) -> str:
        """Get human-readable adoption description."""
        if value >= 0.7:
            return "Fast adoption - easy to switch"
        elif value >= 0.4:
            return "Moderate adoption - some friction"
        else:
            return "Slow adoption - complex implementation"


# Singleton instance
field_mapper = FieldMappingEngine()


def map_user_brief(brief: Dict[str, str]) -> Dict[str, Any]:
    """
    Convenience function to map user brief to config.

    Args:
        brief: User input dictionary

    Returns:
        Structured simulation configuration
    """
    return field_mapper.map_brief_to_config(brief)
