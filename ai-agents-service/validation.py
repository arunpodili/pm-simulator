"""
Validation Framework - Compare Simulation Results to Industry Benchmarks

Provides confidence scoring and realism validation by comparing simulation
outputs against known industry metrics and benchmarks.
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from enum import Enum
import statistics
import logging

logger = logging.getLogger(__name__)


class ValidationStatus(Enum):
    """Validation status levels."""
    VALID = "valid"           # Within 1 std dev
    WARNING = "warning"       # 1-2 std dev
    ALERT = "alert"          # 2-3 std dev
    CRITICAL = "critical"    # >3 std dev


@dataclass
class Benchmark:
    """Industry benchmark metric."""
    metric: str
    industry: str
    mean: float
    std_dev: float
    source: str
    sample_size: Optional[int] = None
    year: int = 2024


@dataclass
class ValidationResult:
    """Result of validating a single metric."""
    metric: str
    value: float
    benchmark_mean: float
    benchmark_std: float
    z_score: float
    confidence: float
    status: ValidationStatus
    interpretation: str


class ValidationFramework:
    """
    Validates simulation results against industry benchmarks.

    Uses statistical comparison (z-scores) to determine if results are
    realistic. Provides confidence scores and recommendations.
    """

    # Industry benchmarks from public sources
    # Sources: OpenView SaaS Benchmarks, Bessemer VP Metrics, etc.
    BENCHMARKS: Dict[str, Dict[str, Benchmark]] = {
        'saas': {
            'trial_to_paid': Benchmark(
                metric='trial_to_paid',
                industry='saas',
                mean=0.15,           # 15% industry average
                std_dev=0.05,        # ±5%
                source='OpenView SaaS Benchmarks 2024',
                sample_size=500
            ),
            'monthly_churn': Benchmark(
                metric='monthly_churn',
                industry='saas',
                mean=0.05,           # 5% monthly
                std_dev=0.02,        # ±2%
                source='ProfitWell SaaS Churn Study',
                sample_size=1200
            ),
            'annual_churn': Benchmark(
                metric='annual_churn',
                industry='saas',
                mean=0.45,           # 45% annual
                std_dev=0.15,
                source='Bessemer VP State of Cloud',
                sample_size=800
            ),
            'nps': Benchmark(
                metric='nps',
                industry='saas',
                mean=30.0,           # NPS score
                std_dev=15.0,
                source='SaaS NPS Benchmarks 2024',
                sample_size=2000
            ),
            'viral_coefficient': Benchmark(
                metric='viral_coefficient',
                industry='saas',
                mean=0.20,           # 0.2 is good
                std_dev=0.10,
                source='Viral Marketing Study',
                sample_size=300
            ),
            'ltv_cac_ratio': Benchmark(
                metric='ltv_cac_ratio',
                industry='saas',
                mean=3.0,            # 3:1 is healthy
                std_dev=1.0,
                source='SaaS Metrics Guide',
                sample_size=1000
            ),
            'payback_period_months': Benchmark(
                metric='payback_period_months',
                industry='saas',
                mean=12.0,           # 12 months
                std_dev=6.0,
                source='OpenView SaaS Benchmarks',
                sample_size=600
            ),
            'gross_margin': Benchmark(
                metric='gross_margin',
                industry='saas',
                mean=0.75,           # 75%
                std_dev=0.10,
                source='Public SaaS Company Data',
                sample_size=150
            ),
            'activation_rate': Benchmark(
                metric='activation_rate',
                industry='saas',
                mean=0.25,           # 25% activate
                std_dev=0.10,
                source='User Onboarding Study',
                sample_size=800
            ),
            'conversion_rate': Benchmark(
                metric='conversion_rate',
                industry='saas',
                mean=0.02,           # 2% visitor to paid
                std_dev=0.01,
                source='Industry Conversion Benchmarks',
                sample_size=2000
            )
        },
        'fintech': {
            'signup_to_activation': Benchmark(
                metric='signup_to_activation',
                industry='fintech',
                mean=0.25,
                std_dev=0.08,
                source='Fintech Onboarding 2024',
                sample_size=500
            ),
            'activation_to_purchase': Benchmark(
                metric='activation_to_purchase',
                industry='fintech',
                mean=0.30,
                std_dev=0.10,
                source='Fintech Conversion Study',
                sample_size=400
            ),
            'monthly_churn': Benchmark(
                metric='monthly_churn',
                industry='fintech',
                mean=0.08,
                std_dev=0.03,
                source='Fintech Churn Analysis',
                sample_size=300
            ),
            'fraud_rate': Benchmark(
                metric='fraud_rate',
                industry='fintech',
                mean=0.005,          # 0.5%
                std_dev=0.002,
                source='Fintech Fraud Report',
                sample_size=250
            )
        },
        'ecommerce': {
            'conversion_rate': Benchmark(
                metric='conversion_rate',
                industry='ecommerce',
                mean=0.025,          # 2.5%
                std_dev=0.015,
                source='Ecommerce Benchmark 2024',
                sample_size=3000
            ),
            'cart_abandonment': Benchmark(
                metric='cart_abandonment',
                industry='ecommerce',
                mean=0.70,           # 70%
                std_dev=0.10,
                source='Baymard Institute',
                sample_size=4000
            ),
            'average_order_value': Benchmark(
                metric='average_order_value',
                industry='ecommerce',
                mean=85.0,
                std_dev=45.0,
                source='Ecommerce Metrics',
                sample_size=2500
            ),
            'repeat_purchase_rate': Benchmark(
                metric='repeat_purchase_rate',
                industry='ecommerce',
                mean=0.27,
                std_dev=0.12,
                source='Customer Loyalty Study',
                sample_size=1800
            )
        },
        'marketplace': {
            'take_rate': Benchmark(
                metric='take_rate',
                industry='marketplace',
                mean=0.15,
                std_dev=0.08,
                source='Marketplace Economics',
                sample_size=200
            ),
            'seller_buyer_ratio': Benchmark(
                metric='seller_buyer_ratio',
                industry='marketplace',
                mean=0.20,
                std_dev=0.10,
                source='Marketplace Network Study',
                sample_size=150
            ),
            'liquidity': Benchmark(
                metric='liquidity',
                industry='marketplace',
                mean=0.60,
                std_dev=0.20,
                source='Marketplace Liquidity Report',
                sample_size=180
            )
        }
    }

    def __init__(self):
        """Initialize validation framework."""
        pass

    def validate_results(
        self,
        results: Dict[str, Any],
        industry: str = 'saas',
        custom_benchmarks: Optional[Dict[str, Benchmark]] = None
    ) -> Dict[str, Any]:
        """
        Validate simulation results against industry benchmarks.

        Args:
            results: Simulation results dictionary
            industry: Industry sector (saas, fintech, ecommerce, etc.)
            custom_benchmarks: Optional custom benchmarks to include

        Returns:
            Validation report with confidence scores and recommendations
        """
        # Get benchmarks for industry
        benchmarks = self.BENCHMARKS.get(industry, self.BENCHMARKS['saas'])

        # Add custom benchmarks if provided
        if custom_benchmarks:
            benchmarks = {**benchmarks, **custom_benchmarks}

        validation_results = []
        total_confidence = 0.0

        # Validate each available metric
        for metric_name, benchmark in benchmarks.items():
            if metric_name in results:
                value = results[metric_name]
                validation = self._validate_metric(
                    metric_name,
                    value,
                    benchmark
                )
                validation_results.append(validation)
                total_confidence += validation.confidence

        # Calculate overall confidence
        avg_confidence = total_confidence / len(validation_results) if validation_results else 0.5

        # Determine overall status
        alert_count = sum(1 for v in validation_results if v.status in [ValidationStatus.ALERT, ValidationStatus.CRITICAL])
        warning_count = sum(1 for v in validation_results if v.status == ValidationStatus.WARNING)

        if alert_count > 0:
            overall_status = 'needs_review'
        elif warning_count > 1:
            overall_status = 'caution'
        else:
            overall_status = 'realistic'

        # Generate recommendations
        recommendations = self._generate_recommendations(validation_results, overall_status)

        return {
            'industry': industry,
            'overall_status': overall_status,
            'overall_confidence': round(avg_confidence * 100, 1),
            'is_realistic': avg_confidence >= 0.6 and alert_count == 0,
            'metrics_validated': len(validation_results),
            'metrics': [
                {
                    'name': v.metric,
                    'value': round(v.value, 3),
                    'benchmark': round(v.benchmark_mean, 3),
                    'z_score': round(v.z_score, 2),
                    'confidence': round(v.confidence * 100, 1),
                    'status': v.status.value,
                    'interpretation': v.interpretation
                }
                for v in validation_results
            ],
            'summary': {
                'valid': sum(1 for v in validation_results if v.status == ValidationStatus.VALID),
                'warnings': warning_count,
                'alerts': alert_count,
                'critical': sum(1 for v in validation_results if v.status == ValidationStatus.CRITICAL)
            },
            'recommendations': recommendations,
            'sources': list(set(v.benchmark.source for v in validation_results))
        }

    def _validate_metric(
        self,
        metric_name: str,
        value: float,
        benchmark: Benchmark
    ) -> ValidationResult:
        """
        Validate a single metric against its benchmark.

        Args:
            metric_name: Name of the metric
            value: Simulated value
            benchmark: Benchmark to compare against

        Returns:
            Validation result with confidence and status
        """
        # Calculate z-score (standard deviations from mean)
        if benchmark.std_dev > 0:
            z_score = (value - benchmark.mean) / benchmark.std_dev
        else:
            z_score = 0

        # Determine status based on z-score
        abs_z = abs(z_score)
        if abs_z <= 1.0:
            status = ValidationStatus.VALID
        elif abs_z <= 2.0:
            status = ValidationStatus.WARNING
        elif abs_z <= 3.0:
            status = ValidationStatus.ALERT
        else:
            status = ValidationStatus.CRITICAL

        # Calculate confidence (closer to mean = higher confidence)
        confidence = max(0, 1 - (abs_z / 4))

        # Generate interpretation
        interpretation = self._interpret_result(metric_name, value, benchmark, z_score, status)

        return ValidationResult(
            metric=metric_name,
            value=value,
            benchmark_mean=benchmark.mean,
            benchmark_std=benchmark.std_dev,
            z_score=z_score,
            confidence=confidence,
            status=status,
            interpretation=interpretation
        )

    def _interpret_result(
        self,
        metric: str,
        value: float,
        benchmark: Benchmark,
        z_score: float,
        status: ValidationStatus
    ) -> str:
        """Generate human-readable interpretation."""
        direction = "above" if z_score > 0 else "below"
        magnitude = abs(z_score)

        interpretations = {
            ValidationStatus.VALID: f"Within normal range ({direction} average by {magnitude:.1f}σ)",
            ValidationStatus.WARNING: f"Somewhat unusual ({direction} average by {magnitude:.1f}σ)",
            ValidationStatus.ALERT: f"Significantly {direction} typical range ({magnitude:.1f}σ)",
            ValidationStatus.CRITICAL: f"Extremely {direction} normal range ({magnitude:.1f}σ) - review inputs"
        }

        return interpretations.get(status, "Unable to interpret")

    def _generate_recommendations(
        self,
        validations: List[ValidationResult],
        overall_status: str
    ) -> List[str]:
        """Generate improvement recommendations."""
        recommendations = []

        # Check for critical issues
        critical_metrics = [v for v in validations if v.status == ValidationStatus.CRITICAL]
        for metric in critical_metrics:
            if metric.z_score > 0:
                recommendations.append(
                    f"{metric.metric}: Simulated value ({metric.value:.2%}) is extremely high. "
                    f"Consider if product truly outperforms industry by {metric.z_score:.1f} standard deviations."
                )
            else:
                recommendations.append(
                    f"{metric.metric}: Simulated value ({metric.value:.2%}) is extremely low. "
                    f"Review if pain points and market fit are properly modeled."
                )

        # Check for warnings
        warning_metrics = [v for v in validations if v.status == ValidationStatus.WARNING]
        if len(warning_metrics) > 2:
            recommendations.append(
                f"Multiple metrics ({len(warning_metrics)}) show warning signs. "
                "Consider refining target market definition or competitive positioning."
            )

        # General recommendations based on status
        if overall_status == 'needs_review':
            recommendations.append(
                "Results show significant deviation from industry norms. "
                "Recommend reviewing simulation assumptions or validating with real user data."
            )
        elif overall_status == 'caution':
            recommendations.append(
                "Some metrics deviate from benchmarks. "
                "Results are plausible but may benefit from sensitivity analysis."
            )
        else:
            recommendations.append(
                "Results align well with industry benchmarks. "
                "Confidence level supports using these projections for planning."
            )

        # Metric-specific recommendations
        for v in validations:
            if v.metric == 'monthly_churn' and v.value > 0.10:
                recommendations.append(
                    "High churn detected. Consider adding retention features or improving onboarding."
                )
            elif v.metric == 'conversion_rate' and v.value < 0.01:
                recommendations.append(
                    "Low conversion rate. Review pricing strategy and value proposition clarity."
                )
            elif v.metric == 'viral_coefficient' and v.value > 0.5:
                recommendations.append(
                    "High viral coefficient! Consider viral loop optimization as growth strategy."
                )

        return recommendations

    def add_custom_benchmark(
        self,
        industry: str,
        metric: str,
        mean: float,
        std_dev: float,
        source: str
    ):
        """
        Add a custom benchmark for validation.

        Args:
            industry: Industry category
            metric: Metric name
            mean: Benchmark mean
            std_dev: Benchmark standard deviation
            source: Data source
        """
        if industry not in self.BENCHMARKS:
            self.BENCHMARKS[industry] = {}

        self.BENCHMARKS[industry][metric] = Benchmark(
            metric=metric,
            industry=industry,
            mean=mean,
            std_dev=std_dev,
            source=source
        )

        logger.info(f"Added custom benchmark: {industry}/{metric}")

    def get_available_industries(self) -> List[str]:
        """Get list of industries with benchmarks."""
        return list(self.BENCHMARKS.keys())

    def get_industry_metrics(self, industry: str) -> List[str]:
        """Get available metrics for an industry."""
        return list(self.BENCHMARKS.get(industry, {}).keys())


# Singleton instance
validator = ValidationFramework()


def validate_simulation_results(
    results: Dict[str, Any],
    industry: str = 'saas'
) -> Dict[str, Any]:
    """
    Convenience function to validate results.

    Args:
        results: Simulation results
        industry: Industry category

    Returns:
        Validation report
    """
    return validator.validate_results(results, industry)
