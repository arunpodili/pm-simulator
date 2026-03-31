import { Template } from '@/types';

export const criticalThinkingTemplate: Template = {
  id: 'framework-critical-thinking',
  name: 'Critical Thinking & Analysis Decision Framework',
  description: 'Comprehensive framework for critical thinking and analytical decisions covering mental models, analytical skills, decision frameworks, and data analysis',
  industryId: 'saas',
  scenarioId: 'product-strategy',
  frameworkIds: ['rice', 'okrs'],
  outputFormat: 'markdown',
  estimatedCompletionTime: '2-3 hours',
  version: '1.0.0',
  sections: [
    {
      id: 'decision-context',
      title: 'Decision Context',
      description: 'Define the decision or problem you are analyzing',
      fieldType: 'table',
      required: true,
      helpText: 'Set the stage for your critical thinking exercise',
      learnContentId: 'decision-context',
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Decision/Problem', ''],
          ['Date', ''],
          ['Product', ''],
          ['Who Is Deciding', ''],
          ['Decision Deadline', ''],
          ['Decision Stakes', 'Low / Medium / High / Critical'],
        ]
      }
    },
    {
      id: 'opportunity-cost-analysis',
      title: 'Opportunity Cost Analysis',
      description: 'Analyze what you are giving up by making this decision',
      fieldType: 'table',
      required: true,
      helpText: 'Every decision has an opportunity cost - make it explicit',
      learnContentId: 'opportunity-cost',
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What are we proposing to do?', ''],
          ['What are we explicitly NOT doing? (List 3)', '1. \n2. \n3.'],
          ['What is the value of the best forgone alternative?', ''],
          ['What is the cost of delay for each alternative?', ''],
          ['Is this the highest-value use of our resources?', 'Yes / No / Why?'],
        ]
      }
    },
    {
      id: 'opportunity-cost-matrix',
      title: 'Opportunity Cost Matrix',
      description: 'Compare initiatives by value and urgency',
      fieldType: 'table',
      required: true,
      helpText: 'Score each initiative to see the true opportunity cost',
      learnContentId: 'prioritization',
      tableSchema: {
        columns: ['Initiative', 'Value (1-10)', 'Urgency (1-10)', 'Combined Score', 'Rank'],
        rows: [
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
        ]
      }
    },
    {
      id: 'sunk-cost-fallacy-check',
      title: 'Sunk Cost Fallacy Check',
      description: 'Ensure you are not continuing due to past investments',
      fieldType: 'table',
      required: true,
      helpText: 'Past investments should not drive future decisions',
      learnContentId: 'sunk-cost',
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What have we already invested?', 'Time: \nMoney: \nReputation:'],
          ['Is that investment recoverable?', 'Yes / No / Partially'],
          ['If we had not started this, would we start today?', 'Yes / No'],
          ['What is keeping us from stopping?', ''],
          ['What evidence suggests continuing is the right choice?', ''],
          ['What would we advise another team to do?', ''],
        ]
      }
    },
    {
      id: 'sunk-cost-decision-tree',
      title: 'Sunk Cost Decision Tree',
      description: 'Work through the decision tree for continuing or stopping',
      fieldType: 'table',
      required: true,
      helpText: 'Follow the logic: validation first, then opportunity validity',
      learnContentId: 'decision-trees',
      tableSchema: {
        columns: ['Validation Status', 'Valid', 'Not Valid', 'Unknown'],
        rows: [
          ['User demand', '', '', ''],
          ['Technical feasibility', '', '', ''],
          ['Business viability', '', '', ''],
          ['Decision', '', '', ''],
        ]
      }
    },
    {
      id: 'second-order-thinking-first',
      title: 'Second-Order Thinking: First-Order Effects',
      description: 'Map immediate effects (0-2 weeks)',
      fieldType: 'table',
      required: true,
      helpText: 'Every decision has ripple effects - start with immediate impacts',
      learnContentId: 'second-order-thinking',
      tableSchema: {
        columns: ['Effect', 'Stakeholder Affected', 'Positive/Negative', 'Magnitude (1-10)'],
        rows: [
          ['', '', '+ / -', ''],
          ['', '', '+ / -', ''],
          ['', '', '+ / -', ''],
        ]
      }
    },
    {
      id: 'second-order-thinking-second',
      title: 'Second-Order Thinking: Second-Order Effects',
      description: 'Map medium-term effects (1-4 weeks)',
      fieldType: 'table',
      required: true,
      helpText: 'These are often more important than first-order effects',
      learnContentId: 'second-order-thinking',
      tableSchema: {
        columns: ['Effect', 'Stakeholder Affected', 'Positive/Negative', 'Magnitude (1-10)'],
        rows: [
          ['', '', '+ / -', ''],
          ['', '', '+ / -', ''],
          ['', '', '+ / -', ''],
        ]
      }
    },
    {
      id: 'second-order-thinking-third',
      title: 'Second-Order Thinking: Third-Order Effects',
      description: 'Map long-term effects (1-3 months)',
      fieldType: 'table',
      required: true,
      helpText: 'Consider the compounding impacts',
      learnContentId: 'second-order-thinking',
      tableSchema: {
        columns: ['Effect', 'Stakeholder Affected', 'Positive/Negative', 'Magnitude (1-10)'],
        rows: [
          ['', '', '+ / -', ''],
          ['', '', '+ / -', ''],
          ['', '', '+ / -', ''],
        ]
      }
    },
    {
      id: 'second-order-thinking-fourth',
      title: 'Second-Order Thinking: Fourth-Order Effects',
      description: 'Map very long-term effects (6+ months)',
      fieldType: 'table',
      required: true,
      helpText: 'Strategic decisions have effects that compound over time',
      learnContentId: 'second-order-thinking',
      tableSchema: {
        columns: ['Effect', 'Stakeholder Affected', 'Positive/Negative', 'Magnitude (1-10)'],
        rows: [
          ['', '', '+ / -', ''],
          ['', '', '+ / -', ''],
          ['', '', '+ / -', ''],
        ]
      }
    },
    {
      id: 'second-order-summary',
      title: 'Second-Order Effects Summary',
      description: 'Summarize the net impact at each order',
      fieldType: 'table',
      required: true,
      helpText: 'Synthesize your second-order thinking',
      learnContentId: 'second-order-thinking',
      tableSchema: {
        columns: ['Order', 'Net Impact', 'Key Risk', 'Key Opportunity'],
        rows: [
          ['First', 'Positive / Negative / Neutral', '', ''],
          ['Second', 'Positive / Negative / Neutral', '', ''],
          ['Third', 'Positive / Negative / Neutral', '', ''],
          ['Fourth', 'Positive / Negative / Neutral', '', ''],
        ]
      }
    },
    {
      id: 'pre-mortem',
      title: 'Pre-Mortem / Inversion',
      description: 'Imagine the decision has failed - write the post-mortem',
      fieldType: 'markdown',
      required: true,
      helpText: `**Headline (6 months from now):**
[Write the headline of the failure post-mortem]

**Failure Scenario 1:**
| Field | Input |
|-------|-------|
| What happened | |
| Root cause | |
| Probability | Low / Medium / High |
| Prevention | |
| Early Warning Signal | |

**Failure Scenario 2:**
| Field | Input |
|-------|-------|
| What happened | |
| Root cause | |
| Probability | Low / Medium / High |
| Prevention | |
| Early Warning Signal | |

**Failure Scenario 3:**
| Field | Input |
|-------|-------|
| What happened | |
| Root cause | |
| Probability | Low / Medium / High |
| Prevention | |
| Early Warning Signal | |`,
      learnContentId: 'pre-mortem',
    },
    {
      id: 'inversion-success',
      title: 'Inversion: Success Conditions',
      description: 'What must be true for this to succeed?',
      fieldType: 'table',
      required: true,
      helpText: 'Flip the pre-mortem - what conditions enable success?',
      learnContentId: 'inversion',
      tableSchema: {
        columns: ['Condition', 'Must Be True', 'Nice to Have', 'Already True'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
        ]
      }
    },
    {
      id: 'pareto-analysis',
      title: 'Pareto Principle (80/20 Analysis)',
      description: 'Identify the 20% that drives 80% of value',
      fieldType: 'table',
      required: true,
      helpText: 'Focus on the vital few, not the trivial many',
      learnContentId: 'pareto',
      tableSchema: {
        columns: ['Feature/Effort', '% of Effort', '% of Value', 'Efficiency Ratio'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['**Total**', '100%', '100%', ''],
        ]
      }
    },
    {
      id: 'pareto-insights',
      title: '80/20 Insights',
      description: 'Extract actionable insights from Pareto analysis',
      fieldType: 'table',
      required: true,
      helpText: 'Turn analysis into action',
      learnContentId: 'pareto',
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What 20% of features drive 80% of value?', ''],
          ['What 20% of customers drive 80% of revenue?', ''],
          ['What 20% of bugs cause 80% of support tickets?', ''],
          ['What should we STOP doing? (Bottom 20% value)', ''],
          ['What should we DOUBLE DOWN on? (Top 20% value)', ''],
        ]
      }
    },
    {
      id: 'base-rate-check',
      title: 'Base Rate Check',
      description: 'Check your assumptions against industry baselines',
      fieldType: 'table',
      required: true,
      helpText: 'Avoid inside view bias - check the base rates',
      learnContentId: 'base-rates',
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What are we trying to achieve?', ''],
          ['What is the industry average success rate?', ''],
          ['What is our historical success rate?', ''],
          ['What is the base rate for similar initiatives?', ''],
          ['Why do we expect to beat the base rate?', ''],
          ['What is unique about our situation?', ''],
          ['What is our plan if we match (not beat) the base rate?', ''],
        ]
      }
    },
    {
      id: 'cohort-analysis',
      title: 'Cohort Analysis Framework',
      description: 'Define and analyze user cohorts',
      fieldType: 'table',
      required: false,
      helpText: 'Understand how different user groups behave over time',
      learnContentId: 'cohort-analysis',
      tableSchema: {
        columns: ['Cohort', 'Size', 'Day 1', 'Day 7', 'Day 14', 'Day 30', 'Day 60', 'Day 90'],
        rows: [
          ['Week 1', '', '%', '%', '%', '%', '%', '%'],
          ['Week 2', '', '%', '%', '%', '%', '%', '%'],
          ['Week 3', '', '%', '%', '%', '%', '%', '%'],
          ['Week 4', '', '%', '%', '%', '%', '%', '%'],
        ]
      }
    },
    {
      id: 'funnel-analysis',
      title: 'Funnel Analysis Framework',
      description: 'Map and analyze your conversion funnel',
      fieldType: 'table',
      required: false,
      helpText: 'Identify where users drop off in your funnel',
      learnContentId: 'funnel-analysis',
      tableSchema: {
        columns: ['Step', 'Action', 'Users', 'Conversion Rate', 'Drop-off Rate'],
        rows: [
          ['1', '', '', '100%', '-'],
          ['2', '', '', '%', '%'],
          ['3', '', '', '%', '%'],
          ['4', '', '', '%', '%'],
          ['5', '', '', '%', '%'],
        ]
      }
    },
    {
      id: 'funnel-insights',
      title: 'Funnel Insights',
      description: 'Extract insights from funnel analysis',
      fieldType: 'table',
      required: false,
      helpText: 'Turn funnel data into hypotheses',
      learnContentId: 'funnel-analysis',
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['Where is the biggest drop-off?', 'Step ___ (___%)'],
          ['Is this drop-off expected or concerning?', ''],
          ['What is the industry benchmark for this step?', ''],
          ['What hypotheses explain the drop-off?', '1. \n2. \n3.'],
          ['What experiments could improve this step?', ''],
        ]
      }
    },
    {
      id: 'market-sizing',
      title: 'Market Sizing (TAM/SAM/SOM)',
      description: 'Size your market opportunity',
      fieldType: 'table',
      required: false,
      helpText: 'Understand the total opportunity',
      learnContentId: 'market-sizing',
      tableSchema: {
        columns: ['Metric', 'Definition', 'Your Market'],
        rows: [
          ['TAM (Total Addressable Market)', 'Everyone who could theoretically use your product', '$___B / ___M users'],
          ['SAM (Serviceable Addressable Market)', 'Who you can realistically reach', '$___B / ___M users'],
          ['SOM (Serviceable Obtainable Market)', 'Who you can capture in 3-5 years', '$___M / ___K users'],
        ]
      }
    },
    {
      id: 'unit-economics',
      title: 'Unit Economics Framework',
      description: 'Analyze your unit economics and LTV:CAC',
      fieldType: 'table',
      required: false,
      helpText: 'Ensure your business model works at the unit level',
      learnContentId: 'unit-economics',
      tableSchema: {
        columns: ['Metric', 'Formula', 'Value'],
        rows: [
          ['ARPU', 'Total Revenue / Total Users', '$___/month'],
          ['ARPPU', 'Total Revenue / Paying Users', '$___/month'],
          ['CAC', 'Total Sales & Marketing / New Customers', '$___'],
          ['Payback Period', 'CAC / (ARPU x Gross Margin %)', '___ months'],
          ['Gross Margin %', '(Revenue - COGS) / Revenue', '___%'],
          ['Monthly Churn', 'Customers Lost / Total Customers', '___%'],
          ['Customer Lifetime', '1 / Monthly Churn Rate', '___ months'],
          ['LTV', 'ARPU x Gross Margin % x Customer Lifetime', '$___'],
          ['LTV:CAC Ratio', 'LTV / CAC', '___:1'],
        ]
      }
    },
    {
      id: 'ab-test-design',
      title: 'A/B Test Design Framework',
      description: 'Design a rigorous A/B test',
      fieldType: 'markdown',
      required: false,
      helpText: `**Hypothesis:**
We believe that [change] will cause [outcome] for [segment].

**Test Parameters:**
| Field | Input |
|-------|-------|
| Primary Metric | |
| Guardrail Metrics | (What must NOT decrease) |
| Minimum Detectable Effect | ___% |
| Baseline Conversion Rate | ___% |
| Statistical Significance Level | 95% (standard) |
| Statistical Power | 80% (standard) |
| Sample Size Needed | ___ per variant |
| Expected Duration | ___ days |
| Traffic Allocation | ___% Control / ___% Treatment |`,
      learnContentId: 'experimentation',
    },
    {
      id: 'metric-dictionary',
      title: 'Metric Dictionary',
      description: 'Define your metrics to avoid metric wars',
      fieldType: 'table',
      required: false,
      helpText: 'Ensure everyone agrees on metric definitions',
      learnContentId: 'metrics-definition',
      tableSchema: {
        columns: ['Metric Name', 'Exact Formula', 'Data Source', 'Owner'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
        ]
      }
    },
    {
      id: 'rice-scoring',
      title: 'RICE Scoring',
      description: 'Prioritize initiatives using RICE',
      fieldType: 'table',
      required: false,
      helpText: 'Reach x Impact x Confidence / Effort',
      learnContentId: 'rice',
      tableSchema: {
        columns: ['Initiative', 'Reach (users)', 'Impact (1-5)', 'Confidence (%)', 'Effort (weeks)', 'RICE Score'],
        rows: [
          ['', '', '', '', '', ''],
          ['', '', '', '', '', ''],
          ['', '', '', '', '', ''],
          ['', '', '', '', '', ''],
        ]
      }
    },
    {
      id: 'decision-matrix',
      title: 'Decision Matrix (Eisenhower)',
      description: 'Categorize decisions by urgency and importance',
      fieldType: 'table',
      required: false,
      helpText: 'Focus on what is important, not just urgent',
      learnContentId: 'decision-matrix',
      tableSchema: {
        columns: ['Quadrant', 'Definition', 'Initiatives'],
        rows: [
          ['Q1: Do Now', 'Important + Urgent', ''],
          ['Q2: Schedule', 'Important + Not Urgent', ''],
          ['Q3: Delegate', 'Not Important + Urgent', ''],
          ['Q4: Eliminate', 'Not Important + Not Urgent', ''],
        ]
      }
    },
    {
      id: 'data-quality-check',
      title: 'Data Quality Check',
      description: 'Verify your data is trustworthy',
      fieldType: 'table',
      required: false,
      helpText: 'Bad data leads to bad decisions',
      learnContentId: 'data-quality',
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['Where does this data come from?', ''],
          ['How is it collected?', ''],
          ['What is the margin of error?', ''],
          ['Is the data complete?', 'Yes / No / Partially'],
          ['Are there known data gaps?', ''],
          ['When was the data last validated?', ''],
        ]
      }
    },
    {
      id: 'bias-checklist',
      title: 'Bias Interpretation Checklist',
      description: 'Check for common cognitive biases',
      fieldType: 'table',
      required: false,
      helpText: 'Be aware of biases that may affect your judgment',
      learnContentId: 'cognitive-bias',
      tableSchema: {
        columns: ['Bias', 'Check', 'Am I Falling For This?'],
        rows: [
          ['Confirmation Bias', 'Am I only looking for data that supports my view?', 'Yes / No'],
          ['Selection Bias', 'Is this sample representative?', 'Yes / No'],
          ['Survivorship Bias', 'Am I only looking at successes, not failures?', 'Yes / No'],
          ['Recency Bias', 'Am I over-weighting recent data?', 'Yes / No'],
          ['Correlation vs. Causation', 'Did X cause Y or are they just correlated?', 'Yes / No / Unknown'],
        ]
      }
    },
    {
      id: 'final-recommendation',
      title: 'Final Recommendation',
      description: 'Synthesize your analysis into a recommendation',
      fieldType: 'table',
      required: true,
      helpText: 'Bring it all together',
      learnContentId: 'decision-making',
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Recommended Decision', ''],
          ['Key Mental Models Used', ''],
          ['Data Supporting This', ''],
          ['Biggest Assumption', ''],
          ['Biggest Risk', ''],
          ['Mitigation Plan', ''],
          ['What Would Change My Mind', ''],
        ]
      }
    },
  ],
};
