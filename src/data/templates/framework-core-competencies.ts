import { Template } from '@/types';

export const coreCompetenciesTemplate: Template = {
  id: 'framework-core-competencies',
  name: 'Core PM Competencies Decision Framework',
  description: 'Comprehensive framework covering Discovery, Strategy, Execution, and Measurement - the complete PM skill stack',
  industryId: 'saas',
  scenarioId: 'roadmap-planning',
  frameworkIds: ['rice', 'jtbd', 'okrs', 'kano'],
  outputFormat: 'markdown',
  estimatedCompletionTime: '3-4 hours',
  version: '1.0.0',
  sections: [
    {
      id: 'decision-context',
      title: 'Decision Context',
      description: 'Define the competency area you are focusing on',
      fieldType: 'table',
      required: true,
      helpText: 'Set the stage for your competency development',
      learnContentId: 'core-competencies',
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Decision/Initiative', ''],
          ['Date', ''],
          ['Product', ''],
          ['Who Is Deciding', ''],
          ['Competency Area', 'Discovery / Strategy / Execution / Measurement'],
          ['Decision Deadline', ''],
        ]
      }
    },
    {
      id: 'research-planning',
      title: 'User Research Planning',
      description: 'Plan your user research study',
      fieldType: 'table',
      required: false,
      helpText: 'Good research starts with clear goals and the right participants',
      learnContentId: 'user-research',
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Research Goal', '(What do you need to learn?)'],
          ['Research Questions', '(List 3-5 key questions)'],
          ['Target Participants', '(Who should you talk to?)'],
          ['Sample Size', '(Minimum 5 for qualitative, 30+ for quantitative)'],
          ['Research Method', 'Interview / Survey / Ethnography / Diary Study / Focus Group'],
          ['Timeline', ''],
          ['Researcher(s)', ''],
        ]
      }
    },
    {
      id: 'interview-summary',
      title: 'User Interview Summary Log',
      description: 'Track insights from each user interview',
      fieldType: 'table',
      required: false,
      helpText: 'Capture insights systematically across all interviews',
      learnContentId: 'user-research',
      tableSchema: {
        columns: ['Interview #', 'Date', 'Participant Profile', 'Key Insights', 'Quotes', 'Follow-up'],
        rows: [
          ['1', '', '', '', '', ''],
          ['2', '', '', '', '', ''],
          ['3', '', '', '', '', ''],
          ['4', '', '', '', '', ''],
          ['5', '', '', '', '', ''],
        ]
      }
    },
    {
      id: 'insight-affinity-map',
      title: 'Insight Affinity Mapping',
      description: 'Group insights by theme',
      fieldType: 'table',
      required: false,
      helpText: 'Find patterns across your research insights',
      learnContentId: 'user-research',
      tableSchema: {
        columns: ['Theme', 'Insights', 'Supporting Quotes', 'Implications'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
        ]
      }
    },
    {
      id: 'problem-statement',
      title: 'Problem Statement',
      description: 'Define and validate the problem',
      fieldType: 'table',
      required: false,
      helpText: 'A well-defined problem is half solved',
      learnContentId: 'problem-validation',
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Who has the problem?', '(Be specific - segment/persona)'],
          ['What is the problem?', '(Describe in their words)'],
          ['How do we know it is real?', '(Evidence, not assumptions)'],
          ['How often does it occur?', '(Frequency)'],
          ['What is their current solution?', ''],
          ['How painful is it?', '(1-10 scale)'],
          ['Would they pay for a solution?', 'Yes / No / How much?'],
        ]
      }
    },
    {
      id: 'problem-validation-checklist',
      title: 'Problem Validation Checklist',
      description: 'Verify the problem is real and worth solving',
      fieldType: 'table',
      required: false,
      helpText: 'Validate before you build',
      learnContentId: 'problem-validation',
      tableSchema: {
        columns: ['Validation Method', 'Status', 'Evidence'],
        rows: [
          ['Customer Interviews', 'Complete / In Progress', '___ interviews conducted'],
          ['Observation', 'Complete / In Progress', 'Observed ___ users in context'],
          ['Support Ticket Analysis', 'Complete / In Progress', '___ relevant tickets found'],
          ['Survey Data', 'Complete / In Progress', '___ responses'],
          ['Competitor Analysis', 'Complete / In Progress', 'Competitors solving this:'],
          ['Willingness to Pay', 'Complete / In Progress', '___ users said they would pay'],
        ]
      }
    },
    {
      id: 'solution-hypothesis',
      title: 'Solution Hypothesis',
      description: 'Define your solution hypothesis',
      fieldType: 'table',
      required: false,
      helpText: 'Be clear about what you believe and how you will know',
      learnContentId: 'solution-validation',
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Hypothesis', 'We believe that [solution] will help [user] achieve [outcome].'],
          ['We will know this is true when', '[metric] improves by [X]%.'],
        ]
      }
    },
    {
      id: 'solution-validation-methods',
      title: 'Solution Validation Methods',
      description: 'Choose your validation approach',
      fieldType: 'table',
      required: false,
      helpText: 'Pick the right validation method for your stage',
      learnContentId: 'solution-validation',
      tableSchema: {
        columns: ['Method', 'When to Use', 'Your Application'],
        rows: [
          ['Prototype Testing', 'Early concept validation', ''],
          ['Concierge Test', 'Manual solution before building', ''],
          ['Wizard of Oz', 'Fake automation, real human behind', ''],
          ['Landing Page Test', 'Demand validation', ''],
          ['Fake Door Test', 'Interest measurement', ''],
          ['Beta Program', 'Real-world usage', ''],
          ['A/B Test', 'Feature comparison', ''],
        ]
      }
    },
    {
      id: 'vision-statement',
      title: 'Vision Statement',
      description: 'Define your 5-10 year vision',
      fieldType: 'markdown',
      required: false,
      helpText: 'A compelling vision inspires and guides',
      learnContentId: 'vision-strategy',
      placeholder: `**Vision Statement (5-10 years):**

"In [X] years, we envision a world where [aspirational future state].
Our product will [role in that world], creating [value] for [users]."`,
    },
    {
      id: 'strategy-statement',
      title: 'Strategy Statement',
      description: 'Define your 1-3 year strategy',
      fieldType: 'markdown',
      required: false,
      helpText: 'Strategy is about choices and trade-offs',
      placeholder: `**Strategy Statement (1-3 years):**

"To achieve our vision, our strategy is to:
1. [Strategic pillar 1]
2. [Strategic pillar 2]
3. [Strategic pillar 3]

We will win by [unique advantage] in the [market/segment]."`,
    },
    {
      id: 'strategy-checklist',
      title: 'Strategy Checklist',
      description: 'Validate your strategy is sound',
      fieldType: 'table',
      required: false,
      helpText: 'Good strategy makes clear choices',
      learnContentId: 'vision-strategy',
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What is our unique advantage?', ''],
          ['What trade-offs are we making?', '(What we are NOT doing)'],
          ['What must be true for this to work?', ''],
          ['How will we measure progress?', ''],
          ['What is our time horizon?', ''],
        ]
      }
    },
    {
      id: 'theme-roadmap',
      title: 'Theme-Based Roadmap',
      description: 'Create a theme-based roadmap (not feature-based)',
      fieldType: 'table',
      required: false,
      helpText: 'Themes communicate outcomes, not just outputs',
      learnContentId: 'roadmapping',
      tableSchema: {
        columns: ['Time Horizon', 'Theme 1', 'Theme 2', 'Theme 3'],
        rows: [
          ['Now (This Quarter)', '', '', ''],
          ['Next (Next Quarter)', '', '', ''],
          ['Later (This Year)', '', '', ''],
        ]
      }
    },
    {
      id: 'okrs',
      title: 'OKRs (Objectives & Key Results)',
      description: 'Set inspirational objectives with measurable key results',
      fieldType: 'table',
      required: false,
      helpText: 'OKRs align the team on outcomes',
      learnContentId: 'okrs',
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Objective', '(Qualitative, inspirational goal)'],
          ['Time Period', 'Quarter / Year'],
          ['Owner', ''],
          ['Why This Matters', ''],
        ]
      },
    },
    {
      id: 'key-results',
      title: 'Key Results',
      description: 'Define measurable key results for your objective',
      fieldType: 'table',
      required: false,
      helpText: 'Key results must be measurable and outcome-focused',
      learnContentId: 'okrs',
      tableSchema: {
        columns: ['Key Result', 'Baseline', 'Target', 'Stretch?'],
        rows: [
          ['', '', '', 'Yes / No'],
          ['', '', '', 'Yes / No'],
          ['', '', '', 'Yes / No'],
        ]
      }
    },
    {
      id: 'okr-checklist',
      title: 'OKR Quality Checklist',
      description: 'Ensure your OKRs are well-formed',
      fieldType: 'table',
      required: false,
      helpText: 'Good OKRs are inspirational and measurable',
      learnContentId: 'okrs',
      tableSchema: {
        columns: ['Question', 'Yes/No'],
        rows: [
          ['Is the objective inspirational?', ''],
          ['Are key results measurable?', ''],
          ['Are key results outcomes (not outputs)?', ''],
          ['Is there a stretch element?', ''],
          ['Do you have 3-5 key results (not more)?', ''],
          ['Is ownership clear?', ''],
        ]
      }
    },
    {
      id: 'prioritization-framework',
      title: 'Prioritization Framework Selection',
      description: 'Choose your prioritization framework',
      fieldType: 'table',
      required: false,
      helpText: 'Different situations call for different frameworks',
      learnContentId: 'prioritization',
      tableSchema: {
        columns: ['Framework', 'Best For', 'Your Choice'],
        rows: [
          ['RICE', 'Feature prioritization with data', ''],
          ['Kano', 'Understanding feature types', ''],
          ['MoSCoW', 'Sprint/Release planning', ''],
          ['Cost of Delay', 'Economic prioritization', ''],
          ['Value vs. Effort', 'Quick prioritization', ''],
        ]
      }
    },
    {
      id: 'prioritization-backlog',
      title: 'Prioritization Backlog',
      description: 'Score and prioritize your initiatives',
      fieldType: 'table',
      required: false,
      helpText: 'Apply your chosen framework consistently',
      learnContentId: 'prioritization',
      tableSchema: {
        columns: ['Initiative', 'Framework Score', 'Strategic Weight', 'Final Priority', 'Notes'],
        rows: [
          ['', '', '', '1-10', ''],
          ['', '', '', '1-10', ''],
          ['', '', '', '1-10', ''],
          ['', '', '', '1-10', ''],
          ['', '', '', '1-10', ''],
        ]
      }
    },
    {
      id: 'user-story-template',
      title: 'User Story Template',
      description: 'Write user stories with acceptance criteria',
      fieldType: 'markdown',
      required: false,
      helpText: 'Good stories are specific and testable',
      learnContentId: 'agile-methodologies',
      placeholder: `**User Story:**

As a [type of user],
I want to [action],
So that [outcome/benefit].

**Acceptance Criteria:**
- Criterion 1
- Criterion 2
- Criterion 3

**Definition of Done:**
- Code complete
- Tests passing
- Code reviewed
- Deployed to staging
- Product approved`,
    },
    {
      id: 'risk-identification',
      title: 'Risk Identification',
      description: 'Identify and assess project risks',
      fieldType: 'table',
      required: false,
      helpText: 'Surface risks early so you can manage them',
      learnContentId: 'risk-management',
      tableSchema: {
        columns: ['Risk', 'Category', 'Probability', 'Impact', 'Risk Score'],
        rows: [
          ['', 'Technical / Market / Resource / Timeline / Other', 'Low/Med/High', 'Low/Med/High', 'P x I'],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
        ]
      }
    },
    {
      id: 'risk-mitigation',
      title: 'Risk Mitigation Plan',
      description: 'Define how you will handle each risk',
      fieldType: 'table',
      required: false,
      helpText: 'Have a plan before risks become problems',
      learnContentId: 'risk-management',
      tableSchema: {
        columns: ['Risk', 'Mitigation Strategy', 'Owner', 'Status'],
        rows: [
          ['', 'Avoid / Reduce / Transfer / Accept', '', 'Active / Monitoring / Closed'],
          ['', '', '', ''],
          ['', '', '', ''],
        ]
      }
    },
    {
      id: 'dependency-tracking',
      title: 'Dependency Tracking',
      description: 'Track dependencies that could block progress',
      fieldType: 'table',
      required: false,
      helpText: 'Dependencies silently kill projects - make them visible',
      learnContentId: 'risk-management',
      tableSchema: {
        columns: ['Dependency', 'Dependent On', 'Impact If Blocked', 'Owner', 'Status'],
        rows: [
          ['', '', 'High / Med / Low', '', 'On Track / At Risk / Blocked'],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
        ]
      }
    },
    {
      id: 'north-star-metric',
      title: 'North Star Metric',
      description: 'Define your single most important metric',
      fieldType: 'table',
      required: false,
      helpText: 'The North Star aligns the team on value delivery',
      learnContentId: 'metrics-definition',
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['North Star Metric', '(Single metric that captures value delivery)'],
          ['Why This Metric?', ''],
          ['Current Value', ''],
          ['Target Value', ''],
          ['Time Horizon', ''],
        ]
      }
    },
    {
      id: 'metric-hierarchy',
      title: 'Metric Hierarchy',
      description: 'Map your metrics from North Star to drivers',
      fieldType: 'markdown',
      required: false,
      helpText: 'Understand what drives your North Star',
      placeholder: `**Metric Hierarchy:**

North Star Metric: []
    |
    ├── Input Metric 1: []
    │       ├── Driver 1a: []
    │       └── Driver 1b: []
    │
    ├── Input Metric 2: []
    │       ├── Driver 2a: []
    │       └── Driver 2b: []
    │
    └── Input Metric 3: []
            ├── Driver 3a: []
            └── Driver 3b: []`,
    },
    {
      id: 'guardrail-metrics',
      title: 'Guardrail Metrics',
      description: 'Define metrics that must NOT decrease',
      fieldType: 'table',
      required: false,
      helpText: 'Guardrails prevent optimization at any cost',
      learnContentId: 'metrics-definition',
      tableSchema: {
        columns: ['Metric', 'Why It is a Guardrail', 'Minimum Threshold'],
        rows: [
          ['', '(What must NOT decrease)', ''],
          ['', '', ''],
          ['', '', ''],
        ]
      }
    },
    {
      id: 'experiment-design',
      title: 'Experiment Design',
      description: 'Design a rigorous experiment',
      fieldType: 'table',
      required: false,
      helpText: 'Good experiments test specific hypotheses',
      learnContentId: 'experimentation',
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Experiment Name', ''],
          ['Hypothesis', '"We believe [X] will cause [Y] for [Z users]"'],
          ['Prediction', '[Metric] will change by [X]%'],
          ['Experiment Type', 'A/B Test / Multivariate / Feature Flag / Manual Test'],
          ['Variant Description', 'Control: \nTreatment:'],
          ['Primary Metric', ''],
          ['Guardrail Metrics', ''],
          ['Sample Size', '___ per variant'],
          ['Duration', '___ days'],
          ['Success Criteria', ''],
          ['Owner', ''],
        ]
      }
    },
    {
      id: 'experiment-results',
      title: 'Experiment Results',
      description: 'Record and analyze experiment results',
      fieldType: 'table',
      required: false,
      helpText: 'Learn from every experiment, win or lose',
      learnContentId: 'experimentation',
      tableSchema: {
        columns: ['Metric', 'Control', 'Treatment', 'Difference', 'Statistical Significance'],
        rows: [
          ['Primary', '', '', '', 'p ='],
          ['Guardrail 1', '', '', '', 'p ='],
          ['Guardrail 2', '', '', '', 'p ='],
          ['Secondary 1', '', '', '', 'p ='],
          ['Secondary 2', '', '', '', 'p ='],
        ]
      }
    },
    {
      id: 'experiment-decision',
      title: 'Experiment Decision',
      description: 'Decide what to do based on experiment results',
      fieldType: 'table',
      required: false,
      helpText: 'Every experiment should lead to a clear decision',
      learnContentId: 'experimentation',
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['Did the treatment win?', 'Yes / No / Inconclusive'],
          ['Were guardrails violated?', 'Yes / No'],
          ['Any segment differences?', ''],
          ['Decision', 'Launch / Iterate / Kill'],
          ['Key Learnings', ''],
          ['Next Experiment', ''],
        ]
      }
    },
    {
      id: 'event-tracking-plan',
      title: 'Event Tracking Plan',
      description: 'Define what events to track',
      fieldType: 'table',
      required: false,
      helpText: 'Good analytics starts with good tracking',
      learnContentId: 'analytics',
      tableSchema: {
        columns: ['Event Name', 'Description', 'Properties', 'Trigger'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
        ]
      }
    },
    {
      id: 'competency-scorecard',
      title: 'Core Competencies Scorecard',
      description: 'Rate yourself on each PM competency',
      fieldType: 'table',
      required: true,
      helpText: 'Self-assessment to identify growth areas',
      learnContentId: 'core-competencies',
      tableSchema: {
        columns: ['Dimension', 'Score', 'Evidence', 'Improvement Plan'],
        rows: [
          ['User Research', '/5', '', ''],
          ['Problem Validation', '/5', '', ''],
          ['Solution Validation', '/5', '', ''],
          ['Market Research', '/5', '', ''],
          ['Vision & Strategy', '/5', '', ''],
          ['Roadmapping', '/5', '', ''],
          ['Goal Setting (OKRs)', '/5', '', ''],
          ['Prioritization', '/5', '', ''],
          ['Agile Execution', '/5', '', ''],
          ['Risk Management', '/5', '', ''],
          ['Metrics Definition', '/5', '', ''],
          ['Experimentation', '/5', '', ''],
          ['Analytics', '/5', '', ''],
        ]
      }
    },
    {
      id: 'final-competency-assessment',
      title: 'Final Competency Assessment',
      description: 'Summarize your competency strengths and priorities',
      fieldType: 'table',
      required: true,
      helpText: 'Turn assessment into action',
      learnContentId: 'core-competencies',
      tableSchema: {
        columns: ['Competency Area', 'Current Strength', 'Priority to Improve', 'Action Plan'],
        rows: [
          ['Discovery', 'High / Med / Low', 'High / Med / Low', ''],
          ['Strategy', 'High / Med / Low', 'High / Med / Low', ''],
          ['Execution', 'High / Med / Low', 'High / Med / Low', ''],
          ['Measurement', 'High / Med / Low', 'High / Med / Low', ''],
        ]
      }
    },
  ],
};
