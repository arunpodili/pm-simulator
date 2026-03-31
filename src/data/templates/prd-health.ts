import { Template } from '@/types';

export const prdHealthTemplate: Template = {
  id: 'prd-health-feature-launch',
  name: 'Health Tech Feature Launch PRD (Comprehensive)',
  description: 'Complete product requirements document for Health Tech with HIPAA/FDA compliance',
  industryId: 'health',
  scenarioId: 'feature-launch',
  frameworkIds: ['rice', 'jtbd'],
  outputFormat: 'markdown',
  estimatedCompletionTime: '4-5 hours',
  version: '1.0.0',
  sections: [
    {
      id: 'document-meta',
      title: 'Document Metadata',
      description: 'Track document ownership and regulatory approvals',
      fieldType: 'table',
      required: true,
      helpText: 'Include all regulatory stakeholders',
      learnContentId: 'doc-versioning',
      tableSchema: {
        columns: ['Field', 'Value'],
        rows: [
          ['Document Owner', ''],
          ['Medical/Clinical Lead', ''],
          ['Compliance/Privacy Officer', ''],
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
      description: 'All stakeholders who must approve (including clinical and compliance)',
      fieldType: 'table',
      required: true,
      helpText: 'Clinical and compliance approval is mandatory',
      learnContentId: 'stakeholder-management',
      tableSchema: {
        columns: ['Role', 'Name', 'Status', 'Date Approved'],
        rows: [
          ['Product', '', 'Pending', ''],
          ['Clinical/Medical', '', 'Pending', ''],
          ['Compliance/Privacy', '', 'Pending', ''],
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
      helpText: 'Include clinical context',
      learnContentId: 'executive-communication',
    },
    {
      id: 'clinical-need',
      title: 'Clinical Need',
      description: 'What healthcare problem are we solving?',
      fieldType: 'markdown',
      required: true,
      helpText: 'Evidence-based problem definition',
      learnContentId: 'problem-definition',
    },
    {
      id: 'stakeholders',
      title: 'Healthcare Stakeholders',
      description: 'All parties involved in care delivery',
      fieldType: 'table',
      required: true,
      helpText: 'Consider all roles in the care journey',
      learnContentId: 'persona-definition',
      tableSchema: {
        columns: ['Role', 'Setting', 'Needs', 'Access Level', 'Workflow Context'],
        rows: [
          ['Patient', '', '', '', ''],
          ['Provider (MD/DO)', '', '', '', ''],
          ['Nurse/MA', '', '', '', ''],
          ['Care Coordinator', '', '', '', ''],
          ['Admin Staff', '', '', '', ''],
        ]
      }
    },
    {
      id: 'jtbd',
      title: 'Jobs To Be Done',
      description: 'Frame the clinical or patient need',
      fieldType: 'markdown',
      required: true,
      helpText: 'Focus on patient outcomes',
      learnContentId: 'jtbd-framework',
    },
    {
      id: 'regulatory-requirements',
      title: 'Regulatory Requirements',
      description: 'HIPAA, FDA, and other compliance requirements',
      fieldType: 'table',
      required: true,
      helpText: 'Non-negotiable for Health Tech',
      learnContentId: 'non-functional-requirements',
      tableSchema: {
        columns: ['Requirement', 'Regulation', 'Description', 'Evidence Required', 'Owner'],
        rows: [
          ['HIPAA Privacy Rule', 'HIPAA', '', '', ''],
          ['HIPAA Security Rule', 'HIPAA', '', '', ''],
          ['Data Encryption', 'HIPAA', '', '', ''],
          ['Audit Trail', 'HIPAA', '', '', ''],
          ['FDA Classification', 'FDA', '', '', ''],
          ['Clinical Validation', 'FDA', '', '', ''],
          ['21 CFR Part 11', 'FDA', '', '', ''],
        ]
      }
    },
    {
      id: 'security-requirements',
      title: 'Security Requirements',
      description: 'PHI protection and access controls',
      fieldType: 'table',
      required: true,
      helpText: 'PHI must be protected at rest and in transit',
      learnContentId: 'non-functional-requirements',
      tableSchema: {
        columns: ['Control', 'Requirement', 'Implementation', 'Verification', 'Owner'],
        rows: [
          ['Access Control', 'Role-based access', '', '', ''],
          ['Encryption at Rest', 'AES-256', '', '', ''],
          ['Encryption in Transit', 'TLS 1.3+', '', '', ''],
          ['Audit Logging', 'All PHI access logged', '', '', ''],
          ['Session Mgmt', 'Auto-logout <15min', '', '', ''],
          ['Minimum Necessary', 'Access limited to need', '', '', ''],
        ]
      }
    },
    {
      id: 'success-metrics',
      title: 'Success Metrics',
      description: 'Clinical and business outcomes',
      fieldType: 'table',
      required: true,
      helpText: 'Balance patient outcomes with operational efficiency',
      learnContentId: 'success-metrics',
      tableSchema: {
        columns: ['Metric Type', 'Metric', 'Baseline', 'Target', 'Timeline', 'Owner'],
        rows: [
          ['Clinical Outcome', '', '', '', '', ''],
          ['Patient Engagement', '', '', '', '', ''],
          ['Provider Efficiency', '', '', '', '', ''],
          ['Patient Satisfaction', '', '', '', '', ''],
          ['Care Adherence', '', '', '', '', ''],
        ]
      }
    },
    {
      id: 'solution-overview',
      title: 'Solution Overview',
      description: 'High-level description',
      fieldType: 'markdown',
      required: true,
      helpText: 'Include clinical workflow diagram',
      learnContentId: 'solution-design',
    },
    {
      id: 'user-stories',
      title: 'User Stories',
      description: 'Detailed user stories with acceptance criteria',
      fieldType: 'table',
      required: true,
      helpText: 'Include clinical scenarios',
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
      helpText: 'Include clinical workflows',
      learnContentId: 'requirements-writing',
      tableSchema: {
        columns: ['ID', 'Requirement', 'Priority', 'Clinical Impact', 'User Story', 'Notes'],
        rows: [['FR-001', '', 'P0', 'High/Med/Low', '', '']]
      }
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Patient safety and compliance risks',
      fieldType: 'table',
      required: true,
      helpText: 'Patient safety is paramount',
      learnContentId: 'risk-management',
      tableSchema: {
        columns: ['Risk', 'Category', 'Severity', 'Likelihood', 'Mitigation', 'Owner'],
        rows: [
          ['Patient safety risk', 'Clinical', '', '', '', ''],
          ['Data breach/PHI exposure', 'Security', '', '', '', ''],
          ['Regulatory penalty', 'Compliance', '', '', '', ''],
          ['Clinical error', 'Operational', '', '', '', ''],
          ['System downtime', 'Technical', '', '', '', ''],
        ]
      }
    },
    {
      id: 'rollout-plan',
      title: 'Clinical Rollout Plan',
      description: 'Phased launch with clinical oversight',
      fieldType: 'table',
      required: true,
      helpText: 'Start with pilot sites',
      learnContentId: 'rollout-strategy',
      tableSchema: {
        columns: ['Phase', 'Site Type', 'Patients', 'Duration', 'Success Criteria', 'Go/No-Go Owner'],
        rows: [
          ['Internal', 'Our clinic', 'Staff only', '2 weeks', 'No safety issues', ''],
          ['Pilot', '1-2 partner sites', '50-100', '4 weeks', 'Positive outcomes', ''],
          ['Expanded', '5-10 sites', '500-1000', '8 weeks', 'Metrics stable', ''],
          ['GA', 'All sites', 'All eligible', '-', 'IRB/FDA approval', ''],
        ]
      }
    },
    {
      id: 'gtm-alignment',
      title: 'Go-to-Market Alignment',
      description: 'Clinical and commercial enablement',
      fieldType: 'table',
      required: true,
      helpText: 'Include clinical champions',
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
      helpText: 'Include IRB and regulatory timelines',
      learnContentId: 'estimation',
      tableSchema: {
        columns: ['Milestone', 'Target Date', 'Dependencies', 'Owner', 'Status'],
        rows: [
          ['PRD Approved', '', '', '', ''],
          ['IRB Approval', '', '', '', ''],
          ['Clinical Review', '', '', '', ''],
          ['Compliance Review', '', '', '', ''],
          ['Security Review', '', '', '', ''],
          ['Engineering Complete', '', '', '', ''],
          ['Pilot Launch', '', '', '', ''],
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
      helpText: 'Monitor clinical outcomes closely',
      learnContentId: 'post-launch',
      tableSchema: {
        columns: ['Activity', 'Timeline', 'Owner', 'Alert Thresholds', 'Notes'],
        rows: [
          ['Patient safety monitoring', 'Real-time', '', 'Any adverse event', ''],
          ['PHI access audit', 'Weekly', '', 'Unauthorized access', ''],
          ['Week 1 review', 'Week 1', '', 'No safety issues', ''],
          ['Month 1 outcomes review', 'Month 1', '', 'Clinical metrics', ''],
        ]
      }
    },
  ],
};
