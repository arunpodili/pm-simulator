import { Template } from '@/types';

export const prdAITemplate: Template = {
  id: 'prd-ai-feature-launch',
  name: 'AI/ML Feature Launch PRD (Comprehensive)',
  description: 'Complete product requirements document for AI/ML features',
  industryId: 'ai-ml',
  scenarioId: 'feature-launch',
  frameworkIds: ['rice', 'jtbd'],
  outputFormat: 'markdown',
  estimatedCompletionTime: '3-4 hours',
  version: '1.0.0',
  sections: [
    {
      id: 'document-meta',
      title: 'Document Metadata',
      description: 'Track document ownership',
      fieldType: 'table',
      required: true,
      helpText: 'Include ML and data leads',
      learnContentId: 'doc-versioning',
      tableSchema: {
        columns: ['Field', 'Value'],
        rows: [
          ['Document Owner', ''],
          ['ML Lead', ''],
          ['Data Lead', ''],
          ['Engineering Lead', ''],
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
      description: 'Track all significant changes',
      fieldType: 'table',
      required: true,
      helpText: 'Critical for ML model iterations',
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
      helpText: 'Include ML and ethics review',
      learnContentId: 'stakeholder-management',
      tableSchema: {
        columns: ['Role', 'Name', 'Status', 'Date Approved'],
        rows: [
          ['Product', '', 'Pending', ''],
          ['ML/AI Lead', '', 'Pending', ''],
          ['Data Engineering', '', 'Pending', ''],
          ['Engineering', '', 'Pending', ''],
          ['Ethics/Responsible AI', '', 'Pending', ''],
        ]
      }
    },
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      description: 'One-paragraph overview',
      fieldType: 'markdown',
      required: true,
      helpText: 'Explain why ML is needed',
      learnContentId: 'executive-communication',
    },
    {
      id: 'ml-problem',
      title: 'ML Problem Definition',
      description: 'What can ML solve?',
      fieldType: 'markdown',
      required: true,
      helpText: 'Ensure ML is the right solution',
      learnContentId: 'problem-definition',
    },
    {
      id: 'users',
      title: 'Target Users',
      description: 'Who will use this?',
      fieldType: 'table',
      required: true,
      helpText: 'Consider ML literacy',
      learnContentId: 'persona-definition',
      tableSchema: {
        columns: ['Segment', 'ML Literacy', 'Use Case', 'Trust Level', 'Needs'],
        rows: [['', 'Low/Med/High', '', 'Low/Med/High', '']]
      }
    },
    {
      id: 'jtbd',
      title: 'Jobs To Be Done',
      description: 'Frame the user need',
      fieldType: 'markdown',
      required: true,
      helpText: 'Focus on outcome, not the model',
      learnContentId: 'jtbd-framework',
    },
    {
      id: 'model-requirements',
      title: 'Model Requirements',
      description: 'Model type, accuracy, latency requirements',
      fieldType: 'table',
      required: true,
      helpText: 'Define acceptable performance',
      learnContentId: 'non-functional-requirements',
      tableSchema: {
        columns: ['Metric', 'Minimum Acceptable', 'Target', 'Stretch Goal', 'Measurement Method'],
        rows: [
          ['Accuracy/Precision', '', '', '', ''],
          ['Recall', '', '', '', ''],
          ['F1 Score', '', '', '', ''],
          ['Latency (p50)', '', '', '', ''],
          ['Latency (p99)', '', '', '', ''],
          ['Throughput (QPS)', '', '', '', ''],
        ]
      }
    },
    {
      id: 'data-requirements',
      title: 'Data Requirements',
      description: 'Training data, features, labeling',
      fieldType: 'table',
      required: true,
      helpText: 'Data quality is critical',
      learnContentId: 'data-tracking',
      tableSchema: {
        columns: ['Requirement', 'Description', 'Source', 'Quality Check', 'Owner'],
        rows: [
          ['Training Data', '', '', '', ''],
          ['Feature Set', '', '', '', ''],
          ['Labeling Strategy', '', '', '', ''],
          ['Validation Set', '', '', '', ''],
          ['Test Set', '', '', '', ''],
        ]
      }
    },
    {
      id: 'success-metrics',
      title: 'Success Metrics',
      description: 'Model and product metrics',
      fieldType: 'table',
      required: true,
      helpText: 'Both offline and online metrics',
      learnContentId: 'success-metrics',
      tableSchema: {
        columns: ['Metric Type', 'Metric', 'Baseline', 'Target', 'Timeline', 'Owner'],
        rows: [
          ['Model (Offline)', '', '', '', '', ''],
          ['Model (Online)', '', '', '', '', ''],
          ['Product Impact', '', '', '', '', ''],
          ['User Experience', '', '', '', '', ''],
        ]
      }
    },
    {
      id: 'solution-overview',
      title: 'Solution Overview',
      description: 'High-level architecture',
      fieldType: 'markdown',
      required: true,
      helpText: 'Include ML pipeline diagram',
      learnContentId: 'solution-design',
    },
    {
      id: 'evaluations',
      title: 'Evaluation Strategy',
      description: 'How we validate model performance',
      fieldType: 'table',
      required: true,
      helpText: 'Offline and online evaluation',
      learnContentId: 'success-metrics',
      tableSchema: {
        columns: ['Eval Type', 'Metric', 'Baseline', 'Target', 'Method'],
        rows: [
          ['Offline (Test Set)', '', '', '', ''],
          ['A/B Test', '', '', '', ''],
          ['Human Review', '', '', '', ''],
          ['Shadow Mode', '', '', '', ''],
        ]
      }
    },
    {
      id: 'ethical-ai',
      title: 'Ethical AI Assessment',
      description: 'Fairness, bias, transparency',
      fieldType: 'table',
      required: true,
      helpText: 'Critical for responsible AI',
      learnContentId: 'risk-management',
      tableSchema: {
        columns: ['Concern', 'Risk Level', 'Assessment', 'Mitigation', 'Owner'],
        rows: [
          ['Bias/Fairness', '', '', '', ''],
          ['Transparency/Explainability', '', '', '', ''],
          ['Privacy', '', '', '', ''],
          ['Misuse Potential', '', '', '', ''],
          ['Human Oversight', '', '', '', ''],
        ]
      }
    },
    {
      id: 'functional-requirements',
      title: 'Functional Requirements',
      description: 'What we are building',
      fieldType: 'table',
      required: true,
      helpText: 'Include fallback behavior',
      learnContentId: 'requirements-writing',
      tableSchema: {
        columns: ['ID', 'Requirement', 'Priority', 'ML Confidence', 'User Story', 'Notes'],
        rows: [['FR-001', '', 'P0', 'High/Med/Low', '', '']]
      }
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'ML-specific risks',
      fieldType: 'table',
      required: true,
      helpText: 'Consider model drift, bias, failures',
      learnContentId: 'risk-management',
      tableSchema: {
        columns: ['Risk', 'Category', 'Severity', 'Likelihood', 'Mitigation', 'Owner'],
        rows: [
          ['Model drift', 'ML', '', '', '', ''],
          ['Biased predictions', 'Ethics', '', '', '', ''],
          ['Poor edge case handling', 'ML', '', '', '', ''],
          ['Data pipeline failure', 'Infrastructure', '', '', '', ''],
          ['Privacy violation', 'Security', '', '', '', ''],
        ]
      }
    },
    {
      id: 'monitoring',
      title: 'Monitoring & Observability',
      description: 'Model drift, performance tracking',
      fieldType: 'table',
      required: true,
      helpText: 'ML models need continuous monitoring',
      learnContentId: 'post-launch',
      tableSchema: {
        columns: ['Metric', 'Alert Threshold', 'Frequency', 'Owner', 'Response'],
        rows: [
          ['Model Drift', '', 'Daily', '', ''],
          ['Prediction Distribution', '', 'Daily', '', ''],
          ['Latency', '', 'Real-time', '', ''],
          ['Error Rate', '', 'Real-time', '', ''],
          ['Data Quality', '', 'Daily', '', ''],
        ]
      }
    },
    {
      id: 'rollout-plan',
      title: 'ML Rollout Plan',
      description: 'Shadow mode to full launch',
      fieldType: 'table',
      required: true,
      helpText: 'Shadow mode first',
      learnContentId: 'rollout-strategy',
      tableSchema: {
        columns: ['Phase', 'Mode', '% Traffic', 'Duration', 'Success Criteria', 'Go/No-Go Owner'],
        rows: [
          ['Shadow', 'Predictions logged, not shown', '100%', '1-2 weeks', 'No major issues', ''],
          ['Beta', 'Shown to users', '5%', '2 weeks', 'Metrics beat baseline', ''],
          ['Expanded', 'Gradual increase', '25% → 50%', '2 weeks', 'Drift within bounds', ''],
          ['GA', 'Full rollout', '100%', '-', 'All metrics green', ''],
        ]
      }
    },
    {
      id: 'timeline-resourcing',
      title: 'Timeline & Resourcing',
      description: 'Project milestones and team',
      fieldType: 'table',
      required: true,
      helpText: 'ML iterations take time',
      learnContentId: 'estimation',
      tableSchema: {
        columns: ['Milestone', 'Target Date', 'Dependencies', 'Owner', 'Status'],
        rows: [
          ['PRD Approved', '', '', '', ''],
          ['Data Collection Complete', '', '', '', ''],
          ['Model Training Complete', '', '', '', ''],
          ['Offline Eval Complete', '', '', '', ''],
          ['Shadow Mode Complete', '', '', '', ''],
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
      helpText: 'Monitor model performance closely',
      learnContentId: 'post-launch',
      tableSchema: {
        columns: ['Activity', 'Timeline', 'Owner', 'Alert Thresholds', 'Notes'],
        rows: [
          ['Model drift monitoring', 'Daily', '', 'Drift > threshold', ''],
          ['Prediction quality review', 'Weekly', '', 'Accuracy drop', ''],
          ['Day 1 check', 'Day 1', '', 'No P0 issues', ''],
          ['Week 1 review', 'Week 1', '', 'Metrics stable', ''],
          ['Month 1 impact', 'Month 1', '', 'Hit targets', ''],
        ]
      }
    },
  ],
};
