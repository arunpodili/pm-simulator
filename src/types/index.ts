// Core Types for PM Simulator Platform

export type IndustryId = 'saas' | 'fintech' | 'health' | 'ecommerce' | 'ai_ml';

export type TemplateCategory = 'prd' | 'framework';

export interface Industry {
  id: IndustryId;
  name: string;
  description: string;
  icon: string;
  color: string;
  regulations?: string[];
  keyMetrics: string[];
  commonChallenges: string[];
  stakeholderTypes: string[];
}

export type ScenarioId =
  | 'feature-launch'
  | 'product-strategy'
  | 'pricing-change'
  | 'go-to-market'
  | 'user-research'
  | 'roadmap-planning'
  | 'stakeholder-alignment'
  | 'crisis-management'
  | 'feature-sunset';

export interface Scenario {
  id: ScenarioId;
  name: string;
  description: string;
  applicableIndustries: IndustryId[];
  defaultFrameworks: FrameworkId[];
  estimatedTime: string;
  outputTypes: string[];
}

export type FrameworkId =
  | 'rice'
  | 'jtbd'
  | 'kano'
  | 'okrs'
  | 'lean-canvas'
  | 'opportunity-solution-tree'
  | 'north-star-metric'
  | 'heart-framework'
  | 'aar'
  | 'swot';

export interface Framework {
  id: FrameworkId;
  name: string;
  description: string;
  whenToUse: string;
  steps: string[];
  outputExample: string;
}

export interface TableSchema {
  columns: string[];
  rows: string[][];
}

export interface TemplateSection {
  id: string;
  title: string;
  description: string;
  fieldType: 'text' | 'textarea' | 'markdown' | 'select' | 'multi-select' | 'number' | 'date' | 'checkbox' | 'table';
  required: boolean;
  placeholder?: string;
  helpText?: string;
  learnContentId?: string;
  options?: { value: string; label: string }[];
  tableSchema?: TableSchema;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  industryId: IndustryId;
  scenarioId: ScenarioId;
  frameworkIds: FrameworkId[];
  sections: TemplateSection[];
  outputFormat: 'markdown' | 'google-docs' | 'notion' | 'confluence';
  estimatedCompletionTime: string;
  version: string;
  category?: TemplateCategory;
}

export interface LearnContent {
  id: string;
  title: string;
  section: string;
  category: 'concept' | 'how-to' | 'best-practice' | 'pitfall' | 'example' | 'checklist';
  content: string;
  readTime: number; // minutes
  sourceReferences?: string[];
  industryContext?: IndustryId[];
}

export interface CaseStudy {
  id: string;
  title: string;
  author: string;
  industryId: IndustryId;
  scenarioId: ScenarioId;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  lessonsLearned: string[];
  artifacts?: string[]; // Links to PRDs, specs, etc.
  upvotes: number;
  views: number;
  createdAt: string;
  tags: string[];
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'general' | 'stakeholder-management' | 'career' | 'technical' | 'methodology';
  tags: string[];
  upvotes: number;
  views: number;
  answers: ForumAnswer[];
  createdAt: string;
  industryContext?: IndustryId;
}

export interface ForumAnswer {
  id: string;
  content: string;
  author: string;
  upvotes: number;
  isAccepted: boolean;
  createdAt: string;
}

export interface DocumentExport {
  format: 'markdown' | 'google-docs' | 'pdf';
  content: string;
  metadata: {
    title: string;
    author: string;
    createdAt: string;
    industry: string;
    scenario: string;
  };
}

// Form state types
export interface TemplateFormState {
  [sectionId: string]: any;
}

export interface ValidationErrors {
  [sectionId: string]: string | null;
}
