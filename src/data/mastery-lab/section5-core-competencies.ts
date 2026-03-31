// Section 5: Core Competencies Decision Framework

export const coreCompetenciesTemplate = {
  id: 'mastery-section-5',
  name: 'Core Competencies Mastery',
  description: 'Master Discovery, Strategy, Execution, and Measurement',
  category: 'mastery' as const,
  estimatedCompletionTime: '90-120 min',
  sections: [
    {
      id: 'decision-context-competency',
      title: '1. Decision Context',
      description: 'Set the context for your competency assessment',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Decision/Initiative', ''],
          ['Date', ''],
          ['Product', ''],
          ['Who Is Deciding', ''],
          ['Competency Area', 'Discovery / Strategy / Execution / Measurement'],
          ['Decision Deadline', '']
        ]
      },
      helpText: 'Which competency area are you focusing on?'
    },
    {
      id: 'research-planning',
      title: '2.1 Research Planning (Discovery)',
      description: 'Plan your user research',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Research Goal', ''],
          ['Research Questions', ''],
          ['Target Participants', ''],
          ['Sample Size', 'Minimum 5 for qualitative, 30+ for quantitative'],
          ['Research Method', 'Interview / Survey / Ethnography / Diary Study / Focus Group'],
          ['Timeline', ''],
          ['Researcher(s)', '']
        ]
      },
      helpText: 'Clear goals drive good research.'
    },
    {
      id: 'user-interview-guide',
      title: '2.2 User Interview Guide',
      description: 'Structure your interviews',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Phase', 'Questions', 'Time'],
        rows: [
          ['Opening', 'Build rapport, set context, get consent', '5 min'],
          ['Background', 'Tell me about your role/day-to-day work', '10 min'],
          ['Problem Exploration', 'Tell me about the LAST time you encountered this', '15 min'],
          ['Solution Reaction', 'Show prototype: What\'s your first impression?', '15 min'],
          ['Closing', 'Anything I should have asked? Who else should I talk to?', '5 min']
        ]
      },
      helpText: 'Listen more than you talk.'
    },
    {
      id: 'interview-summary',
      title: '2.3 Interview Summary Log',
      description: 'Document each interview',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Interview #', 'Date', 'Participant Profile', 'Key Insights', 'Quotes', 'Follow-up'],
        rows: [
          ['1', '', '', '', '', ''],
          ['2', '', '', '', '', ''],
          ['3', '', '', '', '', ''],
          ['4', '', '', '', '', ''],
          ['5', '', '', '', '', '']
        ]
      },
      helpText: 'Capture insights immediately.'
    },
    {
      id: 'insight-affinity',
      title: '2.4 Insight Affinity Mapping',
      description: 'Group insights by theme',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Theme', 'Insights', 'Supporting Quotes', 'Implications'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', '']
        ]
      },
      helpText: 'Look for patterns across interviews.'
    },
    {
      id: 'research-synthesis',
      title: '2.5 Research Synthesis',
      description: 'What did you learn?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What problems are real vs. stated?', ''],
          ['What patterns emerged across interviews?', ''],
          ['What surprised us?', ''],
          ['What remains unknown?', ''],
          ['What should we build/not build based on this?', '']
        ]
      },
      helpText: 'Synthesis turns data into insights.'
    },
    {
      id: 'problem-statement',
      title: '3.1 Problem Statement',
      description: 'Clearly define the problem',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Who has the problem?', ''],
          ['What is the problem?', ''],
          ['How do we know it\'s real?', ''],
          ['How often does it occur?', ''],
          ['What\'s their current solution?', ''],
          ['How painful is it? (1-10)', ''],
          ['Would they pay for a solution?', '']
        ]
      },
      helpText: 'A clear problem is half solved.'
    },
    {
      id: 'problem-validation',
      title: '3.2 Problem Validation Checklist',
      description: 'Validate the problem is real',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Validation Method', 'Status', 'Evidence'],
        rows: [
          ['Customer Interviews', 'Complete / In Progress', ''],
          ['Observation', 'Complete / In Progress', ''],
          ['Support Ticket Analysis', 'Complete / In Progress', ''],
          ['Survey Data', 'Complete / In Progress', ''],
          ['Competitor Analysis', 'Complete / In Progress', ''],
          ['Willingness to Pay', 'Complete / In Progress', '']
        ]
      },
      helpText: 'Multiple validation sources.'
    },
    {
      id: 'problem-validation-score',
      title: 'Problem Validation Scorecard',
      description: 'Score your problem validation',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Criterion', 'Score (1-5)', 'Evidence'],
        rows: [
          ['Problem is frequently experienced', '', ''],
          ['Current solutions are inadequate', '', ''],
          ['Users can articulate the problem', '', ''],
          ['Users actively seek solutions', '', ''],
          ['Users willing to pay for solution', '', ''],
          ['Total', '/25', '']
        ]
      },
      placeholder: 'Threshold: 20+ = Validated, 15-19 = Needs more research, <15 = Not validated',
      helpText: 'Don\'t build until validated.'
    },
    {
      id: 'solution-hypothesis',
      title: '4.1 Solution Hypothesis',
      description: 'State your hypothesis clearly',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Hypothesis', 'We believe that [solution] will help [user] achieve [outcome]'],
          ['Success Metric', 'We\'ll know this is true when [metric] improves by [X]%']
        ]
      },
      helpText: 'Clear hypothesis enables testing.'
    },
    {
      id: 'solution-validation-methods',
      title: '4.2 Solution Validation Methods',
      description: 'Choose your validation approach',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Method', 'When to Use', 'Your Application'],
        rows: [
          ['Prototype Testing', 'Early concept validation', ''],
          ['Concierge Test', 'Manual solution before building', ''],
          ['Wizard of Oz', 'Fake automation, real human behind', ''],
          ['Landing Page Test', 'Demand validation', ''],
          ['Fake Door Test', 'Interest measurement', ''],
          ['Beta Program', 'Real-world usage', ''],
          ['A/B Test', 'Feature comparison', '']
        ]
      },
      helpText: 'Pick the cheapest valid test.'
    },
    {
      id: 'solution-validation-plan',
      title: '4.3 Solution Validation Plan',
      description: 'Plan your validation',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Validation Method', ''],
          ['Success Criteria', ''],
          ['Sample Size', ''],
          ['Timeline', ''],
          ['Who Runs It', ''],
          ['Resources Needed', '']
        ]
      },
      helpText: 'Plan before you execute.'
    },
    {
      id: 'solution-validation-results',
      title: 'Solution Validation Results',
      description: 'Document your results',
      fieldType: 'table' as const,
      required: false,
      tableSchema: {
        columns: ['Metric', 'Target', 'Actual', 'Pass/Fail'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', '']
        ]
      },
      helpText: 'Let results drive decisions.'
    },
    {
      id: 'market-overview',
      title: '5.1 Market Overview',
      description: 'Understand your market',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Market Definition', ''],
          ['Market Size (TAM)', '$___B'],
          ['Market Growth Rate', '___%/year'],
          ['Key Trends', ''],
          ['Regulatory Considerations', '']
        ]
      },
      helpText: 'Know your market dynamics.'
    },
    {
      id: 'competitive-landscape',
      title: '5.2 Competitive Landscape',
      description: 'Map your competitors',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Competitor', 'Positioning', 'Strengths', 'Weaknesses', 'Market Share', 'Pricing'],
        rows: [
          ['', '', '', '', '', ''],
          ['', '', '', '', '', ''],
          ['', '', '', '', '', ''],
          ['', '', '', '', '', '']
        ]
      },
      helpText: 'Know who you\'re competing against.'
    },
    {
      id: 'market-research-summary',
      title: '5.4 Market Research Summary',
      description: 'Synthesize market insights',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['Is the market growing or shrinking?', ''],
          ['What trends favor us?', ''],
          ['What trends threaten us?', ''],
          ['Where are the gaps in competitor offerings?', ''],
          ['What\'s our differentiation?', '']
        ]
      },
      helpText: 'Find your unique position.'
    },
    {
      id: 'vision-statement',
      title: '6.1 Vision Statement',
      description: 'Where are you going in 5-10 years?',
      fieldType: 'textarea' as const,
      required: true,
      placeholder: 'In [X] years, we envision a world where [aspirational future state]. Our product will [role in that world], creating [value] for [users].',
      helpText: 'Vision is your north star.'
    },
    {
      id: 'strategy-statement',
      title: '6.2 Strategy Statement',
      description: 'How will you win in 1-3 years?',
      fieldType: 'textarea' as const,
      required: true,
      placeholder: 'To achieve our vision, our strategy is to:\n1. [Strategic pillar 1]\n2. [Strategic pillar 2]\n3. [Strategic pillar 3]\n\nWe will win by [unique advantage] in the [market/segment].',
      helpText: 'Strategy is your path to vision.'
    },
    {
      id: 'strategy-checklist',
      title: 'Strategy Checklist',
      description: 'Is your strategy sound?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What\'s our unique advantage?', ''],
          ['What trade-offs are we making?', ''],
          ['What must be true for this to work?', ''],
          ['How will we measure progress?', ''],
          ['What\'s our time horizon?', '']
        ]
      },
      helpText: 'Strategy requires trade-offs.'
    },
    {
      id: 'roadmap-philosophy',
      title: '7.1 Roadmap Philosophy',
      description: 'How do you approach roadmapping?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Approach', 'Description', 'Your Choice'],
        rows: [
          ['Feature Roadmap', 'Lists specific features/dates', 'Avoid (creates commitment trap)'],
          ['Theme Roadmap', 'Groups by outcomes/themes', 'Recommended'],
          ['Now/Next/Later', 'Time horizons without dates', 'Recommended for early stage']
        ]
      },
      helpText: 'Themes over features.'
    },
    {
      id: 'theme-roadmap',
      title: '7.2 Theme-Based Roadmap',
      description: 'Plan by themes, not features',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Time Horizon', 'Theme 1', 'Theme 2', 'Theme 3'],
        rows: [
          ['Now (This Quarter)', '', '', ''],
          ['Next (Next Quarter)', '', '', ''],
          ['Later (This Year)', '', '', '']
        ]
      },
      helpText: 'Themes allow flexibility.'
    },
    {
      id: 'okr-definition',
      title: '8.1 Objective Definition',
      description: 'What\'s your inspirational goal?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Objective', ''],
          ['Time Period', 'Quarter / Year'],
          ['Owner', ''],
          ['Why This Matters', '']
        ]
      },
      helpText: 'Objectives should inspire.'
    },
    {
      id: 'key-results',
      title: '8.2 Key Results',
      description: 'How will you measure success?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Key Result', 'Baseline', 'Target', 'Stretch?', 'Owner'],
        rows: [
          ['', '', '', 'Yes / No', ''],
          ['', '', '', 'Yes / No', ''],
          ['', '', '', 'Yes / No', '']
        ]
      },
      helpText: '3-5 key results max.'
    },
    {
      id: 'okr-quality',
      title: '8.3 OKR Quality Checklist',
      description: 'Are your OKRs well-formed?',
      fieldType: 'checkbox' as const,
      required: true,
      options: [
        { value: 'inspirational', label: 'Is the objective inspirational?' },
        { value: 'measurable', label: 'Are key results measurable?' },
        { value: 'outcomes', label: 'Are key results outcomes (not outputs)?' },
        { value: 'stretch', label: 'Is there a stretch element?' },
        { value: 'count', label: 'Do you have 3-5 key results (not more)?' },
        { value: 'ownership', label: 'Is ownership clear?' }
      ],
      helpText: 'Good OKRs drive focus.'
    },
    {
      id: 'prioritization-framework',
      title: '9.1 Prioritization Framework Selection',
      description: 'Which framework will you use?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Framework', 'Best For', 'Your Choice'],
        rows: [
          ['RICE', 'Feature prioritization with data', ''],
          ['Kano', 'Understanding feature types', ''],
          ['MoSCoW', 'Sprint/Release planning', ''],
          ['Cost of Delay', 'Economic prioritization', ''],
          ['Value vs. Effort', 'Quick prioritization', ''],
          ['Your Choice', '', '']
        ]
      },
      helpText: 'Pick one and use it consistently.'
    },
    {
      id: 'prioritization-backlog',
      title: '9.2 Prioritization Backlog',
      description: 'Score your initiatives',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Initiative', 'Framework Score', 'Strategic Weight', 'Final Priority', 'Notes'],
        rows: [
          ['', '', '', '1-10', ''],
          ['', '', '', '1-10', ''],
          ['', '', '', '1-10', ''],
          ['', '', '', '1-10', ''],
          ['', '', '', '1-10', '']
        ]
      },
      helpText: 'Score objectively.'
    },
    {
      id: 'agile-methodology',
      title: '10.1 Methodology Selection',
      description: 'How will you execute?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Methodology', 'Best For', 'Your Choice'],
        rows: [
          ['Scrum', 'Predictable cadence, defined sprints', ''],
          ['Kanban', 'Continuous flow, variable work', ''],
          ['Hybrid', 'Mix of both', '']
        ]
      },
      helpText: 'Match methodology to work type.'
    },
    {
      id: 'user-story',
      title: '10.3 User Story Template',
      description: 'Write clear user stories',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Content'],
        rows: [
          ['User Story', 'As a [type of user], I want to [action], so that [outcome]'],
          ['Acceptance Criteria', ''],
          ['Definition of Done', 'Code complete, Tests passing, Code reviewed, Deployed, Product approved']
        ]
      },
      helpText: 'Clear stories enable delivery.'
    },
    {
      id: 'risk-identification',
      title: '11.1 Risk Identification',
      description: 'What could go wrong?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Risk', 'Category', 'Probability', 'Impact', 'Risk Score'],
        rows: [
          ['', 'Technical / Market / Resource / Timeline', 'Low/Med/High', 'Low/Med/High', 'P × I'],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ]
      },
      helpText: 'Name risks to manage them.'
    },
    {
      id: 'risk-mitigation',
      title: '11.2 Risk Mitigation Plan',
      description: 'How will you handle risks?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Risk', 'Mitigation Strategy', 'Owner', 'Status'],
        rows: [
          ['', 'Avoid / Reduce / Transfer / Accept', '', 'Active / Monitoring / Closed'],
          ['', '', '', ''],
          ['', '', '', '']
        ]
      },
      helpText: 'Every risk needs an owner.'
    },
    {
      id: 'dependency-tracking',
      title: '11.3 Dependency Tracking',
      description: 'What are you blocked on?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Dependency', 'Dependent On', 'Impact If Blocked', 'Owner', 'Status'],
        rows: [
          ['', '', 'High / Med / Low', '', 'On Track / At Risk / Blocked'],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ]
      },
      helpText: 'Surface dependencies early.'
    },
    {
      id: 'north-star-metric',
      title: '12.1 North Star Metric',
      description: 'What\'s your one metric that matters?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['North Star Metric', ''],
          ['Why This Metric?', ''],
          ['Current Value', ''],
          ['Target Value', ''],
          ['Time Horizon', '']
        ]
      },
      helpText: 'One metric to align the team.'
    },
    {
      id: 'metric-hierarchy',
      title: '12.2 Metric Hierarchy',
      description: 'Map your metric tree',
      fieldType: 'markdown' as const,
      required: true,
      placeholder: 'North Star Metric: []\n    │\n    ├── Input Metric 1: []\n    │       └── Driver 1a: []\n    │       └── Driver 1b: []\n    │\n    ├── Input Metric 2: []\n    │       └── Driver 2a: []\n    │       └── Driver 2b: []\n    │\n    └── Input Metric 3: []\n            └── Driver 3a: []\n            └── Driver 3b: []',
      helpText: 'Input metrics drive north star.'
    },
    {
      id: 'guardrail-metrics',
      title: '12.3 Guardrail Metrics',
      description: 'What must NOT decrease?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Metric', 'Why It\'s a Guardrail', 'Minimum Threshold'],
        rows: [
          ['', '', ''],
          ['', '', ''],
          ['', '', '']
        ]
      },
      helpText: 'Protect what matters.'
    },
    {
      id: 'experiment-backlog',
      title: '13.1 Experiment Backlog',
      description: 'What experiments will you run?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Experiment', 'Hypothesis', 'Priority', 'Effort', 'Status'],
        rows: [
          ['', '', 'High/Med/Low', 'S/M/L', 'Not Started / Running / Complete'],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ]
      },
      helpText: 'Always have experiments running.'
    },
    {
      id: 'experiment-design',
      title: '13.2 Experiment Design',
      description: 'Design your experiment',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Experiment Name', ''],
          ['Hypothesis', 'We believe [X] will cause [Y] for [Z users]'],
          ['Prediction', '[Metric] will change by [X]%'],
          ['Experiment Type', 'A/B Test / Multivariate / Feature Flag / Manual Test'],
          ['Variant Description', 'Control: \nTreatment: '],
          ['Primary Metric', ''],
          ['Guardrail Metrics', ''],
          ['Sample Size', '___ per variant'],
          ['Duration', '___ days'],
          ['Success Criteria', ''],
          ['Owner', '']
        ]
      },
      helpText: 'Clear design enables clear results.'
    },
    {
      id: 'experiment-results',
      title: '13.3 Experiment Results',
      description: 'Document your results',
      fieldType: 'table' as const,
      required: false,
      tableSchema: {
        columns: ['Metric', 'Control', 'Treatment', 'Difference', 'Statistical Significance'],
        rows: [
          ['Primary', '', '', '', 'p = '],
          ['Guardrail 1', '', '', '', 'p = '],
          ['Guardrail 2', '', '', '', 'p = '],
          ['Secondary 1', '', '', '', 'p = '],
          ['Secondary 2', '', '', '', 'p = ']
        ]
      },
      helpText: 'Statistical significance matters.'
    },
    {
      id: 'experiment-decision',
      title: '13.4 Experiment Decision',
      description: 'What will you do?',
      fieldType: 'table' as const,
      required: false,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['Did the treatment win?', ''],
          ['Were guardrails violated?', ''],
          ['Any segment differences?', ''],
          ['Decision', 'Launch / Iterate / Kill'],
          ['Key Learnings', ''],
          ['Next Experiment', '']
        ]
      },
      helpText: 'Let data drive decisions.'
    },
    {
      id: 'analytics-stack',
      title: '14.1 Analytics Stack',
      description: 'What tools do you use?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Tool', 'Purpose', 'Owner', 'Access Level'],
        rows: [
          ['', '', '', 'Full / Read-only'],
          ['', '', '', ''],
          ['', '', '', '']
        ]
      },
      helpText: 'Know your tools.'
    },
    {
      id: 'event-tracking',
      title: '14.2 Event Tracking Plan',
      description: 'What events do you track?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Event Name', 'Description', 'Properties', 'Trigger'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', '']
        ]
      },
      helpText: 'Track what matters.'
    },
    {
      id: 'core-competency-scorecard',
      title: '15. Core Competencies Scorecard',
      description: 'Rate yourself on each dimension',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Dimension', 'Score (1-5)', 'Evidence', 'Improvement Plan'],
        rows: [
          ['User Research', '', '', ''],
          ['Problem Validation', '', '', ''],
          ['Solution Validation', '', '', ''],
          ['Market Research', '', '', ''],
          ['Vision & Strategy', '', '', ''],
          ['Roadmapping', '', '', ''],
          ['Goal Setting (OKRs)', '', '', ''],
          ['Prioritization', '', '', ''],
          ['Agile Execution', '', '', ''],
          ['Risk Management', '', '', ''],
          ['Metrics Definition', '', '', ''],
          ['Experimentation', '', '', ''],
          ['Analytics', '', '', '']
        ]
      },
      helpText: 'Target: 50+ out of 65.'
    },
    {
      id: 'final-competency-assessment',
      title: '16. Final Competency Assessment',
      description: 'Summarize your competency state',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Competency Area', 'Current Strength', 'Priority to Improve', 'Action Plan'],
        rows: [
          ['Discovery', 'High / Med / Low', 'High / Med / Low', ''],
          ['Strategy', 'High / Med / Low', 'High / Med / Low', ''],
          ['Execution', 'High / Med / Low', 'High / Med / Low', ''],
          ['Measurement', 'High / Med / Low', 'High / Med / Low', '']
        ]
      },
      helpText: 'Know where to focus.'
    },
    {
      id: 'skill-building-plan',
      title: '17. 90-Day Skill Building Plan',
      description: 'Plan your development',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Week', 'Activity', 'Output'],
        rows: [
          ['Week 1', '', ''],
          ['Week 2', '', ''],
          ['Week 3', '', ''],
          ['Week 4', '', ''],
          ['Week 5', '', ''],
          ['Week 6', '', ''],
          ['Week 7', '', ''],
          ['Week 8', '', ''],
          ['Week 9', '', ''],
          ['Week 10', '', ''],
          ['Week 11', '', ''],
          ['Week 12', '', '']
        ]
      },
      helpText: 'Deliberate practice drives growth.'
    }
  ],
  outputFormat: 'markdown' as const,
  version: '1.0'
};
