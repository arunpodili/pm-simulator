import { Template } from '@/types';

export const prdSaaSTemplate: Template = {
  id: 'prd-saas-feature-launch',
  name: 'SaaS Feature Launch PRD (Comprehensive)',
  description: 'Complete product requirements document for SaaS feature launches with every detail covered',
  industryId: 'saas',
  scenarioId: 'feature-launch',
  frameworkIds: ['rice', 'jtbd', 'okrs'],
  outputFormat: 'markdown',
  estimatedCompletionTime: '2-4 hours',
  version: '1.0.0',
  sections: [
    // ============================================
    // SECTION 1: DOCUMENT META
    // ============================================
    {
      id: 'document-meta',
      title: 'Document Metadata',
      description: 'Track document ownership and versioning',
      fieldType: 'table',
      required: true,
      helpText: 'This ensures accountability and traceability',
      learnContentId: 'doc-versioning',
      tableSchema: {
        columns: ['Field', 'Value'],
        rows: [
          ['Document Owner', ''],
          ['Engineering Lead', ''],
          ['Design Lead', ''],
          ['Status', 'Draft / In Review / Approved / Launched'],
          ['Last Updated', ''],
          ['Version', '1.0'],
          ['Target Launch Date', ''],
        ]
      }
    },
    {
      id: 'change-log',
      title: 'Change Log',
      description: 'Track all significant changes to this document',
      fieldType: 'table',
      required: true,
      helpText: 'Critical for stakeholder alignment and audit trails',
      learnContentId: 'change-management',
      tableSchema: {
        columns: ['Version', 'Date', 'Author', 'Changes', 'Reviewers'],
        rows: [['1.0', 'YYYY-MM-DD', '', 'Initial draft', '']]
      }
    },
    {
      id: 'approvers',
      title: 'Required Approvals',
      description: 'List all stakeholders who must approve before development begins',
      fieldType: 'table',
      required: true,
      helpText: 'Identify approvers early to avoid delays',
      learnContentId: 'stakeholder-management',
      tableSchema: {
        columns: ['Role', 'Name', 'Status', 'Date Approved'],
        rows: [
          ['Product', '', 'Pending', ''],
          ['Engineering', '', 'Pending', ''],
          ['Design', '', 'Pending', ''],
          ['Security (if applicable)', '', 'Pending', ''],
          ['Legal/Compliance (if applicable)', '', 'Pending', ''],
        ]
      }
    },

    // ============================================
    // SECTION 2: EXECUTIVE SUMMARY
    // ============================================
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      description: 'One-paragraph overview that any executive can read in 30 seconds',
      fieldType: 'markdown',
      required: true,
      helpText: 'If an executive reads only one thing, it should be this',
      learnContentId: 'executive-communication',
    },
    {
      id: 'tl-dr',
      title: 'TL;DR Summary',
      description: '5 bullet points maximum - the absolute essentials',
      fieldType: 'markdown',
      required: true,
      helpText: 'Force yourself to be brutally concise',
      learnContentId: 'executive-communication',
    },

    // ============================================
    // SECTION 3: PROBLEM STATEMENT
    // ============================================
    {
      id: 'problem-statement',
      title: 'Problem Statement',
      description: 'Clearly articulate the problem you are solving',
      fieldType: 'markdown',
      required: true,
      helpText: 'A well-defined problem is half-solved. Be specific.',
      learnContentId: 'problem-definition',
    },
    {
      id: 'user-personas',
      title: 'Target User Personas',
      description: 'Who specifically are we building this for?',
      fieldType: 'table',
      required: true,
      helpText: 'Be specific - "everyone" is not a persona',
      learnContentId: 'persona-definition',
      tableSchema: {
        columns: ['Attribute', 'Primary Persona', 'Secondary Persona'],
        rows: [
          ['Name', '', ''],
          ['Role', '', ''],
          ['Segment', '', ''],
          ['Goals', '', ''],
          ['Frustrations', '', ''],
          ['Technical Proficiency', '', ''],
          ['Context', '', ''],
        ]
      }
    },

    // ============================================
    // SECTION 4: JOBS TO BE DONE
    // ============================================
    {
      id: 'jtbd',
      title: 'Jobs To Be Done',
      description: 'Frame the user need using JTBD framework',
      fieldType: 'markdown',
      required: true,
      helpText: 'Focus on the outcome, not the solution',
      learnContentId: 'jtbd-framework',
    },

    // ============================================
    // SECTION 5: SUCCESS METRICS
    // ============================================
    {
      id: 'success-metrics',
      title: 'Success Metrics & Goals',
      description: 'How will we know if this is successful?',
      fieldType: 'table',
      required: true,
      helpText: 'Define metrics BEFORE discussing solutions',
      learnContentId: 'success-metrics',
      tableSchema: {
        columns: ['Metric Type', 'Metric', 'Baseline', 'Target', 'Timeline', 'Owner'],
        rows: [
          ['North Star', '', '', '', '', ''],
          ['Primary KPI', '', '', '', '', ''],
          ['Secondary KPI', '', '', '', '', ''],
          ['Guardrail Metric', '', '', '', '', ''],
        ]
      }
    },

    // ============================================
    // SECTION 6: SOLUTION OVERVIEW
    // ============================================
    {
      id: 'solution-overview',
      title: 'Solution Overview',
      description: 'High-level description of what you are building',
      fieldType: 'markdown',
      required: true,
      helpText: 'Stay high-level here - details come in requirements',
      learnContentId: 'solution-design',
    },
    {
      id: 'user-stories',
      title: 'User Stories',
      description: 'Detailed user stories with acceptance criteria',
      fieldType: 'table',
      required: true,
      helpText: 'Use INVEST criteria: Independent, Negotiable, Valuable, Estimable, Small, Testable',
      learnContentId: 'user-stories',
      tableSchema: {
        columns: ['Story ID', 'As a...', 'I want to...', 'So that...', 'Acceptance Criteria', 'Priority'],
        rows: [['US-001', '', '', '', '', 'P0']]
      }
    },

    // ============================================
    // SECTION 7: FUNCTIONAL REQUIREMENTS
    // ============================================
    {
      id: 'functional-requirements',
      title: 'Functional Requirements',
      description: 'Detailed functional requirements with priorities',
      fieldType: 'table',
      required: true,
      helpText: 'Use MoSCoW prioritization: Must have, Should have, Could have, Won\'t have',
      learnContentId: 'requirements-writing',
      tableSchema: {
        columns: ['ID', 'Requirement', 'Priority', 'Complexity', 'User Story', 'Notes'],
        rows: [['FR-001', '', 'P0', '', '', '']]
      }
    },

    // ============================================
    // SECTION 8: NON-FUNCTIONAL REQUIREMENTS
    // ============================================
    {
      id: 'non-functional-requirements',
      title: 'Non-Functional Requirements',
      description: 'Performance, security, scalability, and quality attributes',
      fieldType: 'table',
      required: true,
      helpText: 'These are often forgotten but critical for production readiness',
      learnContentId: 'non-functional-requirements',
      tableSchema: {
        columns: ['Category', 'Requirement', 'Target', 'Measurement'],
        rows: [
          ['Performance', 'Page Load Time', '<3 seconds', 'Lighthouse'],
          ['Performance', 'API Response Time (p95)', '<500ms', 'Monitoring'],
          ['Scalability', 'Concurrent Users', '', 'Load testing'],
          ['Security', 'Authentication', '', 'Security review'],
          ['Reliability', 'Target Uptime', '99.9%', 'Monitoring'],
          ['Accessibility', 'WCAG Level', 'AA', 'Audit'],
        ]
      }
    },

    // ============================================
    // SECTION 9: DATA REQUIREMENTS
    // ============================================
    {
      id: 'data-requirements',
      title: 'Data Requirements',
      description: 'Data model, tracking, and analytics requirements',
      fieldType: 'table',
      required: true,
      helpText: 'Define what data you need to capture and how',
      learnContentId: 'data-tracking',
      tableSchema: {
        columns: ['Event Name', 'Trigger', 'Properties', 'User Properties', 'Owner'],
        rows: [['', '', '', '', '']]
      }
    },

    // ============================================
    // SECTION 10: INTEGRATIONS & DEPENDENCIES
    // ============================================
    {
      id: 'integrations-dependencies',
      title: 'Integrations & Dependencies',
      description: 'External systems, APIs, and team dependencies',
      fieldType: 'table',
      required: true,
      helpText: 'Map all dependencies early to avoid blockers',
      learnContentId: 'dependency-management',
      tableSchema: {
        columns: ['System/Team', 'Type', 'API/Method', 'Owner', 'Status', 'Required By'],
        rows: [['', '', '', '', '', '']]
      }
    },

    // ============================================
    // SECTION 11: API SPECIFICATIONS
    // ============================================
    {
      id: 'api-specifications',
      title: 'API Specifications',
      description: 'API endpoints, request/response schemas',
      fieldType: 'markdown',
      required: false,
      helpText: 'Work with engineering to define these',
      learnContentId: 'api-design',
    },

    // ============================================
    // SECTION 12: UX/UI REQUIREMENTS
    // ============================================
    {
      id: 'ux-ui-requirements',
      title: 'UX/UI Requirements',
      description: 'Design specifications and interaction details',
      fieldType: 'table',
      required: true,
      helpText: 'Link to designs but also describe key interactions',
      learnContentId: 'ux-specification',
      tableSchema: {
        columns: ['State', 'Screen/Component', 'Description', 'Behavior', 'Design Link'],
        rows: [
          ['Empty State', '', '', '', ''],
          ['Loading State', '', '', '', ''],
          ['Error State', '', '', '', ''],
          ['Success State', '', '', '', ''],
          ['Default State', '', '', '', ''],
        ]
      }
    },

    // ============================================
    // SECTION 13: EDGE CASES & ERROR HANDLING
    // ============================================
    {
      id: 'edge-cases',
      title: 'Edge Cases & Error Handling',
      description: 'Anticipate and plan for edge cases',
      fieldType: 'table',
      required: true,
      helpText: 'PMs often forget this - don\'t be that PM',
      learnContentId: 'edge-case-thinking',
      tableSchema: {
        columns: ['Scenario', 'Category', 'Likelihood', 'Impact', 'Handling'],
        rows: [
          ['', 'User', '', '', ''],
          ['', 'Data', '', '', ''],
          ['', 'Network', '', '', ''],
          ['', 'Permission', '', '', ''],
        ]
      }
    },

    // ============================================
    // SECTION 14: ROLLOUT PLAN
    // ============================================
    {
      id: 'rollout-plan',
      title: 'Rollout & Launch Plan',
      description: 'Phased rollout strategy and launch activities',
      fieldType: 'table',
      required: true,
      helpText: 'Big bang launches are risky - consider phased rollouts',
      learnContentId: 'rollout-strategy',
      tableSchema: {
        columns: ['Phase', 'User Segment', '% of Traffic', 'Duration', 'Success Criteria', 'Go/No-Go Owner'],
        rows: [
          ['Internal/Dogfooding', 'Employees', '100%', '1-2 weeks', 'No P0 bugs', ''],
          ['Alpha', 'Friendly customers', '5%', '2 weeks', 'Positive feedback', ''],
          ['Beta', 'Selected users', '25%', '2-4 weeks', 'Metrics stable', ''],
          ['Canary', 'All users', '50% → 100%', '1 week', 'No metric degradation', ''],
          ['GA', 'All users', '100%', '-', 'Success metrics hit', ''],
        ]
      }
    },

    // ============================================
    // SECTION 15: GO-TO-MARKET ALIGNMENT
    // ============================================
    {
      id: 'gtm-alignment',
      title: 'Go-to-Market Alignment',
      description: 'Marketing, sales, and support enablement',
      fieldType: 'table',
      required: true,
      helpText: 'Great features fail without proper GTM',
      learnContentId: 'gtm-basics',
      tableSchema: {
        columns: ['Activity', 'Team', 'Owner', 'Due Date', 'Status', 'Notes'],
        rows: [
          ['Positioning/Messaging', 'Marketing', '', '', '', ''],
          ['Sales Deck', 'Sales', '', '', '', ''],
          ['Blog Post', 'Marketing', '', '', '', ''],
          ['Help Center Docs', 'Support', '', '', '', ''],
          ['Email Campaign', 'Marketing', '', '', '', ''],
          ['In-app Guidance', 'Product', '', '', '', ''],
        ]
      }
    },

    // ============================================
    // SECTION 16: RISK ASSESSMENT
    // ============================================
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Identify and mitigate risks',
      fieldType: 'table',
      required: true,
      helpText: 'Name the risks before they name you',
      learnContentId: 'risk-management',
      tableSchema: {
        columns: ['Risk', 'Category', 'Likelihood', 'Impact', 'Mitigation', 'Owner'],
        rows: [
          ['', 'Technical', '', '', '', ''],
          ['', 'Business', '', '', '', ''],
          ['', 'Market', '', '', '', ''],
          ['', 'Operational', '', '', '', ''],
        ]
      }
    },

    // ============================================
    // SECTION 17: TIMELINE & RESOURCING
    // ============================================
    {
      id: 'timeline-resourcing',
      title: 'Timeline & Resourcing',
      description: 'Project timeline, milestones, and team requirements',
      fieldType: 'table',
      required: true,
      helpText: 'Be realistic - pad estimates for the unknown',
      learnContentId: 'estimation',
      tableSchema: {
        columns: ['Milestone', 'Target Date', 'Dependencies', 'Owner', 'Status', 'Notes'],
        rows: [
          ['PRD Approved', '', '', '', '', ''],
          ['Design Complete', '', '', '', '', ''],
          ['Engineering Complete', '', '', '', '', ''],
          ['QA Complete', '', '', '', '', ''],
          ['Beta Launch', '', '', '', '', ''],
          ['GA Launch', '', '', '', '', ''],
        ]
      }
    },

    // ============================================
    // SECTION 18: POST-LAUNCH PLAN
    // ============================================
    {
      id: 'post-launch-plan',
      title: 'Post-Launch Plan',
      description: 'What happens after launch?',
      fieldType: 'table',
      required: true,
      helpText: 'Launch is not the end - plan for iteration',
      learnContentId: 'post-launch',
      tableSchema: {
        columns: ['Activity', 'Timeline', 'Owner', 'Success Criteria', 'Notes'],
        rows: [
          ['Day 1 Monitoring', 'Day 1', '', 'No P0 issues', ''],
          ['Week 1 Review', 'Week 1', '', 'Metrics tracking', ''],
          ['Month 1 Success Review', 'Month 1', '', 'Hit targets?', ''],
          ['Quarter 1 Impact Assessment', 'Month 3', '', 'Long-term value', ''],
        ]
      }
    },

    // ============================================
    // SECTION 19: APPENDICES
    // ============================================
    {
      id: 'appendices',
      title: 'Appendices',
      description: 'Additional context, research, and references',
      fieldType: 'markdown',
      required: false,
      helpText: 'Put detailed research and references here',
      learnContentId: 'documentation',
    },
  ],
};
