// Section 6: Domain Verticals Decision Framework

export const domainVerticalsTemplate = {
  id: 'mastery-section-6',
  name: 'Domain Verticals Mastery',
  description: 'Master domain-specific PM skills across B2B SaaS, Consumer, Marketplace, Fintech, AI/ML, and Healthcare',
  category: 'mastery' as const,
  estimatedCompletionTime: '60-90 min',
  sections: [
    {
      id: 'domain-selection',
      title: '1. Domain Selection',
      description: 'Which domain are you focusing on?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Primary Domain', 'B2B SaaS / Consumer / Marketplace / Fintech / AI/ML / Healthcare'],
          ['Your Product', ''],
          ['Your Role', ''],
          ['Time in Domain', ''],
          ['Target Expertise Level', 'Foundational / Intermediate / Advanced / Expert']
        ]
      },
      helpText: 'Choose your primary domain to focus your learning.'
    },
    {
      id: 'b2b-fundamentals',
      title: '2.1 B2B SaaS Fundamentals',
      description: 'Understand B2B-specific dynamics',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Aspect', 'Your Application'],
        rows: [
          ['Who is the Buyer vs. User vs. Economic Buyer', ''],
          ['Sales Cycle Length', ''],
          ['Decision Making Unit (DMU) Members', ''],
          ['Procurement Process', ''],
          ['Contract Terms (Typical)', ''],
          ['Implementation Complexity', ''],
          ['Integration Requirements', '']
        ]
      },
      helpText: 'B2B buying is complex. Map all stakeholders.'
    },
    {
      id: 'b2b-customer-research',
      title: '2.2 B2B Customer Research',
      description: 'How to research in B2B contexts',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Method', 'How to Execute', 'Your Plan'],
        rows: [
          ['Customer Advisory Board', 'Quarterly meetings with strategic customers', ''],
          ['Executive Business Reviews', 'QBRs with key accounts', ''],
          ['Win/Loss Analysis', 'Interview prospects after decision', ''],
          ['Usage Analytics', 'Product analytics on feature adoption', ''],
          ['Support Ticket Analysis', 'Pattern recognition in support requests', ''],
          ['Sales Call Ride-alongs', 'Listen to 5+ sales calls weekly', '']
        ]
      },
      helpText: 'B2B research requires access to customers. Work with Sales/CS.'
    },
    {
      id: 'b2b-metrics',
      title: '2.3 B2B SaaS Metrics Mastery',
      description: 'Know your numbers',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Metric', 'Formula', 'Your Current Value', 'Target', 'Industry Benchmark'],
        rows: [
          ['MRR/ARR', 'Monthly/Annual Recurring Revenue', '', '', ''],
          ['ARR Growth Rate', '(New + Expansion - Churn) / Starting ARR', '', '', '30-50%+ for growth stage'],
          ['Net Revenue Retention', '(Starting + Expansion - Contraction - Churn) / Starting', '', '', '100-120%+'],
          ['Gross Revenue Retention', '(Starting - Churn) / Starting', '', '', '90%+'],
          ['CAC Payback Period', 'CAC / (ARPA * Gross Margin)', '', '', '<12 months'],
          ['LTV:CAC Ratio', 'LTV / CAC', '', '', '3:1'],
          ['Rule of 40', 'Growth Rate + Profit Margin', '', '', '40%+'],
          ['Logo Churn', 'Customers Lost / Starting Customers', '', '', '<2% monthly SMB, <10% annual Enterprise'],
          ['Feature Adoption', 'Users using feature / Total users', '', '', 'Varies by feature'],
          ['Time to Value', 'Days from signup to activation', '', '', '<7 days']
        ]
      },
      helpText: 'Know these cold. Investors and executives will ask.'
    },
    {
      id: 'b2b-pricing',
      title: '2.4 B2B Pricing Strategy',
      description: 'Design your pricing model',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Pricing Model', 'Pros', 'Cons', 'Best For', 'Your Fit'],
        rows: [
          ['Per Seat', 'Predictable, scales with customer', 'Discourages adoption', 'Collaboration tools', ''],
          ['Usage-Based', 'Aligns with value, scales naturally', 'Unpredictable revenue', 'API/Infrastructure', ''],
          ['Tiered', 'Simple, good/better/best', 'Leaves money on table', 'Most SMB products', ''],
          ['Feature-Gated', 'Clear upgrade path', 'Can frustrate users', 'Feature-rich products', ''],
          ['Flat Rate', 'Simple to understand', 'No upsell path', 'Simple products', ''],
          ['Freemium', 'Low CAC, viral potential', 'Low conversion, support cost', 'PLG motions', ''],
          ['Enterprise Custom', 'Maximize deal size', 'Sales intensive', 'Large deals', '']
        ]
      },
      helpText: 'Pricing is a product. Test and iterate.'
    },
    {
      id: 'b2b-roadmap',
      title: '2.5 B2B Roadmap Planning',
      description: 'Balance stakeholder demands',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Stakeholder', 'Their Ask', 'Strategic Fit', 'Revenue Impact', 'Decision'],
        rows: [
          ['Enterprise Customer A', '', '', '', 'Commit / Consider / Decline'],
          ['Enterprise Customer B', '', '', '', ''],
          ['Sales Team', '', '', '', ''],
          ['Strategic Initiative', '', '', '', ''],
          ['Technical Debt', '', '', '', '']
        ]
      },
      helpText: 'Not all customer requests are equal. Weight by strategic value.'
    },
    {
      id: 'b2b-enterprise-deals',
      title: '2.6 Enterprise Deal Support',
      description: 'Handle strategic deal requests',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Field', 'Input'],
        rows: [
          ['Customer Name', ''],
          ['Deal Value (ARR)', ''],
          ['Strategic Importance', 'Logo / Reference / Market Entry / Revenue'],
          ['Feature Request', ''],
          ['Is It On Roadmap Already?', ''],
          ['Engineering Effort', ''],
          ['Opportunity Cost (What slips?)', ''],
          ['Commitment Decision', 'Yes / No / Conditional'],
          ['If Yes, Conditions', ''],
          ['If No, Alternative', '']
        ]
      },
      helpText: 'One big deal can fund a quarter. But don\'t derail strategy for one customer.'
    },
    {
      id: 'b2b-security-compliance',
      title: '2.7 B2B Security & Compliance',
      description: 'Enterprise requirements checklist',
      fieldType: 'checkbox' as const,
      required: true,
      options: [
        { value: 'sso', label: 'SSO/SAML Integration (Okta, Azure AD, etc.)' },
        { value: 'soc2', label: 'SOC 2 Type II Certification' },
        { value: 'gdpr', label: 'GDPR Compliance' },
        { value: 'hipaa', label: 'HIPAA Compliance (if healthcare)' },
        { value: 'encryption', label: 'Encryption at Rest and In Transit' },
        { value: 'audit-logs', label: 'Audit Logs' },
        { value: 'rbac', label: 'Role-Based Access Control' },
        { value: 'data-residency', label: 'Data Residency Options' },
        { value: 'backup', label: 'Backup & Disaster Recovery' },
        { value: 'api-security', label: 'API Security & Rate Limiting' }
      ],
      helpText: 'Enterprise deals will stall without these. Plan ahead.'
    },
    {
      id: 'consumer-fundamentals',
      title: '3.1 Consumer Product Fundamentals',
      description: 'Understand consumer-specific dynamics',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Aspect', 'Your Application'],
        rows: [
          ['Target User Persona', ''],
          ['User Motivation (Why they come)', ''],
          ['Usage Frequency', 'Daily / Weekly / Monthly / Occasional'],
          ['Session Length (Target)', ''],
          ['Monetization Model', 'Ads / Subscription / IAP / Transaction / Hybrid'],
          ['Acquisition Channels', ''],
          ['Viral Coefficient (k)', ''],
          ['Network Effects Type', 'Direct / Indirect / Two-Sided / Data']
        ]
      },
      helpText: 'Consumer is about scale, engagement, and habit formation.'
    },
    {
      id: 'consumer-metrics',
      title: '3.2 Consumer Metrics Mastery',
      description: 'Know your consumer numbers',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Metric', 'Formula', 'Your Value', 'Target', 'Benchmark'],
        rows: [
          ['DAU/MAU', 'Daily Active Users / Monthly Active Users', '', '', '20%+ good, 50%+ great'],
          ['Stickiness', 'DAU / WAU or DAU / MAU', '', '', ''],
          ['D1 Retention', 'Users returning Day 1 / Day 0 users', '', '', '40%+ for social, 25%+ for utility'],
          ['D7 Retention', 'Users returning Day 7 / Day 0 users', '', '', '20%+'],
          ['D30 Retention', 'Users returning Day 30 / Day 0 users', '', '', '10%+'],
          ['Session Length', 'Time per session', '', '', 'Varies by category'],
          ['Sessions per User', 'Sessions per user per week', '', '', ''],
          ['Viral Coefficient', 'Invites sent * Conversion rate', '', '', '>1.0 for viral growth'],
          ['ARPDAU', 'Daily Revenue / DAU', '', '', ''],
          ['LTV', 'ARPU * Gross Margin * Lifetime', '', '', ''],
          ['CAC', 'Total Acquisition Spend / New Users', '', '', ''],
          ['LTV:CAC', 'LTV / CAC', '', '', '3:1+'],
          ['Payback Period', 'CAC / ARPU', '', '', '<12 months']
        ]
      },
      helpText: 'Consumer metrics compound. Small improvements = big outcomes.'
    },
    {
      id: 'consumer-onboarding',
      title: '3.3 Consumer Onboarding Design',
      description: 'Design the first-time user experience',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Step', 'User Action', 'Value Delivered', 'Friction Points', 'Optimization Ideas'],
        rows: [
          ['Landing', '', '', '', ''],
          ['Signup', '', '', '', ''],
          ['First Key Action', '', '', '', ''],
          ['Aha Moment', '', '', '', ''],
          ['Habit Formation', '', '', '', '']
        ]
      },
      helpText: 'Onboarding is your product. Get users to value fast.'
    },
    {
      id: 'consumer-engagement',
      title: '3.4 Consumer Engagement Loops',
      description: 'Design hooks that bring users back',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Trigger', 'Action', 'Reward', 'Investment', 'Your Implementation'],
        rows: [
          ['External (Push, Email)', '', '', '', ''],
          ['Internal (Emotion, Habit)', '', '', '', ''],
          ['Social (Friends, FOMO)', '', '', '', ''],
          ['Content (New posts, updates)', '', '', '', '']
        ]
      },
      placeholder: 'Hook Model: Trigger → Action → Variable Reward → Investment → Trigger',
      helpText: 'Variable rewards are key. Uncertainty drives engagement.'
    },
    {
      id: 'consumer-growth',
      title: '3.5 Consumer Growth Levers',
      description: 'Identify your growth engines',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Growth Engine', 'How It Works', 'Your Status', 'Next Experiment'],
        rows: [
          ['Sticky (Retention-driven)', 'Users stay and engage over time', 'Active / Not Active', ''],
          ['Viral (User-driven)', 'Users invite other users', 'Active / Not Active', ''],
          ['Paid (Acquisition-driven)', 'Paid CAC < LTV', 'Active / Not Active', ''],
          ['Content (SEO-driven)', 'Content attracts organic traffic', 'Active / Not Active', ''],
          ['Platform (Distribution-driven)', 'Leverage existing platforms', 'Active / Not Active', '']
        ]
      },
      helpText: 'Pick ONE engine to master first. Then layer others.'
    },
    {
      id: 'marketplace-fundamentals',
      title: '4.1 Marketplace Fundamentals',
      description: 'Understand two-sided dynamics',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Aspect', 'Supply Side', 'Demand Side'],
        rows: [
          ['Who They Are', '', ''],
          ['Their Motivation', '', ''],
          ['Their Pain Points', '', ''],
          ['Acquisition Strategy', '', ''],
          ['Retention Strategy', '', ''],
          ['Monetization', '', ''],
          ['Chicken/Egg Solution', '', '']
        ]
      },
      helpText: 'Marketplaces live or die by liquidity. Balance both sides.'
    },
    {
      id: 'marketplace-metrics',
      title: '4.2 Marketplace Metrics Mastery',
      description: 'Track marketplace health',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Metric', 'Formula', 'Your Value', 'Target', 'Benchmark'],
        rows: [
          ['GMV', 'Gross Merchandise Value', '', '', ''],
          ['Take Rate', 'Revenue / GMV', '', '', '10-30% typical'],
          ['Liquidity Rate', 'Transactions / Possible Transactions', '', '', '60%+'],
          ['Search Success Rate', 'Searches with result / Total searches', '', '', '80%+'],
          ['Fill Rate', 'Listings sold / Total listings', '', '', ''],
          ['Supplier Utilization', 'Active suppliers / Total suppliers', '', '', ''],
          ['Repeat Purchase Rate', 'Returning buyers / Total buyers', '', '', '50%+'],
          ['Network Effects Strength', 'Value increase per new user', '', '', 'Qualitative']
        ]
      },
      helpText: 'Liquidity is your North Star. Everything serves it.'
    },
    {
      id: 'marketplace-chicken-egg',
      title: '4.3 Solving Chicken & Egg',
      description: 'How will you bootstrap?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Strategy', 'How You\'ll Execute', 'Progress', 'Next Steps'],
        rows: [
          ['Constrain Supply (Niche down)', 'Single category, single city', '', ''],
          ['Constrain Demand (Invite-only)', 'Waitlist, exclusivity', '', ''],
          ['Fake It (Concierge)', 'Manual matching behind the scenes', '', ''],
          ['Subsidize One Side', 'Pay suppliers or buyers initially', '', ''],
          ['Create Single-Player Mode', 'Value without the other side', '', ''],
          ['Seed Supply Yourself', 'Create listings/content yourself', '', '']
        ]
      },
      helpText: 'Start small. Dominate a micro-market before expanding.'
    },
    {
      id: 'marketplace-trust-safety',
      title: '4.4 Marketplace Trust & Safety',
      description: 'Build trust between strangers',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Mechanism', 'Implementation', 'Status'],
        rows: [
          ['Identity Verification', 'Phone, Email, ID, Social', ''],
          ['Reviews & Ratings', 'Two-way, post-transaction', ''],
          ['Insurance/Guarantee', 'Transaction protection', ''],
          ['Dispute Resolution', 'Mediation process', ''],
          ['Fraud Detection', 'Automated + manual review', ''],
          ['Background Checks', 'For high-risk categories', ''],
          ['Secure Payments', 'Escrow, held payments', '']
        ]
      },
      helpText: 'One bad experience can kill your marketplace. Invest early.'
    },
    {
      id: 'fintech-fundamentals',
      title: '5.1 Fintech Fundamentals',
      description: 'Understand financial services dynamics',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Aspect', 'Your Application'],
        rows: [
          ['Regulatory Category', 'Payments / Lending / Investing / Crypto / Insurance'],
          ['License Required', ''],
          ['Regulatory Body', 'SEC / FINRA / OCC / CFPB / State'],
          ['Compliance Requirements', ''],
          ['Banking Partner(s)', ''],
          ['Risk Model', ''],
          ['Fraud Approach', ''],
          ['Capital Requirements', '']
        ]
      },
      helpText: 'Fintech = Finance + Tech. Finance comes first.'
    },
    {
      id: 'fintech-metrics',
      title: '5.2 Fintech Metrics Mastery',
      description: 'Track financial health',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Metric', 'Formula', 'Your Value', 'Target', 'Regulatory Limit'],
        rows: [
          ['Default Rate', 'Defaults / Total Loans', '', '', '<5% typical'],
          ['Loss Rate', 'Net losses / Total volume', '', '', ''],
          ['Chargeback Rate', 'Chargebacks / Transactions', '', '', '<1%'],
          ['Fraud Rate', 'Fraudulent transactions / Total', '', '', '<0.1%'],
          ['Cost of Risk', 'Provisions / Total loans', '', '', ''],
          ['Net Interest Margin', '(Interest Income - Interest Expense) / Assets', '', '', ''],
          ['Efficiency Ratio', 'Non-interest Expense / Revenue', '', '', '<60%'],
          ['Capital Adequacy', 'Tier 1 Capital / Risk-weighted assets', '', '', '6%+']
        ]
      },
      helpText: 'Risk management is your product. Don\'t optimize growth over safety.'
    },
    {
      id: 'fintech-risk',
      title: '5.3 Fintech Risk Management',
      description: 'Identify and mitigate risks',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Risk Type', 'Likelihood', 'Impact', 'Mitigation Strategy', 'Owner'],
        rows: [
          ['Credit Risk', 'Low / Medium / High', 'Low / Medium / High', '', ''],
          ['Fraud Risk', '', '', '', ''],
          ['Compliance Risk', '', '', '', ''],
          ['Operational Risk', '', '', '', ''],
          ['Technology Risk', '', '', '', ''],
          ['Reputation Risk', '', '', '', ''],
          ['Liquidity Risk', '', '', '', ''],
          ['Market Risk', '', '', '', '']
        ]
      },
      helpText: 'Document every risk. Assign owners. Review monthly.'
    },
    {
      id: 'fintech-compliance',
      title: '5.4 Fintech Compliance Checklist',
      description: 'Regulatory requirements',
      fieldType: 'checkbox' as const,
      required: true,
      options: [
        { value: 'kyc', label: 'KYC (Know Your Customer)' },
        { value: 'aml', label: 'AML (Anti-Money Laundering)' },
        { value: 'bsa', label: 'BSA (Bank Secrecy Act)' },
        { value: 'ofac', label: 'OFAC Sanctions Screening' },
        { value: 'gdpr', label: 'GDPR / Data Privacy' },
        { value: 'ccpa', label: 'CCPA / CPRA' },
        { value: 'pci-dss', label: 'PCI DSS (Payment Card Industry)' },
        { value: 'sox', label: 'SOX (if public)' },
        { value: 'udap', label: 'UDAP (Unfair/Deceptive Practices)' },
        { value: 'fair-lending', label: 'Fair Lending (ECOA, FHA)' },
        { value: 'td', label: 'Truth in Disclosures (TILA, etc.)' },
        { value: 'state-licenses', label: 'State Money Transmitter Licenses' }
      ],
      helpText: 'Compliance is not optional. Budget for it from day one.'
    },
    {
      id: 'ai-fundamentals',
      title: '6.1 AI/ML Product Fundamentals',
      description: 'Understand AI-specific dynamics',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Aspect', 'Your Application'],
        rows: [
          ['AI Use Case', 'Prediction / Generation / Classification / Recommendation'],
          ['Model Type', 'Supervised / Unsupervised / Reinforcement / LLM'],
          ['Data Source', ''],
          ['Training Data Size', ''],
          ['Inference Latency Requirement', ''],
          ['Accuracy Requirement', ''],
          ['Human-in-the-Loop?', 'Yes / No'],
          ['Explainability Required?', 'Yes / No'],
          ['Model Update Frequency', '']
        ]
      },
      helpText: 'AI is a means, not an end. Start with the user problem.'
    },
    {
      id: 'ai-metrics',
      title: '6.2 AI/ML Metrics Mastery',
      description: 'Track model and product performance',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Metric Type', 'Metric', 'Your Value', 'Target'],
        rows: [
          ['Model Accuracy', 'Precision', '', ''],
          ['Model Accuracy', 'Recall', '', ''],
          ['Model Accuracy', 'F1 Score', '', ''],
          ['Model Accuracy', 'AUC-ROC', '', ''],
          ['Model Accuracy', 'MAE/RMSE (Regression)', '', ''],
          ['Latency', 'P50 Inference Time', '', ''],
          ['Latency', 'P99 Inference Time', '', ''],
          ['Business', 'Adoption Rate', '', ''],
          ['Business', 'User Satisfaction', '', ''],
          ['Business', 'Impact on Core Metric', '', ''],
          ['Operational', 'Model Drift', '', ''],
          ['Operational', 'Data Quality Score', '', '']
        ]
      },
      helpText: 'Model metrics ≠ Business metrics. Track both.'
    },
    {
      id: 'ai-data-strategy',
      title: '6.3 AI Data Strategy',
      description: 'Plan your data flywheel',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Question', 'Answer'],
        rows: [
          ['What data do you need to train?', ''],
          ['Do you have it? Where?', ''],
          ['What\'s the data quality?', ''],
          ['How will you label/annotate?', ''],
          ['How much labeled data is needed?', ''],
          ['How will you collect more over time?', ''],
          ['What\'s your data moat?', ''],
          ['How do you handle edge cases?', ''],
          ['What\'s your feedback loop?', '']
        ]
      },
      helpText: 'Data is your defensible moat. Build it intentionally.'
    },
    {
      id: 'ai-ethics',
      title: '6.4 AI Ethics & Safety',
      description: 'Responsible AI development',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Risk', 'Assessment', 'Mitigation'],
        rows: [
          ['Bias/Fairness', '', ''],
          ['Privacy', '', ''],
          ['Transparency', '', ''],
          ['Accountability', '', ''],
          ['Security', '', ''],
          ['Misuse Potential', '', ''],
          ['Job Displacement', '', ''],
          ['Hallucination Risk', '', '']
        ]
      },
      helpText: 'Ship responsibly. AI mistakes are hard to undo.'
    },
    {
      id: 'healthcare-fundamentals',
      title: '7.1 Healthcare Fundamentals',
      description: 'Understand healthcare ecosystem',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Stakeholder', 'Their Incentive', 'Their Pain Point', 'Your Value Prop'],
        rows: [
          ['Patients', '', '', ''],
          ['Providers (Physicians)', '', '', ''],
          ['Providers (Nurses/Staff)', '', '', ''],
          ['Hospitals/Health Systems', '', '', ''],
          ['Payers (Insurance)', '', '', ''],
          ['Pharma/Medical Devices', '', '', ''],
          ['Employers', '', '', '']
        ]
      },
      helpText: 'Healthcare has complex incentives. Map everyone.'
    },
    {
      id: 'healthcare-metrics',
      title: '7.2 Healthcare Metrics',
      description: 'Track outcomes that matter',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Metric Category', 'Metric', 'Your Value', 'Target'],
        rows: [
          ['Clinical Outcomes', 'Readmission Rate', '', ''],
          ['Clinical Outcomes', 'Complication Rate', '', ''],
          ['Clinical Outcomes', 'Mortality Rate', '', ''],
          ['Patient Experience', 'NPS', '', ''],
          ['Patient Experience', 'Satisfaction Score', '', ''],
          ['Operational', 'Wait Time', '', ''],
          ['Operational', 'Length of Stay', '', ''],
          ['Financial', 'Cost per Episode', '', ''],
          ['Financial', 'Denial Rate', '', ''],
          ['Utilization', 'Adherence Rate', '', '']
        ]
      },
      helpText: 'Outcomes > Activity. Prove you improve care.'
    },
    {
      id: 'healthcare-compliance',
      title: '7.3 Healthcare Compliance',
      description: 'Regulatory requirements',
      fieldType: 'checkbox' as const,
      required: true,
      options: [
        { value: 'hipaa', label: 'HIPAA (Privacy, Security, Breach Notification)' },
        { value: 'hitrust', label: 'HITRUST Certification' },
        { value: 'soc2', label: 'SOC 2 Type II' },
        { value: 'fda', label: 'FDA (if medical device/SaMD)' },
        { value: 'clc', label: 'CLIA (if lab testing)' },
        { value: 'dea', label: 'DEA (if controlled substances)' },
        { value: 'state-licenses', label: 'State Medical Licenses' },
        { value: 'ncqa', label: 'NCQA (if health plan)' },
        { value: 'hl7', label: 'HL7/FHIR Interoperability' },
        { value: '21st-century', label: '21st Century Cures Act' }
      ],
      helpText: 'Healthcare compliance is table stakes. Budget accordingly.'
    },
    {
      id: 'healthcare-interoperability',
      title: '7.4 Healthcare Interoperability',
      description: 'EHR integration planning',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['EHR System', 'Integration Method', 'Status', 'Timeline'],
        rows: [
          ['Epic', 'FHIR API / Care Everywhere', '', ''],
          ['Cerner', 'FHIR API / Carequality', '', ''],
          ['Meditech', '', '', ''],
          ['Athenahealth', '', '', ''],
          ['eClinicalWorks', '', '', ''],
          ['NextGen', '', '', ''],
          ['Other', '', '', '']
        ]
      },
      helpText: 'EHR integration is hard but necessary. Start early.'
    },
    {
      id: 'domain-scorecard',
      title: '8. Domain Expertise Scorecard',
      description: 'Rate your domain knowledge',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Dimension', 'Score (1-5)', 'Evidence', 'Improvement Plan'],
        rows: [
          ['Market Dynamics', '', '', ''],
          ['Customer Understanding', '', '', ''],
          ['Metrics Mastery', '', '', ''],
          ['Regulatory Knowledge', '', '', ''],
          ['Competitive Landscape', '', '', ''],
          ['Technical Depth', '', '', ''],
          ['Business Model', '', '', ''],
          ['Network Effects', '', '', '']
        ]
      },
      helpText: 'Target: 30+ out of 40 for domain expertise.'
    },
    {
      id: 'domain-learning-plan',
      title: '9. Domain Learning Plan',
      description: 'Build your expertise',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Area to Improve', 'Learning Activity', 'Resources', 'Timeline', 'Success Metric'],
        rows: [
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ]
      },
      helpText: 'Domain expertise is earned over years. Start now.'
    },
    {
      id: 'domain-network',
      title: '10. Domain Network Building',
      description: 'Who do you need to know?',
      fieldType: 'table' as const,
      required: true,
      tableSchema: {
        columns: ['Stakeholder Type', 'Names', 'How to Connect', 'Goal'],
        rows: [
          ['Industry Experts', '', '', ''],
          ['Customers', '', '', ''],
          ['Partners', '', '', ''],
          ['Competitors (for benchmarking)', '', '', ''],
          ['Regulators', '', '', ''],
          ['Investors', '', '', ''],
          ['Media/Analysts', '', '', '']
        ]
      },
      helpText: 'Your network is your net worth in any domain.'
    }
  ],
  outputFormat: 'markdown' as const,
  version: '1.0'
};
