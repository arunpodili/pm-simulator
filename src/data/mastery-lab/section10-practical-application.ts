// Section 10: Practical Application Decision Framework

export const practicalApplicationTemplate = {
  id: 'mastery-section-10',
  name: 'Practical Application Mastery',
  description: 'Action plans, capstone projects, portfolio building, and career development',
  category: 'mastery' as const,
  estimatedCompletionTime: '60-90 min',
  sections: [
    {
      id: 'career-stage',
      title: '1. Career Stage Assessment',
      description: 'Where are you in your PM journey?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Current Role', ''],
          ['Years as PM', ''],
          ['Years Total Experience', ''],
          ['Career Stage', 'Aspiring / APM / PM / Senior / Staff / Principal / VP / CPO'],
          ['Biggest Challenge Right Now', ''],
          ['Biggest Goal (12 months)', '']
        ]
      },
      helpText: 'Know where you are to plan where you\'re going.'
    },
    {
      id: 'week-1-plan',
      title: '2.1 Week 1 Action Plan',
      description: 'What to do in your first week',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Day', 'Activity', 'Outcome', 'Status'],
        rows: [
          ['Day 1', 'Meet team, set up tools, read docs', '', ''],
          ['Day 2', '1:1s with manager, key partners', '', ''],
          ['Day 3', 'Product demo, user research session', '', ''],
          ['Day 4', 'Metrics deep-dive, analytics access', '', ''],
          ['Day 5', 'Week 1 reflection, plan Week 2', '', '']
        ]
      },
      helpText: 'First week sets the tone. Be curious, ask questions.'
    },
    {
      id: 'month-1-plan',
      title: '2.2 Month 1 Action Plan',
      description: 'First month goals',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Goal', 'Actions', 'Success Metric', 'Status'],
        rows: [
          ['Understand the product', 'Use it daily, read all docs', 'Can demo to others', ''],
          ['Understand the users', '5+ user interviews', 'Can articulate top 3 pain points', ''],
          ['Understand the business', 'Meet stakeholders, read strategy docs', 'Can explain business model', ''],
          ['Understand the tech', 'Architecture review, eng 1:1s', 'Can explain system at high level', ''],
          ['Ship something small', 'Bug fix, small improvement', 'In users\' hands', ''],
          ['Build relationships', '1:1 with all team members', 'Trust established', '']
        ]
      },
      helpText: 'Month 1 is about learning. Don\'t make big changes yet.'
    },
    {
      id: 'quarter-1-plan',
      title: '2.3 Quarter 1 Action Plan',
      description: 'First quarter goals',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Goal', 'Actions', 'Success Metric', 'Status'],
        rows: [
          ['Own a feature area', 'Take over roadmap, prioritization', 'Team sees you as owner', ''],
          ['Ship meaningful feature', 'End-to-end delivery', 'Users adopting, metric moving', ''],
          ['Establish cadence', 'Regular rituals, communication', 'Predictable delivery', ''],
          ['Build credibility', 'Deliver on commitments', 'Partners trust your judgment', ''],
          ['Deepen user knowledge', '10+ customer conversations', 'Can speak to real problems', '']
        ]
      },
      helpText: 'Quarter 1 is about proving you can ship. Build trust through delivery.'
    },
    {
      id: 'year-1-plan',
      title: '2.4 Year 1 Action Plan',
      description: 'First year goals',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Goal', 'Actions', 'Success Metric', 'Status'],
        rows: [
          ['Own a product area', 'Full ownership of roadmap and outcomes', 'Area hitting goals', ''],
          ['Develop expertise', 'Deep knowledge in domain/skill', 'Go-to person for X', ''],
          ['Build influence', 'Lead cross-functional initiatives', 'Others follow your lead', ''],
          ['Mentor others', 'Help junior PMs grow', 'Mentee growth', ''],
          ['Establish thought leadership', 'Write, speak, share knowledge', 'External recognition', '']
        ]
      },
      helpText: 'Year 1 is about impact. Move from output to outcome.'
    },
    {
      id: 'capstone-project',
      title: '3.1 Capstone Project Selection',
      description: 'Choose a project to showcase your skills',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Project Idea', 'Problem Solved', 'Skills Demonstrated', 'Timeline', 'Feasibility'],
        rows: [
          ['New feature for current product', '', 'Discovery, execution, analytics', '', ''],
          ['Internal tool improvement', '', 'Problem-solving, stakeholder mgmt', '', ''],
          ['Side project', '', 'Full product lifecycle', '', ''],
          ['Open source contribution', '', 'Collaboration, technical', '', ''],
          ['Case study write-up', '', 'Analysis, communication', '', '']
        ]
      },
      helpText: 'Capstone projects prove you can do the work. Pick something real.'
    },
    {
      id: 'capstone-planning',
      title: '3.2 Capstone Project Plan',
      description: 'Plan your capstone',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Section', 'Content'],
        rows: [
          ['Problem Statement', ''],
          ['Target Users', ''],
          ['Success Metrics', ''],
          ['Timeline', ''],
          ['Resources Needed', ''],
          ['Risks', ''],
          ['Stakeholders', ''],
          ['Deliverables', '']
        ]
      },
      helpText: 'Treat your capstone like a real product. Plan it thoroughly.'
    },
    {
      id: 'capstone-execution',
      title: '3.3 Capstone Execution Tracker',
      description: 'Track your progress',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Milestone', 'Due Date', 'Status', 'Notes'],
        rows: [
          ['Problem validation complete', '', 'Not Started / In Progress / Complete', ''],
          ['Solution designed', '', '', ''],
          ['MVP built', '', '', ''],
          ['User testing complete', '', '', ''],
          ['Launch complete', '', '', ''],
          ['Results documented', '', '', '']
        ]
      },
      helpText: 'Execution is everything. Ship it.'
    },
    {
      id: 'portfolio-overview',
      title: '4.1 PM Portfolio Overview',
      description: 'What goes in a PM portfolio',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Section', 'What to Include', 'Your Status', 'Notes'],
        rows: [
          ['About Me', 'Bio, photo, value prop', '', ''],
          ['Resume', 'PM-focused resume', '', ''],
          ['Case Studies', '3-5 detailed project write-ups', '', ''],
          ['Product Teardowns', 'Analysis of existing products', '', ''],
          ['Writing', 'Blog posts, articles', '', ''],
          ['Speaking', 'Presentations, talks', '', ''],
          ['Testimonials', 'References, recommendations', '', ''],
          ['Contact', 'How to reach you', '', '']
        ]
      },
      helpText: 'PM portfolios are rare. Having one makes you stand out.'
    },
    {
      id: 'case-study-template',
      title: '4.2 Case Study Template',
      description: 'Structure your case studies',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Section', 'Content Guide', 'Your Content'],
        rows: [
          ['Title', 'Catchy, descriptive', ''],
          ['Problem', 'What was broken', ''],
          ['Context', 'Situation, constraints', ''],
          ['Your Role', 'What you did', ''],
          ['Process', 'How you approached it', ''],
          ['Solution', 'What you built', ''],
          ['Results', 'Quantified impact', ''],
          ['Learnings', 'What you\'d do differently', ''],
          ['Artifacts', 'PRDs, mockups, metrics']
        ]
      },
      helpText: 'Case studies show your thinking. Include artifacts.'
    },
    {
      id: 'case-study-brag-doc',
      title: '4.3 Brag Document',
      description: 'Track your achievements',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Date', 'Achievement', 'Impact', 'Evidence', 'Who Can Vouch'],
        rows: [
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ]
      },
      helpText: 'Update your brag doc weekly. You\'ll forget otherwise.'
    },
    {
      id: 'career-development',
      title: '5.1 Career Development Plan',
      description: 'Plan your growth',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Timeframe', 'Target Role', 'Skills to Build', 'Experiences to Gain', 'People to Know'],
        rows: [
          ['6 months', '', '', '', ''],
          ['1 year', '', '', '', ''],
          ['2 years', '', '', '', ''],
          ['3 years', '', '', '', ''],
          ['5 years', '', '', '', '']
        ]
      },
      helpText: 'Careers are marathons. Plan in multi-year increments.'
    },
    {
      id: 'skill-gap-analysis',
      title: '5.2 Skill Gap Analysis',
      description: 'What you need to learn',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Skill', 'Current Level', 'Target Level', 'How to Close Gap', 'Timeline'],
        rows: [
          ['Product Strategy', '', '', '', ''],
          ['User Research', '', '', '', ''],
          ['Data Analysis', '', '', '', ''],
          ['Technical Fluency', '', '', '', ''],
          ['Communication', '', '', '', ''],
          ['Leadership', '', '', '', ''],
          ['Domain Expertise', '', '', '', '']
        ]
      },
      helpText: 'Be honest about gaps. You can\'t close what you won\'t acknowledge.'
    },
    {
      id: 'experience-gap-analysis',
      title: '5.3 Experience Gap Analysis',
      description: 'What you need to do',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Experience', 'Have I Done It?', 'How to Get It', 'Timeline'],
        rows: [
          ['Shipped a 0→1 product', 'Yes / No', '', ''],
          ['Grown a feature 1→100', '', '', ''],
          ['Managed a P&L', '', '', ''],
          ['Led a cross-functional initiative', '', '', ''],
          ['Hired and managed PMs', '', '', ''],
          ['Presented to executives', '', '', ''],
          ['Spoken at a conference', '', '', ''],
          ['Pivoted based on data', '', '', ''],
          ['Killed a feature', '', '', ''],
          ['Worked with enterprise customers', '', '', '']
        ]
      },
      helpText: 'Experience gaps become career ceilings. Seek them out.'
    },
    {
      id: 'network-map',
      title: '5.4 Network Map',
      description: 'Who you know and need to know',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Category', 'Names', 'Relationship', 'Next Touchpoint'],
        rows: [
          ['Mentors', '', '', ''],
          ['Sponsors', '', '', ''],
          ['Peers', '', '', ''],
          ['Industry Leaders', '', '', ''],
          ['Recruiters', '', '', ''],
          ['Former Managers', '', '', ''],
          ['Former Reports', '', '', ''],
          ['Alumni', '', '', '']
        ]
      },
      helpText: 'Your network is your net worth. Invest in relationships.'
    },
    {
      id: 'interview-prep',
      title: '6.1 PM Interview Prep',
      description: 'Prepare for PM interviews',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question Type', 'Practice Count', 'Confidence', 'Resources'],
        rows: [
          ['Product Design', '', 'Low / Medium / High', ''],
          ['Strategy', '', '', ''],
          ['Estimation', '', '', ''],
          ['Metrics', '', '', ''],
          ['Behavioral', '', '', ''],
          ['Technical', '', '', ''],
          ['Execution', '', '', '']
        ]
      },
      helpText: 'Interviewing is a skill. Practice deliberately.'
    },
    {
      id: 'interview-stories',
      title: '6.2 Interview Story Bank',
      description: 'Prepare your stories',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Story Type', 'Situation', 'Action', 'Result', 'When to Use'],
        rows: [
          ['Conflict resolution', '', '', '', ''],
          ['Failure', '', '', '', ''],
          ['Success', '', '', '', ''],
          ['Influence without authority', '', '', '', ''],
          ['Data-driven decision', '', '', '', ''],
          ['Customer obsession', '', '', '', ''],
          ['Prioritization', '', '', '', ''],
          ['Leadership', '', '', '', '']
        ]
      },
      helpText: 'Have 10-15 stories ready. STAR format them.'
    },
    {
      id: 'interview-questions',
      title: '6.3 Questions to Ask Interviewers',
      description: 'Show you\'re thoughtful',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Who to Ask', 'What It Signals'],
        rows: [
          ['What\'s the biggest challenge the team faces?', 'HM', 'Strategic thinking'],
          ['How do you measure PM success?', 'HM/PM', 'Outcome focus'],
          ['Tell me about a recent product decision.', 'PM', 'Curiosity'],
          ['What\'s your product culture like?', 'PM', 'Culture fit'],
          ['What keeps you up at night?', 'Executive', 'Big picture'],
          ['How do PMs work with engineering?', 'Eng', 'Collaboration']
        ]
      },
      helpText: 'Your questions reveal more than your answers.'
    },
    {
      id: 'job-search-tracker',
      title: '7.1 Job Search Tracker',
      description: 'Manage your pipeline',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Company', 'Role', 'Status', 'Contact', 'Next Step', 'Date'],
        rows: [
          ['', '', 'Applied / Screening / Interviewing / Offer / Rejected', '', '', ''],
          ['', '', '', '', '', ''],
          ['', '', '', '', '', ''],
          ['', '', '', '', '', '']
        ]
      },
      helpText: 'Treat job search like a sales pipeline. Track everything.'
    },
    {
      id: 'company-research',
      title: '7.2 Company Research Template',
      description: 'Research before interviewing',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Area', 'Research Question', 'Answer'],
        rows: [
          ['Business', 'How do they make money?', ''],
          ['Product', 'What are their key products?', ''],
          ['Users', 'Who are their customers?', ''],
          ['Competition', 'Who competes with them?', ''],
          ['Recent News', 'What\'s happening?', ''],
          ['Culture', 'What\'s it like to work there?', ''],
          ['Challenges', 'What problems do they face?', '']
        ]
      },
      helpText: 'Research signals interest. Do your homework.'
    },
    {
      id: 'offer-evaluation',
      title: '7.3 Offer Evaluation',
      description: 'Compare opportunities',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Criterion', 'Weight', 'Offer A', 'Offer B', 'Offer C'],
        rows: [
          ['Role/Scope', '25%', '', '', ''],
          ['Company/Stage', '20%', '', '', ''],
          ['Manager', '15%', '', '', ''],
          ['Compensation', '15%', '', '', ''],
          ['Growth Potential', '15%', '', '', ''],
          ['Culture', '10%', '', '', ''],
          ['Total Score', '100%', '', '', '']
        ]
      },
      helpText: 'Not all offers are equal. Weight what matters to you.'
    },
    {
      id: '90-day-plan',
      title: '8.1 First 90 Days Plan',
      description: 'Plan your first quarter',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Phase', 'Goals', 'Key Activities', 'Success Metrics'],
        rows: [
          ['Days 1-30: Learn', 'Understand product, users, team', '', ''],
          ['Days 31-60: Contribute', 'Ship something, build credibility', '', ''],
          ['Days 61-90: Own', 'Take ownership of area', '', '']
        ]
      },
      helpText: 'The first 90 days set the trajectory. Plan intentionally.'
    },
    {
      id: '90-day-learning',
      title: '8.2 Learning Agenda (Days 1-30)',
      description: 'What to learn first',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Topic', 'How to Learn', 'Who Can Help', 'Done When'],
        rows: [
          ['Product', 'Use it, read docs', '', ''],
          ['Users', 'Interviews, support tickets', '', ''],
          ['Business', 'Strategy docs, stakeholder meetings', '', ''],
          ['Technology', 'Architecture review, eng meetings', '', ''],
          ['Team', '1:1s, observation', '', ''],
          ['Process', 'Attend rituals, ask questions', '', '']
        ]
      },
      helpText: 'Learn before you change. Understand the why.'
    },
    {
      id: '90-day-contributing',
      title: '8.3 Contribution Plan (Days 31-60)',
      description: 'How to start adding value',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Area', 'What to Do', 'Expected Impact', 'Timeline'],
        rows: [
          ['Quick wins', 'Fix obvious issues', 'Team confidence', 'Week 5-6'],
          ['Process improvements', 'Suggest better ways', 'Efficiency', 'Week 6-7'],
          ['Feature work', 'Take on small feature', 'User value', 'Week 7-8'],
          ['Relationships', 'Deepen partner bonds', 'Trust', 'Ongoing']
        ]
      },
      helpText: 'Small wins build momentum. Don\'t swing for fences yet.'
    },
    {
      id: '90-day-owning',
      title: '8.4 Ownership Plan (Days 61-90)',
      description: 'Take full ownership',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Area', 'What Ownership Looks Like', 'Success Metrics', 'Timeline'],
        rows: [
          ['Roadmap', 'Own quarterly roadmap', 'Team alignment', 'Week 9-10'],
          ['Metrics', 'Own area metrics', 'Metric movement', 'Week 10-12'],
          ['Stakeholders', 'Primary contact for area', 'Stakeholder satisfaction', 'Week 11-12'],
          ['Strategy', 'Set area strategy', 'Leadership buy-in', 'Week 12']
        ]
      },
      helpText: 'By day 90, you should be the go-to person for your area.'
    },
    {
      id: 'reflection-template',
      title: '9.1 Weekly Reflection',
      description: 'Review your week',
      fieldType: 'table' as const,
      required: false,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What went well?', ''],
          ['What didn\'t go well?', ''],
          ['What did I learn?', ''],
          ['What will I do differently next week?', ''],
          ['What am I grateful for?', '']
        ]
      },
      helpText: 'Weekly reflection compounds. Do it every Friday.'
    },
    {
      id: 'reflection-monthly',
      title: '9.2 Monthly Reflection',
      description: 'Review your month',
      fieldType: 'table' as const,
      required: false,
      tableSchema: {
        columns: ['Area', 'Progress', 'Lessons', 'Next Month Focus'],
        rows: [
          ['Product', '', '', ''],
          ['Skills', '', '', ''],
          ['Relationships', '', '', ''],
          ['Career', '', '', ''],
          ['Wellbeing', '', '', '']
        ]
      },
      helpText: 'Monthly reviews catch drift. Course-correct regularly.'
    },
    {
      id: 'reflection-quarterly',
      title: '9.3 Quarterly Reflection',
      description: 'Review your quarter',
      fieldType: 'table' as const,
      required: false,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What were my biggest wins?', ''],
          ['What were my biggest misses?', ''],
          ['What did I learn about myself?', ''],
          ['What did I learn about product?', ''],
          ['How have I grown?', ''],
          ['What do I want next quarter?', '']
        ]
      },
      helpText: 'Quarterly reviews are strategic. Think big picture.'
    },
    {
      id: 'action-commitment',
      title: '10. Action Commitment',
      description: 'What you\'ll do next',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Action', 'By When', 'Accountability Partner', 'Status'],
        rows: [
          ['', '', '', 'Not Started / In Progress / Complete'],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', '']
        ]
      },
      helpText: 'Insight without action is worthless. Commit to doing.'
    }
  ],
  outputFormat: 'markdown' as const,
  version: '1.0'
};
