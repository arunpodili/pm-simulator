import { Scenario } from '@/types';

export const scenarios: Scenario[] = [
  {
    id: 'feature-launch',
    name: 'Feature Launch',
    description: 'Plan and execute a new feature release from conception to post-launch analysis',
    applicableIndustries: ['saas', 'fintech', 'health', 'ecommerce', 'ai_ml'],
    defaultFrameworks: ['rice', 'jtbd', 'okrs'],
    estimatedTime: '2-4 hours',
    outputTypes: ['PRD', 'Launch Plan', 'Engineering Spec', 'GTM Doc'],
  },
  {
    id: 'product-strategy',
    name: 'Product Strategy',
    description: 'Define long-term product vision, positioning, and strategic roadmap',
    applicableIndustries: ['saas', 'fintech', 'health', 'ecommerce', 'ai_ml'],
    defaultFrameworks: ['swot', 'lean-canvas', 'north-star-metric'],
    estimatedTime: '4-8 hours',
    outputTypes: ['Strategy Memo', 'One-Pager', 'Roadmap'],
  },
  {
    id: 'pricing-change',
    name: 'Pricing Change',
    description: 'Analyze, plan, and execute pricing or packaging changes',
    applicableIndustries: ['saas', 'fintech', 'ecommerce'],
    defaultFrameworks: ['kano', 'swot'],
    estimatedTime: '3-6 hours',
    outputTypes: ['Pricing Analysis', 'Change Plan', 'Communication Doc'],
  },
  {
    id: 'go-to-market',
    name: 'Go-to-Market Plan',
    description: 'Create a comprehensive GTM strategy for new products or major launches',
    applicableIndustries: ['saas', 'fintech', 'health', 'ecommerce', 'ai_ml'],
    defaultFrameworks: ['lean-canvas', 'okrs'],
    estimatedTime: '4-8 hours',
    outputTypes: ['GTM Plan', 'Launch Checklist', 'Sales Enablement'],
  },
  {
    id: 'user-research',
    name: 'User Research Plan',
    description: 'Plan and execute user research studies to validate hypotheses',
    applicableIndustries: ['saas', 'fintech', 'health', 'ecommerce', 'ai_ml'],
    defaultFrameworks: ['jtbd', 'heart-framework'],
    estimatedTime: '2-4 hours',
    outputTypes: ['Research Plan', 'Interview Guide', 'Synthesis Doc'],
  },
  {
    id: 'roadmap-planning',
    name: 'Roadmap Planning',
    description: 'Prioritize and sequence initiatives for quarterly or annual roadmap',
    applicableIndustries: ['saas', 'fintech', 'health', 'ecommerce', 'ai_ml'],
    defaultFrameworks: ['rice', 'opportunity-solution-tree', 'okrs'],
    estimatedTime: '4-8 hours',
    outputTypes: ['Roadmap', 'Priority Matrix', 'Stakeholder Deck'],
  },
  {
    id: 'stakeholder-alignment',
    name: 'Stakeholder Alignment',
    description: 'Navigate complex stakeholder landscapes to build consensus',
    applicableIndustries: ['saas', 'fintech', 'health', 'ai_ml'],
    defaultFrameworks: ['swot'],
    estimatedTime: '2-4 hours',
    outputTypes: ['Stakeholder Map', 'Alignment Memo', 'FAQ Doc'],
  },
  {
    id: 'crisis-management',
    name: 'Crisis / Incident Response',
    description: 'Manage product crises: outages, security incidents, PR issues',
    applicableIndustries: ['saas', 'fintech', 'health', 'ecommerce', 'ai_ml'],
    defaultFrameworks: ['aar'],
    estimatedTime: '1-2 hours',
    outputTypes: ['Incident Report', 'Post-Mortem', 'Communication Plan'],
  },
  {
    id: 'feature-sunset',
    name: 'Feature Sunsetting',
    description: 'Plan and execute the deprecation of a product feature',
    applicableIndustries: ['saas', 'fintech', 'health'],
    defaultFrameworks: ['rice', 'kano'],
    estimatedTime: '2-4 hours',
    outputTypes: ['Sunset Plan', 'Migration Guide', 'Customer Comms'],
  },
];

export const getScenarioById = (id: string): Scenario | undefined => {
  return scenarios.find((s) => s.id === id);
};

export const getScenariosForIndustry = (industryId: string): Scenario[] => {
  return scenarios.filter((s) => s.applicableIndustries.includes(industryId as any));
};
