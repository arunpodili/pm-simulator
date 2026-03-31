// Section 8: Leadership & Growth Decision Framework

export const leadershipGrowthTemplate = {
  id: 'mastery-section-8',
  name: 'Leadership & Growth Mastery',
  description: 'Master hiring PMs, team structures, developing PMs, and career ladders',
  category: 'mastery' as const,
  estimatedCompletionTime: '60-90 min',
  sections: [
    {
      id: 'leadership-context',
      title: '1. Leadership Context',
      description: 'Define your leadership situation',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Current Role', ''],
          ['Team Size', ''],
          ['Reports (Direct/Indirect)', ''],
          ['Leadership Challenge', ''],
          ['Career Goal (1 year)', ''],
          ['Career Goal (3 year)', ''],
          ['Career Goal (5 year)', '']
        ]
      },
      helpText: 'Know where you are and where you\'re going.'
    },
    {
      id: 'pm-hiring-scorecard',
      title: '2.1 PM Hiring Scorecard',
      description: 'Define what great looks like',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Dimension', 'Weight', 'What Great Looks Like', 'How to Assess'],
        rows: [
          ['Product Sense', '25%', '', 'Product critique exercise'],
          ['Analytical Thinking', '20%', '', 'Case study / Metrics exercise'],
          ['Execution', '20%', '', 'Past project deep-dive'],
          ['Communication', '15%', '', 'Presentation / Writing sample'],
          ['Leadership', '10%', '', 'Behavioral questions'],
          ['Culture Add', '10%', '', 'Values alignment'],
          ['Total', '100%', '', '']
        ]
      },
      helpText: 'Scorecards reduce bias. Define great before you interview.'
    },
    {
      id: 'pm-hiring-interview',
      title: '2.2 PM Interview Loop',
      description: 'Design your interview process',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Round', 'Interviewer', 'Focus Area', 'Duration', 'Decision Criteria'],
        rows: [
          ['Recruiter Screen', 'Recruiter', 'Basic fit', '30 min', 'Pass / No Pass'],
          ['Hiring Manager', 'HM', 'Leadership, execution', '45 min', 'Strong Yes / Yes / No / Strong No'],
          ['Product Sense', 'Senior PM', 'Product thinking', '45 min', ''],
          ['Analytical', 'PM/Data', 'Metrics, SQL', '45 min', ''],
          ['Technical', 'Eng Lead', 'Tech fluency', '45 min', ''],
          ['Cross-functional', 'Design/Eng', 'Collaboration', '45 min', ''],
          ['Executive', 'VP/CPO', 'Strategy, culture', '30 min', ''],
          ['Reference Check', 'HM/Recruiter', 'Past performance', '30 min', '']
        ]
      },
      helpText: 'Each round should assess something different. No overlap.'
    },
    {
      id: 'pm-hiring-questions',
      title: '2.3 PM Interview Questions',
      description: 'Question bank by competency',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Competency', 'Question', 'What Good Sounds Like', 'Red Flags'],
        rows: [
          ['Product Sense', 'Pick a product you love. What makes it great?', '', ''],
          ['Strategy', 'How would you monetize [product]?', '', ''],
          ['Execution', 'Tell me about a time you shipped something hard.', '', ''],
          ['Analytics', 'Metric X dropped 20%. How do you investigate?', '', ''],
          ['Leadership', 'Tell me about a time you influenced without authority.', '', ''],
          ['Customer Focus', 'How do you know what customers want?', '', ''],
          ['Prioritization', 'How do you decide what to build next?', '', '']
        ]
      },
      helpText: 'Great answers are specific, structured, and customer-focused.'
    },
    {
      id: 'pm-hiring-exercise',
      title: '2.4 PM Take-Home Exercise',
      description: 'Practical assessment',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Section', 'Prompt', 'Evaluation Criteria'],
        rows: [
          ['Problem Definition', 'Define the problem we\'re solving', 'Clarity, customer focus'],
          ['Solution Design', 'Propose a solution', 'Creativity, feasibility'],
          ['Metrics', 'How will you measure success?', 'Specificity, relevance'],
          ['Prioritization', 'What would you build first?', 'Reasoning, trade-offs'],
          ['Communication', 'Present your thinking', 'Clarity, structure']
        ]
      },
      helpText: 'Keep exercises under 2 hours. Pay candidates for their time.'
    },
    {
      id: 'pm-hiring-evaluation',
      title: '2.5 Candidate Evaluation',
      description: 'Structured evaluation',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Candidate', 'Overall Score', 'Strengths', 'Concerns', 'Recommendation', 'Level'],
        rows: [
          ['', '1-5', '', '', 'Hire / No Hire / Debatable', ''],
          ['', '', '', '', '', ''],
          ['', '', '', '', '', '']
        ]
      },
      helpText: 'Write your evaluation before the debrief. Don\'t be influenced.'
    },
    {
      id: 'team-structure-types',
      title: '3.1 Team Structure Types',
      description: 'Choose your org structure',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Structure Type', 'Pros', 'Cons', 'Best For', 'Your Fit'],
        rows: [
          ['Functional (by discipline)', 'Deep expertise, clear career paths', 'Siloed, slow decisions', 'Early stage', ''],
          ['Product-aligned (by product)', 'Fast, customer-focused, clear ownership', 'Duplication, inconsistent', 'Growth stage', ''],
          ['Customer segment (by persona)', 'Deep customer understanding', 'Platform challenges', 'Multi-segment', ''],
          ['Growth vs Core', 'Dedicated growth focus', 'Can create tension', 'PLG companies', ''],
          ['Platform vs Feature', 'Technical excellence', 'Can lose customer focus', 'Technical products', ''],
          ['Matrix', 'Flexibility, resource optimization', 'Complex, dual reporting', 'Large orgs', '']
        ]
      },
      helpText: 'Structure follows strategy. Change it when strategy changes.'
    },
    {
      id: 'team-structure-design',
      title: '3.2 Team Structure Design',
      description: 'Design your ideal org',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Team', 'Mission', 'PMs', 'Designers', 'Engineers', 'Key Metrics'],
        rows: [
          ['Team A', '', '', '', '', ''],
          ['Team B', '', '', '', '', ''],
          ['Team C', '', '', '', '', ''],
          ['Platform', '', '', '', '', ''],
          ['Growth', '', '', '', '', '']
        ]
      },
      helpText: 'Two-pizza teams. Clear missions. Ownable metrics.'
    },
    {
      id: 'team-structure-evolution',
      title: '3.3 Team Structure Evolution',
      description: 'Plan for growth',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Stage', 'Team Size', 'Structure', 'PM:Eng Ratio', 'Key Hires Needed'],
        rows: [
          ['Current', '', '', '', ''],
          ['6 months', '', '', '', ''],
          ['12 months', '', '', '', ''],
          ['24 months', '', '', '', '']
        ]
      },
      helpText: 'Plan your org for where you\'re going, not where you are.'
    },
    {
      id: 'pm-career-ladder',
      title: '4.1 PM Career Ladder',
      description: 'Define levels clearly',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Level', 'Scope', 'Impact', 'Autonomy', 'Leadership'],
        rows: [
          ['APM / PM I', 'Feature-level', 'Team', 'Close guidance', 'Self'],
          ['PM II', 'Feature/small product', 'Team/Product', 'Moderate guidance', 'Self + mentors'],
          ['Senior PM', 'Product area', 'Product/Business', 'High autonomy', 'Team'],
          ['Staff PM', 'Multiple products', 'Business', 'Strategic', 'Multiple teams'],
          ['Principal PM', 'Company-wide', 'Company/Industry', 'Vision-setting', 'Organization'],
          ['VP Product', 'All products', 'Company', 'Executive', 'All PMs'],
          ['CPO', 'Product + Strategy', 'Company + Market', 'Board-level', 'Executive team']
        ]
      },
      helpText: 'Levels are about scope and impact, not tenure.'
    },
    {
      id: 'pm-competency-framework',
      title: '4.2 PM Competency Framework',
      description: 'Skills by level',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Competency', 'PM II', 'Senior PM', 'Staff PM', 'Principal PM'],
        rows: [
          ['Product Sense', '', '', '', ''],
          ['Strategy', '', '', '', ''],
          ['Execution', '', '', '', ''],
          ['Analytics', '', '', '', ''],
          ['Communication', '', '', '', ''],
          ['Leadership', '', '', '', ''],
          ['Domain Expertise', '', '', '', '']
        ]
      },
      helpText: 'Define what great looks like at each level.'
    },
    {
      id: 'pm-promotion-package',
      title: '4.3 Promotion Package Template',
      description: 'What to prepare for promotion',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Section', 'Content', 'Evidence'],
        rows: [
          ['Scope Evolution', 'How has scope grown?', ''],
          ['Key Achievements', 'Top 3-5 accomplishments', ''],
          ['Impact Metrics', 'Quantified business impact', ''],
          ['Leadership Examples', 'Times led without authority', ''],
          ['Peer Feedback', 'Testimonials from partners', ''],
          ['Stretch Work', 'Examples of next-level work', ''],
          ['Growth Areas', 'What\'s improved since last cycle', '']
        ]
      },
      helpText: 'Promotions are earned before the package. Document the journey.'
    },
    {
      id: 'pm-development-plan',
      title: '5.1 PM Development Plan',
      description: 'Individual growth plan',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Area to Develop', 'Current Level', 'Target Level', 'Development Activities', 'Timeline', 'Success Metric'],
        rows: [
          ['', '', '', '', '', ''],
          ['', '', '', '', '', ''],
          ['', '', '', '', '', ''],
          ['', '', '', '', '', '']
        ]
      },
      helpText: 'Development is a partnership. Manager supports, PM owns.'
    },
    {
      id: 'pm-development-activities',
      title: '5.2 Development Activities Menu',
      description: 'Ways to grow',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Activity Type', 'Examples', 'Time Commitment', 'Best For'],
        rows: [
          ['On-the-job', 'Stretch project, new domain', 'Ongoing', 'Execution, leadership'],
          ['Mentorship', 'Internal mentor, external coach', 'Monthly', 'Career navigation'],
          ['Training', 'Courses, workshops', 'Weekly', 'Skill building'],
          ['Reading', 'Books, articles', 'Daily', 'Knowledge'],
          ['Speaking', 'Presentations, conferences', 'Occasional', 'Communication'],
          ['Writing', 'Blog posts, docs', 'Occasional', 'Clarity of thought'],
          ['Networking', 'Industry events, peer groups', 'Monthly', 'Perspective']
        ]
      },
      helpText: '70-20-10 rule: 70% on-job, 20% relationships, 10% formal.'
    },
    {
      id: 'pm-feedback-template',
      title: '5.3 PM Feedback Template',
      description: 'Structured feedback format',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Dimension', 'Strengths', 'Areas to Improve', 'Specific Examples'],
        rows: [
          ['Product Sense', '', '', ''],
          ['Strategy', '', '', ''],
          ['Execution', '', '', ''],
          ['Analytics', '', '', ''],
          ['Communication', '', '', ''],
          ['Leadership', '', '', ''],
          ['Collaboration', '', '', '']
        ]
      },
      helpText: 'Feedback is specific, actionable, and timely. Give it often.'
    },
    {
      id: 'pm-1on1-template',
      title: '5.4 PM 1:1 Template',
      description: 'Manager-PM weekly check-in',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Section', 'Topics', 'Notes'],
        rows: [
          ['Personal Check-in', 'How are you doing?', ''],
          ['Wins', 'What went well?', ''],
          ['Challenges', 'What\'s hard?', ''],
          ['Priorities', 'Top 3 this week', ''],
          ['Blockers', 'What do you need?', ''],
          ['Feedback', 'Mutual feedback', ''],
          ['Career', 'Long-term growth', ''],
          ['Action Items', 'Who does what by when', '']
        ]
      },
      helpText: '1:1s are for the PM, not the manager. Protect the time.'
    },
    {
      id: 'leadership-situational',
      title: '6.1 Situational Leadership',
      description: 'Adapt your style',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Situation', 'Team Member Level', 'Leadership Style', 'Your Approach'],
        rows: [
          ['New team member', 'Low competence, high commitment', 'Directing', ''],
          ['Learning new skill', 'Some competence, low commitment', 'Coaching', ''],
          ['Experienced but hesitant', 'High competence, variable commitment', 'Supporting', ''],
          ['Expert team member', 'High competence, high commitment', 'Delegating', '']
        ]
      },
      helpText: 'Match your style to the person and situation. One size doesn\'t fit all.'
    },
    {
      id: 'leadership-delegation',
      title: '6.2 Delegation Framework',
      description: 'What to delegate and how',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Task/Decision', 'Who', 'Level of Delegation', 'Check-in Cadence', 'Success Criteria'],
        rows: [
          ['', '', 'Do it / Recommend then act / Act then report / Report regularly', '', '']
        ]
      },
      helpText: 'Delegate outcomes, not tasks. Trust but verify.'
    },
    {
      id: 'leadership-decision-rights',
      title: '6.3 Decision Rights Matrix',
      description: 'Who decides what',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Decision Type', 'Who Decides', 'Who Inputs', 'Who is Consulted', 'Who is Informed'],
        rows: [
          ['Product roadmap', '', '', '', ''],
          ['Feature prioritization', '', '', '', ''],
          ['Hiring', '', '', '', ''],
          ['Promotions', '', '', '', ''],
          ['Budget', '', '', '', ''],
          ['Technical architecture', '', '', '', ''],
          ['Go-to-market', '', '', '', '']
        ]
      },
      helpText: 'Clarity on decision rights prevents conflict. Use RACI.'
    },
    {
      id: 'leadership-influence',
      title: '6.4 Influence Without Authority',
      description: 'Lead when you\'re not the boss',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Stakeholder', 'Their Goal', 'Their Constraint', 'How You Help', 'Ask'],
        rows: [
          ['Engineering Lead', '', '', '', ''],
          ['Design Lead', '', '', '', ''],
          ['Sales Lead', '', '', '', ''],
          ['Marketing Lead', '', '', '', ''],
          ['Executive', '', '', '', '']
        ]
      },
      helpText: 'Influence = credibility + relationships + reciprocity. Build all three.'
    },
    {
      id: 'career-planning',
      title: '7.1 Career Planning',
      description: 'Map your career trajectory',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Timeframe', 'Target Role', 'Target Company', 'Skills Needed', 'Gap to Close', 'Action Plan'],
        rows: [
          ['Now', '', '', '', '', ''],
          ['1 year', '', '', '', '', ''],
          ['3 years', '', '', '', '', ''],
          ['5 years', '', '', '', '', ''],
          ['10 years', '', '', '', '', '']
        ]
      },
      helpText: 'Career planning is iterative. Revisit quarterly.'
    },
    {
      id: 'career-options',
      title: '7.2 Career Options',
      description: 'PM career paths',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Path', 'Description', 'Pros', 'Cons', 'Your Fit'],
        rows: [
          ['IC Track (Principal PM)', 'Deep product expertise', 'Focus on craft, high impact', 'Limited people leadership', ''],
          ['Management Track', 'Build and lead teams', 'Multiply impact through others', 'Less hands-on product', ''],
          ['Executive Track', 'CPO/CEO', 'Strategic, company-wide', 'Political, less product', ''],
          ['Founder Track', 'Start your own company', 'Full ownership, unlimited upside', 'High risk, all-consuming', ''],
          ['Advisor/Investor Track', 'VC, advisory', 'Variety, strategic', 'Less hands-on', ''],
          ['Domain Expert Track', 'Deep industry expertise', 'Highly valued in niche', 'Narrower options', '']
        ]
      },
      helpText: 'No single path is right. Choose based on your strengths and goals.'
    },
    {
      id: 'career-brand',
      title: '7.3 Personal Brand',
      description: 'How you\'re known',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Dimension', 'Current Perception', 'Desired Perception', 'Actions to Bridge'],
        rows: [
          ['Expertise', '', '', ''],
          ['Leadership Style', '', '', ''],
          ['Communication', '', '', ''],
          ['Reliability', '', '', ''],
          ['Innovation', '', '', ''],
          ['Collaboration', '', '', '']
        ]
      },
      helpText: 'Your brand is what people say when you leave the room. Shape it intentionally.'
    },
    {
      id: 'career-network',
      title: '7.4 Career Network',
      description: 'Build your support system',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Role', 'Names', 'Relationship Strength', 'Last Contact', 'Next Touchpoint'],
        rows: [
          ['Mentor (career advisor)', '', 'Strong / Medium / Weak', '', ''],
          ['Sponsor (advocates for you)', '', '', '', ''],
          ['Peer Network', '', '', '', ''],
          ['Industry Contacts', '', '', '', ''],
          ['Recruiters', '', '', '', ''],
          ['Former Managers', '', '', '', ''],
          ['Former Reports', '', '', '', '']
        ]
      },
      helpText: 'Network before you need it. Give more than you take.'
    },
    {
      id: 'leadership-scorecard',
      title: '8. Leadership Scorecard',
      description: 'Rate your leadership skills',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Dimension', 'Score (1-5)', 'Evidence', 'Improvement Plan'],
        rows: [
          ['Strategic Thinking', '', '', ''],
          ['Decision Making', '', '', ''],
          ['Communication', '', '', ''],
          ['Team Building', '', '', ''],
          ['Developing Others', '', '', ''],
          ['Influence', '', '', ''],
          ['Execution', '', '', ''],
          ['Emotional Intelligence', '', '', '']
        ]
      },
      helpText: 'Target: 30+ out of 40 for strong leadership.'
    },
    {
      id: 'leadership-philosophy',
      title: '9. Leadership Philosophy',
      description: 'Define your approach',
      fieldType: 'textarea' as const,
      required: true,
      placeholder: 'Write your leadership philosophy:\n\n1. What I believe about people:\n2. What I believe about teams:\n3. What I believe about decision-making:\n4. What I believe about communication:\n5. My non-negotiables:\n6. How I\'ll develop my team:\n7. How I\'ll handle failure:\n8. How I\'ll celebrate success:',
      helpText: 'Your philosophy guides your actions. Write it down.'
    },
    {
      id: 'growth-reflection',
      title: '10. Growth Reflection',
      description: 'Track your journey',
      fieldType: 'table' as const,
      required: false,
      tableSchema: {
        columns: ['Date', 'What I Learned', 'How I Grew', 'What\'s Next'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', '']
        ]
      },
      helpText: 'Reflection turns experience into insight. Do it regularly.'
    }
  ],
  outputFormat: 'markdown' as const,
  version: '1.0'
};
