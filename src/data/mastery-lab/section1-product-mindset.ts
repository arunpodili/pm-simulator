// Section 1: Product Mindset Decision Framework

export const productMindsetTemplate = {
  id: 'mastery-section-1',
  name: 'Product Mindset Mastery',
  description: 'Master outcomes over outputs, customer obsession, systems thinking, and mental models',
  category: 'mastery' as const,
  estimatedCompletionTime: '45-60 min',
  sections: [
    {
      id: 'decision-context',
      title: '1. Decision Context',
      description: 'Set the foundation for your product decision',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [['Decision/Initiative', ''], ['Date', ''], ['Product', ''], ['Who Is Deciding', ''], ['Decision Deadline', ''], ['Decision Type', 'One-Way Door / Two-Way Door']]
      },
      helpText: 'Clearly define what decision you are making and who is involved.'
    },
    {
      id: 'outcomes-over-outputs',
      title: '2. Outcomes Over Outputs',
      description: 'Define what changes because you shipped it',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Output (What you will ship)', ''],
          ['Outcome (What user behavior changes)', ''],
          ['Business Impact (What metric this moves)', ''],
          ['Success Metric', ''],
          ['Baseline (Current Value)', ''],
          ['Target (Expected Value)', ''],
          ['Time to See Results', '']
        ]
      },
      helpText: 'Focus on what behavior changes for users, not just what you build.'
    },
    {
      id: 'outcome-validation',
      title: '2.3 Outcome Validation Checklist',
      description: 'Validate your outcome is measurable and actionable',
      fieldType: 'checkbox' as const,
      required: true,
      options: [
        { value: 'measurable', label: 'Can I measure this outcome?' },
        { value: 'control', label: 'Is this outcome within our control?' },
        { value: 'matters', label: 'Does this outcome matter to the business?' },
        { value: 'kill', label: 'Would we kill this feature if the outcome didn\'t improve?' }
      ],
      helpText: 'If you can\'t answer YES to all, reconsider your outcome definition.'
    },
    {
      id: 'vanity-vs-actionable',
      title: '2.4 Vanity vs. Actionable Metrics Check',
      description: 'Ensure you\'re tracking metrics that drive decisions',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Metric Type', 'Examples', 'Your Metric'],
        rows: [
          ['Vanity Metrics (Avoid)', 'Signups, Downloads, Page Views, Total Users', ''],
          ['Actionable Metrics (Use)', 'Activation Rate, Retention Rate, Revenue per User', ''],
          ['Your Metric', '', ''],
          ['Is it actionable?', '', 'Yes / No']
        ]
      },
      helpText: 'Vanity metrics make you feel good. Actionable metrics tell you what to do.'
    },
    {
      id: 'customer-obsession',
      title: '3. Customer Obsession',
      description: 'Validate you\'re solving a real customer problem',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What problem are we solving?', ''],
          ['Who has this problem? (Be specific)', ''],
          ['How do we know this is a real problem?', ''],
          ['How often do they experience this?', ''],
          ['What do they currently do to solve it?', ''],
          ['How painful is their current solution? (1-10)', ''],
          ['Would they pay for a solution?', '']
        ]
      },
      helpText: 'Evidence, not assumptions. Talk to real customers.'
    },
    {
      id: 'customer-evidence',
      title: '3.2 Customer Evidence Log',
      description: 'Document direct customer quotes and context',
      fieldType: 'table' as const,
      required: false,
      tableSchema: {
        columns: ['Customer', 'Quote', 'Context', 'Date'],
        rows: [['', '', '', '']]
      },
      helpText: 'Keep a living log of customer evidence to reference.'
    },
    {
      id: 'embracing-uncertainty',
      title: '4. Embracing Uncertainty',
      description: 'Map what you know vs. what you don\'t',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Category', 'Items'],
        rows: [
          ['Known Knowns (Facts we have)', ''],
          ['Known Unknowns (Things we need to learn)', ''],
          ['Unknown Unknowns (Risks we haven\'t identified)', '']
        ]
      },
      helpText: 'Be honest about uncertainty. It\'s okay not to know everything.'
    },
    {
      id: 'confidence-assessment',
      title: '4.2 Confidence Assessment',
      description: 'Rate your confidence in key assumptions',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Assumption', 'Confidence (Low/Med/High)', 'Evidence', 'How to Increase Confidence'],
        rows: [['', '', '', '']]
      },
      helpText: '70% confidence is usually enough to move forward.'
    },
    {
      id: 'reversible-irreversible',
      title: '4.3 Reversible vs. Irreversible Decision',
      description: 'Classify your decision type to determine speed',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['Is this decision reversible?', ''],
          ['If yes, how fast can we reverse?', ''],
          ['If no, what\'s the cost of being wrong?', ''],
          ['What\'s the cost of waiting?', ''],
          ['Decision Speed Required', 'Fast / Medium / Slow'],
          ['Do we have 70%+ confidence?', '']
        ]
      },
      helpText: 'Two-way door? Decide fast. One-way door? Take your time.'
    },
    {
      id: 'systems-thinking',
      title: '5. Systems Thinking',
      description: 'Map the ecosystem and feedback loops',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Node', 'Type', 'Description'],
        rows: [['', 'User / Feature / Revenue / Team / Partner', '']]
      },
      helpText: 'Every product exists in a system. Map all the nodes.'
    },
    {
      id: 'feedback-loops',
      title: '5.3 Feedback Loop Identification',
      description: 'Identify virtuous and vicious cycles',
      fieldType: 'markdown' as const,
      required: true,
      placeholder: 'Virtuous Cycles (Positive):\n[Node A] → [Node B] → [Node A]\n\nExample: More users → More data → Better product → More users\n\nVicious Cycles (Negative):\n[Node A] → [Node B] → [Node A]\n\nExample: Technical debt → Slower development → More shortcuts → More debt',
      helpText: 'Find the loops that compound over time.'
    },
    {
      id: 'second-order-thinking',
      title: '5.4 Second-Order Thinking Map',
      description: 'Map effects at each order',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Order', 'Effect', 'Likelihood', 'Mitigation/Amplification'],
        rows: [
          ['First-Order (Immediate)', '', 'Certain / Likely / Possible', ''],
          ['Second-Order (1-4 weeks)', '', 'Certain / Likely / Possible', ''],
          ['Third-Order (1-3 months)', '', 'Certain / Likely / Possible', ''],
          ['Fourth-Order (6+ months)', '', 'Certain / Likely / Possible', '']
        ]
      },
      helpText: 'Ask: "And then what?" repeatedly.'
    },
    {
      id: 'mental-models-opportunity',
      title: '6.1 Opportunity Cost',
      description: 'What are you saying no to?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What are we saying YES to?', ''],
          ['What are we saying NO to? (List 3)', ''],
          ['What\'s the value of the best alternative?', ''],
          ['Is this trade-off worth it?', '']
        ]
      },
      helpText: 'Every yes is a no to something else.'
    },
    {
      id: 'sunk-cost-check',
      title: '6.2 Sunk Cost Fallacy Check',
      description: 'Are you continuing because of past investment?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What have we already invested?', ''],
          ['Is that investment recoverable?', ''],
          ['If we hadn\'t started this, would we start today?', 'Yes / No'],
          ['If no, why are we continuing?', ''],
          ['What would it take to stop?', '']
        ]
      },
      helpText: 'Past investment is gone. Only future value matters.'
    },
    {
      id: 'pareto-analysis',
      title: '6.3 Pareto Principle (80/20)',
      description: 'Find the vital few',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Analysis', 'Input'],
        rows: [
          ['What 20% of features drive 80% of value?', ''],
          ['What 20% of customers drive 80% of revenue?', ''],
          ['What 20% of efforts drive 80% of results?', ''],
          ['What 80% is creating 20% of value? (Consider cutting)', '']
        ]
      },
      helpText: 'Most value comes from few sources. Find them.'
    },
    {
      id: 'pre-mortem',
      title: '6.4 Inversion / Pre-Mortem',
      description: 'Imagine failure, then prevent it',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Failure Scenario', 'Probability', 'Prevention'],
        rows: [
          ['', 'Low / Med / High', ''],
          ['', 'Low / Med / High', ''],
          ['', 'Low / Med / High', ''],
          ['', 'Low / Med / High', ''],
          ['', 'Low / Med / High', '']
        ]
      },
      helpText: 'Write the post-mortem before you start.'
    },
    {
      id: 'psychological-attributes',
      title: '7. Psychological Attributes Check',
      description: 'Check your mindset',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What don\'t I know about this?', ''],
          ['Who knows more than me about this?', ''],
          ['Have I talked to them?', 'Yes / No'],
          ['What would change my mind?', ''],
          ['Am I attached to being right or to the outcome?', '']
        ]
      },
      helpText: 'Intellectual humility is a superpower.'
    },
    {
      id: 'product-mindset-scorecard',
      title: '8. Product Mindset Scorecard',
      description: 'Rate yourself on each dimension',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Dimension', 'Score (1-5)', 'Evidence', 'Improvement Plan'],
        rows: [
          ['Outcomes Focus', '', '', ''],
          ['Customer Obsession', '', '', ''],
          ['Comfort with Uncertainty', '', '', ''],
          ['Systems Thinking', '', '', ''],
          ['Intellectual Humility', '', '', ''],
          ['Decision Velocity', '', '', ''],
          ['Resilience', '', '', ''],
          ['Curiosity', '', '', '']
        ]
      },
      helpText: 'Target: 30+ out of 40 for strong product mindset.'
    },
    {
      id: 'final-recommendation',
      title: '9. Final Decision Synthesis',
      description: 'Document your recommendation',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['My Recommendation', ''],
          ['Primary Reason', ''],
          ['Key Assumptions', ''],
          ['Biggest Risk', ''],
          ['Mitigation Plan', '']
        ]
      },
      helpText: 'Be clear about what you\'re recommending and why.'
    },
    {
      id: 'post-decision-review',
      title: '10. Post-Decision Review',
      description: 'Fill this out after the review date',
      fieldType: 'table' as const,
      required: false,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['Did we achieve the outcome?', ''],
          ['What surprised us?', ''],
          ['What did we learn?', ''],
          ['What would we do differently?', ''],
          ['Was the decision reversible?', ''],
          ['Would we decide the same again?', '']
        ]
      },
      helpText: 'Review decisions to improve your judgment.'
    }
  ],
  outputFormat: 'markdown' as const,
  version: '1.0'
};
