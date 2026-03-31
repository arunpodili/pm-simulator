import { Template } from '@/types';

export const prdEcommerceTemplate: Template = {
  id: 'prd-ecommerce-feature-launch',
  name: 'E-commerce Feature Launch PRD (Comprehensive)',
  description: 'Complete product requirements document for e-commerce features',
  industryId: 'ecommerce',
  scenarioId: 'feature-launch',
  frameworkIds: ['rice', 'jtbd', 'okrs'],
  outputFormat: 'markdown',
  estimatedCompletionTime: '2-4 hours',
  version: '1.0.0',
  sections: [
    {
      id: 'document-meta',
      title: 'Document Metadata',
      description: 'Track document ownership and versioning',
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
      helpText: 'Critical for stakeholder alignment',
      learnContentId: 'change-management',
      tableSchema: {
        columns: ['Version', 'Date', 'Author', 'Changes', 'Reviewers'],
        rows: [['1.0', '', '', 'Initial draft', '']]
      }
    },
    {
      id: 'approvers',
      title: 'Required Approvals',
      description: 'All stakeholders who must approve',
      fieldType: 'table',
      required: true,
      helpText: 'Include merchandising and operations',
      learnContentId: 'stakeholder-management',
      tableSchema: {
        columns: ['Role', 'Name', 'Status', 'Date Approved'],
        rows: [
          ['Product', '', 'Pending', ''],
          ['Engineering', '', 'Pending', ''],
          ['Design', '', 'Pending', ''],
          ['Merchandising', '', 'Pending', ''],
          ['Operations', '', 'Pending', ''],
        ]
      }
    },
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      description: 'One-paragraph overview',
      fieldType: 'markdown',
      required: true,
      helpText: 'Focus on GMV and conversion impact',
      learnContentId: 'executive-communication',
    },
    {
      id: 'commerce-opportunity',
      title: 'Commerce Opportunity',
      description: 'What shopping friction are we removing?',
      fieldType: 'markdown',
      required: true,
      helpText: 'Tie to conversion and AOV',
      learnContentId: 'problem-definition',
    },
    {
      id: 'shopper-personas',
      title: 'Shopper Segments',
      description: 'Target customer segments',
      fieldType: 'table',
      required: true,
      helpText: 'Consider purchase behavior',
      learnContentId: 'persona-definition',
      tableSchema: {
        columns: ['Segment', 'Behavior', 'AOV', 'Frequency', 'Channel Preference', 'Priority'],
        rows: [
          ['New Visitor', '', '', '', '', 'P1'],
          ['Returning Customer', '', '', '', '', 'P1'],
          ['VIP/loyal', '', '', '', '', 'P0'],
          ['Cart Abandoner', '', '', '', '', 'P1'],
        ]
      }
    },
    {
      id: 'jtbd',
      title: 'Jobs To Be Done',
      description: 'Frame the shopper need',
      fieldType: 'markdown',
      required: true,
      helpText: 'Focus on shopping goals',
      learnContentId: 'jtbd-framework',
    },
    {
      id: 'success-metrics',
      title: 'Commerce Metrics',
      description: 'E-commerce KPIs',
      fieldType: 'table',
      required: true,
      helpText: 'Focus on conversion funnel',
      learnContentId: 'success-metrics',
      tableSchema: {
        columns: ['Metric Type', 'Metric', 'Baseline', 'Target', 'Timeline', 'Owner'],
        rows: [
          ['Conversion', 'Conversion Rate', '', '', '', ''],
          ['Revenue', 'Average Order Value', '', '', '', ''],
          ['Funnel', 'Cart Abandonment Rate', '', '', '', ''],
          ['Retention', 'Customer Lifetime Value', '', '', '', ''],
          ['Engagement', 'Product Page Views', '', '', '', ''],
        ]
      }
    },
    {
      id: 'solution-overview',
      title: 'Solution Overview',
      description: 'High-level description',
      fieldType: 'markdown',
      required: true,
      helpText: 'Include user flow diagram',
      learnContentId: 'solution-design',
    },
    {
      id: 'user-stories',
      title: 'User Stories',
      description: 'Detailed user stories with acceptance criteria',
      fieldType: 'table',
      required: true,
      helpText: 'Include edge cases for checkout',
      learnContentId: 'user-stories',
      tableSchema: {
        columns: ['Story ID', 'As a...', 'I want to...', 'So that...', 'Acceptance Criteria', 'Priority'],
        rows: [['US-001', '', '', '', '', 'P0']]
      }
    },
    {
      id: 'functional-requirements',
      title: 'Functional Requirements',
      description: 'Detailed requirements with priorities',
      fieldType: 'table',
      required: true,
      helpText: 'Consider mobile-first',
      learnContentId: 'requirements-writing',
      tableSchema: {
        columns: ['ID', 'Requirement', 'Priority', 'Platform', 'User Story', 'Notes'],
        rows: [['FR-001', '', 'P0', 'Mobile/Desktop/Both', '', '']]
      }
    },
    {
      id: 'integrations',
      title: 'Commerce Integrations',
      description: 'Payment, shipping, inventory systems',
      fieldType: 'table',
      required: true,
      helpText: 'Map all touchpoints',
      learnContentId: 'dependency-management',
      tableSchema: {
        columns: ['System', 'Purpose', 'API/Method', 'Owner', 'Status', 'Required By'],
        rows: [
          ['Payment Gateway', 'Process payments', '', '', '', ''],
          ['Inventory Management', 'Stock levels', '', '', '', ''],
          ['Shipping/Fulfillment', 'Order delivery', '', '', '', ''],
          ['CRM', 'Customer data', '', '', '', ''],
          ['Analytics', 'Tracking', '', '', '', ''],
        ]
      }
    },
    {
      id: 'promotions-pricing',
      title: 'Promotions & Pricing',
      description: 'Discount rules and pricing logic',
      fieldType: 'table',
      required: false,
      helpText: 'Define all edge cases',
      learnContentId: 'requirements-writing',
      tableSchema: {
        columns: ['Rule', 'Condition', 'Discount', 'Stackable', 'Exclusions', 'Priority'],
        rows: [['', '', '', 'Yes/No', '', '']]
      }
    },
    {
      id: 'ux-requirements',
      title: 'UX/UI Requirements',
      description: 'Design specifications',
      fieldType: 'table',
      required: true,
      helpText: 'Mobile-first design',
      learnContentId: 'ux-specification',
      tableSchema: {
        columns: ['State', 'Screen/Component', 'Description', 'Behavior', 'Design Link'],
        rows: [
          ['Empty State', '', '', '', ''],
          ['Loading State', '', '', '', ''],
          ['Error State', '', '', '', ''],
          ['Success State', '', '', '', ''],
          ['Out of Stock', '', '', '', ''],
        ]
      }
    },
    {
      id: 'edge-cases',
      title: 'Edge Cases',
      description: 'Anticipate edge cases',
      fieldType: 'table',
      required: true,
      helpText: 'Consider inventory, pricing, payment edge cases',
      learnContentId: 'edge-case-thinking',
      tableSchema: {
        columns: ['Scenario', 'Category', 'Likelihood', 'Impact', 'Handling'],
        rows: [
          ['Price changes during checkout', 'Pricing', '', '', ''],
          ['Inventory sells out during order', 'Inventory', '', '', ''],
          ['Payment fails after order placed', 'Payment', '', '', ''],
          ['Multiple discounts applied', 'Promotions', '', '', ''],
          ['Session expires during checkout', 'User', '', '', ''],
        ]
      }
    },
    {
      id: 'rollout-plan',
      title: 'Rollout Plan',
      description: 'Phased launch strategy',
      fieldType: 'table',
      required: true,
      helpText: 'Consider peak traffic periods',
      learnContentId: 'rollout-strategy',
      tableSchema: {
        columns: ['Phase', 'Segment', '% Traffic', 'Duration', 'Success Criteria', 'Go/No-Go Owner'],
        rows: [
          ['Internal', 'Employees', '100%', '3 days', 'No P0 bugs', ''],
          ['Beta', 'Loyal customers', '5%', '1 week', 'Conversion stable', ''],
          ['Expanded', 'All users', '50%', '1 week', 'Metrics stable', ''],
          ['GA', 'All users', '100%', '-', 'Metrics hit target', ''],
        ]
      }
    },
    {
      id: 'gtm-alignment',
      title: 'Marketing Plan',
      description: 'Promotion and communication',
      fieldType: 'table',
      required: true,
      helpText: 'Coordinate campaigns',
      learnContentId: 'gtm-basics',
      tableSchema: {
        columns: ['Channel', 'Message', 'Owner', 'Launch Date', 'Status'],
        rows: [
          ['Email', '', '', '', ''],
          ['Social Media', '', '', '', ''],
          ['On-site Banner', '', '', '', ''],
          ['Push Notification', '', '', '', ''],
        ]
      }
    },
    {
      id: 'timeline-resourcing',
      title: 'Timeline & Resourcing',
      description: 'Project milestones and team',
      fieldType: 'table',
      required: true,
      helpText: 'Consider holiday blackout periods',
      learnContentId: 'estimation',
      tableSchema: {
        columns: ['Milestone', 'Target Date', 'Dependencies', 'Owner', 'Status'],
        rows: [
          ['PRD Approved', '', '', '', ''],
          ['Design Complete', '', '', '', ''],
          ['Engineering Complete', '', '', '', ''],
          ['QA Complete', '', '', '', ''],
          ['Beta Launch', '', '', '', ''],
          ['GA Launch', '', '', '', ''],
        ]
      }
    },
    {
      id: 'post-launch-plan',
      title: 'Post-Launch Plan',
      description: 'Monitoring and iteration',
      fieldType: 'table',
      required: true,
      helpText: 'Monitor conversion closely',
      learnContentId: 'post-launch',
      tableSchema: {
        columns: ['Activity', 'Timeline', 'Owner', 'Alert Thresholds', 'Notes'],
        rows: [
          ['Conversion monitoring', 'Real-time', '', 'Drop > 5%', ''],
          ['Error rate monitoring', 'Real-time', '', 'Error rate > 1%', ''],
          ['Day 1 check', 'Day 1', '', 'No P0 issues', ''],
          ['Week 1 review', 'Week 1', '', 'Metrics stable', ''],
          ['Month 1 impact', 'Month 1', '', 'Hit targets', ''],
        ]
      }
    },
  ],
};
