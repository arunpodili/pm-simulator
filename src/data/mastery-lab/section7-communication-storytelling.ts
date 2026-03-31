// Section 7: Communication & Storytelling Decision Framework

export const communicationStorytellingTemplate = {
  id: 'mastery-section-7',
  name: 'Communication & Storytelling Mastery',
  description: 'Master PRDs, one-pagers, roadmaps, release notes, presentations, and demo scripts',
  category: 'mastery' as const,
  estimatedCompletionTime: '60-90 min',
  sections: [
    {
      id: 'communication-context',
      title: '1. Communication Context',
      description: 'Set the stage for your communication',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Communication Type', 'PRD / One-Pager / Roadmap / Release Notes / Presentation / Demo / Other'],
          ['Audience', ''],
          ['Goal of Communication', ''],
          ['Desired Outcome', ''],
          ['Deadline', ''],
          ['Distribution Channel', 'Email / Meeting / Slack / Document / Other'],
          ['Key Stakeholders', '']
        ]
      },
      helpText: 'Know your audience and goal before you start writing.'
    },
    {
      id: 'audience-analysis',
      title: '2. Audience Analysis',
      description: 'Understand who you\'re communicating to',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Audience Segment', 'What They Care About', 'What They Need to Know', 'Their Questions', 'How to Reach Them'],
        rows: [
          ['Executives', '', '', '', ''],
          ['Engineering', '', '', '', ''],
          ['Design', '', '', '', ''],
          ['Sales/CS', '', '', '', ''],
          ['Marketing', '', '', '', ''],
          ['Customers', '', '', '', '']
        ]
      },
      helpText: 'Tailor your message to each audience. One size doesn\'t fit all.'
    },
    {
      id: 'prd-template',
      title: '3.1 PRD Template',
      description: 'Product Requirements Document',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Section', 'Your Content'],
        rows: [
          ['Title & Version', ''],
          ['Problem Statement', 'What problem are we solving?'],
          ['Goals & Success Metrics', 'How will we know we succeeded?'],
          ['Target Users', 'Who are we building for?'],
          ['User Stories', 'As a [user], I want to [action], so that [outcome]'],
          ['Functional Requirements', 'What the product must do'],
          ['Non-Functional Requirements', 'Performance, security, accessibility'],
          ['Out of Scope', 'What we\'re NOT building'],
          ['Open Questions', 'What we still need to figure out'],
          ['Timeline & Milestones', 'Key dates'],
          ['Dependencies', 'What/who we depend on'],
          ['Risks', 'What could go wrong'],
          ['Appendix', 'Research, mockups, technical specs']
        ]
      },
      helpText: 'A good PRD is living documentation. Keep it updated.'
    },
    {
      id: 'prd-user-stories',
      title: '3.2 User Stories Deep Dive',
      description: 'Write clear, testable user stories',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['ID', 'User Story', 'Acceptance Criteria', 'Priority', 'Story Points'],
        rows: [
          ['US-001', 'As a [user], I want to [action], so that [outcome]', '', 'P0 / P1 / P2', ''],
          ['US-002', '', '', '', ''],
          ['US-003', '', '', '', ''],
          ['US-004', '', '', '', ''],
          ['US-005', '', '', '', '']
        ]
      },
      helpText: 'Acceptance criteria = done. Make them specific and testable.'
    },
    {
      id: 'prd-acceptance-criteria',
      title: '3.3 Acceptance Criteria Examples',
      description: 'Define done clearly',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['User Story', 'Given', 'When', 'Then'],
        rows: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', '']
        ]
      },
      placeholder: 'Format: GIVEN [context], WHEN [action], THEN [expected result]',
      helpText: 'Gherkin format makes criteria testable and clear.'
    },
    {
      id: 'one-pager-template',
      title: '4.1 One-Pager Template',
      description: 'Executive summary format',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Section', 'Content', 'Key Points'],
        rows: [
          ['Headline', '', 'One sentence that captures the essence'],
          ['Problem', '', 'What\'s broken and why it matters'],
          ['Solution', '', 'What we\'re doing about it'],
          ['Why Now', '', 'Urgency and timing'],
          ['Market Opportunity', '', 'Size and growth'],
          ['Business Model', '', 'How we make money'],
          ['Competition', '', 'Landscape and differentiation'],
          ['Go-to-Market', '', 'How we reach customers'],
          ['Team', '', 'Who\'s executing'],
          ['Ask', '', 'What we need'],
          ['Metrics', '', 'How we measure success']
        ]
      },
      helpText: 'One-pagers force clarity. If you can\'t explain it simply, you don\'t understand it.'
    },
    {
      id: 'one-pager-narrative',
      title: '4.2 Narrative Structure',
      description: 'Tell a compelling story',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Story Element', 'Your Content'],
        rows: [
          ['The Hero (Customer)', ''],
          ['The Problem (Villain)', ''],
          ['The Guide (Your Product)', ''],
          ['The Plan (How It Works)', ''],
          ['The Call to Action', ''],
          ['The Stakes (What Happens If...)', ''],
          ['The Happy Ending (Success Vision)', '']
        ]
      },
      placeholder: 'Story structure: Hero has problem → Meets guide → Gets plan → Takes action → Avoids failure → Achieves success',
      helpText: 'Your customer is the hero, not your product. You\'re the guide.'
    },
    {
      id: 'roadmap-template',
      title: '5.1 Roadmap Template',
      description: 'Strategic roadmap format',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Timeframe', 'Theme', 'Initiatives', 'Outcomes', 'Confidence'],
        rows: [
          ['Now (0-3 months)', '', '', '', 'High'],
          ['Next (3-6 months)', '', '', '', 'Medium'],
          ['Later (6-12 months)', '', '', '', 'Low'],
          ['Future (12+ months)', '', '', '', 'Very Low']
        ]
      },
      helpText: 'Roadmaps are promises. Near-term = commitments. Far-term = direction.'
    },
    {
      id: 'roadmap-themes',
      title: '5.2 Roadmap Themes',
      description: 'Organize by outcomes, not features',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Theme', 'Why This Theme', 'Key Initiatives', 'Success Metrics', 'Owner'],
        rows: [
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ]
      },
      helpText: 'Themes connect work to strategy. "Mobile App" is not a theme. "Reduce Time to Value" is.'
    },
    {
      id: 'roadmap-stakeholder',
      title: '5.3 Roadmap Stakeholder Versions',
      description: 'Tailor roadmap for each audience',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Audience', 'Level of Detail', 'Focus', 'Format', 'Cadence'],
        rows: [
          ['Executives', 'High-level themes', 'Business outcomes', 'One-pager', 'Monthly'],
          ['Engineering', 'Detailed initiatives', 'Technical scope', 'Detailed doc', 'Sprint/Weekly'],
          ['Sales/CS', 'Customer-facing features', 'Customer value', 'Visual timeline', 'Monthly'],
          ['Marketing', 'Launch-worthy items', 'Messaging hooks', 'Visual timeline', 'Monthly'],
          ['Customers', 'Released/coming soon', 'Benefits', 'Public roadmap', 'Quarterly']
        ]
      },
      helpText: 'One roadmap, many versions. Same truth, different lenses.'
    },
    {
      id: 'release-notes-template',
      title: '6.1 Release Notes Template',
      description: 'Communicate what shipped',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Section', 'Content'],
        rows: [
          ['Release Title', 'Catchy, descriptive name'],
          ['Release Date', ''],
          ['Version', ''],
          ['Headline', 'One sentence on what\'s new'],
          ['What\'s New', 'Bulleted list of features'],
          ['Why It Matters', 'Customer benefits'],
          ['How to Use It', 'Quick start guide'],
          ['Screenshots/GIFs', 'Visual examples'],
          ['Known Issues', 'Transparency builds trust'],
          ['Feedback Channel', 'How to report issues'],
          ['Related Resources', 'Links to docs, tutorials']
        ]
      },
      helpText: 'Release notes are marketing. Sell the benefit, not the feature.'
    },
    {
      id: 'release-notes-categorization',
      title: '6.2 Release Notes Categorization',
      description: 'Organize by type of change',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Category', 'Changes', 'Impact'],
        rows: [
          ['New Features', '', ''],
          ['Improvements', '', ''],
          ['Bug Fixes', '', ''],
          ['Performance', '', ''],
          ['Security', '', ''],
          ['Deprecations', '', ''],
          ['Breaking Changes', '', '']
        ]
      },
      helpText: 'Categories help readers find what matters to them.'
    },
    {
      id: 'release-notes-audience',
      title: '6.3 Release Notes Versions',
      description: 'Write for different audiences',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Audience', 'Tone', 'Detail Level', 'Channel'],
        rows: [
          ['Internal (Engineering)', 'Technical, detailed', 'High', 'Slack/Email'],
          ['Internal (Sales/CS)', 'Benefit-focused', 'Medium', 'Slack/Email'],
          ['Internal (Executives)', 'Outcome-focused', 'Low', 'Email'],
          ['Customers (Technical)', 'Technical + benefits', 'High', 'Email/In-app'],
          ['Customers (Business)', 'Benefits only', 'Low', 'Email/In-app'],
          ['Public (Blog)', 'Story-driven', 'Medium', 'Blog/Social']
        ]
      },
      helpText: 'Same release, many stories. Tell each one well.'
    },
    {
      id: 'presentation-structure',
      title: '7.1 Presentation Structure',
      description: 'Build a compelling deck',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Slide #', 'Slide Type', 'Key Message', 'Visual'],
        rows: [
          ['1', 'Title Slide', '', ''],
          ['2', 'Hook/Problem', '', ''],
          ['3', 'Solution', '', ''],
          ['4', 'Market Opportunity', '', ''],
          ['5', 'Product Demo/Screenshots', '', ''],
          ['6', 'Business Model', '', ''],
          ['7', 'Go-to-Market', '', ''],
          ['8', 'Competition', '', ''],
          ['9', 'Traction/Metrics', '', ''],
          ['10', 'Team', '', ''],
          ['11', 'Ask/Next Steps', '', ''],
          ['12', 'Appendix', '', '']
        ]
      },
      helpText: '10-20-30 rule: 10 slides, 20 minutes, 30pt font minimum.'
    },
    {
      id: 'presentation-storyboard',
      title: '7.2 Presentation Storyboard',
      description: 'Plan your narrative flow',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Section', 'Slides', 'Key Message', 'Transition'],
        rows: [
          ['Act 1: The Problem', '1-3', 'There\'s a big problem', ''],
          ['Act 2: The Solution', '4-7', 'We have the solution', ''],
          ['Act 3: The Opportunity', '8-11', 'And it\'s a huge opportunity', '']
        ]
      },
      placeholder: 'Three-act structure: Setup → Confrontation → Resolution',
      helpText: 'Every great presentation tells a story. Structure it.'
    },
    {
      id: 'presentation-design',
      title: '7.3 Presentation Design Principles',
      description: 'Visual best practices',
      fieldType: 'checkbox' as const,
      required: true,
      options: [
        { value: 'one-idea', label: 'One idea per slide' },
        { value: 'minimal-text', label: 'Minimal text (6x6 rule: 6 words/line, 6 lines/slide)' },
        { value: 'high-contrast', label: 'High contrast for readability' },
        { value: 'consistent-fonts', label: 'Consistent fonts (max 2-3)' },
        { value: 'consistent-colors', label: 'Consistent color palette' },
        { value: 'visuals-over-text', label: 'Visuals over text where possible' },
        { value: 'data-visualization', label: 'Clear data visualization' },
        { value: 'white-space', label: 'Generous white space' },
        { value: 'animation-sparingly', label: 'Animation used sparingly' },
        { value: 'speaker-notes', label: 'Speaker notes for detail' }
      ],
      helpText: 'Design serves the message. Don\'t let it become the message.'
    },
    {
      id: 'demo-script',
      title: '8.1 Demo Script Template',
      description: 'Plan your product demo',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Section', 'Time', 'What to Show', 'What to Say', 'Backup Plan'],
        rows: [
          ['Hook (Problem)', '1 min', '', '', ''],
          ['Setup (Context)', '1 min', '', '', ''],
          ['Demo Flow 1', '2 min', '', '', ''],
          ['Demo Flow 2', '2 min', '', '', ''],
          ['Demo Flow 3', '2 min', '', '', ''],
          ['Close (CTA)', '1 min', '', '', ''],
          ['Q&A', '5 min', '', '', '']
        ]
      },
      helpText: 'Demos are performances. Rehearse until smooth.'
    },
    {
      id: 'demo-scenarios',
      title: '8.2 Demo Scenarios',
      description: 'Show real-world use cases',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Persona', 'Scenario', 'Pain Point', 'How Product Solves', 'Demo Steps'],
        rows: [
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ]
      },
      helpText: 'Show, don\'t tell. Let the product speak.'
    },
    {
      id: 'demo-objections',
      title: '8.3 Demo Objection Handling',
      description: 'Prepare for tough questions',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Objection', 'Response', 'Proof Point', 'Fallback'],
        rows: [
          ['Too expensive', '', '', ''],
          ['Missing feature X', '', '', ''],
          ['Competitor comparison', '', '', ''],
          ['Security concerns', '', '', ''],
          ['Integration complexity', '', '', ''],
          ['Timing/urgency', '', '', '']
        ]
      },
      helpText: 'Anticipate objections. Have answers ready.'
    },
    {
      id: 'written-communication',
      title: '9.1 Written Communication',
      description: 'Email and document best practices',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Principle', 'Good Example', 'Bad Example'],
        rows: [
          ['Subject Line', '', ''],
          ['Opening', '', ''],
          ['Context Setting', '', ''],
          ['Ask/Action Item', '', ''],
          ['Closing', '', '']
        ]
      },
      helpText: 'Written communication is permanent. Make it count.'
    },
    {
      id: 'written-email-template',
      title: '9.2 Email Templates',
      description: 'Common PM email scenarios',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Scenario', 'Subject', 'Key Points', 'Tone'],
        rows: [
          ['Stakeholder Update', '', '', 'Professional, concise'],
          ['Escalation', '', '', 'Direct, fact-based'],
          ['Delay Announcement', '', '', 'Transparent, solution-oriented'],
          ['Customer Apology', '', '', 'Empathetic, action-focused'],
          ['Team Recognition', '', '', 'Warm, specific'],
          ['Meeting Request', '', '', 'Clear, time-boxed'],
          ['Decision Request', '', '', 'Structured, options provided']
        ]
      },
      helpText: 'Templates save time. Customize for each situation.'
    },
    {
      id: 'difficult-conversations',
      title: '10.1 Difficult Conversations',
      description: 'Handle tough situations',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Scenario', 'Preparation', 'Opening', 'Key Message', 'Desired Outcome'],
        rows: [
          ['Saying No to CEO', '', '', '', ''],
          ['Pushing Back on Sales', '', '', '', ''],
          ['Engineering Disagreement', '', '', '', ''],
          ['Missed Deadline', '', '', '', ''],
          ['Feature Deprecation', '', '', '', ''],
          ['Team Conflict', '', '', '', '']
        ]
      },
      helpText: 'Prepare for difficult conversations. Script your key points.'
    },
    {
      id: 'difficult-conversation-scripts',
      title: '10.2 Conversation Scripts',
      description: 'Word-for-word preparation',
      fieldType: 'textarea' as const,
      required: true,
      placeholder: 'Write out your exact words for the conversation:\n\nOpening: "I wanted to talk to you about..."\nContext: "Here\'s what\'s happening..."\nImpact: "This means that..."\nProposal: "I think we should..."\nClose: "What do you think?"',
      helpText: 'Scripting reduces anxiety. Know your opening cold.'
    },
    {
      id: 'communication-scorecard',
      title: '11. Communication Scorecard',
      description: 'Rate your communication skills',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Dimension', 'Score (1-5)', 'Evidence', 'Improvement Plan'],
        rows: [
          ['Written Communication', '', '', ''],
          ['Verbal Communication', '', '', ''],
          ['Visual Communication', '', '', ''],
          ['Executive Presence', '', '', ''],
          ['Storytelling', '', '', ''],
          ['Active Listening', '', '', ''],
          ['Feedback Delivery', '', '', ''],
          ['Conflict Navigation', '', '', '']
        ]
      },
      helpText: 'Target: 30+ out of 40 for strong communication skills.'
    },
    {
      id: 'communication-feedback',
      title: '12. Communication Feedback Log',
      description: 'Track feedback on your communication',
      fieldType: 'table' as const,
      required: false,
      tableSchema: {
        columns: ['Date', 'Communication Type', 'Audience', 'Feedback', 'Action'],
        rows: [
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ]
      },
      helpText: 'Feedback is a gift. Collect it systematically.'
    }
  ],
  outputFormat: 'markdown' as const,
  version: '1.0'
};
