// Section 2: Creativity & Innovation Decision Framework

export const creativityInnovationTemplate = {
  id: 'mastery-section-2',
  name: 'Creativity & Innovation Mastery',
  description: 'Master JTBD, Design Thinking, First Principles, and Analogous Thinking',
  category: 'mastery' as const,
  estimatedCompletionTime: '60-90 min',
  sections: [
    {
      id: 'problem-definition',
      title: '1. Problem Definition',
      description: 'Clearly define the problem you are solving',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Problem Statement', ''],
          ['Date', ''],
          ['Product/Feature', ''],
          ['Who Reported This', ''],
          ['Urgency', 'Low / Medium / High / Critical']
        ]
      },
      helpText: 'A well-defined problem is half solved.'
    },
    {
      id: 'jtbd-surface-request',
      title: '2.1 The Surface Request (JTBD)',
      description: 'Document what was requested',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['What was requested', ''],
          ['Who requested it', ''],
          ['When was it requested', ''],
          ['Context of request', ''],
          ['Stated reason', '']
        ]
      },
      helpText: 'Start with what they asked for, then dig deeper.'
    },
    {
      id: 'jtbd-interview',
      title: '2.2 JTBD Interview Notes',
      description: 'Discover the real job through interviews',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Customer\'s Answer'],
        rows: [
          ['Tell me about the last time you needed this.', ''],
          ['What happened right before you realized you needed it?', ''],
          ['What did you do instead?', ''],
          ['Who else was involved? What did they need?', ''],
          ['What would happen if you didn\'t have this?', ''],
          ['How do you currently solve this problem?', ''],
          ['What\'s frustrating about your current solution?', '']
        ]
      },
      helpText: 'Don\'t accept the stated request. Discover the real job.'
    },
    {
      id: 'jtbd-real-job',
      title: '2.3 The Real Job',
      description: 'Articulate the actual job to be done',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Customer Segment', ''],
          ['The Actual Job', 'Help me [verb] so that [outcome]'],
          ['Emotional Job', 'I want to feel [emotion] when [situation]'],
          ['Social Job', 'I want others to see me as [identity]'],
          ['Job Context', ''],
          ['Job Frequency', ''],
          ['Current Alternatives', ''],
          ['Why Alternatives Fail', '']
        ]
      },
      helpText: 'The job is rarely about the product itself.'
    },
    {
      id: 'jtbd-validation',
      title: '2.4 Job Validation Checklist',
      description: 'Validate this is a real job worth solving',
      fieldType: 'checkbox' as const,
      required: true,
      options: [
        { value: 'real-job', label: 'Is this a real job or a solution in disguise?' },
        { value: 'observable', label: 'Can we observe customers actually doing this job?' },
        { value: 'spending', label: 'Do customers currently spend money/time on this job?' },
        { value: 'important', label: 'Is this job important enough that they\'ll pay for a solution?' },
        { value: 'underserved', label: 'Is this job underserved by current solutions?' }
      ],
      helpText: 'All boxes should be checked for a validated job.'
    },
    {
      id: 'empathize-phase',
      title: '3.1 EMPATHIZE Phase (Design Thinking)',
      description: 'Observe and understand users deeply',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Who did you observe', ''],
          ['Where did you observe them', ''],
          ['What did you see them do', ''],
          ['What did you hear them say', ''],
          ['What did you feel them experience', '']
        ]
      },
      helpText: 'Watch what they do, not just what they say.'
    },
    {
      id: 'pain-points-observed',
      title: 'Pain Points Observed',
      description: 'Document pain points from observation',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Pain Point', 'Severity (1-5)', 'Frequency'],
        rows: [['', '', '']]
      },
      helpText: 'Quantify the pain to prioritize.'
    },
    {
      id: 'define-phase',
      title: '3.2 DEFINE Phase',
      description: 'Write a clear problem statement',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['User', ''],
          ['User\'s Need (Verb-focused)', ''],
          ['Surprising Insight', '']
        ]
      },
      placeholder: 'Problem Statement Template: "[USER] needs to [USER\'S NEED] because [SURPRISING INSIGHT]"',
      helpText: 'Frame the problem around the user, not your solution.'
    },
    {
      id: 'how-might-we',
      title: 'How Might We Questions',
      description: 'Reframe the problem as opportunities',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['HMW Question', 'Why This Matters'],
        rows: [
          ['How might we [verb] [user] so that [outcome]?', ''],
          ['How might we [verb] [user] so that [outcome]?', ''],
          ['How might we [verb] [user] so that [outcome]?', '']
        ]
      },
      helpText: 'Good HMW questions open up possibilities.'
    },
    {
      id: 'ideate-phase',
      title: '3.3 IDEATE Phase',
      description: 'Brainstorm solutions without constraints',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Idea', 'Wild/Conservative', 'Who Suggested'],
        rows: [
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
          ['', '', '']
        ]
      },
      helpText: 'Quantity over quality at this stage.'
    },
    {
      id: 'constraint-ideation',
      title: 'Constraint-Based Ideation',
      description: 'Use constraints to spark creativity',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Constraint', 'Creative Solution'],
        rows: [
          ['What if we had 10x the budget?', ''],
          ['What if we had 1/10th the budget?', ''],
          ['What if this had to work offline?', ''],
          ['What if this had to work for 1M users?', ''],
          ['What if we had to launch in 1 week?', '']
        ]
      },
      helpText: 'Constraints force creative thinking.'
    },
    {
      id: 'reverse-brainstorming',
      title: 'Reverse Brainstorming',
      description: 'How could you guarantee failure?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Way to Guarantee Failure', 'Inverse (What to Do)'],
        rows: [
          ['', ''],
          ['', ''],
          ['', '']
        ]
      },
      helpText: 'Inverting the problem reveals solutions.'
    },
    {
      id: 'prototype-phase',
      title: '3.4 PROTOTYPE Phase',
      description: 'Build something testable',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['What are we prototyping', ''],
          ['Fidelity Level', 'Paper / Wireframe / Clickable / Functional'],
          ['Time to Build', ''],
          ['Who will build it', ''],
          ['What we\'re testing', '']
        ]
      },
      helpText: 'Prototype just enough to learn.'
    },
    {
      id: 'test-phase',
      title: '3.5 TEST Phase',
      description: 'Test with real users',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Who are we testing with', ''],
          ['Number of users', 'Minimum 5 for qualitative'],
          ['Test environment', ''],
          ['Success criteria', '']
        ]
      },
      helpText: 'Test early, test often, test cheaply.'
    },
    {
      id: 'test-results',
      title: 'Test Results',
      description: 'Document what you learned',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['User', 'Task Success', 'Confusion Points', 'Positive Reactions', 'Negative Reactions'],
        rows: [
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ]
      },
      helpText: 'Look for patterns across users.'
    },
    {
      id: 'key-learnings',
      title: 'Key Learnings from Testing',
      description: 'Synthesize insights',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Learning', 'Implication', 'Action'],
        rows: [
          ['', '', ''],
          ['', '', ''],
          ['', '', '']
        ]
      },
      helpText: 'Turn observations into actions.'
    },
    {
      id: 'first-principles-breakdown',
      title: '4.1 Break Down to Fundamentals (First Principles)',
      description: 'What do you know for sure?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What do we KNOW is true? (Facts, not opinions)', ''],
          ['What are we ASSUMING is true?', ''],
          ['What do competitors do?', ''],
          ['What does the market expect?', '']
        ]
      },
      helpText: 'Strip away assumptions to find truth.'
    },
    {
      id: 'challenge-assumptions',
      title: '4.2 Challenge Assumptions',
      description: 'Question every assumption',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Assumption', 'How to Test', 'Result'],
        rows: [
          ['', '', ''],
          ['', '', ''],
          ['', '', '']
        ]
      },
      helpText: 'Test assumptions before building on them.'
    },
    {
      id: 'rebuild-from-scratch',
      title: '4.3 Rebuild from Scratch',
      description: 'If you started fresh, what would you build?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['If we started from zero, what would we build?', ''],
          ['What constraints are artificial?', ''],
          ['What\'s the simplest version that works?', ''],
          ['What\'s the 10x version?', '']
        ]
      },
      helpText: 'Free yourself from legacy thinking.'
    },
    {
      id: 'first-principles-calculation',
      title: '4.4 First Principles Calculation',
      description: 'Calculate from fundamentals',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Component', 'Market Price', 'First Principles Cost', 'Gap'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['Total', '', '', '']
        ]
      },
      helpText: 'Compare market prices to fundamental costs.'
    },
    {
      id: 'analogous-industries',
      title: '5.1 Find Analogous Industries',
      description: 'What other industries solved similar problems?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Your Industry/Problem', 'Analogous Industry', 'Why It\'s Similar'],
        rows: [
          ['', '', ''],
          ['', '', ''],
          ['', '', '']
        ]
      },
      helpText: 'Look outside your industry for insights.'
    },
    {
      id: 'analogous-case-study',
      title: '5.2 Analogous Case Study',
      description: 'Study a specific analogous solution',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Company/Product', ''],
          ['Industry', ''],
          ['Problem They Solved', ''],
          ['How They Solved It', ''],
          ['Result', '']
        ]
      },
      helpText: 'Deep dive into one analogous example.'
    },
    {
      id: 'apply-learnings',
      title: '5.3 Apply Learnings',
      description: 'How does this apply to your situation?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['What They Did', 'How It Applies to Us', 'What We\'d Need to Change'],
        rows: [
          ['', '', ''],
          ['', '', ''],
          ['', '', '']
        ]
      },
      helpText: 'Adapt, don\'t copy.'
    },
    {
      id: 'solution-synthesis',
      title: '6. Creative Solution Synthesis',
      description: 'Combine all insights into solutions',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Source', 'Key Insight', 'How It Shapes Solution'],
        rows: [
          ['JTBD', '', ''],
          ['Design Thinking', '', ''],
          ['First Principles', '', ''],
          ['Analogous Thinking', '', '']
        ]
      },
      helpText: 'Synthesize insights into solutions.'
    },
    {
      id: 'solution-options',
      title: 'Solution Options',
      description: 'Generate multiple solution options',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Aspect', 'Option A', 'Option B', 'Option C'],
        rows: [
          ['What', '', '', ''],
          ['Why it works', '', '', ''],
          ['Risks', '', '', ''],
          ['Effort', '', '', ''],
          ['Confidence', '', '', '']
        ]
      },
      helpText: 'Always have multiple options.'
    },
    {
      id: 'solution-selection',
      title: 'Solution Selection Matrix',
      description: 'Score each option',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Option', 'User Value (/5)', 'Business Value (/5)', 'Feasibility (/5)', 'Confidence (/5)', 'Total (/20)'],
        rows: [
          ['A', '', '', '', '', ''],
          ['B', '', '', '', '', ''],
          ['C', '', '', '', '', '']
        ]
      },
      helpText: 'Score objectively across dimensions.'
    },
    {
      id: 'validation-plan',
      title: '7. Validation Plan',
      description: 'What needs to be true for this to work?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Assumption', 'How to Validate', 'Cost', 'Time'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', '']
        ]
      },
      helpText: 'Validate cheaply before building.'
    },
    {
      id: 'experiment-design',
      title: '7.2 Experiment Design',
      description: 'Design a test for your hypothesis',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Hypothesis', 'We believe [X] will cause [Y]'],
          ['Experiment', ''],
          ['Metric', ''],
          ['Success Threshold', ''],
          ['Timeframe', ''],
          ['Who Runs It', '']
        ]
      },
      helpText: 'Clear hypothesis, clear metric.'
    },
    {
      id: 'cheap-tests',
      title: '7.3 Cheap Tests First',
      description: 'Start with the cheapest validation',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Test', 'Cost', 'Time', 'What It Proves'],
        rows: [
          ['Customer interviews', '$0', '1 week', 'Problem exists'],
          ['Landing page test', '$500', '3 days', 'Willingness to try'],
          ['Concierge test', '$0', '1 week', 'Solution works manually'],
          ['Fake door test', '$0', '1 week', 'Actual interest'],
          ['MVP', '$$$$', '4+ weeks', 'Full validation']
        ]
      },
      helpText: 'Validate before you build.'
    },
    {
      id: 'final-recommendation-creativity',
      title: '8. Final Recommendation',
      description: 'Document your recommended solution',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Recommended Solution', ''],
          ['Why This Option', ''],
          ['JTBD It Serves', ''],
          ['Key Assumptions', ''],
          ['Validation Needed', ''],
          ['Effort Required', ''],
          ['Expected Outcome', ''],
          ['Success Metrics', ''],
          ['Review Date', '']
        ]
      },
      helpText: 'Be clear about what you recommend and why.'
    },
    {
      id: 'creative-blockers',
      title: '9. Creative Blockers Checklist',
      description: 'What\'s preventing bigger thinking?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Blocker', 'Is This Present?', 'How to Overcome'],
        rows: [
          ['Fear of failure', 'Yes / No', ''],
          ['Organizational inertia', 'Yes / No', ''],
          ['Resource constraints', 'Yes / No', ''],
          ['Lack of customer input', 'Yes / No', ''],
          ['Competitor obsession', 'Yes / No', ''],
          ['HiPPO (Highest Paid Person\'s Opinion)', 'Yes / No', ''],
          ['Analysis paralysis', 'Yes / No', '']
        ]
      },
      helpText: 'Name the blockers to overcome them.'
    },
    {
      id: 'post-launch-learning',
      title: '10. Post-Launch Learning',
      description: 'What did you learn after launch?',
      fieldType: 'table' as const,
      required: false,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['Did we solve the real job?', ''],
          ['What surprised us?', ''],
          ['What would we do differently?', ''],
          ['What did we learn about our users?', ''],
          ['What did we learn about our process?', ''],
          ['Is this solution still valid?', 'Yes / No / Needs Pivot']
        ]
      },
      helpText: 'Learn from every launch.'
    }
  ],
  outputFormat: 'markdown' as const,
  version: '1.0'
};
