// Section 4: Stakeholder Management Decision Framework

export const stakeholderManagementTemplate = {
  id: 'mastery-section-4',
  name: 'Stakeholder Management Mastery',
  description: 'Master stakeholder mapping, influence strategies, saying yes/no, and conflict resolution',
  category: 'mastery' as const,
  estimatedCompletionTime: '45-60 min',
  sections: [
    {
      id: 'decision-context-stakeholder',
      title: '1. Decision Context',
      description: 'Set the context for your stakeholder decision',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Decision/Initiative', ''],
          ['Date', ''],
          ['Product', ''],
          ['Who Is Deciding', ''],
          ['Decision Deadline', ''],
          ['Stakeholder Complexity', 'Low / Medium / High / Critical']
        ]
      },
      helpText: 'Understand the stakeholder landscape.'
    },
    {
      id: 'stakeholder-identification',
      title: '2.1 Identify All Stakeholders',
      description: 'List everyone who has a stake',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Stakeholder', 'Role', 'Team', 'Contact'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', '']
        ]
      },
      helpText: 'Cast a wide net.'
    },
    {
      id: 'power-interest-grid',
      title: '2.2 Stakeholder Power-Interest Grid',
      description: 'Plot stakeholders by power and interest',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Stakeholder', 'Power (1-10)', 'Interest (1-10)', 'Quadrant'],
        rows: [
          ['', '', '', 'Manage Closely / Keep Satisfied / Keep Informed / Monitor'],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', '']
        ]
      },
      helpText: 'High Power + High Interest = Manage Closely'
    },
    {
      id: 'stakeholder-agenda',
      title: '2.3 Stakeholder Agenda Analysis',
      description: 'Understand hidden agendas',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Stakeholder', 'What They Say They Want', 'What They Actually Need', 'Hidden Agenda', 'Personal Incentives'],
        rows: [
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ]
      },
      helpText: 'Look beyond stated positions.'
    },
    {
      id: 'stakeholder-position',
      title: '2.4 Stakeholder Position Mapping',
      description: 'Where do they stand now vs. where you need them?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Stakeholder', 'Current Position', 'Desired Position', 'Gap', 'Strategy to Move'],
        rows: [
          ['', 'Support / Neutral / Oppose', 'Support / Neutral / Oppose', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ]
      },
      helpText: 'Plan how to move each stakeholder.'
    },
    {
      id: 'influence-network',
      title: '2.5 Stakeholder Influence Network',
      description: 'Who influences whom?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Stakeholder', 'Influenced By', 'Influences'],
        rows: [
          ['', '', ''],
          ['', '', ''],
          ['', '', '']
        ]
      },
      helpText: 'Sometimes you influence the influencer.'
    },
    {
      id: 'credibility-assessment',
      title: '3.1 Credibility Assessment',
      description: 'Rate your credibility with each stakeholder',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Self-Rating (1-5)', 'Evidence', 'Improvement Plan'],
        rows: [
          ['Do I understand their domain?', '', '', ''],
          ['Have I delivered on past commitments?', '', '', ''],
          ['Do I follow through on promises?', '', '', ''],
          ['Do I respect their constraints?', '', '', ''],
          ['Have I built personal rapport?', '', '', '']
        ]
      },
      helpText: 'Credibility is earned over time.'
    },
    {
      id: 'influence-strategy',
      title: '3.2 Influence Strategy Menu',
      description: 'Choose your influence approach',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Strategy', 'When to Use', 'How to Execute', 'Your Application'],
        rows: [
          ['Shared Understanding', '', 'Create documents that force clarity', ''],
          ['Transparency', '', 'Share the "why" behind decisions', ''],
          ['Radical Candor', '', 'Challenge directly while caring personally', ''],
          ['Pre-Mortems', '', 'Get dissenting voices heard early', ''],
          ['Credit Sharing', '', '"We did this" not "I did this"', ''],
          ['Obligation Banking', '', 'Do favors before you need them', ''],
          ['Coalition Building', '', 'Build support from multiple stakeholders first', '']
        ]
      },
      helpText: 'Match strategy to situation.'
    },
    {
      id: 'influence-plan',
      title: '3.3 Influence Plan per Stakeholder',
      description: 'Plan your approach for each',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Stakeholder', 'Current Relationship', 'Target Relationship', 'Influence Strategy', 'Touchpoint Plan'],
        rows: [
          ['', 'Trust / Neutral / Distrust', 'Trust', '', 'Weekly 1:1 / Monthly / As needed'],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ]
      },
      helpText: 'Be intentional about relationships.'
    },
    {
      id: 'request-intake',
      title: '4.1 Request Intake',
      description: 'Document the request',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Who Made the Request', ''],
          ['What Was Requested', ''],
          ['When Was It Requested', ''],
          ['Context of Request', ''],
          ['Stated Reason', ''],
          ['Real Reason', '']
        ]
      },
      helpText: 'Understand the real request.'
    },
    {
      id: 'say-yes-framework',
      title: '4.2 Say YES Framework',
      description: 'When should you say yes?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Criterion', 'Does This Request Meet It?', 'Evidence'],
        rows: [
          ['Aligns with product strategy and vision', 'Yes / No / Partially', ''],
          ['You understand the customer problem deeply', 'Yes / No', ''],
          ['Opportunity size justifies investment', 'Yes / No', ''],
          ['You have resources to do it well', 'Yes / No', ''],
          ['Creates compounding value', 'Yes / No', ''],
          ['Overall', 'YES / NO / NOT NOW', '']
        ]
      },
      helpText: 'Say yes strategically.'
    },
    {
      id: 'say-no-framework',
      title: '4.3 Say NO Framework',
      description: 'When should you say no?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Criterion', 'Does This Request Meet It?', 'Evidence'],
        rows: [
          ['It\'s a "fast follow" without strategic merit', 'Yes / No', ''],
          ['Customer segment isn\'t your ICP', 'Yes / No', ''],
          ['Creates technical debt that\'ll slow you later', 'Yes / No', ''],
          ['Would make product worse for most users', 'Yes / No', ''],
          ['You don\'t have resources to do it right', 'Yes / No', ''],
          ['Overall', 'NO / NOT NOW', '']
        ]
      },
      helpText: 'Say no kindly but firmly.'
    },
    {
      id: 'not-now-pile',
      title: '4.4 The "Not Now" Pile',
      description: 'Track deferred requests',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Request', 'Priority', 'When to Revisit', 'Who Requested', 'Status'],
        rows: [
          ['', 'P1 / P2 / P3', '', '', 'Backlog / Killed'],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ]
      },
      helpText: '"Not now" is often better than "no".'
    },
    {
      id: 'engineering-strategy',
      title: '5.1 Engineering Stakeholders',
      description: 'How to work with engineering',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Aspect', 'Strategy'],
        rows: [
          ['What They Value', 'Technical excellence, manageable scope, respect for constraints'],
          ['Common Concerns', 'Overpromising, technical debt, unrealistic timelines'],
          ['How to Earn Credibility', 'Understand tech constraints, never commit without them, defend focus time'],
          ['How to Handle Resistance', 'Ask "what specifically blocks this?", involve in solution'],
          ['Red Flags', 'Vague estimates, silent disagreement, "fine, we\'ll do it your way"']
        ]
      },
      helpText: 'Engineers want to ship. Understand their constraints.'
    },
    {
      id: 'sales-strategy',
      title: '5.3 Sales Stakeholders',
      description: 'How to work with sales',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Aspect', 'Strategy'],
        rows: [
          ['What They Value', 'Competitive parity, deal-closing features, responsive PMs'],
          ['Common Concerns', 'Losing deals, slow response, product doesn\'t match market'],
          ['How to Earn Credibility', 'Join customer calls, respond quickly, explain trade-offs'],
          ['How to Handle Resistance', '"Which deals specifically?", "Is this one customer or market?"'],
          ['Red Flags', '"Competitor X has this", vague customer feedback, one-off requests']
        ]
      },
      helpText: 'Sales has market info. Validate patterns.'
    },
    {
      id: 'marketing-strategy',
      title: '5.4 Marketing Stakeholders',
      description: 'How to work with marketing',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Aspect', 'Strategy'],
        rows: [
          ['What They Value', 'Compelling narrative, press-worthy launches, clear positioning'],
          ['Common Concerns', 'Late notice, unclear messaging, product doesn\'t match story'],
          ['How to Earn Credibility', 'Share roadmap early, align on messaging, give them wins'],
          ['How to Handle Resistance', '"What story are you trying to tell?", find product truth'],
          ['Red Flags', 'Launch date set before product ready, overpromising in press']
        ]
      },
      helpText: 'Marketing needs time to craft stories.'
    },
    {
      id: 'executive-strategy',
      title: '5.5 Executive Stakeholders',
      description: 'How to work with executives',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Aspect', 'Strategy'],
        rows: [
          ['What They Value', 'Business outcomes, strategic alignment, no surprises'],
          ['Common Concerns', 'Missing goals, competitive threats, resource waste'],
          ['How to Earn Credibility', 'Tie work to business outcomes, escalate early, bring options'],
          ['How to Handle Resistance', 'Acknowledge vision, surface trade-offs, offer "yes, if..."'],
          ['Red Flags', '"Why isn\'t this done?", comparing to competitors, sudden priority shifts']
        ]
      },
      helpText: 'Executives want options, not problems.'
    },
    {
      id: 'legal-strategy',
      title: '5.6 Legal/Compliance Stakeholders',
      description: 'How to work with legal',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Aspect', 'Strategy'],
        rows: [
          ['What They Value', 'Early engagement, no surprises, documentation'],
          ['Common Concerns', 'Lawsuits, regulatory violations, data privacy'],
          ['How to Earn Credibility', 'Engage BEFORE launch, provide full context, respect authority'],
          ['How to Handle Resistance', '"What specifically creates risk?", "Is there a safe path to yes?"'],
          ['Red Flags', 'Brought in at last minute, vague concerns, "we can\'t do this"']
        ]
      },
      helpText: 'Legal is a partner, not a blocker.'
    },
    {
      id: 'customer-strategy',
      title: '5.7 Customer Stakeholders',
      description: 'How to work with customers',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Aspect', 'Strategy'],
        rows: [
          ['What They Value', 'Their problem solved, being heard, product that works'],
          ['Common Concerns', 'Ignored requests, broken promises, poor UX'],
          ['How to Earn Credibility', 'Talk to them directly, show you listened, follow through'],
          ['How to Handle Resistance', '"Tell me more about the last time...", dig to real job'],
          ['Red Flags', 'Only hearing from loudest customers, feature requests without context']
        ]
      },
      helpText: 'Customers have problems, not solutions.'
    },
    {
      id: 'conflict-type',
      title: '6.1 Conflict Type Identification',
      description: 'What type of conflict is this?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Conflict Type', 'Signs', 'Resolution Approach'],
        rows: [
          ['Goal Conflict', 'Different definitions of success', 'Align on shared outcome'],
          ['Resource Conflict', 'Competing for same resources', 'Prioritize transparently'],
          ['Information Asymmetry', 'One side has info other doesn\'t', 'Share context openly'],
          ['Values Conflict', 'Different priorities/principles', 'Find higher-level shared value'],
          ['Relationship Conflict', 'Personal tension, history', '1:1 conversation, reset']
        ]
      },
      helpText: 'Name the conflict type to resolve it.'
    },
    {
      id: 'conflict-resolution',
      title: '6.2 Conflict Resolution Framework',
      description: 'Step-by-step resolution',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Step', 'Description'],
        rows: [
          ['Step 1: Understand Both Sides', 'Document each side\'s position, interest, and fear'],
          ['Step 2: Find Shared Ground', 'What do both sides agree on?'],
          ['Step 3: Generate Options', 'Create multiple win-win options'],
          ['Step 4: Facilitate Conversation', 'Bring parties together with ground rules']
        ]
      },
      helpText: 'Facilitate, don\'t dictate.'
    },
    {
      id: 'conflict-understand',
      title: 'Understand Both Sides',
      description: 'Document each perspective',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Side', 'Their Position', 'Their Interest', 'Their Fear'],
        rows: [
          ['Side A', '', '', ''],
          ['Side B', '', '', '']
        ]
      },
      helpText: 'Position vs. Interest is key.'
    },
    {
      id: 'conflict-options',
      title: 'Generate Options',
      description: 'Create win-win solutions',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Option', 'How Side A Benefits', 'How Side B Benefits', 'Trade-offs'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', '']
        ]
      },
      helpText: 'Multiple options enable choice.'
    },
    {
      id: 'communication-plan',
      title: '7.1 Communication Plan',
      description: 'Plan your messaging',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Stakeholder', 'Key Message', 'Channel', 'Timing', 'Owner'],
        rows: [
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ]
      },
      helpText: 'Tailor message to audience.'
    },
    {
      id: 'communication-checklist',
      title: '7.2 Communication Checklist',
      description: 'Did you communicate effectively?',
      fieldType: 'checkbox' as const,
      required: true,
      options: [
        { value: 'why', label: 'Have I shared the "why" behind this decision?' },
        { value: 'acknowledged', label: 'Have I acknowledged their concerns?' },
        { value: 'trade-offs', label: 'Have I been clear about trade-offs?' },
        { value: 'respond', label: 'Have I given them a chance to respond?' },
        { value: 'documented', label: 'Have I documented the decision and rationale?' },
        { value: 'review', label: 'Have I set a review date?' }
      ],
      helpText: 'Over-communicate, not under.'
    },
    {
      id: 'decision-log',
      title: '7.3 Decision Documentation',
      description: 'Document the decision',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Decision', ''],
          ['Date', ''],
          ['Decided By', ''],
          ['Context', ''],
          ['Options Considered', ''],
          ['Decision Rationale', ''],
          ['Dissenting Views', ''],
          ['Review Date', '']
        ]
      },
      helpText: 'Document for future reference.'
    },
    {
      id: 'stakeholder-scorecard',
      title: '8. Stakeholder Management Scorecard',
      description: 'Rate yourself on each dimension',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Dimension', 'Score (1-5)', 'Evidence', 'Improvement Plan'],
        rows: [
          ['Stakeholder Mapping', '', '', ''],
          ['Influence Without Authority', '', '', ''],
          ['Saying Yes/No Effectively', '', '', ''],
          ['Engineering Relationship', '', '', ''],
          ['Sales Relationship', '', '', ''],
          ['Executive Relationship', '', '', ''],
          ['Conflict Resolution', '', '', ''],
          ['Communication', '', '', '']
        ]
      },
      helpText: 'Target: 30+ out of 40.'
    },
    {
      id: 'final-stakeholder-plan',
      title: '9. Final Stakeholder Plan',
      description: 'Summarize your approach',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Decision/Initiative', ''],
          ['Key Stakeholders', ''],
          ['Who Needs to Move', ''],
          ['Influence Strategy', ''],
          ['Communication Plan', ''],
          ['Potential Conflicts', ''],
          ['Resolution Approach', ''],
          ['Success Looks Like', '']
        ]
      },
      helpText: 'One cohesive plan.'
    },
    {
      id: 'post-decision-review-stakeholder',
      title: '10. Post-Decision Review',
      description: 'Review after the fact',
      fieldType: 'table' as const,
      required: false,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['Did stakeholders feel heard?', ''],
          ['Who was surprised?', ''],
          ['Who was happy/unhappy?', ''],
          ['What relationships improved?', ''],
          ['What relationships need work?', ''],
          ['What would I do differently?', '']
        ]
      },
      helpText: 'Relationships are long-term.'
    }
  ],
  outputFormat: 'markdown' as const,
  version: '1.0'
};
