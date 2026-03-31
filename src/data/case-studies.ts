// Real-World Product Manager Case Studies Library
// Compiled from actual PM portfolios, LinkedIn posts, Medium articles, and company case studies

export interface CaseStudy {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  company?: string;
  category: 'Growth' | 'Strategy' | 'Feature Launch' | 'Teardown' | 'Problem Solving' | 'AI/ML' | 'Marketplace' | 'Fintech';
  summary: string;
  problem: string;
  approach: string;
  solution: string;
  results: string[];
  frameworks: string[];
  metrics: string[];
  keyLearnings: string[];
  readTime: number;
  sourceUrl?: string;
  industry: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'pinterest-ai-platform',
    title: 'How Pinterest Built a 600M-User AI Platform',
    author: 'Mohit Aggarwal',
    authorRole: 'Senior Product Manager',
    company: 'Pinterest',
    category: 'AI/ML',
    industry: 'Social Media / E-commerce',
    summary: 'How Pinterest leveraged AI to transform from a static image board to an interactive shopping platform with 80B+ visual search queries per month.',
    problem: 'Pinterest needed to evolve beyond static pins to become an actionable shopping destination. Gen Z users (50%+ of base) expected AI-powered personalization and instant purchase paths.',
    approach: 'Analyzed 80B monthly visual search queries to identify intent patterns. Partnered with ML teams to build shoppable pin detection. Ran A/B tests on AI recommendations vs. human curation.',
    solution: 'Launched AI-powered visual search, shoppable pins with direct checkout, and personalized homefeed ranking. Integrated with 1000+ retail partners for real-time inventory.',
    results: [
      '$1B+ quarterly revenue (Q4 2024)',
      '80B visual search queries/month',
      'Gen Z became 50%+ of user base',
      '3x increase in purchase conversion',
      '40% of sessions now include AI interaction'
    ],
    frameworks: ['AARRR', 'North Star Metric', 'AI/ML Product Framework'],
    metrics: ['Visual Search Queries', 'Purchase Conversion Rate', 'AI Interaction Rate', 'Quarterly Revenue', 'Gen Z User %'],
    keyLearnings: [
      'AI features must feel invisible - users care about outcomes, not the tech',
      'Visual search is the future of e-commerce discovery',
      'Gen Z expects personalization by default - no opt-in required',
      'Partnership integrations are as important as core product'
    ],
    readTime: 12,
    sourceUrl: 'https://medium.com/@mohit15856/how-pinterests-product-decisions-built-a-600m-user-ai-platform-a-case-study-for-pms-8131d531a00d'
  },
  {
    id: 'fitbit-engagement',
    title: 'Fitbit User Engagement Enhancement - 20% DAU Increase',
    author: 'Fitbit Product Team',
    authorRole: 'Growth PM Team',
    company: 'Fitbit (Google)',
    category: 'Growth',
    industry: 'HealthTech / Wearables',
    summary: 'How Fitbit reversed declining engagement through personalized goals, gamification, and social features.',
    problem: 'Declining user engagement with high churn rates. Users were not forming daily habits and dropping off after 30 days.',
    approach: 'Analyzed 7/30/90-day retention cohorts. Identified that users who set goals in week 1 had 3x higher retention. Conducted 50+ user interviews on motivation drivers.',
    solution: 'Launched personalized goal setting on day 1, gamification (badges, challenges), social features (friend challenges, leaderboards), and Fitbit Premium subscription.',
    results: [
      '20% increase in DAU within 6 months',
      '35% reduction in new user churn',
      '40% increase in average session duration',
      '50% growth in social interactions',
      'Fitbit Premium became $100M+ ARR business'
    ],
    frameworks: ['AARRR', 'Hook Model', 'Sean Ellis PMF Test'],
    metrics: ['DAU/MAU', '7/30/90-day Retention', 'Session Duration', 'Challenge Participation Rate', 'Premium Conversion'],
    keyLearnings: [
      'Day 1 experience determines 80% of retention outcomes',
      'Social accountability drives habit formation better than solo goals',
      'Gamification works when tied to real progress, not empty badges',
      'Premium features must enhance free experience, not restrict it'
    ],
    readTime: 10,
    sourceUrl: 'https://hellopm.co/fitbit-product-analytics-case-study/'
  },
  {
    id: 'superhuman-pmf',
    title: 'How Superhuman Engineered Product-Market Fit',
    author: 'Rahul Vohra',
    authorRole: 'CEO & Founder',
    company: 'Superhuman',
    category: 'Strategy',
    industry: 'SaaS / Email',
    summary: 'The systematic approach Superhuman used to achieve 58% PMF score (industry standard is 40%) through segmentation and iteration.',
    problem: 'Started at 22% PMF score - far below the 40% threshold. Needed to understand who loved the product and why.',
    approach: 'Implemented Sean Ellis PMF survey with segmentation. Identified that "very disappointed" users shared specific characteristics. Built roadmap exclusively for this segment.',
    solution: 'Focused on speed as core differentiator (keyboard shortcuts, instant load). Implemented $30/month pricing (premium signal). Created invite-only scarcity. Built concierge onboarding.',
    results: [
      'Increased PMF score from 22% to 58%',
      '$30/month became industry standard for premium email',
      'Became case study adopted by hundreds of startups',
      'Achieved profitability without VC pressure',
      '90%+ retention rate among target segment'
    ],
    frameworks: ['Sean Ellis PMF Test', 'Segmentation Analysis', 'Value-Based Pricing'],
    metrics: ['PMF Score', 'Retention Rate', 'NPS', 'ARR', 'Time to Inbox Zero'],
    keyLearnings: [
      'PMF is binary - you either have it or you dont, but getting there is iterative',
      'Segment before analyzing - average users hide the truth',
      'Price signals quality - discounting attracts wrong customers',
      'Speed is a feature that compounds - every ms matters'
    ],
    readTime: 15,
    sourceUrl: 'https://www.ideaplan.io/case-studies/superhuman-product-market-fit'
  },
  {
    id: 'stripe-api-teardown',
    title: 'Stripe API Teardown - What 8.1/10 Agent-Native Looks Like',
    author: 'Developer Experience Team Analysis',
    authorRole: 'Technical PM',
    company: 'Stripe',
    category: 'Teardown',
    industry: 'Fintech / Payments',
    summary: 'Deep technical analysis of why Stripe has the highest API developer experience score (8.1/10) among payment platforms.',
    problem: 'Payment integration traditionally required weeks of engineering work, PCI compliance headaches, and complex bank relationships.',
    approach: 'Analyzed Stripe API across 10 dimensions: authentication, error handling, documentation, test/prod parity, idempotency, rate limiting, webhooks, SDKs, versioning, and developer support.',
    solution: 'Stripe solved this with 7 lines of code integration, complete test mode parity, 80+ documented decline codes, and machine-readable API keys with environment prefixes.',
    results: [
      '8.1/10 Agent-Native Score (highest in category)',
      '$36B valuation',
      'Millions of developers integrated',
      'Only 3% of commerce is online (massive TAM)',
      '2.9% + 30¢ per transaction pricing became standard'
    ],
    frameworks: ['API Design Principles', 'Developer Experience Framework', 'Platform Strategy'],
    metrics: ['Integration Time', 'API Uptime', 'Developer Satisfaction', 'Transaction Volume', 'Decline Code Coverage'],
    keyLearnings: [
      'Developer experience IS the product for API companies',
      'Test/prod parity prevents 80% of production issues',
      'Error transparency builds trust - document every failure mode',
      'Idempotency is table stakes for payment systems'
    ],
    readTime: 18,
    sourceUrl: 'https://dev.to/supertrained/stripe-api-autopsy-what-8110-agent-native-actually-looks-like-36ep'
  },
  {
    id: 'airbnb-teardown',
    title: 'Airbnb Product Teardown - Comprehensive Analysis',
    author: 'Ruchi Parijat',
    authorRole: 'Senior Product Manager',
    company: 'Independent Analysis',
    category: 'Teardown',
    industry: 'Marketplace / Travel',
    summary: 'Complete teardown of Airbnb covering technical architecture, functional features, business strategy, and unique differentiators.',
    problem: 'Airbnb needed to build trust between strangers, handle complex booking flows, and compete with established hotel chains.',
    approach: 'Analyzed across 4 dimensions: Technical (API, ML, mobile), Functional (booking, payments, reviews), Business (diversification, global expansion), and Differentiators.',
    solution: 'Airbnb built transparent feedback systems, direct host-guest communication, seamless payments, algorithmic pricing, and diversified into Experiences, Plus, and Luxe tiers.',
    results: [
      'Millions of listings globally',
      'Trust system with 2-way reviews',
      'Algorithmic matchmaking with 95%+ match rate',
      'Service diversification reduced seasonality risk',
      'Community-driven model created network effects'
    ],
    frameworks: ['Marketplace Dynamics', 'Trust & Safety Framework', 'Platform Strategy'],
    metrics: ['Booking Conversion', 'Host Response Rate', 'Review Participation', 'Repeat Booking Rate', 'NPS'],
    keyLearnings: [
      'Trust is the core product in peer-to-peer marketplaces',
      'Two-sided marketplaces need balanced growth (chicken-egg problem)',
      'Diversification protects against core business volatility',
      'Community building is a moat, not a feature'
    ],
    readTime: 20,
    sourceUrl: 'https://medium.com/@roohiwrites/dissecting-airbnb-a-comprehensive-product-teardown-9071ef880d6f'
  },
  {
    id: 'spotify-discover-weekly',
    title: 'Spotify Discover Weekly - How AI Built a $100B Empire',
    author: 'Product Strategy Analysis',
    authorRole: 'Music Industry PM',
    company: 'Spotify',
    category: 'AI/ML',
    industry: 'Media / Entertainment',
    summary: 'How Spotify algorithmic playlists (Discover Weekly, Daily Mix) became the core retention driver with 5B+ annual streams.',
    problem: 'Music streaming is a commodity - same songs everywhere. Spotify needed differentiation beyond licensing deals.',
    approach: 'Built hybrid AI system combining collaborative filtering, content-based analysis, and NLP on playlist data. Limited to 30 songs to balance familiarity with serendipity. Weekly Monday refresh creates habit.',
    solution: 'Launched Discover Weekly (2015), Daily Mix, Release Radar, and Wrapped. Each uses different AI techniques but shares the same goal: perfect personalization.',
    results: [
      '5 billion+ Discover Weekly streams annually',
      '40 million weekly active users of Discover Weekly',
      '35% increase in discovery sessions',
      'Wrapped generates 225M+ social shares',
      '180M+ subscribers at $10B+ ARR'
    ],
    frameworks: ['AI/ML Product Framework', 'Habit Formation', 'Viral Loop'],
    metrics: ['Streams per User', 'Discovery Session Rate', 'Playlist Saves', 'Social Shares', 'Churn Reduction'],
    keyLearnings: [
      'AI recommendations must balance familiarity with novelty',
      'Weekly cadence creates anticipation and habit',
      'Data-driven features become viral when packaged emotionally (Wrapped)',
      'Personalization at scale requires hybrid AI approaches'
    ],
    readTime: 14,
    sourceUrl: 'https://medium.com/@productbrief/spotifys-algorithmic-alchemy-how-ai-powered-playlists-built-a-100-billion-empire-eac5a0d0bceb'
  },
  {
    id: 'netflix-ads-tier',
    title: 'Netflix Ad-Supported Tier - Strategic Decision Analysis',
    author: 'Strategy PM Analysis',
    authorRole: 'Streaming Industry PM',
    company: 'Netflix',
    category: 'Strategy',
    industry: 'Media / Streaming',
    summary: 'How Netflix defensive innovation with ad-tier protected premium subscribers while opening new revenue stream.',
    problem: 'Subscriber growth slowed post-pandemic. Password sharing crackdown needed alternative for price-sensitive users. Ad-free premium tier at risk of cannibalization.',
    approach: 'Analyzed churn reasons - 40% cited price sensitivity. Studied Hulu ad-tier retention. Modeled cannibalization vs. new acquisition. Decided on restricted features to protect premium.',
    solution: 'Launched $6.99/mo ad-tier with deliberate restrictions: 720p max (not 1080p/4K), 1 stream only, no downloads. Made premium tier clearly superior for power users.',
    results: [
      '23M+ ad-tier subscribers within 12 months',
      'Minimal cannibalization of premium tier',
      'New revenue stream from advertisers',
      'Churn reduction among price-sensitive segment',
      'Ad revenue on track for $3B+ annually'
    ],
    frameworks: ['Defensive Innovation', 'Price Discrimination', 'Jobs to Be Done'],
    metrics: ['Ad-Tier Subscribers', 'Premium Retention', 'ARPU', 'Ad Fill Rate', 'Churn by Tier'],
    keyLearnings: [
      'Defensive products need clear differentiation to avoid cannibalization',
      'Feature restrictions can be more effective than price cuts',
      'Ad-tier is a growth lever, not just monetization',
      'Timing matters - launch before competitors capture the segment'
    ],
    readTime: 12,
    sourceUrl: 'https://www.toughtongueai.com/blog/product-strategy-case-studies'
  },
  {
    id: 'duolingo-gamification',
    title: 'Duolingo Gamification - 9 Lessons on Retention',
    author: 'ProdLab @ IIM Indore',
    authorRole: 'Product Management Student',
    company: 'Independent Analysis',
    category: 'Growth',
    industry: 'EdTech',
    summary: 'How Duolingo uses gamification mechanics (streaks, gems, leaderboards) to achieve industry-leading retention rates.',
    problem: 'Language learning has 90%+ drop-off within 30 days. Most users never form daily habits.',
    approach: 'Analyzed Duolingo across 9 dimensions: mascot integration, streak mechanics, progress visualization, social features, push notification timing, and recovery options.',
    solution: 'Built comprehensive gamification system: streaks with freeze options, XP and leaderboards, quest progress, friend challenges, and the iconic Duo owl push notifications.',
    results: [
      'Industry-leading 90-day retention (5x category average)',
      '500M+ downloads, 50M+ MAU',
      'Streak users have 10x higher LTV',
      'Social features drive 30% of daily sessions',
      'Push notifications achieve 15%+ CTR'
    ],
    frameworks: ['Hook Model', 'Gamification Framework', 'Fogg Behavior Model'],
    metrics: ['DAU/MAU', 'Streak Retention', 'Leaderboard Participation', 'Session Frequency', 'LTV'],
    keyLearnings: [
      'Streaks work because loss aversion is stronger than gain seeking',
      'Mascot personality makes notifications feel human, not spammy',
      'Recovery options (streak freeze) reduce all-or-nothing abandonment',
      'Social accountability beats solo motivation'
    ],
    readTime: 10,
    sourceUrl: 'https://prodlab.substack.com/p/product-teardown-duolingo'
  },
  {
    id: 'canal-plus-conversion',
    title: 'Canal+ 3x Conversion Increase with Product Intelligence',
    author: 'Growth PM Team',
    authorRole: 'Media Streaming PM',
    company: 'Canal+',
    category: 'Growth',
    industry: 'Media / Streaming',
    summary: 'How Canal+ used Amplitude analytics to identify key behavior and increase conversion by 3x through targeted interventions.',
    problem: 'Low trial-to-paid conversion rate. Could not identify what behaviors predicted conversion vs. churn.',
    approach: 'Implemented Amplitude for product analytics. Discovered users who watched both live AND on-demand content had 5x higher conversion. Built cohorts around this insight.',
    solution: 'Created onboarding flow that immediately exposed users to both live and on-demand content. Sent targeted emails highlighting both content types. Optimized homepage to surface both.',
    results: [
      '3x increase in conversion rate',
      '25% reduction in churn',
      'Cross-functional squads organized around lifecycle',
      'Data-driven culture replaced HiPPO decisions',
      'Expanded to 180M+ users globally'
    ],
    frameworks: ['AARRR', 'Cohort Analysis', 'Behavioral Segmentation'],
    metrics: ['Trial Conversion', 'Content Consumption Mix', 'Churn Rate', 'Email CTR', 'Homepage Engagement'],
    keyLearnings: [
      'Single behaviors can predict conversion - find your "a-ha" moment',
      'Cross-functional squads accelerate experimentation velocity',
      'Product intelligence tools require cultural adoption, not just installation',
      'Onboarding sets the trajectory for entire user journey'
    ],
    readTime: 8,
    sourceUrl: 'https://amplitude.com/case-studies/canal'
  },
  {
    id: '80-percent-dropoff',
    title: 'How to Solve an 80% Drop-Off in a Mobile App',
    author: 'Dmytro Khalapsus',
    authorRole: 'Product Leader',
    company: 'The Atomic Product',
    category: 'Problem Solving',
    industry: 'HealthTech / Nutrition',
    summary: 'Step-by-step case study of solving 80% user retention drop-off by Day 2-3 in a nutrition tracking app (NutriTrack).',
    problem: 'NutriTrack meal planning app had 80% of users drop off by Day 2-3. Acquisition was strong but retention was killing the business.',
    approach: 'Analyzed behavioral data (funnel, cohorts) and qualitative data (user interviews, support tickets). Formed 5 hypotheses scored with ICE framework. Selected top hypothesis for MVP test.',
    solution: 'Discovered users overwhelmed by meal planning complexity. Launched simplified "3 meals today" view instead of full week planning. Added quick-add templates and grocery auto-generation.',
    results: [
      'Reduced Day 3 drop-off from 80% to 45%',
      '2x increase in week 1 retention',
      '30% increase in meal plan completion',
      'Support tickets reduced by 60%',
      'App Store rating improved from 3.2 to 4.5'
    ],
    frameworks: ['ICE Scoring', '5 Whys', 'MVP Testing'],
    metrics: ['Day 1/3/7 Retention', 'Meal Plan Completion', 'Support Tickets', 'App Store Rating', 'Feature Adoption'],
    keyLearnings: [
      'Behavioral + qualitative data together reveal the full picture',
      'Overwhelming users with features is worse than too few',
      'ICE scoring prevents analysis paralysis',
      'Simplification often beats adding more features'
    ],
    readTime: 15,
    sourceUrl: 'https://www.theatomicproduct.com/p/how-to-solve-an-80-drop-off-in-a'
  },
  {
    id: 'noah-debrincat-llm',
    title: 'LLM-Powered No-Code Validator - 400+ Engineering Hours Saved',
    author: 'Noah Debrincat',
    authorRole: 'Lead Product Manager',
    company: 'Enterprise SaaS',
    category: 'AI/ML',
    industry: 'B2B SaaS',
    summary: 'How Noah built an LLM-powered validation system that saved 400+ engineering hours and became a $350K+ value creator.',
    problem: 'Enterprise customers needed complex data validation but engineering backlog was 6+ months. No-code tools existed but required technical expertise.',
    approach: 'Leveraged LLMs to parse natural language validation rules. Built no-code UI for business users. Trained on 1000+ historical validation patterns.',
    solution: 'Launched LLM-powered validator where users describe rules in plain English. System auto-generates validation logic with 95%+ accuracy. Includes confidence scoring and human review queue.',
    results: [
      '400+ engineering hours saved per quarter',
      '$350K+ annual value created',
      '100+ features shipped faster',
      'Business users can iterate without engineering',
      'Became core differentiator in sales cycles'
    ],
    frameworks: ['AI/ML Product Framework', 'No-Code Strategy', 'Value Quantification'],
    metrics: ['Engineering Hours Saved', 'Validation Accuracy', 'User Adoption', 'Time to Launch', 'Sales Win Rate'],
    keyLearnings: [
      'LLMs excel at translating human intent to technical rules',
      'Confidence scoring builds trust in AI outputs',
      'No-code is about empowerment, not replacing engineers',
      'Quantify value in hours saved - executives understand this'
    ],
    readTime: 10,
    sourceUrl: 'https://noahdebrincat.com/'
  },
  {
    id: 'noah-debrincat-hope4all',
    title: 'HOPE4ALL Cancer Registry - $1M+ Gilead Partnership',
    author: 'Noah Debrincat',
    authorRole: 'Lead Product Manager',
    company: 'HealthTech',
    category: 'Feature Launch',
    industry: 'Healthcare / Biotech',
    summary: 'How Noah led development of cancer registry platform that secured $1M+ partnership with Gilead Sciences.',
    problem: 'Cancer treatment data was fragmented across providers. Pharma companies needed real-world evidence but HIPAA compliance made data sharing nearly impossible.',
    approach: 'Built HIPAA-compliant data registry with patient consent management. Partnered with 50+ clinics for data collection. Created anonymized aggregate views for pharma partners.',
    solution: 'Launched HOPE4ALL registry with real-time treatment outcomes, patient journey tracking, and compliant data sharing. Gilead became anchor partner for liver cancer research.',
    results: [
      '$1M+ partnership with Gilead Sciences',
      '50+ clinics contributing data',
      '10,000+ patient records',
      'First real-world evidence for new liver cancer treatments',
      'Expanded to 3 additional cancer types'
    ],
    frameworks: ['Healthcare Compliance Framework', 'Multi-Sided Platform', 'Partnership Strategy'],
    metrics: ['Clinic Participation', 'Patient Records', 'Data Quality Score', 'Partner Revenue', 'Research Publications'],
    keyLearnings: [
      'Compliance is a feature, not a constraint - market it as such',
      'Multi-sided platforms need balanced value for all parties',
      'Anchor partners validate the model for others',
      'Healthcare products move slow but have high moats'
    ],
    readTime: 12,
    sourceUrl: 'https://noahdebrincat.com/'
  },
  {
    id: 'apartment-communication',
    title: 'Streamlining Apartment Communication - Building in Public',
    author: 'Rachit Ranka',
    authorRole: 'Product Manager',
    company: 'Independent Project',
    category: 'Problem Solving',
    industry: 'PropTech / Real Estate',
    summary: 'How Rachit identified 7 pain points in apartment living and built MVP solutions using impact vs. effort prioritization.',
    problem: 'Apartment residents face communication challenges: maintenance requests invisible, announcements buried in emails, no transparency on issue resolution.',
    approach: 'Conducted 20+ resident interviews. Mapped 7 distinct pain points. Used impact vs. effort matrix to prioritize. Built MVP for top 3 problems.',
    solution: 'Launched apartment communication platform with announcements hub, complaint tracking with status visibility, and finance dashboard for maintenance fees.',
    results: [
      'Key insight: residents more frustrated by lack of visibility than slow resolution',
      'MVP launched in 4 weeks',
      'Pilot with 3 apartment complexes',
      '80% resident adoption in pilot buildings',
      'Maintenance ticket resolution time reduced by 40%'
    ],
    frameworks: ['Impact vs. Effort', 'Problem-Solution Fit', 'Build in Public'],
    metrics: ['Resident Adoption', 'Ticket Resolution Time', 'Announcement Open Rate', 'Satisfaction Score'],
    keyLearnings: [
      'Visibility into process matters as much as outcomes',
      'Building in public creates accountability and feedback',
      'Imperfect starts beat no starts - ship and iterate',
      'B2B2C requires solving for both admin and end-user'
    ],
    readTime: 8,
    sourceUrl: 'https://www.linkedin.com/posts/rachit-ranka_streamlining-apartment-communication-activity-7371438287741255680-ukgh'
  },
  {
    id: 'nykaa-teardown',
    title: 'Nykaa App Teardown - Strengths, Weaknesses, and Lessons',
    author: 'Shreya Pandita',
    authorRole: 'Aspiring Product Manager',
    company: 'Independent Analysis',
    category: 'Teardown',
    industry: 'E-commerce / Beauty',
    summary: 'First product teardown analyzing Nykaa 80% repeat purchase rate, omnichannel strategy, and areas for improvement.',
    problem: 'Nykaa dominates Indian beauty e-commerce but faces challenges in app engagement and personalization.',
    approach: 'Analyzed Nykaa across business metrics (80% repeat rate), user experience (onboarding, discovery, checkout), and competitive positioning (vs. Purplle, Amazon Beauty).',
    solution: 'Identified strengths (trusted brand, content integration, omnichannel) and weaknesses (transactional app, Nykaa Play not working, limited personalization). Proposed discovery and engagement improvements.',
    results: [
      '80% repeat purchase rate (industry leading)',
      'Strong omnichannel presence (100+ stores)',
      'Content-commerce integration working well',
      'Personalization opportunity identified',
      'Key lesson: imperfect starts beat no starts'
    ],
    frameworks: ['SWOT Analysis', 'E-commerce Metrics Framework', 'Omnichannel Strategy'],
    metrics: ['Repeat Purchase Rate', 'App MAU', 'Average Order Value', 'Store Footfall', 'Content Engagement'],
    keyLearnings: [
      'Content-commerce integration is Nykaa moat vs. Amazon',
      'Omnichannel is table stakes for beauty in India',
      'Personalization is the next frontier for repeat buyers',
      'First teardown teaches more than 10 case studies'
    ],
    readTime: 10,
    sourceUrl: 'https://www.linkedin.com/posts/shreyapandita01_nykaa-teardown-activity-7371211215894646784-tI3J'
  },
  {
    id: 'razorpay-revenue',
    title: 'How Razorpay Can Increase Revenue in 2025',
    author: 'Atharva Tendulkar',
    authorRole: 'Product Manager',
    company: 'Independent Case Study',
    category: 'Strategy',
    industry: 'Fintech / Payments',
    summary: 'PRD completed in 2-3 days analyzing Razorpay revenue opportunities across existing and new product lines.',
    problem: 'Razorpay dominates Indian payment gateway market but faces saturation in core SMB segment. Need new revenue streams for 2025 growth.',
    approach: 'Analyzed current revenue mix (payment gateway, RazorpayX, Capital). Identified whitespace in enterprise, international expansion, and value-added services.',
    solution: 'Recommended 3-pronged strategy: (1) Enterprise tier with custom pricing, (2) Southeast Asia expansion, (3) SaaS marketplace for integrations. Prioritized enterprise as highest ROI.',
    results: [
      'Enterprise segment could add $50M+ ARR',
      'International expansion TAM 3x domestic',
      'Marketplace creates ecosystem lock-in',
      'PRD completed in 2-3 days as portfolio piece',
      'Demonstrates strategic thinking for PM interviews'
    ],
    frameworks: ['TAM/SAM/SOM', 'Revenue Model Canvas', 'Ansoff Matrix'],
    metrics: ['ARR Growth', 'Enterprise Win Rate', 'International Revenue %', 'Marketplace GMV'],
    keyLearnings: [
      'Core market saturation requires adjacent expansion',
      'Enterprise sales need different motion than SMB',
      'Marketplaces create defensibility through network effects',
      'Time-boxed PRDs demonstrate execution ability'
    ],
    readTime: 12,
    sourceUrl: 'https://www.linkedin.com/posts/atharvatendulkar_how-razorpay-can-improve-revenue-activity-7295655844153593857-PkEU'
  },
  {
    id: 'meta-metaverse',
    title: 'Meta Metaverse Pivot - $50B+ Investment Analysis',
    author: 'Strategy PM Analysis',
    authorRole: 'Tech Industry Analyst',
    company: 'Meta',
    category: 'Strategy',
    industry: 'Social Media / VR',
    summary: 'Analysis of Meta $50B+ metaverse investment and strategic pivot to enterprise-first AR/VR solutions.',
    problem: 'Consumer metaverse adoption lagged expectations. Horizon Worlds failed to gain traction. Reality Labs losing $10B+ annually.',
    approach: 'Analyzed enterprise vs. consumer AR/VR adoption curves. Studied Microsoft HoloLens enterprise success. Identified manufacturing, healthcare, training as beachhead verticals.',
    solution: 'Recommended pivot to enterprise-first: Quest for Business, enterprise training solutions, healthcare partnerships. Reduce consumer spending by 40-50% while maintaining R&D.',
    results: [
      '$50B+ invested over 5 years',
      '$10B+ annual Reality Labs losses',
      'Enterprise pilot programs showing 3x ROI',
      'Manufacturing training use cases leading adoption',
      'Recommendation: 40-50% consumer spend reduction'
    ],
    frameworks: ['BCG Matrix', 'Crossing the Chasm', 'Real Options Thinking'],
    metrics: ['Reality Labs Loss', 'Enterprise Pilots', 'Quest for Business Adoption', 'Training ROI'],
    keyLearnings: [
      'Enterprise adoption precedes consumer for new categories',
      'Moonshots need intermediate milestones for accountability',
      'Pivot timing is critical - too early wastes investment, too late kills optionality',
      'B2B sales cycles are long but retention is high'
    ],
    readTime: 14,
    sourceUrl: 'https://www.toughtongueai.com/blog/product-strategy-case-studies'
  },
  {
    id: 'uber-car-seat',
    title: 'Google PM Interview - Uber Car Seat Challenge',
    author: 'Ajitesh',
    authorRole: 'Ex-Google PM',
    company: 'Google PM Interview Prep',
    category: 'Problem Solving',
    industry: 'Marketplace / Transportation',
    summary: 'Creative brainstorming case study for improving Uber family travel experience - from car seats to kids service tier.',
    problem: 'Parents struggle with Uber travel - car seat logistics, child safety concerns, driver friction. Family travel is underserved.',
    approach: 'Mapped customer journey for parents. Identified 5 key friction points: car seat carrying, driver acceptance, safety verification, pricing, and special needs.',
    solution: 'Proposed Uber Kids service tier with: (1) Car seat equipped vehicles, (2) Verified family drivers, (3) In-car entertainment, (4) School/hotspot programs, (5) Innovative tech like AR windows.',
    results: [
      'TAM: 40M+ families with children under 10 in US',
      'Estimated 15% premium pricing acceptance',
      'School partnership opportunity for daily rides',
      'Demonstrates creative brainstorming for PM interviews',
      'Uses SCAMPER and biomimicry techniques'
    ],
    frameworks: ['Customer Journey Mapping', 'SCAMPER', 'Biomimicry', 'Segmentation'],
    metrics: ['Family Ride Share', 'Premium Acceptance', 'Safety Incident Rate', 'School Partnership Adoption'],
    keyLearnings: [
      'Segmentation reveals underserved niches in mature products',
      'Creative techniques (SCAMPER, biomimicry) generate novel solutions',
      'Safety and trust are paramount for family products',
      'Partnership strategies can unlock distribution'
    ],
    readTime: 10,
    sourceUrl: 'https://www.toughtongueai.com/blog/google-pm-interview-uber-car-seat-challenge'
  },
  {
    id: 'okrs-rewrite',
    title: 'Upgrading Editor in OKR Environment - Failed Twice, Succeeded Third',
    author: 'Bertrand Rothen',
    authorRole: 'Senior Product Manager',
    company: 'Enterprise SaaS',
    category: 'Problem Solving',
    industry: 'B2B SaaS',
    summary: 'How Bertrand succeeded on third attempt after two failed rewrites by applying "Where To / Where From / Where Next" framework.',
    problem: 'Legacy editor needed upgrade. Failed twice before - once due to scope creep, once due to technical debt. Third attempt needed to succeed.',
    approach: 'Applied "Where To / Where From / Where Next" framework. Defined non-negotiable value. Sliced project into iterations. Set OKRs around value delivery, not feature completion.',
    solution: 'Completed in one quarter (2 weeks over) with reduced scope but same core value. Launched iterative improvements over next 2 quarters. Achieved 90% user adoption.',
    results: [
      'Completed in 1 quarter (2 weeks over)',
      '90% user adoption within 30 days',
      'Technical debt reduced by 70%',
      'Team velocity increased 2x post-launch',
      'Framework adopted for future rewrites'
    ],
    frameworks: ['Where To/From/Next', 'OKR Setting', 'Iterative Delivery'],
    metrics: ['User Adoption', 'Technical Debt Reduction', 'Team Velocity', 'Bug Rate'],
    keyLearnings: [
      'Rewrite projects need clear value definition before technical scope',
      'Iterative delivery beats big-bang for legacy replacements',
      'OKRs should measure value, not output',
      'Third attempts can succeed with different framing'
    ],
    readTime: 12,
    sourceUrl: 'https://www.bertrandrothen.com/product-management-case-studies/upgrading-an-existing-editor-in-an-okr-based-strategic-environment-product-management-case-study'
  },
  {
    id: 'elizabeth-launch',
    title: '$75M Product Launch - 35% Faster Time-to-Market',
    author: 'Elizabeth Dworkin',
    authorRole: 'Senior Program Manager',
    company: 'Enterprise Tech',
    category: 'Feature Launch',
    industry: 'B2B SaaS',
    summary: 'How Elizabeth orchestrated $75M product launch with 700+ contributors, achieving 35% faster time-to-market and $6-8M annual savings.',
    problem: 'Large product launches were slow (12+ months), expensive, and had coordination overhead. 700+ contributors across engineering, marketing, sales, support.',
    approach: 'Built operating model vs. just executing tasks. Created cross-functional pods with clear decision rights. Implemented weekly sync vs. daily standups for leaders.',
    solution: 'Launched with 35% faster time-to-market, $6-8M annual cost savings, 20% reduction in redundant meetings. Operating model became template for future launches.',
    results: [
      '$75M product launch successful',
      '35% faster time-to-market',
      '$6-8M annual cost savings',
      '20% reduction in redundant meetings',
      'Operating model scaled to 10+ launches'
    ],
    frameworks: ['Operating Model Design', 'Cross-Functional Alignment', 'Launch Excellence'],
    metrics: ['Time-to-Market', 'Cost Savings', 'Meeting Hours', 'Launch Success Rate'],
    keyLearnings: [
      'Systems beat heroics - build repeatable models',
      'Decision clarity reduces meeting overhead',
      'Cross-functional pods need shared incentives',
      'Operational excellence is a competitive advantage'
    ],
    readTime: 8,
    sourceUrl: 'https://www.linkedin.com/posts/elizabethdworkin_case-study-wednesday-operational-excellence-activity-7424835751886004226-fIU0'
  },
  {
    id: 'di-legacy-platform',
    title: '$600M Efficiency - Legacy System to Platform Strategy',
    author: 'Di Larmore',
    authorRole: 'Senior Product Manager',
    company: 'Enterprise Tech',
    category: 'Strategy',
    industry: 'B2B SaaS',
    summary: 'How Di turned legacy system replacement into platform strategy, creating $600M efficiency and becoming omnichannel commerce foundation.',
    problem: 'Legacy payment system was 15+ years old, costly to maintain, blocking innovation. Replacement had failed twice. Business needed omnichannel capabilities.',
    approach: 'Reframed from replacement to platform strategy. Built abstraction layer for legacy integration. Created API-first architecture for future extensibility.',
    solution: 'Launched platform that became omnichannel commerce foundation. Enabled new revenue streams ($18M+), third-party ticketing ($485M sales). Platform approach justified investment.',
    results: [
      '$600M efficiency over 5 years',
      '$18M+ new revenue enabled',
      '$485M in third-party ticketing sales',
      'Platform became strategic asset',
      'Innovation velocity increased 3x'
    ],
    frameworks: ['Platform Strategy', 'API-First Design', 'Legacy Modernization'],
    metrics: ['Efficiency Savings', 'New Revenue', 'Platform Adoption', 'Innovation Velocity'],
    keyLearnings: [
      'Reframe replacements as platforms to unlock budget',
      'Abstraction layers enable gradual modernization',
      'API-first enables ecosystem partnerships',
      'Outcomes over outputs - measure business impact'
    ],
    readTime: 15,
    sourceUrl: 'https://www.dilarmore.com/'
  },
  {
    id: 'sharon-transaction',
    title: 'Transaction Monitoring Infrastructure - 80K+ Users',
    author: 'Sharon Praise-Akpunne',
    authorRole: 'Senior Product Manager',
    company: 'Fintech',
    category: 'Feature Launch',
    industry: 'Fintech',
    summary: 'How Sharon built transaction monitoring infrastructure serving 80K+ users with 3X adoption increase.',
    problem: 'Fintech needed real-time transaction monitoring for fraud detection. Legacy batch processing caused 24-hour delays. False positives were 40%+.',
    approach: 'Built streaming infrastructure with sub-second latency. Implemented ML-based fraud scoring. Created human review queue for edge cases.',
    solution: 'Launched real-time monitoring with 95%+ accuracy. Reduced false positives to 15%. Scaled to 80K+ users with 3X adoption increase.',
    results: [
      '80K+ active users',
      '3X adoption increase',
      '95%+ fraud detection accuracy',
      'False positives reduced from 40% to 15%',
      'Sub-second latency achieved'
    ],
    frameworks: ['Real-time Systems', 'ML Product Framework', 'Fraud Detection'],
    metrics: ['Active Users', 'Adoption Rate', 'Detection Accuracy', 'False Positive Rate', 'Latency'],
    keyLearnings: [
      'Real-time is table stakes for fintech',
      'ML models need human review for edge cases',
      'False positives kill user trust faster than false negatives',
      'Infrastructure products need internal evangelism'
    ],
    readTime: 10,
    sourceUrl: 'https://sharry.netlify.app/'
  },
  {
    id: 'mukul-dating',
    title: 'Dating App Engagement - 20% Increase in Customer Reviews',
    author: 'Mukul',
    authorRole: 'Product Manager & AI Explorer',
    company: 'Independent Case Study',
    category: 'Growth',
    industry: 'Consumer / Dating',
    summary: 'How Mukul designed feature to increase customer reviews, achieving 20% increase with $10M potential revenue impact.',
    problem: 'Dating app had low review/rating participation. User feedback critical for matching algorithm but only 5% of users left reviews.',
    approach: 'Analyzed review funnel drop-offs. Tested incentive structures (gamification, social proof, timing). Identified post-date moment as optimal.',
    solution: 'Launched post-date review prompt with gamification (badges for helpful reviews), social proof (show others reviews), and optimal timing (2 hours after date end).',
    results: [
      '20% increase in customer reviews',
      '$10M potential revenue from better matching',
      'Review quality score improved 35%',
      'Matching algorithm accuracy increased',
      'User satisfaction up 15%'
    ],
    frameworks: ['Funnel Analysis', 'Gamification', 'Behavioral Timing'],
    metrics: ['Review Rate', 'Review Quality Score', 'Matching Accuracy', 'User Satisfaction'],
    keyLearnings: [
      'Timing matters more than incentives for reviews',
      'Gamification works when tied to community value',
      'Social proof increases participation more than rewards',
      'Better data improves core product (matching)'
    ],
    readTime: 8,
    sourceUrl: 'https://mukul-portfolio-nine.vercel.app/'
  }
];

export const getCaseStudyById = (id: string): CaseStudy | undefined => {
  return caseStudies.find(cs => cs.id === id);
};

export const getCaseStudiesByCategory = (category: CaseStudy['category']): CaseStudy[] => {
  return caseStudies.filter(cs => cs.category === category);
};

export const getCaseStudiesByIndustry = (industry: string): CaseStudy[] => {
  return caseStudies.filter(cs => cs.industry.toLowerCase().includes(industry.toLowerCase()));
};

export const searchCaseStudies = (query: string): CaseStudy[] => {
  const lowerQuery = query.toLowerCase();
  return caseStudies.filter(cs =>
    cs.title.toLowerCase().includes(lowerQuery) ||
    cs.summary.toLowerCase().includes(lowerQuery) ||
    cs.author.toLowerCase().includes(lowerQuery) ||
    cs.company?.toLowerCase().includes(lowerQuery) ||
    cs.industry.toLowerCase().includes(lowerQuery)
  );
};
