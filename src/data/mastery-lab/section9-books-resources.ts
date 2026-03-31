// Section 9: Books & Resources Decision Framework

export const booksResourcesTemplate = {
  id: 'mastery-section-9',
  name: 'Books & Resources Mastery',
  description: 'Curated reading lists, podcasts, newsletters, communities, and courses for PMs',
  category: 'mastery' as const,
  estimatedCompletionTime: '30-45 min',
  sections: [
    {
      id: 'learning-goals',
      title: '1. Learning Goals',
      description: 'What do you want to learn?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Area', 'Current Level', 'Target Level', 'Priority', 'Timeline'],
        rows: [
          ['Product Fundamentals', 'Beginner / Intermediate / Advanced', '', 'P0 / P1 / P2', ''],
          ['Strategy', '', '', '', ''],
          ['Analytics', '', '', '', ''],
          ['Leadership', '', '', '', ''],
          ['Domain Expertise', '', '', '', ''],
          ['Technical Knowledge', '', '', '', '']
        ]
      },
      helpText: 'Know what you want to learn before you pick resources.'
    },
    {
      id: 'reading-list-core',
      title: '2.1 Core Reading List',
      description: 'Essential PM books',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Book', 'Author', 'Status', 'Rating', 'Key Takeaway'],
        rows: [
          ['Inspired', 'Marty Cagan', 'Not Started / Reading / Completed', '', ''],
          ['The Lean Startup', 'Eric Ries', '', '', ''],
          ['Zero to One', 'Peter Thiel', '', '', ''],
          ['The Mom Test', 'Rob Fitzpatrick', '', '', ''],
          ['Cracking the PM Interview', 'Gayle Laakmann McDowell', '', '', ''],
          ['Decode and Conquer', 'Lewis Lin', '', '', ''],
          ['Escaping the Build Trap', 'Melissa Perri', '', '', ''],
          ['Good Strategy/Bad Strategy', 'Richard Rumelt', '', '', ''],
          ['The Hard Thing About Hard Things', 'Ben Horowitz', '', '', ''],
          ['Measure What Matters', 'John Doerr', '', '', ''],
          ['High Output Management', 'Andrew Grove', '', '', ''],
          ['Thinking, Fast and Slow', 'Daniel Kahneman', '', '', ''],
          ['Influence', 'Robert Cialdini', '', '', ''],
          ['Hooked', 'Nir Eyal', '', '', ''],
          ['Crossing the Chasm', 'Geoffrey Moore', '', '', '']
        ]
      },
      helpText: 'Read one book per month. Apply what you learn immediately.'
    },
    {
      id: 'reading-list-advanced',
      title: '2.2 Advanced Reading List',
      description: 'For experienced PMs',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Book', 'Author', 'Status', 'Rating', 'Key Takeaway'],
        rows: [
          ['7 Powers', 'Hamilton Helmer', 'Not Started / Reading / Completed', '', ''],
          ['Competitive Strategy', 'Michael Porter', '', '', ''],
          ['The Innovator\'s Dilemma', 'Clayton Christensen', '', '', ''],
          ['Platform Revolution', 'Parker/Van Alstyne', '', '', ''],
          ['Monetizing Innovation', 'Raman/Bill', '', '', ''],
          ['The Cold Start Problem', 'Andrew Chen', '', '', ''],
          ['Blitzscaling', 'Reid Hoffman', '', '', ''],
          ['Power: Why Some People Have It', 'Jeffrey Pfeffer', '', '', ''],
          ['An Elegant Puzzle', 'Will Larson', '', '', ''],
          ['Staff Engineer', 'Will Larson', '', '', ''],
          ['The Manager\'s Path', 'Camille Fournier', '', '', ''],
          ['Radical Candor', 'Kim Scott', '', '', ''],
          ['The Five Dysfunctions of a Team', 'Patrick Lencioni', '', '', ''],
          ['Principles', 'Ray Dalio', '', '', ''],
          ['Seeking Wisdom', 'Peter Bevelin', '', '', '']
        ]
      },
      helpText: 'Advanced books teach mental models and strategy.'
    },
    {
      id: 'reading-list-domain',
      title: '2.3 Domain-Specific Reading',
      description: 'Books by specialty',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Domain', 'Book', 'Author', 'Status', 'Notes'],
        rows: [
          ['B2B SaaS', 'Product-Led Growth', 'Wes Bush', '', ''],
          ['B2B SaaS', 'The Sales Acceleration Formula', 'Mark Roberge', '', ''],
          ['Consumer', 'Actionable Analytics', 'David Cole', '', ''],
          ['Consumer', 'Virality', 'Jonah Berger', '', ''],
          ['Marketplace', 'Matchmakers', 'Hagiu/Wright', '', ''],
          ['Fintech', 'The Fintech Book', 'Chishti/Barberis', '', ''],
          ['AI/ML', 'Prediction Machines', 'Agrawal et al.', '', ''],
          ['AI/ML', 'Human Compatible', 'Stuart Russell', '', ''],
          ['Healthcare', 'The Digital Doctor', 'Robert Wachter', '', ''],
          ['Leadership', 'Multipliers', 'Liz Wiseman', '', ''],
          ['Strategy', 'Playing to Win', 'Lafky/Martin', '', ''],
          ['Growth', 'Hacking Growth', 'Ellis/Brown', '', '']
        ]
      },
      helpText: 'Go deep in your domain. Read adjacent domains for breadth.'
    },
    {
      id: 'reading-tracker',
      title: '2.4 Reading Tracker',
      description: 'Track your reading',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Book', 'Start Date', 'End Date', 'Pages', 'Rating', 'Summary', 'Action Items'],
        rows: [
          ['', '', '', '', '', '', ''],
          ['', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '']
        ]
      },
      helpText: 'Reading without action is entertainment. Extract action items.'
    },
    {
      id: 'podcast-list',
      title: '3.1 Podcast Directory',
      description: 'PM podcasts to follow',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Podcast', 'Host', 'Frequency', 'Best For', 'Favorite Episode'],
        rows: [
          ['Lenny\'s Podcast', 'Lenny Rachitsky', 'Weekly', 'Deep dives with top PMs', ''],
          ['The Product Podcast', 'Product School', 'Weekly', 'PM interviews, careers', ''],
          ['This is Product Management', 'Alpha', 'Weekly', 'PM methodologies', ''],
          ['Masters of Scale', 'Reid Hoffman', 'Weekly', 'Scaling companies', ''],
          ['How I Built This', 'NPR', 'Weekly', 'Founder stories', ''],
          ['a16z Podcast', 'Andreessen Horowitz', 'Multiple/week', 'Tech trends', ''],
          ['The Twenty Minute VC', 'Harry Stebbings', 'Multiple/week', 'VC insights', ''],
          ['Acquired', 'Ben Gilbert & David Rosenthal', 'Monthly', 'Company deep dives', ''],
          ['All-In Podcast', 'Best/Friedberg/Calcanis/Sacks', 'Weekly', 'Tech/business talk', ''],
          ['My First Million', 'Shaan Puri & Sam Parr', 'Weekly', 'Business ideas', ''],
          ['Nudge', 'Michaela Haot', 'Weekly', 'Product decisions', ''],
          ['Product Talk', 'Marty Cagan', 'Irregular', 'Product fundamentals', ''],
          ['Reforge Podcast', 'Reforge', 'Irregular', 'Growth/strategy', ''],
          ['SaaStr', 'Jason Lemkin', 'Weekly', 'B2B SaaS', ''],
          ['The a16z Infra Podcast', 'a16z', 'Irregular', 'Infrastructure tech', '']
        ]
      },
      helpText: 'Podcasts are great for commutes. Take notes on key insights.'
    },
    {
      id: 'podcast-learning-log',
      title: '3.2 Podcast Learning Log',
      description: 'Capture insights from episodes',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Episode', 'Guest', 'Key Insight', 'Application', 'Date'],
        rows: [
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ]
      },
      helpText: 'One insight applied is worth 100 insights consumed.'
    },
    {
      id: 'newsletter-list',
      title: '4.1 Newsletter Subscriptions',
      description: 'PM newsletters to read',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Newsletter', 'Author', 'Frequency', 'Focus', 'Subscribe Link'],
        rows: [
          ['Lenny\'s Newsletter', 'Lenny Rachitsky', 'Weekly', 'Product/Growth', ''],
          ['Stratechery', 'Ben Thompson', '2x/week', 'Tech strategy', ''],
          ['Platformer', 'Casey Newton', 'Weekly', 'Tech/platforms', ''],
          ['The Generalist', 'Mario Gabriele', 'Weekly', 'Tech trends', ''],
          ['Not Boring', 'Packy McCormick', 'Irregular', 'Tech/business', ''],
          ['Ben\'s Bites', 'Ben Tossell', 'Daily', 'AI/Product', ''],
          ['TLDR', 'TLDR', 'Daily', 'Tech news', ''],
          ['Morning Brew', 'Morning Brew', 'Daily', 'Business news', ''],
          ['The Profile', 'The Profile', 'Weekly', 'Company profiles', ''],
          ['StrictlyVC', 'StrictlyVC', 'Daily', 'VC news', ''],
          ['Finimize', 'Finimize', 'Daily', 'Finance news', ''],
          ['Product Coalition', 'Product Coalition', 'Weekly', 'PM community', ''],
          ['Mind the Product', 'Mind the Product', 'Weekly', 'PM community', ''],
          ['Reforge Blog', 'Reforge', 'Irregular', 'Growth/strategy', ''],
          ['a16z Blog', 'a16z', 'Irregular', 'VC insights', '']
        ]
      },
      helpText: 'Newsletters keep you current. Don\'t let them become noise.'
    },
    {
      id: 'newsletter-processing',
      title: '4.2 Newsletter Processing System',
      description: 'How to handle incoming content',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Source', 'Read Frequency', 'Where Saved', 'Review Cadence'],
        rows: [
          ['Daily newsletters', 'Daily skim, deep read weekly', 'Notion/Readwise', 'Weekly review'],
          ['Weekly newsletters', 'Read on receipt', 'Notion/Readwise', 'Weekly review'],
          ['Long-form', 'Weekend deep read', 'Notion/Readwise', 'Monthly review'],
          ['Research reports', 'Monthly', 'Notion/Readwise', 'Quarterly review']
        ]
      },
      helpText: 'Have a system. Otherwise, content disappears into the void.'
    },
    {
      id: 'community-list',
      title: '5.1 PM Communities',
      description: 'Where PMs gather',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Community', 'Platform', 'Size', 'Focus', 'Join Link'],
        rows: [
          ['Mind the Product', 'Slack/Events', '100k+', 'General PM', ''],
          ['Product School', 'Slack/Events', '50k+', 'PM education', ''],
          ['Reforge', 'Slack/Cohorts', '10k+', 'Growth/strategy', ''],
          ['Lenny\'s Slack', 'Slack', '15k+', 'Product/Growth', ''],
          ['Women in Product', 'Slack/Events', '10k+', 'Women PMs', ''],
          ['Black in Product', 'Slack/Events', '5k+', 'Black PMs', ''],
          ['Latinos in Tech', 'Slack/Events', '10k+', 'Latino tech', ''],
          ['Product Coalition', 'Slack/Medium', '20k+', 'General PM', ''],
          ['r/ProductManagement', 'Reddit', '100k+', 'General PM', ''],
          ['Indie Hackers', 'Forum', '50k+', 'Indie founders', ''],
          ['Y Combinator Hacker News', 'Forum', 'Millions', 'Tech news', ''],
          ['LinkedIn PM Groups', 'LinkedIn', 'Various', 'Networking', ''],
          ['Local PM meetups', 'In-person', 'Varies', 'Networking', '']
        ]
      },
      helpText: 'Communities provide peer learning. Participate, don\'t just lurk.'
    },
    {
      id: 'community-engagement',
      title: '5.2 Community Engagement Plan',
      description: 'How to get value from communities',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Community', 'How I\'ll Engage', 'Time Commitment', 'Goal'],
        rows: [
          ['', 'Post questions, answer others', '30 min/week', 'Learn from peers'],
          ['', 'Attend events', 'Monthly', 'Network'],
          ['', 'Write posts', 'Monthly', 'Build reputation'],
          ['', 'Find accountability partner', 'Ongoing', 'Stay motivated']
        ]
      },
      helpText: 'Give before you take. Help others to help yourself.'
    },
    {
      id: 'course-list',
      title: '6.1 PM Courses',
      description: 'Structured learning programs',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Course', 'Provider', 'Format', 'Duration', 'Cost', 'Best For'],
        rows: [
          ['Reforge', 'Reforge', 'Cohort-based', '6 weeks', '$2000+', 'Experienced PMs'],
          ['Product School', 'Product School', 'In-person/Online', '8-12 weeks', '$3000+', 'Aspiring PMs'],
          ['General Assembly', 'GA', 'In-person/Online', '10 weeks', '$3000+', 'Career changers'],
          ['LinkedIn Learning', 'LinkedIn', 'Self-paced', 'Varies', '$30/month', 'Beginners'],
          ['Coursera PM Certificate', 'Google', 'Self-paced', '6 months', '$50/month', 'Beginners'],
          ['Udemy PM Courses', 'Udemy', 'Self-paced', 'Varies', '$20-200', 'Specific skills'],
          ['Mind the Product', 'MTP', 'Workshops', '1-2 days', '$500-1000', 'Skill building'],
          ['Pragmatic Institute', 'Pragmatic', 'In-person', 'Varies', '$2000+', 'B2B PMs'],
          ['280 Group', '280 Group', 'In-person', 'Varies', '$2000+', 'Enterprise PMs'],
          ['Y Combinator Startup School', 'YC', 'Online', 'Self-paced', 'Free', 'Founders']
        ]
      },
      helpText: 'Courses accelerate learning. Apply immediately to retain.'
    },
    {
      id: 'course-selection',
      title: '6.2 Course Selection Framework',
      description: 'Choose the right course',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Criterion', 'Weight', 'Course A', 'Course B', 'Course C'],
        rows: [
          ['Content Quality', '30%', '', '', ''],
          ['Instructor Quality', '20%', '', '', ''],
          ['Peer Network', '20%', '', '', ''],
          ['Time Commitment', '15%', '', '', ''],
          ['Cost', '15%', '', '', ''],
          ['Total Score', '100%', '', '', '']
        ]
      },
      helpText: 'Not all courses are equal. Choose based on your goals.'
    },
    {
      id: 'learning-plan',
      title: '7.1 Annual Learning Plan',
      description: 'Plan your year of learning',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Quarter', 'Focus Area', 'Books to Read', 'Courses to Take', 'Events to Attend'],
        rows: [
          ['Q1', '', '', '', ''],
          ['Q2', '', '', '', ''],
          ['Q3', '', '', '', ''],
          ['Q4', '', '', '', '']
        ]
      },
      helpText: 'Learning is a practice, not an event. Plan it intentionally.'
    },
    {
      id: 'learning-budget',
      title: '7.2 Learning Budget',
      description: 'Invest in yourself',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Category', 'Annual Budget', 'Spent YTD', 'Remaining'],
        rows: [
          ['Books', '$500', '', ''],
          ['Courses', '$3000', '', ''],
          ['Conferences', '$2000', '', ''],
          ['Coaching', '$2000', '', ''],
          ['Community Memberships', '$500', '', ''],
          ['Total', '$8000', '', '']
        ]
      },
      helpText: 'Companies often have learning budgets. Ask for it.'
    },
    {
      id: 'knowledge-management',
      title: '8.1 Knowledge Management System',
      description: 'Where you store learnings',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Tool', 'What Goes Here', 'How Organized', 'Search Strategy'],
        rows: [
          ['Notion', '', '', ''],
          ['Readwise', '', '', ''],
          ['Obsidian', '', '', ''],
          ['Evernote', '', '', ''],
          ['OneNote', '', '', ''],
          ['Google Docs', '', '', '']
        ]
      },
      helpText: 'Your second brain is only as good as your retrieval system.'
    },
    {
      id: 'knowledge-management-structure',
      title: '8.2 Knowledge Structure',
      description: 'How to organize what you learn',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Category', 'Subcategories', 'Tags'],
        rows: [
          ['Product Fundamentals', 'Discovery, Strategy, Execution', '#fundamentals'],
          ['Analytics', 'Metrics, A/B Testing, SQL', '#analytics'],
          ['Leadership', 'Management, Hiring, Culture', '#leadership'],
          ['Domain Knowledge', 'B2B, Consumer, Fintech, etc.', '#domain'],
          ['Mental Models', 'Decision-making, Strategy', '#mental-models'],
          ['Case Studies', 'Company deep dives', '#case-studies'],
          ['Templates', 'PRDs, Roadmaps, Frameworks', '#templates']
        ]
      },
      helpText: 'Consistent structure makes retrieval easy.'
    },
    {
      id: 'resource-scorecard',
      title: '9. Learning Progress Scorecard',
      description: 'Track your learning',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Metric', 'Target', 'Actual', 'Progress'],
        rows: [
          ['Books Read (Annual)', '12', '', ''],
          ['Podcast Episodes', '50', '', ''],
          ['Newsletters Read', '52', '', ''],
          ['Courses Completed', '2', '', ''],
          ['Events Attended', '4', '', ''],
          ['Posts Written', '12', '', ''],
          ['Teaching Sessions', '4', '', '']
        ]
      },
      helpText: 'What gets measured gets done. Track your learning.'
    },
    {
      id: 'teaching-plan',
      title: '10. Teaching Plan',
      description: 'Learn by teaching',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Topic', 'Audience', 'Format', 'Timeline', 'Status'],
        rows: [
          ['Internal team share', 'Team', '30 min presentation', '', 'Planned / Done'],
          ['Blog post', 'Public', '1000 words', '', ''],
          ['Conference talk', 'Industry', '20 min talk', '', ''],
          ['Mentorship', 'Individual', 'Ongoing', '', ''],
          ['Workshop', 'Community', '2 hours', '', '']
        ]
      },
      helpText: 'Teaching is the best way to learn. Share what you know.'
    }
  ],
  outputFormat: 'markdown' as const,
  version: '1.0'
};
