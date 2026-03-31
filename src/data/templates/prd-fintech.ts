import { Template } from '@/types';

export const prdFinTechTemplate: Template = {
  id: 'prd-fintech-feature-launch',
  name: 'FinTech Feature Launch PRD (Comprehensive)',
  description: 'Complete product requirements document for FinTech features with compliance and security',
  industryId: 'fintech',
  scenarioId: 'feature-launch',
  frameworkIds: ['rice', 'jtbd'],
  outputFormat: 'markdown',
  estimatedCompletionTime: '3-4 hours',
  version: '1.0.0',
  sections: [
    {
      id: 'document-meta',
      title: 'Document Metadata',
      description: 'Track document ownership and regulatory approvals',
      fieldType: 'table',
      required: true,
      helpText: 'Include compliance and security stakeholders',
      learnContentId: 'doc-versioning',
      tableSchema: {
        columns: ['Field', 'Value'],
        rows: [
          ['Document Owner', ''],
          ['Engineering Lead', ''],
          ['Compliance Officer', ''],
          ['Security Lead', ''],
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
      helpText: 'Critical for audit trails',
      learnContentId: 'change-management',
      tableSchema: {
        columns: ['Version', 'Date', 'Author', 'Changes', 'Reviewers'],
        rows: [['1.0', '', '', 'Initial draft', '']]
      }
    },
    {
      id: 'approvers',
      title: 'Required Approvals',
      description: 'All stakeholders who must approve (including compliance)',
      fieldType: 'table',
      required: true,
      helpText: 'Compliance approval is mandatory',
      learnContentId: 'stakeholder-management',
      tableSchema: {
        columns: ['Role', 'Name', 'Status', 'Date Approved'],
        rows: [
          ['Product', '', 'Pending', ''],
          ['Engineering', '', 'Pending', ''],
          ['Compliance', '', 'Pending', ''],
          ['Security', '', 'Pending', ''],
          ['Legal', '', 'Pending', ''],
        ]
      }
    },
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      description: 'One-paragraph overview',
      fieldType: 'markdown',
      required: true,
      helpText: 'Include regulatory context if applicable',
      learnContentId: 'executive-communication',
    },
    {
      id: 'problem-statement',
      title: 'Problem Statement',
      description: 'What financial pain point are we solving?',
      fieldType: 'markdown',
      required: true,
      helpText: 'Include regulatory context',
      learnContentId: 'problem-definition',
    },
    {
      id: 'user-personas',
      title: 'Target User Personas',
      description: 'User segments with KYC/AML considerations',
      fieldType: 'table',
      required: true,
      helpText: 'Consider verification levels',
      learnContentId: 'persona-definition',
      tableSchema: {
        columns: ['Persona', 'Role', 'Segment', 'KYC Level', 'Transaction Volume', 'Goals'],
        rows: [['', '', '', 'Basic/Enhanced', '', '']]
      }
    },
    {
      id: 'jtbd',
      title: 'Jobs To Be Done',
      description: 'Frame the user need',
      fieldType: 'markdown',
      required: true,
      helpText: 'Consider financial anxiety',
      learnContentId: 'jtbd-framework',
    },
    {
      id: 'compliance-requirements',
      title: 'Compliance Requirements',
      description: 'Regulatory and compliance requirements',
      fieldType: 'table',
      required: true,
      helpText: 'Non-negotiable for FinTech',
      learnContentId: 'non-functional-requirements',
      tableSchema: {
        columns: ['Requirement', 'Regulation', 'Description', 'Evidence Required', 'Owner'],
        rows: [
          ['KYC/AML', 'BSA/USA PATRIOT Act', '', '', ''],
          ['Data Encryption', 'PCI-DSS', '', '', ''],
          ['Audit Logging', 'SOC 2', '', '', ''],
          ['Transaction Monitoring', 'FinCEN', '', '', ''],
          ['Consumer Disclosure', 'Reg E', '', '', ''],
        ]
      }
    },
    {
      id: 'security-requirements',
      title: 'Security Requirements',
      description: 'Security controls and protections',
      fieldType: 'table',
      required: true,
      helpText: 'Financial data requires highest security',
      learnContentId: 'non-functional-requirements',
      tableSchema: {
        columns: ['Control', 'Requirement', 'Implementation', 'Verification', 'Owner'],
        rows: [
          ['Authentication', 'MFA required', '', '', ''],
          ['Authorization', 'Role-based access', '', '', ''],
          ['Encryption at Rest', 'AES-256', '', '', ''],
          ['Encryption in Transit', 'TLS 1.3+', '', '', ''],
          ['Session Management', 'Auto-logout 15min', '', '', ''],
          ['Audit Trail', 'All transactions logged', '', '', ''],
        ]
      }
    },
    {
      id: 'success-metrics',
      title: 'Success Metrics',
      description: 'FinTech-specific metrics',
      fieldType: 'table',
      required: true,
      helpText: 'Balance growth with risk',
      learnContentId: 'success-metrics',
      tableSchema: {
        columns: ['Metric Type', 'Metric', 'Baseline', 'Target', 'Timeline', 'Owner'],
        rows: [
          ['Transaction Success Rate', '', '', '', '', ''],
          ['Fraud Rate', '', '', '', '', ''],
          ['Time to First Transaction', '', '', '', '', ''],
          ['Conversion Rate', '', '', '', '', ''],
          ['False Positive Rate', '', '', '', '', ''],
        ]
      }
    },
    {
      id: 'solution-overview',
      title: 'Solution Overview',
      description: 'High-level description',
      fieldType: 'markdown',
      required: true,
      helpText: 'Include money flow diagram',
      learnContentId: 'solution-design',
    },
    {
      id: 'user-stories',
      title: 'User Stories',
      description: 'Detailed user stories with acceptance criteria',
      fieldType: 'table',
      required: true,
      helpText: 'Include fraud scenarios',
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
      helpText: 'Include transaction limits and validations',
      learnContentId: 'requirements-writing',
      tableSchema: {
        columns: ['ID', 'Requirement', 'Priority', 'Risk Level', 'User Story', 'Notes'],
        rows: [['FR-001', '', 'P0', 'High/Med/Low', '', '']]
      }
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Financial and operational risks',
      fieldType: 'table',
      required: true,
      helpText: 'Consider fraud, operational, and compliance risks',
      learnContentId: 'risk-management',
      tableSchema: {
        columns: ['Risk', 'Category', 'Likelihood', 'Impact', 'Mitigation', 'Owner'],
        rows: [
          ['Fraudulent transactions', 'Fraud', '', '', '', ''],
          ['Regulatory penalty', 'Compliance', '', '', '', ''],
          ['Data breach', 'Security', '', '', '', ''],
          ['System downtime', 'Operational', '', '', '', ''],
        ]
      }
    },
    {
      id: 'rollout-plan',
      title: 'Phased Rollout Plan',
      description: 'Careful launch with risk controls',
      fieldType: 'table',
      required: true,
      helpText: 'Start with low transaction limits',
      learnContentId: 'rollout-strategy',
      tableSchema: {
        columns: ['Phase', 'User Segment', 'Transaction Limit', 'Duration', 'Success Criteria', 'Go/No-Go Owner'],
        rows: [
          ['Internal', 'Employees', '$100', '1 week', 'No issues', ''],
          ['Alpha', 'Trusted users', '$1,000', '2 weeks', 'Fraud rate < 0.1%', ''],
          ['Beta', 'Verified users', '$10,000', '2 weeks', 'Metrics stable', ''],
          ['GA', 'All eligible users', 'Standard', '-', 'All checks pass', ''],
        ]
      }
    },
    {
      id: 'gtm-alignment',
      title: 'Go-to-Market Alignment',
      description: 'Marketing, sales, and support enablement',
      fieldType: 'table',
      required: true,
      helpText: 'Include trust and security messaging',
      learnContentId: 'gtm-basics',
      tableSchema: {
        columns: ['Activity', 'Team', 'Owner', 'Due Date', 'Status'],
        rows: [['', '', '', '', '']]
      }
    },
    {
      id: 'timeline-resourcing',
      title: 'Timeline & Resourcing',
      description: 'Project milestones and team',
      fieldType: 'table',
      required: true,
      helpText: 'Include compliance review time',
      learnContentId: 'estimation',
      tableSchema: {
        columns: ['Milestone', 'Target Date', 'Dependencies', 'Owner', 'Status'],
        rows: [
          ['PRD Approved', '', '', '', ''],
          ['Compliance Review', '', '', '', ''],
          ['Security Review', '', '', '', ''],
          ['Engineering Complete', '', '', '', ''],
          ['QA Complete', '', '', '', ''],
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
      helpText: 'Monitor fraud metrics closely',
      learnContentId: 'post-launch',
      tableSchema: {
        columns: ['Activity', 'Timeline', 'Owner', 'Alert Thresholds', 'Notes'],
        rows: [
          ['Fraud monitoring', 'Real-time', '', 'Fraud rate > 0.5%', ''],
          ['Day 1 check', 'Day 1', '', 'No P0 issues', ''],
          ['Week 1 review', 'Week 1', '', 'Metrics stable', ''],
          ['Month 1 review', 'Month 1', '', 'Hit targets', ''],
        ]
      }
    },
  ],
};
