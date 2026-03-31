import { Template } from '@/types';

export const prdFeatureLaunchTemplate: Template = {
  id: 'prd-feature-launch-v1',
  name: 'Feature Launch PRD',
  description: 'Complete product requirements document',
  industryId: 'saas',
  scenarioId: 'feature-launch',
  frameworkIds: ['rice', 'jtbd', 'okrs'],
  outputFormat: 'markdown',
  estimatedCompletionTime: '2-4 hours',
  version: '1.0.0',
  sections: [
    {
      id: 'document-meta',
      title: 'Document Metadata',
      description: 'Track ownership and versioning',
      fieldType: 'table',
      required: true,
      helpText: 'Document tracking information',
      learnContentId: 'doc-versioning',
      tableSchema: {
        columns: ['Field', 'Value'],
        rows: [
          ['Document Owner', ''],
          ['Engineering Lead', ''],
          ['Design Lead', ''],
          ['Status', 'Draft'],
          ['Last Updated', ''],
          ['Version', '1.0'],
        ]
      }
    },
    {
      id: 'change-log',
      title: 'Change Log',
      description: 'Track document changes',
      fieldType: 'table',
      required: true,
      helpText: 'Version history',
      learnContentId: 'change-management',
      tableSchema: {
        columns: ['Version', 'Date', 'Author', 'Changes', 'Reviewers'],
        rows: [['1.0', '', '', 'Initial draft', '']]
      }
    },
    {
      id: 'approvers',
      title: 'Approvals',
      description: 'Required stakeholder sign-offs',
      fieldType: 'table',
      required: true,
      helpText: 'Identify approvers early',
      learnContentId: 'stakeholder-management',
      tableSchema: {
        columns: ['Role', 'Name', 'Status', 'Date'],
        rows: [
          ['Product', '', 'Pending', ''],
          ['Engineering', '', 'Pending', ''],
          ['Design', '', 'Pending', ''],
        ]
      }
    },
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      description: '30-second overview',
      fieldType: 'markdown',
      required: true,
      helpText: 'What any executive will read',
      learnContentId: 'executive-communication',
      placeholder: `**Feature:** [What we are building]
**Users:** [Who this is for]
**Action:** [What they can do]
**Benefit:** [Expected outcome]`,
    },
    {
      id: 'tl-dr',
      title: 'TL;DR',
      description: '5 bullets max',
      fieldType: 'markdown',
      required: true,
      helpText: 'Be brutally concise',
      learnContentId: 'executive-communication',
      placeholder: `- WHAT: [What is this feature]
- WHO: [Who is it for]
- WHY: [Why are we building it]
- IMPACT: [Expected impact]
- WHEN: [Target timeline]`,
    },
    {
      id: 'problem-statement',
      title: 'Problem Statement',
      description: 'Define the problem clearly',
      fieldType: 'markdown',
      required: true,
      helpText: 'A well-defined problem is half-solved',
      learnContentId: 'problem-definition',
      placeholder: `**Current State:** [Describe the current situation]

**Affected Users:** [Who experiences this?]

**Frequency:** [How often does this occur?]

**Severity:** [What is the impact?]

**Evidence:** [Data or research validating this]`,
    },
    {
      id: 'user-personas',
      title: 'User Personas',
      description: 'Who are we building for',
      fieldType: 'table',
      required: true,
      helpText: 'Be specific - not "everyone"',
      learnContentId: 'persona-definition',
      tableSchema: {
        columns: ['Persona', 'Role', 'Segment', 'Goals', 'Frustrations', 'Proficiency'],
        rows: [['', '', '', '', '', '']]
      }
    },
    {
      id: 'jtbd',
      title: 'Jobs To Be Done',
      description: 'Frame the user need',
      fieldType: 'markdown',
      required: true,
      helpText: 'Focus on outcome, not solution',
      learnContentId: 'jtbd-framework',
      placeholder: `**When...** [Situation or context]

**I want to...** [Motivation or action]

**So I can...** [Expected benefit]`,
    },
    {
      id: 'success-metrics',
      title: 'Success Metrics',
      description: 'How we measure success',
      fieldType: 'table',
      required: true,
      helpText: 'Define metrics before solutions',
      learnContentId: 'success-metrics',
      tableSchema: {
        columns: ['Metric', 'Baseline', 'Target', 'Timeline', 'Owner'],
        rows: [['', '', '', '', '']]
      }
    },
    {
      id: 'solution-overview',
      title: 'Solution Overview',
      description: 'High-level what we are building',
      fieldType: 'markdown',
      required: true,
      helpText: 'Stay high-level here',
      learnContentId: 'solution-design',
    },
    {
      id: 'user-stories',
      title: 'User Stories',
      description: 'Detailed stories with acceptance criteria',
      fieldType: 'table',
      required: true,
      helpText: 'Use INVEST criteria',
      learnContentId: 'user-stories',
      tableSchema: {
        columns: ['Story', 'As a...', 'I want to...', 'So that...', 'Acceptance Criteria'],
        rows: [['', '', '', '', '']]
      }
    },
    {
      id: 'functional-requirements',
      title: 'Functional Requirements',
      description: 'Detailed requirements with priorities',
      fieldType: 'table',
      required: true,
      helpText: 'Use MoSCoW prioritization',
      learnContentId: 'requirements-writing',
      tableSchema: {
        columns: ['ID', 'Requirement', 'Priority', 'Complexity', 'Notes'],
        rows: [['FR-001', '', 'P0', '', '']]
      }
    },
    {
      id: 'non-functional-requirements',
      title: 'Non-Functional Requirements',
      description: 'Performance, security, scalability',
      fieldType: 'table',
      required: true,
      helpText: 'Often forgotten but critical',
      learnContentId: 'non-functional-requirements',
      tableSchema: {
        columns: ['Category', 'Requirement', 'Target', 'Measurement'],
        rows: [
          ['Performance', '', '', ''],
          ['Scalability', '', '', ''],
          ['Security', '', '', ''],
          ['Reliability', '', '', ''],
        ]
      }
    },
    {
      id: 'data-requirements',
      title: 'Data Requirements',
      description: 'Data model and tracking',
      fieldType: 'table',
      required: true,
      helpText: 'Define data needs',
      learnContentId: 'data-tracking',
      tableSchema: {
        columns: ['Event', 'Trigger', 'Properties', 'User Properties'],
        rows: [['', '', '', '']]
      }
    },
    {
      id: 'integrations-dependencies',
      title: 'Integrations & Dependencies',
      description: 'External systems and team dependencies',
      fieldType: 'table',
      required: true,
      helpText: 'Map dependencies early',
      learnContentId: 'dependency-management',
      tableSchema: {
        columns: ['System/Team', 'Type', 'Owner', 'Status', 'Required By'],
        rows: [['', '', '', '', '']]
      }
    },
    {
      id: 'api-specifications',
      title: 'API Specifications',
      description: 'Endpoints and schemas',
      fieldType: 'markdown',
      required: false,
      helpText: 'Work with engineering',
      learnContentId: 'api-design',
    },
    {
      id: 'ux-ui-requirements',
      title: 'UX/UI Requirements',
      description: 'Design specs and interactions',
      fieldType: 'table',
      required: true,
      helpText: 'Link to designs',
      learnContentId: 'ux-specification',
      tableSchema: {
        columns: ['State', 'Description', 'Behavior', 'Notes'],
        rows: [
          ['Empty State', '', '', ''],
          ['Loading State', '', '', ''],
          ['Error State', '', '', ''],
          ['Success State', '', '', ''],
        ]
      }
    },
    {
      id: 'edge-cases',
      title: 'Edge Cases',
      description: 'Anticipate edge cases',
      fieldType: 'table',
      required: true,
      helpText: 'PMs often forget this',
      learnContentId: 'edge-case-thinking',
      tableSchema: {
        columns: ['Scenario', 'Likelihood', 'Impact', 'Handling'],
        rows: [['', '', '', '']]
      }
    },
    {
      id: 'rollout-plan',
      title: 'Rollout Plan',
      description: 'Phased launch strategy',
      fieldType: 'table',
      required: true,
      helpText: 'Consider phased rollouts',
      learnContentId: 'rollout-strategy',
      tableSchema: {
        columns: ['Phase', 'Segment', 'Size', 'Duration', 'Success Criteria'],
        rows: [
          ['Internal', '', '', '', ''],
          ['Alpha', '', '', '', ''],
          ['Beta', '', '', '', ''],
          ['GA', '', '', '', ''],
        ]
      }
    },
    {
      id: 'gtm-alignment',
      title: 'GTM Alignment',
      description: 'Marketing, sales, support',
      fieldType: 'table',
      required: true,
      helpText: 'Great features fail without GTM',
      learnContentId: 'gtm-basics',
      tableSchema: {
        columns: ['Activity', 'Owner', 'Due Date', 'Status'],
        rows: [['', '', '', '']]
      }
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Identify and mitigate risks',
      fieldType: 'table',
      required: true,
      helpText: 'Name risks before they name you',
      learnContentId: 'risk-management',
      tableSchema: {
        columns: ['Risk', 'Likelihood', 'Impact', 'Mitigation', 'Owner'],
        rows: [['', '', '', '', '']]
      }
    },
    {
      id: 'timeline-resourcing',
      title: 'Timeline & Resourcing',
      description: 'Project milestones and team',
      fieldType: 'table',
      required: true,
      helpText: 'Be realistic with estimates',
      learnContentId: 'estimation',
      tableSchema: {
        columns: ['Milestone', 'Target Date', 'Dependencies', 'Owner', 'Status'],
        rows: [
          ['PRD Approved', '', '', '', ''],
          ['Design Complete', '', '', '', ''],
          ['Engineering Complete', '', '', '', ''],
          ['QA Complete', '', '', '', ''],
          ['Launch', '', '', '', ''],
        ]
      }
    },
    {
      id: 'post-launch-plan',
      title: 'Post-Launch Plan',
      description: 'What happens after launch',
      fieldType: 'table',
      required: true,
      helpText: 'Launch is not the end',
      learnContentId: 'post-launch',
      tableSchema: {
        columns: ['Activity', 'Timeline', 'Owner', 'Notes'],
        rows: [
          ['Monitor Dashboard', 'Day 1', '', ''],
          ['Week 1 Review', 'Week 1', '', ''],
          ['Month 1 Review', 'Month 1', '', ''],
        ]
      }
    },
  ],
};
