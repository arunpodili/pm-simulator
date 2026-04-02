/**
 * Field Mapping Utilities - Transform User Inputs
 *
 * Client-side utilities for working with field mapping API
 */

export interface UserBrief {
  problem: string;
  target_user: string;
  pricing: string;
  competitors: string;
  success_metric: string;
  additional_context?: string;
}

export interface MappedConfig {
  pain_severity: {
    value: number;
    confidence: number;
    description: string;
  };
  market_size: {
    value: string;
    confidence: number;
    description: string;
  };
  price_sensitivity: {
    value: number;
    confidence: number;
    description: string;
  };
  viral_potential: {
    value: number;
    confidence: number;
    description: string;
  };
  competitive_pressure: {
    value: number;
    confidence: number;
    description: string;
  };
  tech_adoption_speed: {
    value: number;
    confidence: number;
    description: string;
  };
  extracted_price?: number;
  insights: Array<{
    field: string;
    value: any;
    confidence: number;
    source: string;
    snippet: string;
  }>;
}

export interface FieldHint {
  field: string;
  text: string;
  confidence: number;
  type: 'suggestion' | 'warning' | 'info';
}

/**
 * Extract hints from user input
 */
export function extractHints(text: string, fieldType: keyof UserBrief): FieldHint[] {
  const hints: FieldHint[] = [];
  const lowerText = text.toLowerCase();

  // Pain level hints
  if (fieldType === 'problem') {
    const criticalWords = ['critical', 'urgent', 'blocking', 'frustrated'];
    const highWords = ['major', 'significant', 'serious', 'big problem'];

    if (criticalWords.some(w => lowerText.includes(w))) {
      hints.push({
        field: 'pain_severity',
        text: '🔴 Critical pain detected - high urgency',
        confidence: 0.9,
        type: 'suggestion',
      });
    } else if (highWords.some(w => lowerText.includes(w))) {
      hints.push({
        field: 'pain_severity',
        text: '🟠 High pain detected - significant problem',
        confidence: 0.8,
        type: 'suggestion',
      });
    }

    if (lowerText.length < 20) {
      hints.push({
        field: 'problem',
        text: '⚠️ Consider adding more detail about the pain point',
        confidence: 0.7,
        type: 'warning',
      });
    }
  }

  // Market size hints
  if (fieldType === 'target_user') {
    const enterpriseWords = ['enterprise', 'fortune 500', 'corporation', 'large'];
    const smbWords = ['small business', 'startup', 'team', 'founder'];

    if (enterpriseWords.some(w => lowerText.includes(w))) {
      hints.push({
        field: 'market_size',
        text: '🏢 Enterprise market detected',
        confidence: 0.85,
        type: 'suggestion',
      });
    } else if (smbWords.some(w => lowerText.includes(w))) {
      hints.push({
        field: 'market_size',
        text: '🚀 SMB/Startup market detected',
        confidence: 0.8,
        type: 'suggestion',
      });
    }
  }

  // Price sensitivity hints
  if (fieldType === 'pricing') {
    const priceMatch = text.match(/\$([\d,]+)/);
    if (priceMatch) {
      const price = parseInt(priceMatch[1].replace(',', ''));
      if (price < 20) {
        hints.push({
          field: 'price_sensitivity',
          text: '💰 Low price point - high conversion expected',
          confidence: 0.75,
          type: 'suggestion',
        }));
      } else if (price > 100) {
        hints.push({
          field: 'price_sensitivity',
          text: '💎 Premium pricing - enterprise sales cycle',
          confidence: 0.75,
          type: 'suggestion',
        });
      }
    }

    if (!text.includes('$') && text.length > 0) {
      hints.push({
        field: 'pricing',
        text: '💡 Tip: Include price (e.g., $15/month) for better modeling',
        confidence: 0.8,
        type: 'info',
      });
    }
  }

  // Competition hints
  if (fieldType === 'competitors') {
    const competitiveWords = ['competitive', 'crowded', 'saturated', 'many'];
    const blueOceanWords = ['first', 'unique', 'no competition', 'only'];

    if (competitiveWords.some(w => lowerText.includes(w))) {
      hints.push({
        field: 'competitive_pressure',
        text: '🥊 Competitive market - differentiation critical',
        confidence: 0.8,
        type: 'suggestion',
      });
    } else if (blueOceanWords.some(w => lowerText.includes(w))) {
      hints.push({
        field: 'competitive_pressure',
        text: '🌊 First mover advantage - educate market',
        confidence: 0.8,
        type: 'suggestion',
      });
    }
  }

  return hints;
}

