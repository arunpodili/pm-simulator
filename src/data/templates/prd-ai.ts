import { Template } from '@/types';

export const prdAITemplate: Template = {
  id: 'prd-ai-feature-launch',
  name: 'AI/ML Feature Launch PRD (Comprehensive)',
  description: 'Complete product requirements document for AI/ML features with model requirements, ethical AI, and responsible deployment',
  industryId: 'ai-ml',
  scenarioId: 'feature-launch',
  frameworkIds: ['rice', 'jtbd', 'okrs'],
  outputFormat: 'markdown',
  estimatedCompletionTime: '4-5 hours',
  version: '1.0.0',
  sections: [
    {
      id: 'document-meta',
      title: 'Document Metadata',
      description: 'Track document ownership, version control, and ML-specific approvals',
      fieldType: 'table',
      required: true,
      helpText: 'Include ML, data, and responsible AI stakeholders',
      learnContentId: 'doc-versioning',
      tableSchema: {
        columns: ['Field', 'Value'],
        rows: [
          ['Document Owner', ''],
          ['Product Lead', ''],
          ['ML/AI Lead', ''],
          ['Data Engineering Lead', ''],
          ['Engineering Lead', ''],
          ['Responsible AI/Ethics Lead', ''],
          ['Status', 'Draft / In Review / ML Review / Ethics Review / Approved / Launched'],
          ['Last Updated', ''],
          ['Version', '1.0'],
          ['Target Launch Date', ''],
          ['Model Card Version', '1.0'],
        ]
      }
    },
    {
      id: 'change-log',
      title: 'Change Log',
      description: 'Track all significant changes - critical for ML model iterations',
      fieldType: 'table',
      required: true,
      helpText: 'ML models iterate frequently - track all changes for reproducibility',
      learnContentId: 'change-management',
      tableSchema: {
        columns: ['Version', 'Date', 'Author', 'Changes Made', 'Model Version', 'Reviewers', 'Approval Status'],
        rows: [
          ['1.0', '', '', 'Initial draft', 'v1.0', '', 'Pending'],
          ['1.1', '', '', '', 'v1.1', '', 'Pending'],
        ]
      }
    },
    {
      id: 'approvers',
      title: 'Required Approvals',
      description: 'All stakeholders including ML and ethics review',
      fieldType: 'table',
      required: true,
      helpText: 'Responsible AI review is mandatory for ML features',
      learnContentId: 'stakeholder-management',
      tableSchema: {
        columns: ['Role', 'Name', 'Department', 'Status', 'Date Approved', 'Comments'],
        rows: [
          ['Product', '', '', 'Pending', '', ''],
          ['ML/AI Lead', '', '', 'Pending', '', ''],
          ['Data Engineering', '', '', 'Pending', '', ''],
          ['Engineering', '', '', 'Pending', '', ''],
          ['Responsible AI/Ethics', '', '', 'Pending', '', ''],
          ['Legal/Privacy', '', '', 'Pending', '', ''],
        ]
      }
    },
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      description: 'BLUF - One-paragraph overview explaining why ML is the right solution',
      fieldType: 'markdown',
      required: true,
      helpText: `**Include:**
- What ML capability we're building and why ML is needed (vs rules-based)
- Target user and problem being solved
- Expected business impact and user value
- Key model metrics and success criteria
- Ethical considerations and mitigations
- Launch timeline and rollout approach

**TL;DR:** [1-2 sentence summary]

**30-Second Read:**
- ML Problem: [What requires ML vs rules]
- Solution: [Model type, approach]
- User Impact: [What users gain]
- Business Impact: [ROI, efficiency, revenue]
- Risk Level: [Low/Medium/High - ethical considerations]
- Ask: [What approval/resources needed]`,
      learnContentId: 'executive-communication',
    },
    {
      id: 'ml-problem',
      title: 'ML Problem Definition',
      description: 'What can ML solve? Why is ML the right approach?',
      fieldType: 'markdown',
      required: true,
      helpText: `**Problem Analysis:**
Describe why ML is the right solution:
- Why rules-based approaches fail
- Pattern recognition or prediction needed
- Scale/personalization requirements
- Data availability for training

**ML Approach Justification:**
| Criteria | Assessment | Notes |
|----------|------------|-------|
| Clear pattern in data | Yes/No | [Evidence] |
| Sufficient training data | Yes/No - [Volume] | [Data sources] |
| Rules-based insufficient | Yes/No | [Why rules fail] |
| Acceptable error tolerance | Yes/No | [User impact] |
| Ethical concerns addressable | Yes/No | [Mitigation plan] |

**ML Task Type:**
- [ ] Classification (binary/multi-class)
- [ ] Regression
- [ ] Ranking/Recommendation
- [ ] Clustering/Segmentation
- [ ] Natural Language Processing
- [ ] Computer Vision
- [ ] Time Series Forecasting
- [ ] Anomaly Detection
- [ ] Other: [Specify]

**Non-ML Alternatives Considered:**
| Alternative | Why Rejected |
|-------------|--------------|
| Rules-based system | [Reason] |
| Heuristic approach | [Reason] |
| Manual review | [Reason] |`,
      learnContentId: 'problem-definition',
    },
    {
      id: 'users',
      title: 'Target Users & ML Literacy',
      description: 'User segments with ML literacy and trust considerations',
      fieldType: 'table',
      required: true,
      helpText: 'Consider how ML literacy affects user experience and trust',
      learnContentId: 'persona-definition',
      tableSchema: {
        columns: ['Segment', 'ML Literacy', 'Use Case', 'Trust in AI', 'Needs', 'Explainability Required'],
        rows: [
          ['Technical User', 'High', '[Use case]', 'High', 'Control, transparency', 'Low - technical details OK'],
          ['General Consumer', 'Low-Medium', '[Use case]', 'Medium', 'Simplicity, reliability', 'Medium - plain language'],
          ['Expert User (Doctor/Lawyer)', 'Medium-High', '[Use case]', 'Medium-Low', 'Accuracy, audit trail', 'High - reasoning required'],
          ['Skeptical User', 'Low', '[Use case]', 'Low', 'Opt-out, human override', 'High - clear benefits'],
        ]
      }
    },
    {
      id: 'jtbd',
      title: 'Jobs To Be Done',
      description: 'Frame the user need - focus on outcome, not the model',
      fieldType: 'markdown',
      required: true,
      helpText: `**Primary Job Story:**
"When [situation], I want to [action], so I can [outcome]."

**Example:** "When I'm searching for my next book, I want to discover titles I'll love, so I can spend my reading time on great books."

**ML-Specific Considerations:**
- Users care about the OUTCOME, not the ML
- Focus on reliability and usefulness, not accuracy metrics
- Explainability should match user mental model

**Related Jobs:**
| Job Type | Job Statement | Importance (1-10) | Satisfaction (1-10) | Opportunity |
|----------|---------------|-------------------|--------------------|-------------|
| Functional | [Get accurate predictions/recommendations] | | | |
| Emotional | [Feel confident in AI decisions] | | | |
| Social | [Trust the system, recommend to others] | | | |

**Alternatives Analysis:**
| Current Alternative | Why It Falls Short | ML Advantage |
|---------------------|--------------------|--------------|
| [Manual search] | [Time-consuming, incomplete] | [Personalization, speed] |
| [Rules-based] | [Rigid, doesn't adapt] | [Learns from behavior] |
| [Do nothing] | [Missing opportunities] | [Discovery, relevance] |`,
      learnContentId: 'jtbd-framework',
    },
    {
      id: 'model-requirements',
      title: 'Model Requirements',
      description: 'Model type, accuracy, latency, and performance requirements',
      fieldType: 'table',
      required: true,
      helpText: 'Define acceptable performance - balance accuracy with latency and cost',
      learnContentId: 'non-functional-requirements',
      tableSchema: {
        columns: ['Metric', 'Definition', 'Minimum Acceptable', 'Target', 'Stretch Goal', 'Measurement Method', 'Current Baseline'],
        rows: [
          ['Accuracy/Precision', 'Correct predictions / total', '', '', '', 'Test set evaluation', ''],
          ['Recall', 'True positives / all positives', '', '', '', 'Test set evaluation', ''],
          ['F1 Score', 'Harmonic mean of precision/recall', '', '', '', 'Test set evaluation', ''],
          ['AUC-ROC', 'Area under ROC curve', '', '', '', 'Test set evaluation', ''],
          ['Latency (p50)', 'Median inference time', '', '', '', 'Production monitoring', ''],
          ['Latency (p99)', '99th percentile inference time', '', '', '', 'Production monitoring', ''],
          ['Throughput (QPS)', 'Queries per second capacity', '', '', '', 'Load testing', ''],
          ['Model Size', 'Model file size', '', '', '', 'N/A', ''],
          ['Training Time', 'Time to retrain model', '', '', '', 'ML pipeline', ''],
        ]
      }
    },
    {
      id: 'model-card',
      title: 'Model Card',
      description: 'Model documentation including intended use, limitations, and ethics',
      fieldType: 'markdown',
      required: true,
      helpText: `**Model Details:**
| Field | Value |
|-------|-------|
| Model Name | [Name] |
| Model Version | [Version] |
| Model Type | [Architecture] |
| Training Framework | [TensorFlow/PyTorch/etc.] |
| License | [Open source/Proprietary] |

**Intended Use:**
- Primary use case: [What it's designed for]
- Out-of-scope uses: [What it should NOT be used for]
- Target users: [Who should use it]

**Training Data:**
| Data Source | Volume | Time Period | Demographics |
|-------------|--------|-------------|--------------|
| [Source 1] | [Size] | [Dates] | [Breakdown] |
| [Source 2] | [Size] | [Dates] | [Breakdown] |

**Evaluation Results:**
| Metric | Value | Test Set | Confidence Interval |
|--------|-------|----------|---------------------|
| Accuracy | | | |
| Precision | | | |
| Recall | | | |
| F1 | | | |

**Limitations:**
- [Known limitation 1]
- [Known limitation 2]
- [Demographic groups with lower performance]

**Ethical Considerations:**
- [Bias assessment results]
- [Fairness mitigations applied]
- [Recommended monitoring]`,
      learnContentId: 'non-functional-requirements',
    },
    {
      id: 'data-requirements',
      title: 'Data Requirements',
      description: 'Training data, features, labeling strategy, and data quality',
      fieldType: 'table',
      required: true,
      helpText: 'Data quality is critical - garbage in, garbage out',
      learnContentId: 'data-tracking',
      tableSchema: {
        columns: ['Requirement', 'Description', 'Source', 'Volume', 'Quality Check', 'Owner', 'Status'],
        rows: [
          ['Training Data', 'Labeled examples for training', '[Database/API]', '[X examples]', 'Label accuracy >95%', '', ''],
          ['Validation Set', 'Holdout for hyperparameter tuning', '[Source]', '[X examples]', 'Representative of production', '', ''],
          ['Test Set', 'Final evaluation before deployment', '[Source]', '[X examples]', 'Unseen during training', '', ''],
          ['Feature Store', 'Pre-computed features', '[Feature store]', '[X features]', 'Freshness SLA', '', ''],
          ['Labeling Strategy', 'Human annotation approach', '[Internal/Vendor]', '[X annotators]', 'Inter-annotator agreement >90%', '', ''],
          ['Data Augmentation', 'Synthetic data generation', '[Technique]', '[X multiplier]', 'Quality validation', '', ''],
        ]
      }
    },
    {
      id: 'data-quality-checklist',
      title: 'Data Quality Checklist',
      description: 'Verify data readiness for ML training',
      fieldType: 'markdown',
      required: true,
      helpText: `**Data Completeness:**
- [ ] No critical missing values (>95% complete)
- [ ] All required features present
- [ ] Sufficient volume for training ([X] examples minimum)
- [ ] Class distribution adequate (for classification)
- [ ] Temporal coverage sufficient

**Data Quality:**
- [ ] Label accuracy validated (>95% agreement)
- [ ] Outliers identified and handled
- [ ] Data leakage prevented (train/test separation)
- [ ] Feature distributions analyzed
- [ ] Data drift baseline established

**Data Governance:**
- [ ] PII identified and handled
- [ ] Data lineage documented
- [ ] Consent/permissions verified
- [ ] Retention policies defined
- [ ] Access controls in place

**Feature Engineering:**
| Feature | Source | Type | Transformation | Importance (expected) |
|---------|--------|------|----------------|----------------------|
| [Feature 1] | [Source] | [Numeric/Categorical] | [Normalization, etc.] | [High/Med/Low] |
| [Feature 2] | [Source] | [Numeric/Categorical] | [Normalization, etc.] | [High/Med/Low] |`,
      learnContentId: 'data-tracking',
    },
    {
      id: 'success-metrics',
      title: 'Success Metrics',
      description: 'Model metrics (offline/online) and product impact metrics',
      fieldType: 'table',
      required: true,
      helpText: 'Both offline (model) and online (product) metrics - they may differ',
      learnContentId: 'success-metrics',
      tableSchema: {
        columns: ['Metric Type', 'Metric Name', 'Definition', 'Baseline', 'Target', 'Timeline', 'Owner', 'Current'],
        rows: [
          ['Model (Offline)', 'Precision@K', 'Precision at K recommendations', '', '>0.7', 'Pre-launch', '', ''],
          ['Model (Offline)', 'NDCG', 'Normalized Discounted Cumulative Gain', '', '>0.8', 'Pre-launch', '', ''],
          ['Model (Online)', 'CTR', 'Click-through rate on recommendations', '', '+15%', '2 weeks', '', ''],
          ['Model (Online)', 'Conversion Rate', 'Clicks to conversion %', '', '+10%', '4 weeks', '', ''],
          ['Product Impact', 'User Engagement', 'Time spent, pages viewed', '', '+20%', '4 weeks', '', ''],
          ['Product Impact', 'Revenue per User', 'Average revenue per user', '', '+10%', 'Quarter', '', ''],
          ['User Experience', 'Satisfaction Score', 'User rating of recommendations', '', '>4.0/5', '4 weeks', '', ''],
          ['User Experience', 'Negative Feedback Rate', 'Thumbs down, hides, reports', '', '<5%', 'Ongoing', '', ''],
          ['System', 'Inference Latency', 'p99 prediction time', '', '<100ms', 'Ongoing', '', ''],
          ['System', 'Model Coverage', '% requests with valid prediction', '', '>99%', 'Ongoing', '', ''],
        ]
      }
    },
    {
      id: 'okrs',
      title: 'OKRs (Objectives & Key Results)',
      description: 'Quarterly objectives with measurable ML key results',
      fieldType: 'table',
      required: true,
      helpText: 'Align on outcomes, not model metrics alone',
      learnContentId: 'okrs',
      tableSchema: {
        columns: ['Objective', 'Key Result', 'Baseline', 'Target', 'Progress', 'Owner'],
        rows: [
          ['Launch ML-powered [Feature]', 'Complete shadow mode with no P0 issues', 'N/A', 'Complete', '', ''],
          ['Improve user experience', 'Increase CTR on recommendations from X% to Y%', 'X%', 'Y%', '', ''],
          ['Maintain model quality', 'Keep precision above X% in production', 'N/A', '>X%', '', ''],
          ['Ensure responsible AI', 'Complete bias audit with no critical findings', 'N/A', 'Complete', '', ''],
        ]
      }
    },
    {
      id: 'solution-overview',
      title: 'Solution Overview',
      description: 'High-level ML architecture and integration with product',
      fieldType: 'markdown',
      required: true,
      helpText: `**Solution Summary:**
[2-3 paragraph description of the ML solution and how it integrates with the product]

**ML Architecture Diagram:**
\`\`\`
[User Request] → [Feature Extraction] → [Model Inference] → [Post-processing] → [Response]
                      ↓                      ↓                    ↓
                [Feature Store]        [Model Server]      [Business Rules]
                      ↓                      ↓                    ↓
                [Real-time + Batch]   [A/B Test Routing]   [Fallback Logic]
\`\`\`

**System Components:**
| Component | Purpose | Owner | SLA | Scaling Strategy |
|-----------|---------|-------|-----|------------------|
| [Feature Service] | Real-time feature computation | [Team] | 99.9% | Auto-scale |
| [Model Server] | Model inference | [ML Team] | 99.9% | GPU scaling |
| [Model Registry] | Model versioning | [ML Team] | 99.9% | N/A |
| [Training Pipeline] | Model retraining | [ML Team] | N/A | Scheduled |
| [Monitoring] | Model drift, performance | [ML Team] | 99.9% | Real-time |

**Key ML Decisions:**
| Decision | Option A | Option B | Chosen | Rationale |
|----------|----------|----------|--------|-----------|
| [Model architecture] | [Pros/Cons] | [Pros/Cons] | [A/B] | [Accuracy, latency, cost] |
| [Training approach] | [Pros/Cons] | [Pros/Cons] | [A/B] | [Data availability, quality] |
| [Deployment strategy] | [Pros/Cons] | [Pros/Cons] | [A/B] | [Risk tolerance, rollback] |

**Dependencies:**
- [ ] [Team] - [Feature/data pipeline] - Due: [Date]
- [ ] [Team] - [Model training infrastructure] - Due: [Date]
- [ ] [Team] - [Monitoring infrastructure] - Due: [Date]`,
      learnContentId: 'solution-design',
    },
    {
      id: 'evaluations',
      title: 'Evaluation Strategy',
      description: 'Offline and online evaluation approach',
      fieldType: 'table',
      required: true,
      helpText: 'Offline evaluation first, then online validation',
      learnContentId: 'success-metrics',
      tableSchema: {
        columns: ['Eval Type', 'Metric', 'Baseline Model', 'Target Model', 'Method', 'Success Criteria', 'Owner'],
        rows: [
          ['Offline (Test Set)', 'Precision@K', '', '', 'Holdout evaluation', 'Precision >0.7', ''],
          ['Offline (Test Set)', 'NDCG', '', '', 'Holdout evaluation', 'NDCG >0.8', ''],
          ['Offline (A/B)', 'Model A vs Model B', '', '', 'Backtesting', 'Statistically significant improvement', ''],
          ['Shadow Mode', 'Production metrics', 'N/A', '', 'Log predictions, compare to actuals', 'No degradation', ''],
          ['Online (A/B Test)', 'CTR, Conversion', 'Control', 'Treatment', 'Randomized experiment', 'p<0.05, lift >X%', ''],
          ['Human Review', 'Quality assessment', '', '', 'Expert evaluation', '>80% acceptable', ''],
        ]
      }
    },
    {
      id: 'evaluation-detail',
      title: 'Evaluation Detail',
      description: 'Detailed evaluation methodology and statistical rigor',
      fieldType: 'markdown',
      required: true,
      helpText: `**Offline Evaluation:**

| Aspect | Approach |
|--------|----------|
| Test Set Size | [X examples, power analysis] |
| Cross-Validation | [K-fold, time-based split] |
| Statistical Test | [T-test, bootstrap] |
| Significance Level | p < 0.05 |
| Confidence Intervals | 95% CI |

**Error Analysis:**
| Error Type | Frequency | Root Cause | Mitigation |
|------------|-----------|------------|------------|
| [False Positive] | [X%] | [Cause] | [Fix] |
| [False Negative] | [X%] | [Cause] | [Fix] |
| [Edge Case] | [X%] | [Cause] | [Fix] |

**Slice Analysis:**
Evaluate performance across user segments:
| Segment | Metric | Performance | Gap vs Overall | Action |
|---------|--------|-------------|----------------|--------|
| [Segment 1] | [Metric] | [Value] | [+/-X%] | [Monitor/Improve] |
| [Segment 2] | [Metric] | [Value] | [+/-X%] | [Monitor/Improve] |

**A/B Test Design:**
- Population: [User segment]
- Randomization unit: [User/Session]
- Sample size: [X users per variant]
- Duration: [X weeks for statistical power]
- Success metric: [Primary metric]
- Guardrail metrics: [Metrics to monitor for negative impact]`,
      learnContentId: 'success-metrics',
    },
    {
      id: 'ethical-ai',
      title: 'Ethical AI Assessment',
      description: 'Fairness, bias, transparency, and responsible AI evaluation',
      fieldType: 'table',
      required: true,
      helpText: 'Critical for responsible AI - complete before any deployment',
      learnContentId: 'risk-management',
      tableSchema: {
        columns: ['Concern', 'Risk Level', 'Assessment', 'Mitigation', 'Residual Risk', 'Owner', 'Status'],
        rows: [
          ['Bias/Fairness', 'High/Med/Low', '[Bias audit results]', '[Fairness constraints, reweighting]', '', '', ''],
          ['Transparency/Explainability', 'High/Med/Low', '[Explainability approach]', '[SHAP, LIME, feature importance]', '', '', ''],
          ['Privacy', 'High/Med/Low', '[PII handling]', '[Differential privacy, federated learning]', '', '', ''],
          ['Misuse Potential', 'High/Med/Low', '[Dual-use assessment]', '[Usage restrictions, monitoring]', '', '', ''],
          ['Human Oversight', 'High/Med/Low', '[Human-in-loop design]', '[Appeal process, human override]', '', '', ''],
          ['Accountability', 'High/Med/Low', '[Decision audit trail]', '[Logging, model cards, documentation]', '', '', ''],
        ]
      }
    },
    {
      id: 'bias-assessment',
      title: 'Bias & Fairness Assessment',
      description: 'Detailed fairness evaluation across protected attributes',
      fieldType: 'markdown',
      required: true,
      helpText: `**Protected Attributes Analyzed:**
| Attribute | Categories | Data Availability | Performance Gap |
|-----------|------------|-------------------|-----------------|
| Gender | [Male/Female/Other] | [X% coverage] | [Gap in metric] |
| Age | [Age groups] | [X% coverage] | [Gap in metric] |
| Race/Ethnicity | [Categories] | [X% coverage] | [Gap in metric] |
| Geography | [Regions] | [X% coverage] | [Gap in metric] |

**Fairness Metrics:**
| Metric | Definition | Threshold | Result | Pass/Fail |
|--------|------------|-----------|--------|-----------|
| Demographic Parity | Equal positive rates | <5% gap | [X%] | [Pass/Fail] |
| Equalized Odds | Equal TPR/FPR | <5% gap | [X%] | [Pass/Fail] |
| Predictive Parity | Equal PPV | <5% gap | [X%] | [Pass/Fail] |

**Mitigation Strategies Applied:**
- [ ] Pre-processing (reweighting, resampling)
- [ ] In-processing (fairness constraints)
- [ ] Post-processing (threshold adjustment)
- [ ] Feature removal (proxy variables)
- [ ] Adversarial debiasing

**Ongoing Monitoring:**
- [ ] Fairness metrics tracked in production
- [ ] Regular bias audits scheduled (quarterly)
- [ ] User feedback mechanism for bias reports
- [ ] Escalation process for fairness issues`,
      learnContentId: 'risk-management',
    },
    {
      id: 'functional-requirements',
      title: 'Functional Requirements',
      description: 'ML feature requirements with fallback behavior',
      fieldType: 'table',
      required: true,
      helpText: 'Include fallback behavior for when ML fails',
      learnContentId: 'requirements-writing',
      tableSchema: {
        columns: ['Req ID', 'Requirement Description', 'Priority', 'ML Confidence', 'Fallback Behavior', 'User Story Ref', 'Notes'],
        rows: [
          ['FR-001', 'System shall display ML recommendations with confidence score', 'P0', 'High', 'Show generic recommendations if confidence <threshold', '', ''],
          ['FR-002', 'System shall provide explanation for ML predictions', 'P0', 'High', 'Show simple explanation, hide technical details', '', 'User trust'],
          ['FR-003', 'System shall allow users to provide feedback on predictions', 'P0', 'Medium', 'Thumbs up/down, report issue', '', 'Feedback loop'],
          ['FR-004', 'System shall gracefully degrade when model unavailable', 'P0', 'High', 'Use rules-based fallback, log incident', '', 'Reliability'],
          ['FR-005', 'System shall respect user opt-out of ML features', 'P0', 'High', 'Use non-personalized experience', '', 'User choice'],
        ]
      }
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'ML-specific risks including drift, bias, and failures',
      fieldType: 'table',
      required: true,
      helpText: 'Consider model drift, bias amplification, and ML failures',
      learnContentId: 'risk-management',
      tableSchema: {
        columns: ['Risk ID', 'Risk Description', 'Category', 'Severity (1-5)', 'Likelihood (1-5)', 'User Impact', 'Mitigation Strategy', 'Owner'],
        rows: [
          ['RISK-001', 'Model drift causing degraded predictions', 'ML', '4', '3', 'Poor user experience', 'Continuous monitoring, automatic retraining', ''],
          ['RISK-002', 'Biased predictions harming protected groups', 'Ethics', '5', '2', 'Discrimination, legal risk', 'Bias audits, fairness constraints', ''],
          ['RISK-003', 'Model fails on edge cases', 'ML', '3', '3', 'User frustration', 'Fallback to rules, human review', ''],
          ['RISK-004', 'Data pipeline failure', 'Infrastructure', '4', '3', 'No predictions available', 'Monitoring, alerts, fallback', ''],
          ['RISK-005', 'Adversarial attack on model', 'Security', '4', '2', 'Manipulated predictions', 'Input validation, anomaly detection', ''],
          ['RISK-006', 'Privacy violation via model', 'Privacy', '5', '2', 'Data exposure, legal risk', 'Differential privacy, access controls', ''],
          ['RISK-007', 'Model makes harmful recommendation', 'Safety', '5', '2', 'User harm, reputational damage', 'Content filters, human review', ''],
        ]
      }
    },
    {
      id: 'monitoring',
      title: 'Monitoring & Observability',
      description: 'Model drift, prediction quality, and system health monitoring',
      fieldType: 'table',
      required: true,
      helpText: 'ML models need continuous monitoring - they degrade over time',
      learnContentId: 'post-launch',
      tableSchema: {
        columns: ['Metric', 'Category', 'Alert Threshold', 'Frequency', 'Owner', 'Response', 'Dashboard'],
        rows: [
          ['Model Drift (PSI)', 'ML Quality', 'PSI >0.2', 'Daily', 'ML Team', 'Investigate, retrain if needed', ''],
          ['Prediction Distribution', 'ML Quality', 'Significant shift', 'Daily', 'ML Team', 'Analyze, adjust', ''],
          ['Accuracy Degradation', 'ML Quality', '>-5% from baseline', 'Weekly', 'ML Team', 'Retrain model', ''],
          ['Latency (p99)', 'System', '>200ms', 'Real-time', 'Engineering', 'Scale infrastructure', ''],
          ['Error Rate', 'System', '>1%', 'Real-time', 'Engineering', 'Investigate, fix', ''],
          ['Data Quality', 'Data', 'Missing features >5%', 'Daily', 'Data Team', 'Fix pipeline', ''],
          ['Feature Drift', 'Data', 'Significant distribution shift', 'Daily', 'ML Team', 'Investigate data sources', ''],
        ]
      }
    },
    {
      id: 'monitoring-detail',
      title: 'Monitoring Detail',
      description: 'Detailed monitoring setup for ML systems',
      fieldType: 'markdown',
      required: true,
      helpText: `**Model Quality Monitoring:**

| Metric | Baseline | Warning | Critical | Action |
|--------|----------|---------|----------|--------|
| Precision | [X%] | -10% | -20% | Investigate, retrain |
| Recall | [X%] | -10% | -20% | Investigate, retrain |
| Coverage | [X%] | <95% | <90% | Fix feature pipeline |
| Calibration | [Score] | Deviation >5% | Deviation >10% | Recalibrate |

**Data Quality Monitoring:**
| Check | Threshold | Alert | Owner |
|-------|-----------|-------|-------|
| Missing values | <5% | >5% missing | Data Team |
| Feature range | Within expected | Out of range | Data Team |
| Schema changes | None detected | Schema mismatch | Data Team |
| Freshness | <1 hour old | >1 hour stale | Data Team |

**Drift Detection:**
- Population Stability Index (PSI) for feature distributions
- Kolmogorov-Smirnov test for continuous features
- Chi-square test for categorical features
- Prediction distribution monitoring

**Dashboards:**
| Dashboard | Purpose | Owner | Link |
|-----------|---------|-------|------|
| Model Performance | Accuracy, precision, recall over time | ML Team | [Link] |
| Data Quality | Feature health, freshness | Data Team | [Link] |
| System Health | Latency, throughput, errors | Engineering | [Link] |
| Business Impact | CTR, conversion, revenue | Product | [Link] |`,
      learnContentId: 'post-launch',
    },
    {
      id: 'rollout-plan',
      title: 'ML Rollout Plan',
      description: 'Shadow mode to beta to GA - careful validation at each stage',
      fieldType: 'table',
      required: true,
      helpText: 'Shadow mode first - never deploy untested ML directly to users',
      learnContentId: 'rollout-strategy',
      tableSchema: {
        columns: ['Phase', 'Mode', '% Traffic', 'Duration', 'Success Criteria', 'Go/No-Go Owner', 'Risk Level'],
        rows: [
          ['Shadow', 'Predictions logged, not shown', '100%', '1-2 weeks', 'No major issues, metrics beat baseline', 'ML Lead', 'Low'],
          ['Internal', 'Shown to employees only', '100% internal', '1 week', 'Positive feedback, no bugs', 'Product Lead', 'Low'],
          ['Beta', 'Shown to users', '5%', '2 weeks', 'Metrics beat baseline, no negative feedback', 'Product Lead', 'Medium'],
          ['Expanded', 'Gradual increase', '25% → 50%', '2 weeks each', 'Drift within bounds, metrics stable', 'ML Lead', 'Medium'],
          ['GA', 'Full rollout', '100%', 'Ongoing', 'All metrics green, business impact proven', 'Executive Sponsor', 'Low'],
        ]
      }
    },
    {
      id: 'rollout-checklist',
      title: 'ML Rollout Readiness Checklist',
      description: 'Pre-deployment verification for ML models',
      fieldType: 'markdown',
      required: true,
      helpText: `**Model Readiness:**
- [ ] Offline evaluation complete, metrics meet threshold
- [ ] Error analysis complete, edge cases handled
- [ ] Bias/fairness audit complete, mitigations applied
- [ ] Model card documented
- [ ] Version control and rollback capability verified

**Infrastructure Readiness:**
- [ ] Model serving infrastructure load tested
- [ ] Latency SLA verified (p50, p99)
- [ ] Auto-scaling configured
- [ ] Fallback mechanism tested
- [ ] Monitoring and alerting configured

**Process Readiness:**
- [ ] On-call rotation scheduled
- [ ] Runbook documented
- [ ] Escalation procedures defined
- [ ] Retraining pipeline tested
- [ ] Incident response plan documented

**Stakeholder Readiness:**
- [ ] Product team trained
- [ ] Customer support briefed
- [ ] Legal/privacy review complete
- [ ] Ethics review complete
- [ ] Executive approval obtained`,
      learnContentId: 'rollout-strategy',
    },
    {
      id: 'timeline-resourcing',
      title: 'Timeline & Resourcing',
      description: 'Project milestones accounting for ML iteration cycles',
      fieldType: 'table',
      required: true,
      helpText: 'ML iterations take time - plan for multiple training cycles',
      learnContentId: 'estimation',
      tableSchema: {
        columns: ['Milestone', 'Target Date', 'Duration', 'Dependencies', 'Owner', 'Status', 'Notes'],
        rows: [
          ['PRD Approved', '', '1 week', 'None', 'Product', '', ''],
          ['Data Collection Complete', '', '2-4 weeks', 'Data access', 'Data Team', '', 'Critical path'],
          ['Model Training v1', '', '2-4 weeks', 'Data complete', 'ML Team', '', 'First iteration'],
          ['Model Iteration', '', '2-3 weeks', 'v1 evaluation', 'ML Team', '', 'Multiple cycles expected'],
          ['Offline Eval Complete', '', '1 week', 'Model frozen', 'ML Team', '', ''],
          ['Ethics Review', '', '2 weeks', 'Model card', 'Ethics Lead', '', 'Required'],
          ['Shadow Mode Complete', '', '2 weeks', 'Infra ready', 'ML Team', '', ''],
          ['Beta Launch', '', '2 weeks', 'Shadow success', 'Product', '', ''],
          ['GA Launch', '', '1 week', 'Beta success', 'Product', '', ''],
        ]
      }
    },
    {
      id: 'team-structure',
      title: 'Team Structure & Roles',
      description: 'ML-specific roles and responsibilities',
      fieldType: 'table',
      required: true,
      helpText: 'Clear ownership for ML-specific functions',
      learnContentId: 'stakeholder-management',
      tableSchema: {
        columns: ['Role', 'Name', 'Responsibility', 'Department', 'Time Allocation'],
        rows: [
          ['Product Lead', '', 'Product strategy, user requirements', 'Product', '50%'],
          ['ML Lead', '', 'Model architecture, training, evaluation', 'ML/AI', '75%'],
          ['Data Engineer', '', 'Data pipelines, feature engineering', 'Data', '75%'],
          ['ML Engineer', '', 'Model deployment, serving, monitoring', 'ML/AI', '75%'],
          ['Engineering Lead', '', 'Integration, infrastructure', 'Engineering', '50%'],
          ['Data Scientist', '', 'Analysis, experimentation', 'Analytics', '50%'],
          ['Ethics/Responsible AI', '', 'Fairness, bias, ethics review', 'Legal/Ethics', '25%'],
        ]
      }
    },
    {
      id: 'post-launch-plan',
      title: 'Post-Launch Plan',
      description: 'Continuous monitoring, retraining, and iteration',
      fieldType: 'table',
      required: true,
      helpText: 'ML models require continuous monitoring and periodic retraining',
      learnContentId: 'post-launch',
      tableSchema: {
        columns: ['Activity', 'Timeline', 'Owner', 'Alert Threshold', 'Response', 'Notes'],
        rows: [
          ['Model drift monitoring', 'Daily', 'ML Team', 'PSI >0.2', 'Investigate, schedule retrain', 'Automated alert'],
          ['Prediction quality review', 'Weekly', 'ML Team', 'Accuracy drop >5%', 'Root cause analysis', ''],
          ['Retraining', 'Monthly/Quarterly', 'ML Team', 'Scheduled', 'Deploy new version', 'Or trigger-based'],
          ['Bias audit', 'Quarterly', 'Ethics Lead', 'Fairness gap >5%', 'Mitigation required', ''],
          ['Day 1 check', 'Day 1', 'Product', 'No P0 issues', 'Go/No-Go decision', ''],
          ['Week 1 review', 'Week 1', 'ML Lead', 'Metrics stable', 'Continue launch', ''],
          ['Month 1 impact', 'Month 1', 'Product', 'Hit targets', 'Scale/expand', 'Executive review'],
        ]
      }
    },
    {
      id: 'retraining-strategy',
      title: 'Retraining Strategy',
      description: 'When and how to retrain the model',
      fieldType: 'markdown',
      required: true,
      helpText: `**Retraining Triggers:**
| Trigger | Threshold | Action |
|---------|-----------|--------|
| Scheduled | Monthly/Quarterly | Automatic retraining |
| Performance degradation | Accuracy drop >5% | Investigate, retrain if needed |
| Data drift | PSI >0.2 | Investigate, retrain if needed |
| New data available | X new examples | Consider retraining |
| Feature changes | New features added | Retrain with new features |

**Retraining Pipeline:**
1. Data collection and validation
2. Feature computation
3. Model training (with hyperparameter tuning)
4. Offline evaluation
5. Model comparison with current production
6. Deployment if improvement confirmed

**Model Versioning:**
| Version | Date | Key Changes | Performance | Status |
|---------|------|-------------|-------------|--------|
| v1.0 | [Date] | Initial release | [Metrics] | Production |
| v1.1 | [Date] | [Changes] | [Metrics] | Staged |

**Rollback Plan:**
- [ ] Previous model version kept available
- [ ] Rollback triggered by: [Criteria]
- [ ] Rollback time target: <5 minutes
- [ ] Rollback tested: [Date]`,
      learnContentId: 'post-launch',
    },
    {
      id: 'appendices',
      title: 'Appendices',
      description: 'Supporting ML documentation and references',
      fieldType: 'markdown',
      required: false,
      helpText: `**Appendix A: Technical Glossary**
| Term | Definition |
|------|------------|
| [ML term] | [Definition] |
| [Metric] | [Definition] |

**Appendix B: Model Documentation**
- Model card: [Link]
- Architecture diagram: [Link]
- Training pipeline: [Link]
- Feature documentation: [Link]

**Appendix C: Evaluation Reports**
- Offline evaluation report: [Link]
- A/B test results: [Link]
- Bias audit report: [Link]

**Appendix D: Operational Runbooks**
- Model deployment runbook: [Link]
- Incident response: [Link]
- Retraining procedure: [Link]

**Appendix E: Research & References**
- Academic papers: [Links]
- Benchmark results: [Link]
- Competitive analysis: [Link]`,
      learnContentId: 'documentation',
    },
  ],
};
