/**
 * Hint Database - Contextual guidance from PM literature
 * Sources: Inspired, The Lean Startup, The Mom Test, Escaping the Build Trap, Measure What Matters
 */

export interface Hint {
  type: 'example' | 'best-practice' | 'warning' | 'framework';
  content: string;
  source?: string;
}

export const hintDatabase: Record<string, Hint[]> = {
  // Problem Statement Section
  'problem-statement.what': [
    {
      type: 'example',
      content: 'Enterprise customers take 14 days to activate, with 40% dropping off before setup.',
      source: 'Typical SaaS onboarding friction',
    },
    {
      type: 'example',
      content: 'Small business owners spend 6+ hours weekly on manual invoicing, leading to delayed payments.',
      source: 'FinTech payment processing pain',
    },
    {
      type: 'best-practice',
      content: 'Start with the customer pain, not your solution. Avoid mentioning features or technology.',
      source: 'The Mom Test, Chapter 2',
    },
    {
      type: 'warning',
      content: 'Avoid generic statements like "users want a better experience." Be specific about what hurts.',
      source: 'Inspired by Marty Cagan',
    },
  ],

  'problem-statement.who': [
    {
      type: 'example',
      content: 'Mid-market companies with 50-200 employees, using legacy tools that require IT setup.',
      source: 'SaaS target segment example',
    },
    {
      type: 'best-practice',
      content: 'Focus on specific segments, not "everyone." The more specific, the better your solution can fit.',
      source: 'The Lean Startup by Eric Ries',
    },
    {
      type: 'warning',
      content: 'If your answer is "anyone who..." you need to narrow down. Pick the segment in most pain.',
      source: 'The Mom Test by Rob Fitzpatrick',
    },
  ],

  'problem-statement.why': [
    {
      type: 'example',
      content: '$2M ARR at risk from churn. Each day delayed costs ~$5K in lost expansion revenue.',
      source: 'Revenue impact example',
    },
    {
      type: 'best-practice',
      content: 'Quantify when possible. Dollar amounts, percentages, and frequency make the case stronger.',
      source: 'Escaping the Build Trap by Melissa Perri',
    },
    {
      type: 'framework',
      content: 'Frame the impact in terms of: Revenue (dollars), Efficiency (hours saved), Risk (compliance).',
      source: 'Business value framework',
    },
  ],

  'problem-statement.when': [
    {
      type: 'example',
      content: 'During first 14 days after contract signing, especially when no dedicated onboarding manager is assigned.',
      source: 'Onboarding friction point',
    },
    {
      type: 'best-practice',
      content: 'Identify the trigger moment when the problem is most acute. This is where your solution can intervene.',
      source: 'Jobs-to-be-Done Framework',
    },
  ],

  // Target Market Section
  'target-market.size': [
    {
      type: 'framework',
      content: 'TAM (Total Addressable Market) → SAM (Serviceable Available Market) → SOM (Serviceable Obtainable Market). Start with SOM.',
      source: 'Market sizing framework',
    },
    {
      type: 'example',
      content: 'TAM: $50B project management software. SAM: $5B SMB segment. SOM: $500M early-stage companies.',
      source: 'Market sizing example',
    },
    {
      type: 'best-practice',
      content: 'Your beachhead market should be small enough to dominate quickly, large enough to matter.',
      source: 'Crossing the Chasm by Geoffrey Moore',
    },
  ],

  'target-market.segments': [
    {
      type: 'example',
      content: '1) Series A startups with 20-50 employees, 2) Digital agencies, 3) Remote-first tech companies.',
      source: 'Segmentation example',
    },
    {
      type: 'best-practice',
      content: 'Prioritize segments by: pain intensity, accessibility, budget availability, and strategic fit.',
      source: 'Segmentation framework',
    },
  ],

  // Value Proposition Section
  'value-proposition.benefit': [
    {
      type: 'example',
      content: 'Reduce onboarding time from 14 days to 48 hours with guided setup and automated data migration.',
      source: 'Concrete benefit example',
    },
    {
      type: 'best-practice',
      content: 'Lead with outcomes, not features. "Save 10 hours/week" beats "automated workflow."',
      source: 'Value proposition design',
    },
  ],

  'value-proposition.differentiation': [
    {
      type: 'example',
      content: 'Unlike Salesforce (expensive, complex), we focus on SMBs with 5-minute setup and no training required.',
      source: 'Positioning example',
    },
    {
      type: 'framework',
      content: 'Differentiation matrix: What you do | How you do it | Who you serve | Why it matters.',
      source: 'Positioning framework',
    },
  ],

  // Success Metrics Section
  'success-metrics.north-star': [
    {
      type: 'example',
      content: 'Weekly Active Teams (WAT) - teams that log in and complete at least 1 task per week.',
      source: 'North Star metric example',
    },
    {
      type: 'best-practice',
      content: 'Your North Star should measure value delivered to users, not just activity. It should be actionable and measurable.',
      source: 'Measure What Matters by John Doerr',
    },
    {
      type: 'framework',
      content: 'OKRs: Objective (qualitative ambition) + Key Results (quantifiable outcomes, 3-5 per objective).',
      source: 'OKR Framework',
    },
  ],

  'success-metrics.lag-indicators': [
    {
      type: 'example',
      content: 'Revenue, churn rate, NPS, customer lifetime value.',
      source: 'Lag indicator examples',
    },
    {
      type: 'best-practice',
      content: 'Lag indicators tell you what happened. Lead indicators predict what will happen. Track both.',
      source: 'Metrics framework',
    },
  ],

  'success-metrics.lead-indicators': [
    {
      type: 'example',
      content: 'Activation rate (completes onboarding), Feature adoption (uses 3+ features), Referral rate.',
      source: 'Lead indicator examples',
    },
    {
      type: 'best-practice',
      content: 'Good lead indicators: 1) Measurable frequently, 2) Correlates with lag indicators, 3) Influenceable by team.',
      source: 'Leading indicator criteria',
    },
  ],
};

export function getHints(fieldId: string): Hint[] {
  return hintDatabase[fieldId] || [];
}

export function hasHints(fieldId: string): boolean {
  return fieldId in hintDatabase;
}