/**
 * Map user brief via API
 */
export async function mapBriefToConfig(brief: UserBrief): Promise<MappedConfig> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:5001';

  const response = await fetch(`${API_BASE_URL}/api/simulation/map-fields`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(brief),
  });

  if (!response.ok) {
    throw new Error('Failed to map fields');
  }

  return response.json();
}

/**
 * Calculate overall confidence score
 */
export function calculateOverallConfidence(config: MappedConfig): number {
  const confidences = [
    config.pain_severity.confidence,
    config.market_size.confidence,
    config.price_sensitivity.confidence,
    config.viral_potential.confidence,
    config.competitive_pressure.confidence,
    config.tech_adoption_speed.confidence,
  ];

  const avg = confidences.reduce((a, b) => a + b, 0) / confidences.length;
  return Math.round(avg * 100);
}

/**
 * Get simulation presets based on mapped config
 */
export function getSimulationPresets(config: MappedConfig): {
  personaCount: number;
  simulationDays: number;
  marketingSpend: 'low' | 'medium' | 'high';
} {
  // Adjust based on market size
  const marketSizeMultipliers: Record<string, number> = {
    enterprise: 0.5,
    mid_market: 1.0,
    smb: 1.5,
    consumer: 2.0,
  };

  const multiplier = marketSizeMultipliers[config.market_size.value] || 1.0;

  // Base values
  let personaCount = Math.round(1000 * multiplier);
  let simulationDays = 90;
  let marketingSpend: 'low' | 'medium' | 'high' = 'medium';

  // Adjust for pain severity
  if (config.pain_severity.value > 0.8) {
    // High pain = faster adoption
    simulationDays = 60;
    marketingSpend = 'high';
  } else if (config.pain_severity.value < 0.4) {
    // Low pain = slower adoption
    simulationDays = 120;
    marketingSpend = 'low';
  }

  // Adjust for competition
  if (config.competitive_pressure.value > 0.7) {
    marketingSpend = 'high';
    simulationDays = Math.max(simulationDays, 90);
  }

  return {
    personaCount,
    simulationDays,
    marketingSpend,
  };
}

/**
 * Format confidence for display
 */
export function formatConfidence(confidence: number): {
  color: string;
  label: string;
  icon: string;
} {
  if (confidence >= 0.8) {
    return { color: 'text-green-600', label: 'High confidence', icon: '✅' };
  } else if (confidence >= 0.5) {
    return { color: 'text-yellow-600', label: 'Medium confidence', icon: '⚠️' };
  } else {
    return { color: 'text-red-600', label: 'Low confidence', icon: '❓' };
  }
}

/**
 * Get example briefs for templates
 */
export function getExampleBriefs(): Array<{
  name: string;
  category: string;
  brief: UserBrief;
}> {
  return [
    {
      name: 'AI Meeting Summarizer',
      category: 'productivity',
      brief: {
        problem: 'Remote teams waste hours in meetings with no clear outcomes. Meeting notes are inconsistent',
        target_user: 'Product managers and team leads at mid-size tech companies',
        pricing: '$15/user/month for teams',
        competitors: 'Otter.ai, Fireflies.ai, manual note taking',
        success_metric: 'Reduce meeting time by 30%',
        additional_context: 'Integrates with Zoom, Google Meet, Slack',
      },
    },
    {
      name: 'DevOps Automation',
      category: 'developer_tool',
      brief: {
        problem: 'Deploying to production is manual and error-prone. Takes 2 weeks for releases',
        target_user: 'Engineering teams at growing startups',
        pricing: '$49/month per team',
        competitors: 'GitHub Actions, Jenkins, CircleCI',
        success_metric: 'Deploy 10x more frequently',
        additional_context: 'GitHub integration, automated testing pipeline',
      },
    },
    {
      name: 'Security Scanner',
      category: 'security',
      brief: {
        problem: 'Developers unknowingly introduce vulnerabilities. No security review process',
        target_user: 'Security teams and developers at SaaS companies',
        pricing: '$99/month per repository',
        competitors: 'Snyk, SonarQube, manual code review',
        success_metric: 'Zero critical vulnerabilities in production',
        additional_context: 'Pre-commit hooks, CI/CD integration',
      },
    },
  ];
}
