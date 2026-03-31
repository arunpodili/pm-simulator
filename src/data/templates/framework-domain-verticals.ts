import { Template } from '@/types';

export const domainVerticalsTemplate: Template = {
  id: 'framework-domain-verticals',
  name: 'Domain Verticals Decision Framework',
  description: 'Comprehensive framework for domain-specific product decisions covering B2B SaaS, Consumer, Marketplace, Fintech, AI/ML, and Healthcare',
  industryId: 'saas',
  scenarioId: 'product-strategy',
  frameworkIds: ['rice', 'okrs', 'swot'],
  outputFormat: 'markdown',
  estimatedCompletionTime: '3-4 hours',
  version: '1.0.0',
  sections: [
    {
      id: 'decision-context',
      title: 'Decision Context',
      description: 'Define the domain vertical and decision',
      fieldType: 'table',
      required: true,
      helpText: 'Set the stage for your domain-specific analysis',
      learnContentId: 'domain-verticals',
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Decision/Initiative', ''],
          ['Date', ''],
          ['Product', ''],
          ['Domain Vertical', 'B2B SaaS / Consumer / Marketplace / Fintech / AI-ML / Healthcare / Other'],
          ['Who Is Deciding', ''],
          ['Decision Deadline', ''],
        ]
      }
    },
    {
      id: 'domain-fit-assessment',
      title: 'Domain Fit Assessment',
      description: 'Assess your fit and understanding of the domain',
      fieldType: 'table',
      required: true,
      helpText: 'Understand the unique constraints and opportunities of your domain',
      learnContentId: 'domain-selection',
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What domain are you in?', ''],
          ['Why this domain?', ''],
          ['What are the unique constraints?', ''],
          ['What are the unique opportunities?', ''],
          ['What domain expertise do you need?', ''],
        ]
      }
    },
    {
      id: 'b2b-business-model',
      title: 'B2B SaaS: Business Model Assessment',
      description: 'Define your B2B business model',
      fieldType: 'table',
      required: false,
      helpText: 'B2B requires understanding the buyer committee',
      learnContentId: 'b2b-saas',
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Target Customer', 'Enterprise / SMB / Mid-Market'],
          ['Pricing Model', 'Per-seat / Usage-based / Tiered / Custom'],
          ['Average Contract Value (ACV)', '$___'],
          ['Sales Model', 'Product-Led / Sales-Led / Hybrid'],
          ['Deployment Model', 'Multi-tenant / Single-tenant / On-premise'],
        ]
      }
    },
    {
      id: 'b2b-decision-maker-map',
      title: 'B2B SaaS: Decision-Maker Map',
      description: 'Map the buyer committee',
      fieldType: 'table',
      required: false,
      helpText: 'B2B purchases involve multiple stakeholders',
      learnContentId: 'b2b-saas',
      tableSchema: {
        columns: ['Role', 'Title', 'What They Care About', 'Their Objections', 'How to Win Them'],
        rows: [
          ['End User', '', 'Ease of use, saves time', 'Another tool to learn', 'Show workflow fit'],
          ['Manager', '', 'Team productivity, reporting', 'Will my team adopt?', 'Show admin dashboard'],
          ['IT/Security', '', 'Security, compliance, integration', 'Is this safe?', 'Show certifications'],
          ['Economic Buyer', '', 'ROI, budget impact', 'Is this worth the cost?', 'Show business case'],
          ['Champion', '', 'Personal success, visibility', 'Can I stake my reputation?', 'Show quick wins'],
        ]
      }
    },
    {
      id: 'b2b-metrics-dashboard',
      title: 'B2B SaaS: Metrics Dashboard',
      description: 'Track key B2B SaaS metrics',
      fieldType: 'table',
      required: false,
      helpText: 'NRR and GRR are the king and queen of B2B SaaS',
      learnContentId: 'b2b-saas',
      tableSchema: {
        columns: ['Metric', 'Formula', 'Your Value', 'Industry Benchmark'],
        rows: [
          ['MRR', 'Monthly Recurring Revenue', '$___', ''],
          ['ARR', 'MRR x 12', '$___', ''],
          ['Net Revenue Retention', '(Ending MRR - New MRR) / Starting MRR', '___%', '100-120% (good), 120%+ (great)'],
          ['Gross Revenue Retention', '(Ending MRR - Churn) / Starting MRR', '___%', '90%+ (good), 95%+ (great)'],
          ['CAC Payback Period', 'CAC / (ARPA x Gross Margin %)', '___ months', '<12 months'],
          ['LTV:CAC', 'LTV / CAC', '___:1', '3:1+'],
          ['Rule of 40', 'Growth Rate + Profit Margin', '___%', '40%+'],
        ]
      }
    },
    {
      id: 'b2b-compliance-checklist',
      title: 'B2B SaaS: Compliance Checklist',
      description: 'Track compliance requirements',
      fieldType: 'table',
      required: false,
      helpText: 'Enterprise customers require compliance certifications',
      learnContentId: 'b2b-saas',
      tableSchema: {
        columns: ['Compliance', 'Required?', 'Status', 'Owner', 'Notes'],
        rows: [
          ['SOC 2 Type II', 'Yes / No', 'Complete / In Progress / Not Started', '', ''],
          ['GDPR', 'Yes / No', 'Complete / In Progress / Not Started', '', ''],
          ['HIPAA', 'Yes / No', 'Complete / In Progress / Not Started', '', ''],
          ['ISO 27001', 'Yes / No', 'Complete / In Progress / Not Started', '', ''],
          ['SSO/SAML', 'Yes / No', 'Complete / In Progress / Not Started', '', ''],
          ['Data Residency', 'Yes / No', 'Complete / In Progress / Not Started', '', ''],
        ]
      }
    },
    {
      id: 'consumer-product-type',
      title: 'Consumer: Product Type',
      description: 'Define your consumer product type',
      fieldType: 'table',
      required: false,
      helpText: 'Different consumer product types have different dynamics',
      learnContentId: 'consumer-products',
      tableSchema: {
        columns: ['Type', 'Description', 'Your Product'],
        rows: [
          ['Utility', 'Solves specific problem (e.g., Uber, Airbnb)', ''],
          ['Content', 'Provides content consumption (e.g., Netflix, Spotify)', ''],
          ['Social', 'Enables connection (e.g., Instagram, TikTok)', ''],
          ['Gaming', 'Entertainment focused', ''],
          ['Commerce', 'Enables purchasing (e.g., Amazon, Shopify)', ''],
          ['Creator Economy', 'Enables creation/monetization (e.g., Substack, Patreon)', ''],
        ]
      }
    },
    {
      id: 'consumer-metrics-dashboard',
      title: 'Consumer: Metrics Dashboard',
      description: 'Track key consumer product metrics',
      fieldType: 'table',
      required: false,
      helpText: 'Retention is everything in consumer',
      learnContentId: 'consumer-products',
      tableSchema: {
        columns: ['Metric', 'Formula', 'Your Value', 'Industry Benchmark'],
        rows: [
          ['DAU', 'Daily Active Users', '___', ''],
          ['WAU', 'Weekly Active Users', '___', ''],
          ['MAU', 'Monthly Active Users', '___', ''],
          ['DAU/MAU Ratio', 'DAU / MAU', '___%', '20%+ (good), 50%+ (great)'],
          ['D1 Retention', '% active 1 day after install', '___%', '40%+ (good)'],
          ['D7 Retention', '% active 7 days after install', '___%', '20%+ (good)'],
          ['D30 Retention', '% active 30 days after install', '___%', '10%+ (good)'],
        ]
      }
    },
    {
      id: 'viral-loop-design',
      title: 'Consumer: Viral Loop Design',
      description: 'Design your viral growth loop',
      fieldType: 'table',
      required: false,
      helpText: 'Viral loops can drive exponential growth',
      learnContentId: 'consumer-products',
      tableSchema: {
        columns: ['Component', 'Your Design'],
        rows: [
          ['Who Invites', '(Existing user segment)'],
          ['How They Invite', '(Mechanism: link, share, invite)'],
          ['Incentive for Inviter', '(What do they get?)'],
          ['Incentive for Invitee', '(What do they get?)'],
          ['Friction Points', '(What could block sharing?)'],
          ['Viral Coefficient (k)', '___ (Target: >1.0 for viral growth)'],
        ]
      }
    },
    {
      id: 'marketplace-type',
      title: 'Marketplace: Type & Model',
      description: 'Define your marketplace type',
      fieldType: 'table',
      required: false,
      helpText: 'Marketplaces have unique chicken-and-egg dynamics',
      learnContentId: 'marketplace',
      tableSchema: {
        columns: ['Type', 'Description', 'Your Marketplace'],
        rows: [
          ['Goods', 'Physical products (e.g., eBay, Etsy)', ''],
          ['Services', 'Labor/services (e.g., TaskRabbit, Fiverr)', ''],
          ['Rentals', 'Temporary access (e.g., Airbnb, Turo)', ''],
          ['On-Demand', 'Immediate fulfillment (e.g., Uber, DoorDash)', ''],
          ['Professional', 'B2B services (e.g., Upwork, Toptal)', ''],
          ['Content', 'User-generated content (e.g., YouTube, Medium)', ''],
        ]
      }
    },
    {
      id: 'chicken-egg-strategy',
      title: 'Marketplace: Chicken-and-Egg Strategy',
      description: 'Solve the marketplace cold start problem',
      fieldType: 'table',
      required: false,
      helpText: 'Which side do you start with?',
      learnContentId: 'marketplace',
      tableSchema: {
        columns: ['Question', 'Your Answer'],
        rows: [
          ['Which side do you start with?', 'Supply / Demand'],
          ['Why this side first?', ''],
          ['How do you seed initial supply?', ''],
          ['How do you drive initial demand?', ''],
          ['What is your liquidity target?', '___% of listings get transacted'],
        ]
      }
    },
    {
      id: 'marketplace-metrics',
      title: 'Marketplace: Metrics Dashboard',
      description: 'Track key marketplace metrics',
      fieldType: 'table',
      required: false,
      helpText: 'Liquidity is the key marketplace metric',
      learnContentId: 'marketplace',
      tableSchema: {
        columns: ['Metric', 'Formula', 'Your Value', 'Industry Benchmark'],
        rows: [
          ['GMV', 'Gross Merchandise Value', '$___', ''],
          ['Take Rate', 'Revenue / GMV', '___%', '10-30% typical'],
          ['Liquidity', '% of listings that get transacted', '___%', '30%+ (good), 50%+ (great)'],
          ['Fill Rate', '% of requests that get fulfilled', '___%', '70%+ (good)'],
          ['Repeat Rate', '% of customers who transact again', '___%', ''],
        ]
      }
    },
    {
      id: 'fintech-category',
      title: 'Fintech: Category & Model',
      description: 'Define your fintech category',
      fieldType: 'table',
      required: false,
      helpText: 'Fintech requires understanding regulatory requirements',
      learnContentId: 'fintech',
      tableSchema: {
        columns: ['Category', 'Description', 'Your Product'],
        rows: [
          ['Payments', 'Processing transactions (e.g., Stripe, Square)', ''],
          ['Lending', 'Credit/loans (e.g., Affirm, SoFi)', ''],
          ['Investing', 'Wealth management (e.g., Robinhood, Betterment)', ''],
          ['Banking', 'Digital banking (e.g., Chime, Revolut)', ''],
          ['Insurance', 'Insurtech (e.g., Lemonade, Root)', ''],
          ['B2B Fintech', 'Business finance (e.g., Brex, Ramp)', ''],
        ]
      }
    },
    {
      id: 'fintech-regulatory',
      title: 'Fintech: Regulatory Landscape',
      description: 'Map your regulatory requirements',
      fieldType: 'table',
      required: false,
      helpText: 'Regulatory compliance is non-negotiable in fintech',
      learnContentId: 'fintech',
      tableSchema: {
        columns: ['Regulation', 'Applies?', 'Status', 'Owner', 'Notes'],
        rows: [
          ['Money Transmitter License', 'Yes / No', 'Complete / In Progress / N/A', '', ''],
          ['PCI DSS', 'Yes / No', 'Complete / In Progress / N/A', '', ''],
          ['KYC/AML', 'Yes / No', 'Complete / In Progress / N/A', '', ''],
          ['SEC Registration', 'Yes / No', 'Complete / In Progress / N/A', '', ''],
          ['GDPR/CCPA', 'Yes / No', 'Complete / In Progress / N/A', '', ''],
        ]
      }
    },
    {
      id: 'fintech-metrics',
      title: 'Fintech: Metrics Dashboard',
      description: 'Track key fintech metrics',
      fieldType: 'table',
      required: false,
      helpText: 'Unit economics and risk metrics are critical',
      learnContentId: 'fintech',
      tableSchema: {
        columns: ['Metric', 'Formula', 'Your Value', 'Industry Benchmark'],
        rows: [
          ['TPV', 'Total Payment Volume', '$___', ''],
          ['Net Interest Margin', '(Interest Income - Interest Expense) / Assets', '___%', '3-5% (banking)'],
          ['Credit Loss Rate', 'Charge-offs / Total loans', '___%', '<3% (good)'],
          ['Revenue per User', 'Total Revenue / Active Users', '$___', ''],
          ['LTV:CAC', 'LTV / CAC', '___:1', '3:1+'],
        ]
      }
    },
    {
      id: 'ai-ml-type',
      title: 'AI/ML: Product Type',
      description: 'Define your AI/ML product type',
      fieldType: 'table',
      required: false,
      helpText: 'Different AI types have different requirements',
      learnContentId: 'ai-ml',
      tableSchema: {
        columns: ['Type', 'Description', 'Your Product'],
        rows: [
          ['Prediction', 'Forecasting outcomes (e.g., demand, churn)', ''],
          ['Classification', 'Categorizing inputs (e.g., spam detection)', ''],
          ['Generation', 'Creating content (e.g., GPT, image gen)', ''],
          ['Recommendation', 'Suggesting items (e.g., Netflix, Spotify)', ''],
          ['NLP', 'Text/language processing', ''],
          ['Computer Vision', 'Image/video analysis', ''],
        ]
      }
    },
    {
      id: 'ai-ml-model-metrics',
      title: 'AI/ML: Model Metrics',
      description: 'Track model performance metrics',
      fieldType: 'table',
      required: false,
      helpText: 'Model metrics must translate to user value',
      learnContentId: 'ai-ml',
      tableSchema: {
        columns: ['Metric', 'Formula', 'Your Value', 'Target'],
        rows: [
          ['Accuracy', 'Correct predictions / Total predictions', '___%', ''],
          ['Precision', 'True positives / All positive predictions', '___%', ''],
          ['Recall', 'True positives / All actual positives', '___%', ''],
          ['F1 Score', '2 x (Precision x Recall) / (Precision + Recall)', '___', '0.8+'],
          ['Latency', 'Time to prediction', '___ ms', ''],
        ]
      }
    },
    {
      id: 'ai-ml-bias-assessment',
      title: 'AI/ML: Bias & Fairness Assessment',
      description: 'Assess model bias and fairness',
      fieldType: 'table',
      required: false,
      helpText: 'Fair AI is not optional',
      learnContentId: 'ai-ml',
      tableSchema: {
        columns: ['Check', 'Status', 'Notes'],
        rows: [
          ['Training Data Representativeness', 'Pass / Fail / N/A', ''],
          ['Demographic Parity', 'Pass / Fail / N/A', ''],
          ['Equal Opportunity', 'Pass / Fail / N/A', ''],
          ['Predictive Parity', 'Pass / Fail / N/A', ''],
          ['Adverse Impact Analysis', 'Pass / Fail / N/A', ''],
        ]
      }
    },
    {
      id: 'healthcare-type',
      title: 'Healthcare: Product Type',
      description: 'Define your healthcare product type',
      fieldType: 'table',
      required: false,
      helpText: 'Healthcare has complex stakeholder dynamics',
      learnContentId: 'healthcare',
      tableSchema: {
        columns: ['Type', 'Description', 'Your Product'],
        rows: [
          ['EHR/EMR', 'Electronic health records', ''],
          ['Telehealth', 'Remote care', ''],
          ['Patient Engagement', 'Patient portals, reminders', ''],
          ['Clinical Decision Support', 'Diagnosis/treatment assistance', ''],
          ['Health Analytics', 'Population health, outcomes', ''],
          ['Digital Therapeutics', 'Software as treatment', ''],
        ]
      }
    },
    {
      id: 'healthcare-regulatory',
      title: 'Healthcare: Regulatory Landscape',
      description: 'Map your healthcare regulatory requirements',
      fieldType: 'table',
      required: false,
      helpText: 'HIPAA is the floor, not the ceiling',
      learnContentId: 'healthcare',
      tableSchema: {
        columns: ['Regulation', 'Applies?', 'Status', 'Owner', 'Notes'],
        rows: [
          ['HIPAA', 'Yes / No', 'Complete / In Progress / N/A', '', ''],
          ['HITECH', 'Yes / No', 'Complete / In Progress / N/A', '', ''],
          ['FDA (SaMD)', 'Yes / No', 'Complete / In Progress / N/A', 'Software as Medical Device'],
          ['21st Century Cures Act', 'Yes / No', 'Complete / In Progress / N/A', ''],
          ['Interoperability Rules', 'Yes / No', 'Complete / In Progress / N/A', ''],
        ]
      }
    },
    {
      id: 'healthcare-stakeholder-map',
      title: 'Healthcare: Stakeholder Map',
      description: 'Map healthcare stakeholders',
      fieldType: 'table',
      required: false,
      helpText: 'Healthcare has complex stakeholder dynamics',
      learnContentId: 'healthcare',
      tableSchema: {
        columns: ['Stakeholder', 'Role', 'What They Care About', 'Their Power'],
        rows: [
          ['Patients', 'End users', 'Outcomes, experience, cost', 'Low (individually)'],
          ['Providers', 'Doctors, nurses', 'Workflow, outcomes, liability', 'High'],
          ['Payers', 'Insurance companies', 'Cost, outcomes, compliance', 'High'],
          ['Administrators', 'Hospital admin', 'Efficiency, compliance, budget', 'High'],
          ['IT/Security', 'Hospital IT', 'Security, integration, uptime', 'Medium'],
        ]
      }
    },
    {
      id: 'domain-risk-assessment',
      title: 'Domain-Specific Risk Assessment',
      description: 'Assess risks specific to your domain',
      fieldType: 'table',
      required: true,
      helpText: 'Every domain has unique risks',
      learnContentId: 'domain-verticals',
      tableSchema: {
        columns: ['Domain', 'Key Risks', 'Your Mitigation'],
        rows: [
          ['B2B SaaS', 'Long sales cycles, churn', ''],
          ['Consumer', 'High competition, retention', ''],
          ['Marketplace', 'Chicken-and-egg, liquidity', ''],
          ['Fintech', 'Regulatory, trust', ''],
          ['AI/ML', 'Bias, drift, explainability', ''],
          ['Healthcare', 'Compliance, patient safety', ''],
        ]
      }
    },
    {
      id: 'domain-metrics-priority',
      title: 'Domain Metrics Priority',
      description: 'Define your domain-specific north star and inputs',
      fieldType: 'table',
      required: true,
      helpText: 'Your domain dictates what metrics matter most',
      learnContentId: 'domain-verticals',
      tableSchema: {
        columns: ['Domain', 'North Star Metric', 'Input Metric 1', 'Input Metric 2', 'Guardrail'],
        rows: [
          ['Your Domain', '', '', '', ''],
        ]
      }
    },
    {
      id: 'domain-competencies-scorecard',
      title: 'Domain Competencies Scorecard',
      description: 'Rate yourself on domain knowledge',
      fieldType: 'table',
      required: true,
      helpText: 'Domain expertise takes time - assess where you are',
      learnContentId: 'domain-verticals',
      tableSchema: {
        columns: ['Competency', 'Score', 'Evidence', 'Improvement Plan'],
        rows: [
          ['Industry Knowledge', '/5', '', ''],
          ['Regulatory Understanding', '/5', '', ''],
          ['Domain Metrics Fluency', '/5', '', ''],
          ['Stakeholder Understanding', '/5', '', ''],
          ['Domain-Specific Skills', '/5', '', ''],
        ]
      }
    },
    {
      id: 'domain-learning-plan',
      title: '90-Day Domain Learning Plan',
      description: 'Plan your domain immersion',
      fieldType: 'table',
      required: true,
      helpText: 'Domain expertise is built through deliberate learning',
      learnContentId: 'domain-verticals',
      tableSchema: {
        columns: ['Week', 'Activity', 'Output'],
        rows: [
          ['1-2', 'Read 3 industry books', 'Book summaries'],
          ['3-4', 'Interview 5 domain experts', 'Insight document'],
          ['5-6', 'Attend industry conference/event', 'Conference notes'],
          ['7-8', 'Analyze 3 competitor products', 'Competitive analysis'],
          ['9-10', 'Shadow 5 users/customers', 'User research report'],
          ['11-12', 'Build domain knowledge deck', 'Share with team'],
        ]
      }
    },
  ],
};
