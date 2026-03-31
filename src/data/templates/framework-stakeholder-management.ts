import { Template } from '@/types';

export const stakeholderManagementTemplate: Template = {
  id: 'framework-stakeholder-management',
  name: 'Stakeholder Management Decision Framework',
  description: 'Comprehensive framework for stakeholder management: mapping, influence strategies, saying yes/no, conflict resolution, and communication planning',
  industryId: 'saas',
  scenarioId: 'stakeholder-alignment',
  frameworkIds: ['rice', 'swot'],
  outputFormat: 'markdown',
  estimatedCompletionTime: '2-3 hours',
  version: '1.0.0',
  sections: [
    {
      id: 'decision-context',
      title: 'Decision Context',
      description: 'Define the decision or initiative requiring stakeholder alignment',
      fieldType: 'table',
      required: true,
      helpText: 'Set the stage for your stakeholder management exercise',
      learnContentId: 'decision-context',
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Decision/Initiative', ''],
          ['Date', ''],
          ['Product', ''],
          ['Who Is Deciding', ''],
          ['Decision Deadline', ''],
          ['Stakeholder Complexity', 'Low / Medium / High / Critical'],
        ]
      }
    },
    {
      id: 'stakeholder-identification',
      title: 'Identify All Stakeholders',
      description: 'List everyone affected by or able to affect this decision',
      fieldType: 'table',
      required: true,
      helpText: 'Cast a wide net - missing stakeholders become blockers later',
      learnContentId: 'stakeholder-mapping',
      tableSchema: {
        columns: ['Stakeholder', 'Role', 'Team', 'Contact'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
        ]
      }
    },
    {
      id: 'power-interest-grid',
      title: 'Stakeholder Power-Interest Grid',
      description: 'Plot each stakeholder by power and interest',
      fieldType: 'table',
      required: true,
      helpText: 'High power + high interest = manage closely',
      learnContentId: 'stakeholder-mapping',
      tableSchema: {
        columns: ['Stakeholder', 'Power (1-10)', 'Interest (1-10)', 'Quadrant'],
        rows: [
          ['', '', '', 'Manage Closely / Keep Satisfied / Keep Informed / Monitor'],
          ['', '', '', 'Manage Closely / Keep Satisfied / Keep Informed / Monitor'],
          ['', '', '', 'Manage Closely / Keep Satisfied / Keep Informed / Monitor'],
          ['', '', '', 'Manage Closely / Keep Satisfied / Keep Informed / Monitor'],
        ]
      }
    },
    {
      id: 'stakeholder-agenda-analysis',
      title: 'Stakeholder Agenda Analysis',
      description: 'Understand what each stakeholder really wants',
      fieldType: 'table',
      required: true,
      helpText: 'Dig beneath stated positions to real interests',
      learnContentId: 'stakeholder-analysis',
      tableSchema: {
        columns: ['Stakeholder', 'What They Say They Want', 'What They Actually Need', 'Hidden Agenda', 'Personal Incentives'],
        rows: [
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
        ]
      }
    },
    {
      id: 'stakeholder-position-mapping',
      title: 'Stakeholder Position Mapping',
      description: 'Map current vs. desired position for each stakeholder',
      fieldType: 'table',
      required: true,
      helpText: 'Identify who needs to move and by how much',
      learnContentId: 'stakeholder-analysis',
      tableSchema: {
        columns: ['Stakeholder', 'Current Position', 'Desired Position', 'Gap', 'Strategy to Move'],
        rows: [
          ['', 'Support / Neutral / Oppose', 'Support / Neutral / Oppose', '', ''],
          ['', 'Support / Neutral / Oppose', 'Support / Neutral / Oppose', '', ''],
          ['', 'Support / Neutral / Oppose', 'Support / Neutral / Oppose', '', ''],
          ['', 'Support / Neutral / Oppose', 'Support / Neutral / Oppose', '', ''],
        ]
      }
    },
    {
      id: 'influence-network',
      title: 'Stakeholder Influence Network',
      description: 'Map who influences whom',
      fieldType: 'table',
      required: true,
      helpText: 'Sometimes you influence the decision-maker through someone they trust',
      learnContentId: 'influence-without-authority',
      tableSchema: {
        columns: ['Stakeholder', 'Influenced By', 'Influences'],
        rows: [
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
        ]
      }
    },
    {
      id: 'credibility-assessment',
      title: 'Credibility Assessment',
      description: 'Assess your credibility with each key stakeholder',
      fieldType: 'table',
      required: true,
      helpText: 'Influence requires credibility - assess yours honestly',
      learnContentId: 'influence-without-authority',
      tableSchema: {
        columns: ['Question', 'Self-Rating (1-5)', 'Evidence', 'Improvement Plan'],
        rows: [
          ['Do I understand their domain?', '', '', ''],
          ['Have I delivered on past commitments?', '', '', ''],
          ['Do I follow through on promises?', '', '', ''],
          ['Do I respect their constraints?', '', '', ''],
          ['Have I built personal rapport?', '', '', ''],
        ]
      }
    },
    {
      id: 'influence-strategy-menu',
      title: 'Influence Strategy Menu',
      description: 'Select influence strategies for each stakeholder',
      fieldType: 'table',
      required: true,
      helpText: 'Different stakeholders require different influence approaches',
      learnContentId: 'influence-without-authority',
      tableSchema: {
        columns: ['Strategy', 'When to Use', 'Your Application'],
        rows: [
          ['Shared Understanding', 'Early alignment', ''],
          ['Transparency', 'Ongoing', ''],
          ['Radical Candor', 'When there is disagreement', ''],
          ['Pre-Mortems', 'Before commitment', ''],
          ['Credit Sharing', 'After success', ''],
          ['Obligation Banking', 'Long-term', ''],
          ['Coalition Building', 'When facing resistance', ''],
        ]
      }
    },
    {
      id: 'influence-plan',
      title: 'Influence Plan per Stakeholder',
      description: 'Define your influence approach for each key stakeholder',
      fieldType: 'table',
      required: true,
      helpText: 'Be intentional about how you build influence',
      learnContentId: 'influence-without-authority',
      tableSchema: {
        columns: ['Stakeholder', 'Current Relationship', 'Target Relationship', 'Influence Strategy', 'Touchpoint Plan'],
        rows: [
          ['', 'Trust / Neutral / Distrust', 'Trust', '', 'Weekly 1:1 / Monthly / As needed'],
          ['', 'Trust / Neutral / Distrust', 'Trust', '', ''],
          ['', 'Trust / Neutral / Distrust', 'Trust', '', ''],
          ['', 'Trust / Neutral / Distrust', 'Trust', '', ''],
        ]
      }
    },
    {
      id: 'request-intake',
      title: 'Request Intake',
      description: 'Document the request you are evaluating',
      fieldType: 'table',
      required: false,
      helpText: 'Understand the real request before responding',
      learnContentId: 'saying-yes-no',
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Who Made the Request', ''],
          ['What Was Requested', ''],
          ['When Was It Requested', ''],
          ['Context of Request', ''],
          ['Stated Reason', ''],
          ['Real Reason', 'Dig deeper'],
        ]
      }
    },
    {
      id: 'say-yes-framework',
      title: 'Say YES Framework',
      description: 'Evaluate whether to say yes to the request',
      fieldType: 'table',
      required: false,
      helpText: 'Say yes when it aligns with strategy and you have capacity',
      learnContentId: 'saying-yes-no',
      tableSchema: {
        columns: ['Criterion', 'Does This Request Meet It?', 'Evidence'],
        rows: [
          ['Aligns with product strategy and vision', 'Yes / No / Partially', ''],
          ['You understand the customer problem deeply', 'Yes / No', ''],
          ['Opportunity size justifies investment', 'Yes / No', ''],
          ['You have resources to do it well', 'Yes / No', ''],
          ['Creates compounding value', 'Yes / No', ''],
          ['Overall', 'YES / NO / NOT NOW', ''],
        ]
      }
    },
    {
      id: 'say-no-framework',
      title: 'Say NO Framework',
      description: 'Evaluate whether to say no to the request',
      fieldType: 'table',
      required: false,
      helpText: 'Say no when it dilutes focus or you cannot do it well',
      learnContentId: 'saying-yes-no',
      tableSchema: {
        columns: ['Criterion', 'Does This Request Meet It?', 'Evidence'],
        rows: [
          ['It is a "fast follow" without strategic merit', 'Yes / No', ''],
          ['Customer segment is not your ICP', 'Yes / No', ''],
          ['Creates technical debt that will slow you later', 'Yes / No', ''],
          ['Would make product worse for most users', 'Yes / No', ''],
          ['You do not have resources to do it right', 'Yes / No', ''],
          ['Overall', 'NO / NOT NOW', ''],
        ]
      }
    },
    {
      id: 'not-now-pile',
      title: 'The "Not Now" Pile',
      description: 'Track requests that are not priorities now',
      fieldType: 'table',
      required: false,
      helpText: 'Not now is often better than no - track these for later',
      learnContentId: 'saying-yes-no',
      tableSchema: {
        columns: ['Request', 'Priority', 'When to Revisit', 'Who Requested', 'Status'],
        rows: [
          ['', 'P1 / P2 / P3', '', '', 'Backlog / Killed'],
          ['', 'P1 / P2 / P3', '', '', 'Backlog / Killed'],
          ['', 'P1 / P2 / P3', '', '', 'Backlog / Killed'],
        ]
      }
    },
    {
      id: 'engineering-strategy',
      title: 'Engineering Stakeholder Strategy',
      description: 'Define your approach for engineering stakeholders',
      fieldType: 'table',
      required: false,
      helpText: 'Engineering values technical excellence and realistic scope',
      learnContentId: 'stakeholder-specific-strategies',
      tableSchema: {
        columns: ['Aspect', 'Strategy'],
        rows: [
          ['What They Value', 'Technical excellence, manageable scope, respect for constraints'],
          ['Common Concerns', 'Overpromising, technical debt, unrealistic timelines'],
          ['How to Earn Credibility', 'Understand tech constraints, never commit without them, defend focus time'],
          ['How to Handle Resistance', 'Ask "what specifically blocks this?", involve in solution'],
          ['Red Flags', 'Vague estimates, silent disagreement, "fine, we will do it your way"'],
        ]
      }
    },
    {
      id: 'sales-strategy',
      title: 'Sales Stakeholder Strategy',
      description: 'Define your approach for sales stakeholders',
      fieldType: 'table',
      required: false,
      helpText: 'Sales values deal-closing features and responsive PMs',
      learnContentId: 'stakeholder-specific-strategies',
      tableSchema: {
        columns: ['Aspect', 'Strategy'],
        rows: [
          ['What They Value', 'Competitive parity, deal-closing features, responsive PMs'],
          ['Common Concerns', 'Losing deals, slow response, product does not match market'],
          ['How to Earn Credibility', 'Join customer calls, respond quickly, explain trade-offs clearly'],
          ['How to Handle Resistance', 'Which deals specifically? Is this one customer or market?'],
          ['Red Flags', 'Competitor X has this, vague customer feedback, one-off requests'],
        ]
      }
    },
    {
      id: 'executive-strategy',
      title: 'Executive Stakeholder Strategy',
      description: 'Define your approach for executive stakeholders',
      fieldType: 'table',
      required: false,
      helpText: 'Executives value business outcomes and strategic alignment',
      learnContentId: 'stakeholder-specific-strategies',
      tableSchema: {
        columns: ['Aspect', 'Strategy'],
        rows: [
          ['What They Value', 'Business outcomes, strategic alignment, no surprises'],
          ['Common Concerns', 'Missing goals, competitive threats, resource waste'],
          ['How to Earn Credibility', 'Tie work to business outcomes, escalate early, bring options not problems'],
          ['How to Handle Resistance', 'Acknowledge vision, surface trade-offs, offer path to yes, if...'],
          ['Red Flags', 'Why is not this done?, comparing to competitors, sudden priority shifts'],
        ]
      }
    },
    {
      id: 'conflict-identification',
      title: 'Conflict Type Identification',
      description: 'Identify the type of conflict you are facing',
      fieldType: 'table',
      required: false,
      helpText: 'Different conflicts require different resolution approaches',
      learnContentId: 'conflict-resolution',
      tableSchema: {
        columns: ['Conflict Type', 'Signs', 'Resolution Approach', 'Your Situation'],
        rows: [
          ['Goal Conflict', 'Different definitions of success', 'Align on shared outcome', ''],
          ['Resource Conflict', 'Competing for same resources', 'Prioritize transparently', ''],
          ['Information Asymmetry', 'One side has info other does not', 'Share context openly', ''],
          ['Values Conflict', 'Different priorities/principles', 'Find higher-level shared value', ''],
          ['Relationship Conflict', 'Personal tension, history', '1:1 conversation, reset', ''],
        ]
      }
    },
    {
      id: 'conflict-resolution',
      title: 'Conflict Resolution Framework',
      description: 'Work through the conflict resolution steps',
      fieldType: 'markdown',
      required: false,
      helpText: 'Find shared ground and generate win-win options',
      learnContentId: 'conflict-resolution',
      placeholder: `**Step 1: Understand Both Sides**

| Side | Their Position | Their Interest | Their Fear |
|------|----------------|----------------|------------|
| Side A | | | |
| Side B | | | |

**Step 2: Find Shared Ground**

| Question | Answer |
|----------|--------|
| What do both sides agree on? | |
| What is the higher-level shared goal? | |
| What would a win-win look like? | |

**Step 3: Generate Options**

| Option | How Side A Benefits | How Side B Benefits | Trade-offs |
|--------|---------------------|---------------------|------------|
| 1 | | | |
| 2 | | | |
| 3 | | | |`,
    },
    {
      id: 'communication-plan',
      title: 'Communication Plan',
      description: 'Plan your message for each stakeholder',
      fieldType: 'table',
      required: true,
      helpText: 'Different stakeholders need different messages',
      learnContentId: 'communication-planning',
      tableSchema: {
        columns: ['Stakeholder', 'Key Message', 'Channel', 'Timing', 'Owner'],
        rows: [
          ['', '', 'Email / Meeting / Slack / Doc', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
        ]
      }
    },
    {
      id: 'decision-documentation',
      title: 'Decision Documentation',
      description: 'Document the decision and rationale',
      fieldType: 'table',
      required: true,
      helpText: 'Good decisions are documented decisions',
      learnContentId: 'decision-documentation',
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Decision', ''],
          ['Date', ''],
          ['Decided By', ''],
          ['Context', ''],
          ['Options Considered', '1. \n2. \n3.'],
          ['Decision Rationale', ''],
          ['Dissenting Views', ''],
          ['Review Date', ''],
        ]
      }
    },
    {
      id: 'final-stakeholder-plan',
      title: 'Final Stakeholder Plan',
      description: 'Synthesize your stakeholder management approach',
      fieldType: 'table',
      required: true,
      helpText: 'Bring it all together into an actionable plan',
      learnContentId: 'stakeholder-management',
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Decision/Initiative', ''],
          ['Key Stakeholders', ''],
          ['Who Needs to Move', '(From oppose/neutral to support)'],
          ['Influence Strategy', ''],
          ['Communication Plan', ''],
          ['Potential Conflicts', ''],
          ['Resolution Approach', ''],
          ['Success Looks Like', ''],
        ]
      }
    },
  ],
};
