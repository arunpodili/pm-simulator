// Section 3: Critical Thinking & Analysis Decision Framework

export const criticalThinkingTemplate = {
  id: 'mastery-section-3',
  name: 'Critical Thinking & Analysis Mastery',
  description: 'Master mental models, analytical skills, decision frameworks, and data analysis',
  category: 'mastery' as const,
  estimatedCompletionTime: '60-90 min',
  sections: [
    {
      id: 'decision-context-critical',
      title: '1. Decision Context',
      description: 'Set the context for your critical decision',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Decision/Problem', ''],
          ['Date', ''],
          ['Product', ''],
          ['Who Is Deciding', ''],
          ['Decision Deadline', ''],
          ['Decision Stakes', 'Low / Medium / High / Critical']
        ]
      },
      helpText: 'Understand the stakes before applying mental models.'
    },
    {
      id: 'opportunity-cost-analysis',
      title: '2.1 Opportunity Cost Analysis',
      description: 'What are you giving up by saying yes?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What are we proposing to do?', ''],
          ['What are we explicitly NOT doing? (List 3)', ''],
          ['What\'s the value of the best forgone alternative?', ''],
          ['What\'s the cost of delay for each alternative?', ''],
          ['Is this the highest-value use of our resources?', 'Yes / No / Why?']
        ]
      },
      helpText: 'Every yes is a no to something else.'
    },
    {
      id: 'opportunity-cost-matrix',
      title: '2.2 Opportunity Cost Matrix',
      description: 'Prioritize initiatives by value and urgency',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Initiative', 'Value (1-10)', 'Urgency (1-10)', 'Combined Score', 'Rank'],
        rows: [
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ]
      },
      helpText: 'Score objectively across dimensions.'
    },
    {
      id: 'sunk-cost-check',
      title: '2.3 Sunk Cost Fallacy Check',
      description: 'Are you continuing because of past investment?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What have we already invested?', ''],
          ['Is that investment recoverable?', ''],
          ['If we hadn\'t started this, would we start today?', 'Yes / No'],
          ['What\'s keeping us from stopping?', ''],
          ['What evidence suggests continuing is the right choice?', ''],
          ['What would we advise another team to do?', '']
        ]
      },
      helpText: 'Past investment is gone. Only future value matters.'
    },
    {
      id: 'sunk-cost-decision-tree',
      title: '2.4 Sunk Cost Decision Tree',
      description: 'Follow the decision tree',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Validation Status', 'Valid', 'Not Valid', 'Unknown'],
        rows: [
          ['User demand', '', '', ''],
          ['Technical feasibility', '', '', ''],
          ['Business viability', '', '', ''],
          ['Decision', '', '', '']
        ]
      },
      placeholder: 'Decision Tree:\n1. Have we validated this works?\n   - YES → Is the opportunity still valid?\n   - NO → STOP or PIVOT',
      helpText: 'Use the tree to make objective decisions.'
    },
    {
      id: 'first-order-effects',
      title: '2.5 First-Order Effects',
      description: 'Immediate effects (0-2 weeks)',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Effect', 'Stakeholder Affected', 'Positive/Negative', 'Magnitude (1-10)'],
        rows: [
          ['', '', '+ / -', ''],
          ['', '', '+ / -', ''],
          ['', '', '+ / -', '']
        ]
      },
      helpText: 'What happens immediately?'
    },
    {
      id: 'second-order-effects',
      title: 'Second-Order Effects (1-4 weeks)',
      description: 'Effects that happen because of first-order effects',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Effect', 'Stakeholder Affected', 'Positive/Negative', 'Magnitude (1-10)'],
        rows: [
          ['', '', '+ / -', ''],
          ['', '', '+ / -', ''],
          ['', '', '+ / -', '']
        ]
      },
      helpText: 'Ask: "And then what?"'
    },
    {
      id: 'third-order-effects',
      title: 'Third-Order Effects (1-3 months)',
      description: 'Longer-term cascading effects',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Effect', 'Stakeholder Affected', 'Positive/Negative', 'Magnitude (1-10)'],
        rows: [
          ['', '', '+ / -', ''],
          ['', '', '+ / -', ''],
          ['', '', '+ / -', '']
        ]
      },
      helpText: 'Think further ahead.'
    },
    {
      id: 'fourth-order-effects',
      title: 'Fourth-Order Effects (6+ months)',
      description: 'Long-term systemic effects',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Effect', 'Stakeholder Affected', 'Positive/Negative', 'Magnitude (1-10)'],
        rows: [
          ['', '', '+ / -', ''],
          ['', '', '+ / -', ''],
          ['', '', '+ / -', '']
        ]
      },
      helpText: 'What are the long-term implications?'
    },
    {
      id: 'second-order-summary',
      title: '2.6 Second-Order Summary',
      description: 'Summarize net impact at each order',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Order', 'Net Impact', 'Key Risk', 'Key Opportunity'],
        rows: [
          ['First', 'Positive / Negative / Neutral', '', ''],
          ['Second', 'Positive / Negative / Neutral', '', ''],
          ['Third', 'Positive / Negative / Neutral', '', ''],
          ['Fourth', 'Positive / Negative / Neutral', '', '']
        ]
      },
      helpText: 'Does the net impact change over time?'
    },
    {
      id: 'pre-mortem',
      title: '2.7 Inversion / Pre-Mortem',
      description: 'Write the failure post-mortem before you start',
      fieldType: 'markdown' as const,
      required: true,
      placeholder: 'Headline: [Write the headline of the failure post-mortem]\n\nFailure Scenario 1:\n- What happened:\n- Root cause:\n- Probability: Low / Medium / High\n- Prevention:\n- Early Warning Signal:',
      helpText: 'Imagine failure to prevent it.'
    },
    {
      id: 'inversion-success',
      title: '2.8 Inversion Success Question',
      description: 'What must be true for this to succeed?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Condition', 'Must Be True', 'Nice to Have', 'Already True'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', '']
        ]
      },
      helpText: 'Invert the problem to find requirements.'
    },
    {
      id: 'pareto-analysis',
      title: '2.9 Pareto Principle (80/20)',
      description: 'Find the vital few',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Feature/Effort', '% of Effort', '% of Value', 'Efficiency Ratio'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['Total', '100%', '100%', '']
        ]
      },
      helpText: 'Most value comes from few sources.'
    },
    {
      id: 'pareto-insights',
      title: '80/20 Insights',
      description: 'What does the 80/20 analysis tell you?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What 20% of features drive 80% of value?', ''],
          ['What 20% of customers drive 80% of revenue?', ''],
          ['What 20% of bugs cause 80% of support tickets?', ''],
          ['What 20% of sales reps close 80% of deals?', ''],
          ['What should we STOP doing?', ''],
          ['What should we DOUBLE DOWN on?', '']
        ]
      },
      helpText: 'Cut the bottom 80%, double down on top 20%.'
    },
    {
      id: 'compounding-effects',
      title: '2.10 Compounding Effects Analysis',
      description: 'Small actions that compound over time',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Small Action', 'Frequency', '1 Week', '1 Month', '1 Quarter', '1 Year'],
        rows: [
          ['', 'Daily', '', '', '', ''],
          ['', 'Weekly', '', '', '', ''],
          ['', 'Monthly', '', '', '', '']
        ]
      },
      helpText: 'Think in compounding curves.'
    },
    {
      id: 'base-rate-check',
      title: '2.11 Base Rate Check',
      description: 'What are the industry benchmarks?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What are we trying to achieve?', ''],
          ['What\'s the industry average success rate?', ''],
          ['What\'s our historical success rate?', ''],
          ['What\'s the base rate for similar initiatives?', ''],
          ['Why do we expect to beat the base rate?', ''],
          ['What\'s unique about our situation?', ''],
          ['What\'s our plan if we match (not beat) the base rate?', '']
        ]
      },
      helpText: 'Start with base rates, then adjust.'
    },
    {
      id: 'cohort-definition',
      title: '3.1 Define Your Cohorts',
      description: 'How are you segmenting users?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Cohort Type', 'Definition', 'Time Period'],
        rows: [
          ['', '', '']
        ]
      },
      helpText: 'Cohorts reveal true trends.'
    },
    {
      id: 'cohort-retention',
      title: 'Cohort Retention Table',
      description: 'Track retention by cohort',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Cohort', 'Size', 'Day 1', 'Day 7', 'Day 14', 'Day 30', 'Day 60', 'Day 90'],
        rows: [
          ['Week 1', '', '%', '%', '%', '%', '%', '%'],
          ['Week 2', '', '%', '%', '%', '%', '%', '%'],
          ['Week 3', '', '%', '%', '%', '%', '%', '%'],
          ['Week 4', '', '%', '%', '%', '%', '%', '%'],
          ['Week 5', '', '%', '%', '%', '%', '%', '%'],
          ['Week 6', '', '%', '%', '%', '%', '%', '%']
        ]
      },
      helpText: 'Are cohorts improving or declining?'
    },
    {
      id: 'cohort-interpretation',
      title: 'Cohort Interpretation',
      description: 'What do the cohorts tell you?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['Are cohorts improving or declining over time?', ''],
          ['What product changes happened during this period?', ''],
          ['What external factors might affect cohorts?', ''],
          ['Which cohort is the outlier? Why?', ''],
          ['What does this tell us about product health?', '']
        ]
      },
      helpText: 'Interpret the patterns.'
    },
    {
      id: 'funnel-analysis',
      title: '3.2 Funnel Analysis',
      description: 'Map your user funnel',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Step', 'Action', 'Users', 'Conversion Rate', 'Drop-off Rate'],
        rows: [
          ['1', '', '', '100%', '-'],
          ['2', '', '', '%', '%'],
          ['3', '', '', '%', '%'],
          ['4', '', '', '%', '%'],
          ['5', '', '', '%', '%']
        ]
      },
      helpText: 'Find the biggest drop-off.'
    },
    {
      id: 'funnel-insights',
      title: 'Funnel Insights',
      description: 'What does the funnel tell you?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['Where is the biggest drop-off?', ''],
          ['Is this drop-off expected or concerning?', ''],
          ['What\'s the industry benchmark for this step?', ''],
          ['What hypotheses explain the drop-off?', ''],
          ['What experiments could improve this step?', '']
        ]
      },
      helpText: 'Hypothesize, then test.'
    },
    {
      id: 'market-sizing',
      title: '3.3 Market Sizing (TAM/SAM/SOM)',
      description: 'Size your market opportunity',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Metric', 'Definition', 'Your Market'],
        rows: [
          ['TAM (Total Addressable Market)', 'Everyone who could theoretically use your product', ''],
          ['SAM (Serviceable Addressable Market)', 'Who you can realistically reach', ''],
          ['SOM (Serviceable Obtainable Market)', 'Who you can capture in 3-5 years', '']
        ]
      },
      helpText: 'Bottom-up is more accurate than top-down.'
    },
    {
      id: 'unit-economics-revenue',
      title: '3.4 Revenue Per Customer',
      description: 'Calculate revenue metrics',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Metric', 'Formula', 'Value'],
        rows: [
          ['ARPU (Average Revenue Per User)', 'Total Revenue / Total Users', ''],
          ['ARPPU (Average Revenue Per Paying User)', 'Total Revenue / Paying Users', ''],
          ['ACV (Annual Contract Value)', 'Monthly × 12', '']
        ]
      },
      helpText: 'Know your revenue metrics.'
    },
    {
      id: 'unit-economics-cost',
      title: 'Cost Per Customer',
      description: 'Calculate cost metrics',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Metric', 'Formula', 'Value'],
        rows: [
          ['CAC (Customer Acquisition Cost)', 'Total Sales & Marketing / New Customers', ''],
          ['Payback Period', 'CAC / (ARPU × Gross Margin %)', '']
        ]
      },
      helpText: 'How long to recover CAC?'
    },
    {
      id: 'unit-economics-ltv',
      title: 'Lifetime Value',
      description: 'Calculate LTV',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Metric', 'Formula', 'Value'],
        rows: [
          ['Gross Margin %', '(Revenue - COGS) / Revenue', ''],
          ['Monthly Churn', 'Customers Lost / Total Customers', ''],
          ['Customer Lifetime', '1 / Monthly Churn Rate', ''],
          ['LTV', 'ARPU × Gross Margin % × Customer Lifetime', '']
        ]
      },
      helpText: 'LTV must be > 3× CAC.'
    },
    {
      id: 'ltv-cac-analysis',
      title: 'LTV:CAC Analysis',
      description: 'Is your unit economics healthy?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Ratio', 'Interpretation', 'Your Status'],
        rows: [
          ['< 1:1', 'Losing money on each customer', ''],
          ['1-2:1', 'Unsustainable', ''],
          ['3:1', 'Healthy SaaS business', ''],
          ['5:1+', 'Under-investing in growth', ''],
          ['Your Ratio', '', '']
        ]
      },
      helpText: 'Target 3:1 or higher.'
    },
    {
      id: 'ab-test-design',
      title: '3.5 A/B Test Design',
      description: 'Design your experiment',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Hypothesis', 'We believe that [change] will cause [outcome] for [segment]'],
          ['Primary Metric', ''],
          ['Guardrail Metrics', ''],
          ['Minimum Detectable Effect', ''],
          ['Baseline Conversion Rate', ''],
          ['Sample Size Needed', ''],
          ['Expected Duration', ''],
          ['Traffic Allocation', '% Control / % Treatment']
        ]
      },
      helpText: 'Clear hypothesis, clear metric.'
    },
    {
      id: 'ab-test-results',
      title: 'A/B Test Results',
      description: 'Document your results',
      fieldType: 'table' as const,
      required: false,
      tableSchema: {
        columns: ['Metric', 'Control', 'Treatment', 'Difference', 'Significant?'],
        rows: [
          ['Primary', '', '', '', 'Yes / No'],
          ['Guardrail 1', '', '', '', 'Yes / No'],
          ['Guardrail 2', '', '', '', 'Yes / No'],
          ['Secondary 1', '', '', '', 'Yes / No'],
          ['Secondary 2', '', '', '', 'Yes / No']
        ]
      },
      helpText: 'Statistical significance matters.'
    },
    {
      id: 'ab-test-decision',
      title: 'A/B Test Decision',
      description: 'What will you do based on results?',
      fieldType: 'table' as const,
      required: false,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['Did the treatment win?', ''],
          ['Were guardrails violated?', ''],
          ['Any segment differences?', ''],
          ['Decision', 'Launch / Iterate / Kill'],
          ['Learnings', '']
        ]
      },
      helpText: 'Let data drive decisions.'
    },
    {
      id: 'metric-definition',
      title: '3.6 Metric Definition',
      description: 'Define your metrics clearly',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Metric Name', 'Exact Formula', 'Data Source', 'Owner'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', '']
        ]
      },
      helpText: 'Avoid metric definition wars.'
    },
    {
      id: 'rice-scoring',
      title: '4.1 RICE Scoring',
      description: 'Prioritize with RICE',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Initiative', 'Reach (users)', 'Impact (1-5)', 'Confidence (%)', 'Effort (weeks)', 'RICE Score'],
        rows: [
          ['', '', '', '', '', ''],
          ['', '', '', '', '', ''],
          ['', '', '', '', '', ''],
          ['', '', '', '', '', '']
        ]
      },
      placeholder: 'RICE Formula: (Reach × Impact × Confidence) / Effort',
      helpText: 'Score objectively.'
    },
    {
      id: 'rice-review',
      title: 'RICE Critical Review',
      description: 'Does the ranking feel right?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['Does the ranking feel right?', ''],
          ['What\'s not captured in RICE?', ''],
          ['Any initiatives that should be weighted differently?', ''],
          ['Final Priority Order', '']
        ]
      },
      helpText: 'RICE informs, doesn\'t replace thinking.'
    },
    {
      id: 'kano-model',
      title: '4.2 Kano Model',
      description: 'Classify features by user perception',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Feature', 'If we have it', 'If we DON\'T have it', 'Category'],
        rows: [
          ['', '', '', 'Basic / Performance / Delighter / Indifferent'],
          ['', '', '', ''],
          ['', '', '', '']
        ]
      },
      helpText: 'Know which features are table stakes vs. delighters.'
    },
    {
      id: 'moscow-prioritization',
      title: '4.3 MoSCoW Prioritization',
      description: 'Categorize by necessity',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Category', 'Definition', 'Initiatives'],
        rows: [
          ['Must Have', 'Non-negotiable for launch/success', ''],
          ['Should Have', 'Important but not critical', ''],
          ['Could Have', 'Nice to have if time/resources allow', ''],
          ['Won\'t Have', 'Explicitly not doing (for now)', '']
        ]
      },
      helpText: 'Be ruthless about what\'s truly mandatory.'
    },
    {
      id: 'cost-of-delay',
      title: '4.4 Cost of Delay',
      description: 'What\'s the cost of waiting?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Initiative', 'Value per Week', 'Urgency', 'Duration', 'CD3 (Value/Duration)'],
        rows: [
          ['', '', 'High / Med / Low', '', ''],
          ['', '', 'High / Med / Low', '', ''],
          ['', '', 'High / Med / Low', '', '']
        ]
      },
      helpText: 'Higher CD3 = higher priority.'
    },
    {
      id: 'eisenhower-matrix',
      title: '4.5 Eisenhower Decision Matrix',
      description: 'Urgent vs. Important',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Quadrant', 'Initiatives'],
        rows: [
          ['Q1: Do Now (Urgent + Important)', ''],
          ['Q2: Schedule (Not Urgent + Important)', ''],
          ['Q3: Delegate (Urgent + Not Important)', ''],
          ['Q4: Eliminate (Not Urgent + Not Important)', '']
        ]
      },
      helpText: 'Spend more time in Q2.'
    },
    {
      id: 'weighted-scoring',
      title: '4.6 Weighted Scoring Model',
      description: 'Custom criteria for your decision',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Criteria', 'Weight (%)', 'Initiative A', 'Initiative B', 'Initiative C'],
        rows: [
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['Total', '100%', '', '', '']
        ]
      },
      helpText: 'Customize criteria to your context.'
    },
    {
      id: 'data-quality',
      title: '5. Data Quality Check',
      description: 'Is your data trustworthy?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['Where does this data come from?', ''],
          ['How is it collected?', ''],
          ['What\'s the margin of error?', ''],
          ['Is the data complete?', ''],
          ['Are there known data gaps?', ''],
          ['When was the data last validated?', '']
        ]
      },
      helpText: 'Garbage in, garbage out.'
    },
    {
      id: 'bias-checklist',
      title: 'Data Interpretation Checklist',
      description: 'Check for common biases',
      fieldType: 'checkbox' as const,
      required: true,
      options: [
        { value: 'confirmation', label: 'Confirmation Bias - Am I only looking for data that supports my view?' },
        { value: 'selection', label: 'Selection Bias - Is this sample representative?' },
        { value: 'survivorship', label: 'Survivorship Bias - Am I only looking at successes?' },
        { value: 'recency', label: 'Recency Bias - Am I over-weighting recent data?' },
        { value: 'correlation', label: 'Correlation vs. Causation - Did X cause Y or just correlated?' }
      ],
      helpText: 'Name the bias to avoid it.'
    },
    {
      id: 'critical-thinking-scorecard',
      title: '6. Critical Thinking Scorecard',
      description: 'Rate yourself on each dimension',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Dimension', 'Score (1-5)', 'Evidence', 'Improvement Plan'],
        rows: [
          ['Opportunity Cost Awareness', '', '', ''],
          ['Second-Order Thinking', '', '', ''],
          ['Inversion/Pre-Mortem', '', '', ''],
          ['Sunk Cost Resistance', '', '', ''],
          ['Pareto Application', '', '', ''],
          ['Base Rate Usage', '', '', ''],
          ['Data Literacy', '', '', ''],
          ['Bias Awareness', '', '', '']
        ]
      },
      helpText: 'Target: 30+ out of 40.'
    },
    {
      id: 'final-recommendation-critical',
      title: '7. Final Recommendation',
      description: 'Document your decision',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Recommended Decision', ''],
          ['Key Mental Models Used', ''],
          ['Data Supporting This', ''],
          ['Biggest Assumption', ''],
          ['Biggest Risk', ''],
          ['Mitigation Plan', ''],
          ['What Would Change My Mind', '']
        ]
      },
      helpText: 'Be clear and decisive.'
    },
    {
      id: 'post-decision-review-critical',
      title: '8. Post-Decision Review',
      description: 'Review after the fact',
      fieldType: 'table' as const,
      required: false,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['Decision Date', ''],
          ['Review Date', ''],
          ['Outcome', 'Success / Partial / Failure'],
          ['What did the data say vs. what happened?', ''],
          ['Which mental model was most useful?', ''],
          ['What bias did I fall for?', ''],
          ['What would I do differently?', '']
        ]
      },
      helpText: 'Review to improve judgment.'
    }
  ],
  outputFormat: 'markdown' as const,
  version: '1.0'
};
