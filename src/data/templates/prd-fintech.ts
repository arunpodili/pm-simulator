import { Template } from '@/types';

export const prdFinTechTemplate: Template = {
  id: 'prd-fintech-feature-launch',
  name: 'FinTech Feature Launch PRD (Comprehensive)',
  description: 'Complete product requirements document for FinTech features with compliance, security, and regulatory requirements',
  industryId: 'fintech',
  scenarioId: 'feature-launch',
  frameworkIds: ['rice', 'jtbd', 'okrs'],
  outputFormat: 'markdown',
  estimatedCompletionTime: '4-5 hours',
  version: '1.0.0',
  sections: [
    {
      id: 'document-meta',
      title: 'Document Metadata',
      description: 'Track document ownership, version control, and regulatory approvals',
      fieldType: 'table',
      required: true,
      helpText: 'Include all compliance and security stakeholders for audit trail',
      learnContentId: 'doc-versioning',
      tableSchema: {
        columns: ['Field', 'Value'],
        rows: [
          ['Document Owner', ''],
          ['Product Lead', ''],
          ['Engineering Lead', ''],
          ['Compliance Officer', ''],
          ['Security Lead', ''],
          ['Legal Counsel', ''],
          ['Status', 'Draft / In Review / Compliance Review / Approved / Launched'],
          ['Last Updated', ''],
          ['Version', '1.0'],
          ['Target Launch Date', ''],
          ['Regulatory Filing Required', 'Yes/No - Specify which'],
        ]
      }
    },
    {
      id: 'change-log',
      title: 'Change Log',
      description: 'Track all significant changes to this document for audit purposes',
      fieldType: 'table',
      required: true,
      helpText: 'Critical for regulatory audits and compliance traceability',
      learnContentId: 'change-management',
      tableSchema: {
        columns: ['Version', 'Date', 'Author', 'Changes Made', 'Reviewers', 'Approval Status'],
        rows: [
          ['1.0', '', '', 'Initial draft', '', 'Pending'],
          ['1.1', '', '', '', '', 'Pending'],
        ]
      }
    },
    {
      id: 'approvers',
      title: 'Required Approvals',
      description: 'All stakeholders who must approve before launch (including regulatory)',
      fieldType: 'table',
      required: true,
      helpText: 'Compliance and legal approval is mandatory for FinTech products',
      learnContentId: 'stakeholder-management',
      tableSchema: {
        columns: ['Role', 'Name', 'Department', 'Status', 'Date Approved', 'Comments'],
        rows: [
          ['Product', '', '', 'Pending', '', ''],
          ['Engineering', '', '', 'Pending', '', ''],
          ['Compliance', '', '', 'Pending', '', ''],
          ['Security', '', '', 'Pending', '', ''],
          ['Legal', '', '', 'Pending', '', ''],
          ['Risk Management', '', '', 'Pending', '', ''],
          ['Executive Sponsor', '', '', 'Pending', '', ''],
        ]
      }
    },
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      description: 'BLUF (Bottom Line Up Front) - One-paragraph overview with regulatory context',
      fieldType: 'markdown',
      required: true,
      helpText: `**Include:**
- What we're building and why (with regulatory context if applicable)
- Target market size and opportunity
- Key compliance requirements
- Expected financial impact (revenue, cost savings, risk reduction)
- Critical success metrics
- Major risks and mitigations

**TL;DR:** [1-2 sentence summary]

**30-Second Read:**
- Problem: [What financial pain point]
- Solution: [What we're building]
- Market: [TAM/SAM/SOM if known]
- Ask: [What approval/resources needed]`,
      learnContentId: 'executive-communication',
    },
    {
      id: 'problem-statement',
      title: 'Problem Statement',
      description: 'What financial pain point are we solving? Include regulatory and compliance context.',
      fieldType: 'markdown',
      required: true,
      helpText: `**Problem Definition:**
Describe the specific financial problem users face. Include:
- Current user behavior and workarounds
- Financial impact on users (cost, time, risk)
- Regulatory drivers (if applicable - e.g., new compliance requirements)
- Market trends supporting this opportunity

**Evidence:**
| Evidence Type | Source | Finding | Confidence Level |
|--------------|--------|---------|-----------------|
| User Interview | [X customers] | [Key insight] | High/Med/Low |
| Support Tickets | [Ticket volume] | [Common issue] | High |
| Market Research | [Report name] | [Market size/trend] | Medium |
| Regulatory | [Regulation name] | [Requirement/change] | High |

**Cost of Inaction:**
- Monthly revenue loss: $[X]
- Users at risk of churn: [X]%
- Regulatory penalty risk: [Description]
- Competitive disadvantage: [Description]`,
      learnContentId: 'problem-definition',
    },
    {
      id: 'opportunity-assessment',
      title: 'Opportunity Assessment',
      description: 'Market size, competitive landscape, and strategic fit',
      fieldType: 'table',
      required: true,
      helpText: 'Quantify the opportunity and competitive positioning',
      learnContentId: 'market-analysis',
      tableSchema: {
        columns: ['Metric', 'Value', 'Source', 'Notes'],
        rows: [
          ['TAM (Total Addressable Market)', '$', '', ''],
          ['SAM (Serviceable Addressable Market)', '$', '', ''],
          ['SOM (Serviceable Obtainable Market)', '$', '', ''],
          ['Target Customer Segment', '', '', ''],
          ['Competitive Advantage', '', '', ''],
          ['Strategic Priority', 'P0/P1/P2', '', ''],
        ]
      }
    },
    {
      id: 'user-personas',
      title: 'Target User Personas',
      description: 'User segments with KYC/AML verification levels and transaction behaviors',
      fieldType: 'table',
      required: true,
      helpText: 'Consider verification levels, transaction volumes, and risk profiles',
      learnContentId: 'persona-definition',
      tableSchema: {
        columns: ['Persona Name', 'Role', 'Customer Segment', 'KYC Level', 'Avg Transaction Volume', 'Monthly Frequency', 'Primary Goals', 'Pain Points'],
        rows: [
          ['Retail User', 'Individual', 'Mass Market', 'Basic', '<$5K', '5-10', '', ''],
          ['Premium User', 'Individual', 'HNW', 'Enhanced', '$5K-$50K', '10-25', '', ''],
          ['Business User', 'SMB Owner', 'Commercial', 'Business Verified', '$10K-$100K', '20-50', '', ''],
          ['Enterprise', 'CFO/Treasurer', 'Enterprise', 'Enhanced Due Diligence', '$100K+', '50+', '', ''],
        ]
      }
    },
    {
      id: 'persona-deep-dive',
      title: 'Persona Deep Dive',
      description: 'Detailed persona profiles with financial context',
      fieldType: 'markdown',
      required: true,
      helpText: `**Primary Persona: [Name]**

**Demographics:**
- Age: [Range]
- Income: [Range]
- Location: [Geography]
- Occupation: [Role]
- Financial Sophistication: [Low/Medium/High]

**Day in the Life:**
| Time | Activity | Financial Touchpoint | Pain Point |
|------|----------|---------------------|------------|
| Morning | [Activity] | [Payment/Transfer/etc] | [Frustration] |
| Afternoon | [Activity] | [Payment/Transfer/etc] | [Frustration] |
| Evening | [Activity] | [Payment/Transfer/etc] | [Frustration] |

**Financial Context:**
- Current banking relationships: [Number and types]
- Payment methods used: [Cards, ACH, Wire, etc.]
- Financial goals: [Saving, investing, debt payoff]
- Risk tolerance: [Conservative/Moderate/Aggressive]
- Technology comfort: [Low/Medium/High]

**Validation Checklist:**
- [ ] Interviewed 5+ users matching this persona
- [ ] Reviewed support tickets from this segment
- [ ] Validated transaction volume assumptions
- [ ] Confirmed KYC/AML requirements for segment`,
      learnContentId: 'persona-definition',
    },
    {
      id: 'jtbd',
      title: 'Jobs To Be Done',
      description: 'Frame the user need in financial and emotional context',
      fieldType: 'markdown',
      required: true,
      helpText: `**Primary Job Story:**
"When [situation/trigger], I want to [motivation/desire], so I can [expected outcome/benefit]."

**Example:** "When I need to pay my freelancer internationally, I want to know the exact fee and delivery time upfront, so I can budget accurately and maintain trust."

**Related Jobs:**
| Job Type | Job Statement | Importance (1-10) | Satisfaction (1-10) | Opportunity |
|----------|---------------|-------------------|--------------------|-------------|
| Functional | [What they're trying to accomplish] | | | |
| Emotional | [How they want to feel] | | | |
| Social | [How they want to be perceived] | | | |

**Alternatives Analysis:**
| Current Alternative | Why It Falls Short | Our Advantage |
|---------------------|--------------------|---------------|
| [Competitor product] | [Gap] | [Differentiation] |
| [Manual process] | [Time/error prone] | [Automation] |
| [Do nothing] | [Status quo bias] | [Urgency creator] |

**Validation Checklist:**
- [ ] Job statement is outcome-focused (not solution-focused)
- [ ] Importance score > 7 from user research
- [ ] Current satisfaction < 7 (indicates opportunity)
- [ ] Clear emotional and social jobs identified`,
      learnContentId: 'jtbd-framework',
    },
    {
      id: 'compliance-requirements',
      title: 'Compliance & Regulatory Requirements',
      description: 'All regulatory and compliance requirements that must be met',
      fieldType: 'table',
      required: true,
      helpText: 'Non-negotiable for FinTech - consult legal/compliance early',
      learnContentId: 'non-functional-requirements',
      tableSchema: {
        columns: ['Requirement ID', 'Regulation/Standard', 'Requirement Description', 'Evidence Required', 'Testing Method', 'Owner', 'Status'],
        rows: [
          ['COMP-001', 'BSA/USA PATRIOT Act', 'KYC/AML customer identification', 'Customer verification records', 'Audit review', '', ''],
          ['COMP-002', 'FinCEN', 'Suspicious Activity Reporting (SAR)', 'SAR filing capability', 'Test filing', '', ''],
          ['COMP-003', 'OFAC', 'Sanctions list screening', 'Screening logs', 'Penetration test', '', ''],
          ['COMP-004', 'PCI-DSS 4.0', 'Card data encryption and handling', 'ROC/AOC certification', 'QSA audit', '', ''],
          ['COMP-005', 'SOC 2 Type II', 'Security controls and audit logging', 'Audit trail logs', 'Annual audit', '', ''],
          ['COMP-006', 'Reg E (EFTA)', 'Consumer error resolution', 'Dispute workflow', 'Compliance test', '', ''],
          ['COMP-007', 'GDPR/CCPA', 'Data privacy and deletion rights', 'Data deletion logs', 'Privacy audit', '', ''],
          ['COMP-008', 'State Money Transmitter', 'State licensing requirements', 'Compliance attestation', 'Legal review', '', ''],
        ]
      }
    },
    {
      id: 'compliance-checklist',
      title: 'Compliance Checklist',
      description: 'Detailed compliance requirements and status tracking',
      fieldType: 'markdown',
      required: true,
      helpText: `**KYC/AML Requirements:**
- [ ] Customer Identification Program (CIP) implemented
- [ ] Customer Due Diligence (CDD) rules followed
- [ ] Beneficial Ownership identification (for business customers)
- [ ] Ongoing monitoring for suspicious activity
- [ ] SAR filing process defined
- [ ] OFAC sanctions screening integrated
- [ ] PEP (Politically Exposed Persons) screening

**Transaction Monitoring:**
- [ ] Real-time fraud detection rules configured
- [ ] Velocity limits set per customer segment
- [ ] Unusual pattern detection enabled
- [ ] Manual review queue established
- [ ] Escalation procedures documented

**Consumer Protections:**
- [ ] Clear fee disclosures provided
- [ ] Error resolution process (Reg E) documented
- [ ] Privacy notices provided
- [ ] Opt-out mechanisms available
- [ ] Accessibility compliance (WCAG 2.1 AA)

**Record Keeping:**
- [ ] Transaction records retained 5 years minimum
- [ ] Customer identification records retained 5 years after account closure
- [ ] SAR records retained 5 years from filing date
- [ ] Audit logs immutable and tamper-evident`,
      learnContentId: 'non-functional-requirements',
    },
    {
      id: 'security-requirements',
      title: 'Security Requirements',
      description: 'Security controls, encryption standards, and access management',
      fieldType: 'table',
      required: true,
      helpText: 'Financial data requires highest security standards - zero tolerance for breaches',
      learnContentId: 'non-functional-requirements',
      tableSchema: {
        columns: ['Control ID', 'Security Domain', 'Control Description', 'Standard/Requirement', 'Implementation Details', 'Verification Method', 'Owner'],
        rows: [
          ['SEC-001', 'Authentication', 'Multi-factor authentication required', 'NIST 800-63B', '', 'Penetration test', ''],
          ['SEC-002', 'Authentication', 'Session timeout after 15 minutes', 'PCI-DSS', '', 'Security test', ''],
          ['SEC-003', 'Authorization', 'Role-based access control (RBAC)', 'SOC 2', '', 'Code review', ''],
          ['SEC-004', 'Encryption', 'AES-256 encryption at rest', 'FIPS 140-2', '', 'Security audit', ''],
          ['SEC-005', 'Encryption', 'TLS 1.3+ for all data in transit', 'PCI-DSS', '', 'SSL Labs test', ''],
          ['SEC-006', 'Key Management', 'HSM for key storage', 'PCI-DSS', '', 'QSA audit', ''],
          ['SEC-007', 'Audit Logging', 'All transactions and access logged', 'SOC 2', '', 'Log review', ''],
          ['SEC-008', 'Data Protection', 'Tokenization of sensitive data', 'PCI-DSS', '', 'Security review', ''],
          ['SEC-009', 'Network Security', 'WAF and DDoS protection', 'Best Practice', '', 'Penetration test', ''],
          ['SEC-010', 'Incident Response', '24-hour breach notification capability', 'GDPR/State Laws', '', 'Tabletop exercise', ''],
        ]
      }
    },
    {
      id: 'security-controls-detail',
      title: 'Security Controls Detail',
      description: 'Detailed security implementation requirements',
      fieldType: 'markdown',
      required: true,
      helpText: `**Authentication & Access Control:**
| Control | Implementation | Verification |
|---------|---------------|--------------|
| MFA Enforcement | TOTP/SMS/Push options, backup codes | Test all flows |
| Password Policy | Min 12 chars, complexity, breach detection | OWASP ZAP scan |
| Session Management | 15-min timeout, secure cookies, CSRF tokens | Security test |
| Account Lockout | 5 failed attempts, progressive delays | Penetration test |
| Privileged Access | Separate admin portal, hardware tokens | Access review |

**Data Protection:**
| Data Type | Encryption | Tokenization | Masking | Retention |
|-----------|------------|--------------|---------|-----------|
| PII | AES-256 | Yes (SSN) | Yes (UI) | 7 years |
| Account Numbers | AES-256 | Yes | Yes | 7 years |
| Transaction Data | AES-256 | No | Partial | 7 years |
| Authentication Logs | AES-256 | No | No | 3 years |

**Security Monitoring:**
- [ ] SIEM integration for real-time alerting
- [ ] Failed login monitoring (>5 attempts = alert)
- [ ] Unusual transaction pattern detection
- [ ] Privileged access monitoring
- [ ] Data exfiltration detection
- [ ] File integrity monitoring
- [ ] Vulnerability scanning (weekly)
- [ ] Penetration testing (annual + pre-launch)`,
      learnContentId: 'non-functional-requirements',
    },
    {
      id: 'fraud-risk-assessment',
      title: 'Fraud Risk Assessment',
      description: 'Identify and mitigate fraud risks specific to this feature',
      fieldType: 'table',
      required: true,
      helpText: 'Consider all fraud vectors and define detection/prevention controls',
      learnContentId: 'risk-management',
      tableSchema: {
        columns: ['Fraud Type', 'Risk Scenario', 'Likelihood (1-5)', 'Impact (1-5)', 'Detection Control', 'Prevention Control', 'Residual Risk'],
        rows: [
          ['Account Takeover', 'Credential stuffing attack', '', '', 'Login anomaly detection', 'MFA, device fingerprinting', ''],
          ['Identity Fraud', 'Synthetic identity application', '', '', 'Document verification', 'Third-party IDV service', ''],
          ['Transaction Fraud', 'Unauthorized transfer', '', '', 'Velocity monitoring', 'Transaction limits, 2FA', ''],
          ['Money Laundering', 'Structuring/smurfing', '', '', 'Pattern detection', 'KYC, transaction monitoring', ''],
          ['Friendly Fraud', 'False dispute claim', '', '', 'Transaction evidence', 'Clear descriptors, confirmations', ''],
          ['Internal Fraud', 'Employee misuse', '', '', 'Access logging', 'Separation of duties', ''],
        ]
      }
    },
    {
      id: 'success-metrics',
      title: 'Success Metrics',
      description: 'FinTech-specific metrics balancing growth, risk, and compliance',
      fieldType: 'table',
      required: true,
      helpText: 'Balance growth metrics with risk management - fraud rate is critical',
      learnContentId: 'success-metrics',
      tableSchema: {
        columns: ['Metric Category', 'Metric Name', 'Definition', 'Baseline', 'Target', 'Timeline', 'Owner', 'Current'],
        rows: [
          ['Growth', 'Activation Rate', '% completing first transaction', '', '60%', '3 months', '', ''],
          ['Growth', 'Weekly Active Transactors', 'Users making transaction/week', '', '+20%', '3 months', '', ''],
          ['Growth', 'Conversion Rate', 'Funnel completion %', '', '', '3 months', '', ''],
          ['Revenue', 'Average Transaction Value', 'Mean transaction $', '', '', '3 months', '', ''],
          ['Revenue', 'Take Rate', 'Fee as % of transaction', '', '', '3 months', '', ''],
          ['Risk', 'Fraud Rate', 'Fraudulent transactions %', '', '<0.1%', 'Ongoing', '', ''],
          ['Risk', 'False Positive Rate', 'Legit transactions flagged %', '', '<2%', 'Ongoing', '', ''],
          ['Risk', 'Chargeback Rate', 'Disputes as % of transactions', '', '<0.5%', 'Ongoing', '', ''],
          ['Experience', 'Time to First Transaction', 'Signup to first use (minutes)', '', '<10 min', '3 months', '', ''],
          ['Experience', 'Transaction Success Rate', 'Successful completion %', '', '>99.5%', 'Ongoing', '', ''],
          ['Experience', 'NPS', 'Net Promoter Score', '', '>50', '6 months', '', ''],
        ]
      }
    },
    {
      id: 'okrs',
      title: 'OKRs (Objectives & Key Results)',
      description: 'Quarterly objectives with measurable key results',
      fieldType: 'table',
      required: true,
      helpText: 'Align team on outcomes, not outputs',
      learnContentId: 'okrs',
      tableSchema: {
        columns: ['Objective', 'Key Result', 'Baseline', 'Target', 'Progress', 'Owner'],
        rows: [
          ['Launch [Feature] successfully', 'Complete phased rollout to 100% of eligible users', '0%', '100%', '', ''],
          ['Drive adoption', 'Achieve 60% activation rate within 30 days', '0%', '60%', '', ''],
          ['Maintain security', 'Keep fraud rate below 0.1% throughout launch', 'N/A', '<0.1%', '', ''],
          ['Delight users', 'Achieve NPS of 50+ among beta users', 'N/A', '50+', '', ''],
        ]
      }
    },
    {
      id: 'solution-overview',
      title: 'Solution Overview',
      description: 'High-level solution architecture with money flow and integrations',
      fieldType: 'markdown',
      required: true,
      helpText: `**Solution Summary:**
[2-3 paragraph description of what we're building and how it works]

**Money Flow Diagram:**
\`\`\`
[User] → [Payment Method] → [Processor] → [Clearing Network] → [Receiving Bank] → [Destination]
                ↓                    ↓              ↓                    ↓
            [Auth/Fraud]      [Settlement]    [FX Conversion]    [Compliance Check]
\`\`\`

**System Components:**
| Component | Purpose | Owner | SLA |
|-----------|---------|-------|-----|
| [Service A] | [What it does] | [Team] | 99.9% |
| [Service B] | [What it does] | [Team] | 99.9% |
| [External Partner] | [What they provide] | [Vendor] | Per contract |

**Key Technical Decisions:**
| Decision | Option A | Option B | Chosen | Rationale |
|----------|----------|----------|--------|-----------|
| [Architecture choice] | [Pros/Cons] | [Pros/Cons] | [A/B] | [Why] |
| [Vendor selection] | [Pros/Cons] | [Pros/Cons] | [A/B] | [Why] |

**Dependencies:**
- [ ] [Team/Service] - [What they need to deliver] - Due: [Date]
- [ ] [Team/Service] - [What they need to deliver] - Due: [Date]`,
      learnContentId: 'solution-design',
    },
    {
      id: 'user-stories',
      title: 'User Stories',
      description: 'Detailed user stories with acceptance criteria and compliance considerations',
      fieldType: 'table',
      required: true,
      helpText: 'Include fraud scenarios, edge cases, and compliance requirements',
      learnContentId: 'user-stories',
      tableSchema: {
        columns: ['Story ID', 'User Story', 'Acceptance Criteria', 'Compliance Notes', 'Priority', 'Estimate'],
        rows: [
          ['US-001', 'As a [persona], I want to [action], so I can [outcome]', 'Given/When/Then format', '[KYC/AML/PCI notes]', 'P0', ''],
          ['US-002', 'As a user, I want to see transaction confirmation', '1. Confirmation screen shows amount, fee, delivery time 2. Email receipt sent 3. Transaction appears in history', 'Reg E disclosure required', 'P0', ''],
          ['US-003', 'As a user, I want to cancel a pending transaction', '1. Cancel button visible for pending only 2. Confirmation of cancellation 3. Refund processed if applicable', 'Cancellation policy disclosure', 'P1', ''],
        ]
      }
    },
    {
      id: 'functional-requirements',
      title: 'Functional Requirements',
      description: 'Detailed functional requirements with transaction limits and validations',
      fieldType: 'table',
      required: true,
      helpText: 'Include all transaction limits, validations, and error handling',
      learnContentId: 'requirements-writing',
      tableSchema: {
        columns: ['Req ID', 'Requirement Description', 'Priority', 'Risk Level', 'User Story Ref', 'Acceptance Criteria', 'Notes'],
        rows: [
          ['FR-001', 'System shall validate user KYC level before allowing transaction', 'P0', 'High', 'US-001', 'Blocks transaction if KYC incomplete', 'Regulatory requirement'],
          ['FR-002', 'System shall enforce transaction limits based on verification level', 'P0', 'High', 'US-001', 'Basic: $1K/day, Enhanced: $10K/day', 'AML requirement'],
          ['FR-003', 'System shall display all fees before transaction confirmation', 'P0', 'High', 'US-002', 'Fee breakdown: exchange rate, service fee, total', 'Consumer protection'],
          ['FR-004', 'System shall provide transaction confirmation with unique ID', 'P0', 'Medium', 'US-002', 'Confirmation screen + email + SMS option', 'Dispute resolution'],
          ['FR-005', 'System shall allow cancellation of pending transactions', 'P1', 'Medium', 'US-003', 'Cancel button disabled after processing', 'User experience'],
        ]
      }
    },
    {
      id: 'non-functional-requirements',
      title: 'Non-Functional Requirements',
      description: 'Performance, reliability, security, and compliance standards',
      fieldType: 'table',
      required: true,
      helpText: 'Define measurable standards for system quality attributes',
      learnContentId: 'non-functional-requirements',
      tableSchema: {
        columns: ['Category', 'Requirement', 'Metric', 'Target', 'Measurement Method'],
        rows: [
          ['Performance', 'Transaction processing time', 'p50 latency', '<2 seconds', 'APM monitoring'],
          ['Performance', 'Transaction processing time', 'p99 latency', '<5 seconds', 'APM monitoring'],
          ['Reliability', 'System uptime', 'Availability', '99.9%', 'Uptime monitoring'],
          ['Reliability', 'Transaction success rate', 'Success %', '>99.5%', 'Transaction logs'],
          ['Scalability', 'Peak transaction capacity', 'TPS', '1000 TPS', 'Load testing'],
          ['Security', 'Vulnerability SLA', 'Critical fix time', '<24 hours', 'Security scans'],
          ['Compliance', 'Audit log retention', 'Retention period', '7 years', 'Compliance audit'],
        ]
      }
    },
    {
      id: 'integrations',
      title: 'Third-Party Integrations',
      description: 'All external systems, APIs, and vendor dependencies',
      fieldType: 'table',
      required: true,
      helpText: 'Map all touchpoints including fallback options',
      learnContentId: 'dependency-management',
      tableSchema: {
        columns: ['Integration', 'Provider', 'Purpose', 'API Type', 'SLA', 'Fallback', 'Owner', 'Status'],
        rows: [
          ['Identity Verification', 'Jumio/Onfido', 'KYC verification', 'REST API', '99.9%', 'Manual review', '', ''],
          ['Payment Processing', 'Stripe/Adyen', 'Card processing', 'REST API', '99.99%', 'Secondary processor', '', ''],
          ['Banking Network', 'Plaid/Yodlee', 'Account verification', 'REST API', '99.9%', 'Micro-deposits', '', ''],
          ['Fraud Detection', 'Sift/Forter', 'Fraud scoring', 'REST API', '99.9%', 'Rules engine', '', ''],
          ['Sanctions Screening', 'ComplyAdvantage', 'OFAC/PEP screening', 'REST API', '99.9%', 'Manual review', '', ''],
          ['Email Service', 'SendGrid', 'Transaction receipts', 'REST API', '99.9%', 'Queue for retry', '', ''],
          ['SMS Service', 'Twilio', '2FA, notifications', 'REST API', '99.9%', 'Email fallback', '', ''],
        ]
      }
    },
    {
      id: 'api-specifications',
      title: 'API Specifications',
      description: 'Internal and external API endpoints and contracts',
      fieldType: 'markdown',
      required: false,
      helpText: `**Key Endpoints:**

**POST /api/v1/transactions**
\`\`\`json
Request:
{
  "amount": 100.00,
  "currency": "USD",
  "destination": "account_id",
  "idempotency_key": "uuid"
}

Response:
{
  "transaction_id": "txn_xxx",
  "status": "pending|completed|failed",
  "fee": 2.50,
  "estimated_delivery": "2024-01-01T12:00:00Z"
}
\`\`\`

**Error Codes:**
| Code | Meaning | User Message |
|------|---------|--------------|
| INSUFFICIENT_FUNDS | Account balance too low | "Insufficient funds for this transaction" |
| KYC_REQUIRED | Verification needed | "Please complete identity verification" |
| LIMIT_EXCEEDED | Transaction limit reached | "Transaction exceeds your daily limit" |
| FRAUD_SUSPECTED | Fraud detection triggered | "Transaction under review" |`,
      learnContentId: 'api-design',
    },
    {
      id: 'ux-requirements',
      title: 'UX/UI Requirements',
      description: 'Design specifications, states, and accessibility requirements',
      fieldType: 'table',
      required: true,
      helpText: 'Financial products require clarity and confidence - WCAG 2.1 AA compliance',
      learnContentId: 'ux-specification',
      tableSchema: {
        columns: ['Screen/Component', 'State', 'Description', 'Behavior', 'Accessibility', 'Design Link'],
        rows: [
          ['Transaction Form', 'Default', 'Amount, destination, memo fields', 'Real-time validation', 'WCAG AA', ''],
          ['Transaction Form', 'Loading', 'Processing transaction', 'Show progress, no back button', 'ARIA live region', ''],
          ['Transaction Form', 'Error', 'Validation or system error', 'Clear error message, preserve data', 'Error announced', ''],
          ['Confirmation', 'Success', 'Transaction completed', 'Show confirmation code, receipt option', 'Success announced', ''],
          ['Confirmation', 'Failed', 'Transaction declined', 'Explain reason, retry option', 'Error announced', ''],
          ['Transaction History', 'Empty', 'No transactions yet', 'Educational message, CTA', '', ''],
          ['Transaction History', 'Loading', 'Fetching transactions', 'Skeleton loader', 'Loading announced', ''],
        ]
      }
    },
    {
      id: 'edge-cases',
      title: 'Edge Cases & Error Handling',
      description: 'Anticipate and handle all edge cases and failure scenarios',
      fieldType: 'table',
      required: true,
      helpText: 'Financial edge cases can result in real monetary loss - be thorough',
      learnContentId: 'edge-case-thinking',
      tableSchema: {
        columns: ['Scenario', 'Category', 'Likelihood', 'Impact', 'Handling', 'User Message'],
        rows: [
          ['Insufficient funds during transaction', 'Transaction', 'High', 'High', 'Decline with clear error', "Insufficient funds. Please add funds or use a different payment method."],
          ['Network failure during processing', 'Technical', 'Medium', 'High', 'Idempotent retry, clear status', "We're processing your transaction. Please don't refresh."],
          ['Duplicate transaction submission', 'User Error', 'Medium', 'Medium', 'Idempotency key prevents duplicate', 'This transaction has already been submitted.'],
          ['Exchange rate change during confirmation', 'FX', 'High', 'Medium', 'Lock rate for 30 seconds, refresh if expired', "Exchange rate has changed. Please confirm the new rate."],
          ['Recipient account closed/invalid', 'Destination', 'Low', 'High', 'Return funds, notify user', "The destination account is invalid. Funds will be returned within 3-5 business days."],
          ['Fraud detection triggered', 'Security', 'Medium', 'High', 'Hold transaction, manual review', "Your transaction is under review. We'll contact you within 24 hours."],
          ['System outage during peak', 'Infrastructure', 'Low', 'High', 'Queue transactions, communicate delay', "High volume. Your transaction is queued and will process shortly."],
          ['Regulatory hold (OFAC match)', 'Compliance', 'Low', 'Critical', 'Freeze transaction, compliance review', "Your transaction requires additional verification. We'll contact you shortly."],
        ]
      }
    },
    {
      id: 'rollout-plan',
      title: 'Phased Rollout Plan',
      description: 'Careful launch with increasing transaction limits and risk controls',
      fieldType: 'table',
      required: true,
      helpText: 'Start with low limits and trusted users - financial risk requires caution',
      learnContentId: 'rollout-strategy',
      tableSchema: {
        columns: ['Phase', 'User Segment', 'User Count', 'Transaction Limit', 'Duration', 'Success Criteria', 'Go/No-Go Owner'],
        rows: [
          ['Dogfood', 'Internal employees only', '<50', '$100/day', '1 week', 'No P0 bugs, all transactions complete', 'Product Lead'],
          ['Alpha', 'Trusted beta users', '50-100', '$1,000/day', '2 weeks', 'Fraud rate <0.1%, Success rate >99%', 'Product Lead'],
          ['Beta', 'Verified users (Enhanced KYC)', '500-1000', '$10,000/day', '2 weeks', 'Metrics stable, NPS >40', 'Product Lead'],
          ['Expanded', 'All verified users', '10K+', '$25,000/day', '2 weeks', 'Fraud rate <0.1%, Chargeback <0.5%', 'Compliance Lead'],
          ['GA', 'All eligible users', '100% of TAM', 'Standard limits', 'Ongoing', 'All metrics green, Compliance sign-off', 'Executive Sponsor'],
        ]
      }
    },
    {
      id: 'rollout-checklist',
      title: 'Rollout Readiness Checklist',
      description: 'Pre-launch verification across all functions',
      fieldType: 'markdown',
      required: true,
      helpText: `**Engineering Readiness:**
- [ ] All P0/P1 bugs resolved
- [ ] Load testing completed (2x expected peak)
- [ ] Disaster recovery tested
- [ ] Monitoring and alerting configured
- [ ] Runbooks documented
- [ ] On-call rotation scheduled

**Security Readiness:**
- [ ] Penetration test completed, critical issues resolved
- [ ] Security review sign-off
- [ ] Fraud rules configured and tested
- [ ] Incident response plan documented

**Compliance Readiness:**
- [ ] Compliance review sign-off
- [ ] Legal review sign-off
- [ ] Regulatory filings completed (if required)
- [ ] Terms of service updated
- [ ] Privacy policy updated

**Customer Support Readiness:**
- [ ] Support team trained
- [ ] FAQ documentation published
- [ ] Escalation procedures defined
- [ ] Support tools configured

**Go-to-Market Readiness:**
- [ ] Marketing materials approved
- [ ] Sales team trained (if applicable)
- [ ] Press release ready (if applicable)
- [ ] Social media posts scheduled`,
      learnContentId: 'rollout-strategy',
    },
    {
      id: 'gtm-alignment',
      title: 'Go-to-Market Alignment',
      description: 'Marketing, sales, and support enablement plan',
      fieldType: 'table',
      required: true,
      helpText: 'Include trust and security messaging - financial products require confidence',
      learnContentId: 'gtm-basics',
      tableSchema: {
        columns: ['Activity', 'Channel', 'Message/Theme', 'Owner', 'Launch Date', 'Status', 'Notes'],
        rows: [
          ['Product Launch Announcement', 'Email, Blog', 'Security, speed, transparency', 'Marketing', '', '', ''],
          ['Social Media Campaign', 'Twitter, LinkedIn', 'Customer testimonials, trust signals', 'Marketing', '', '', ''],
          ['In-App Notification', 'Product', 'Feature announcement with CTA', 'Product', '', '', ''],
          ['Sales Enablement', 'Sales', 'Pitch deck, battle cards, FAQs', 'Sales Ops', '', '', ''],
          ['Support Training', 'Training', 'Product knowledge, escalation paths', 'Support', '', '', ''],
          ['PR Outreach', 'Media', 'Industry publication exclusives', 'Marketing', '', '', ''],
        ]
      }
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Financial, operational, compliance, and reputational risks',
      fieldType: 'table',
      required: true,
      helpText: 'Consider all risk categories - financial and reputational risks are critical',
      learnContentId: 'risk-management',
      tableSchema: {
        columns: ['Risk ID', 'Risk Description', 'Category', 'Severity (1-5)', 'Likelihood (1-5)', 'Mitigation Strategy', 'Owner', 'Status'],
        rows: [
          ['RISK-001', 'Fraudulent transactions exceed acceptable rate', 'Fraud', '5', '3', 'Multi-layer fraud detection, transaction limits, manual review queue', '', ''],
          ['RISK-002', 'Regulatory penalty or enforcement action', 'Compliance', '5', '2', 'Compliance review, legal sign-off, ongoing monitoring', '', ''],
          ['RISK-003', 'Data breach exposing customer financial data', 'Security', '5', '2', 'Encryption, access controls, monitoring, incident response plan', '', ''],
          ['RISK-004', 'System outage during peak transaction period', 'Operational', '4', '3', 'Redundancy, auto-scaling, disaster recovery', '', ''],
          ['RISK-005', 'Third-party provider failure (processor, IDV)', 'Vendor', '4', '3', 'Fallback providers, graceful degradation', '', ''],
          ['RISK-006', 'Negative press or social media incident', 'Reputational', '4', '2', 'PR response plan, customer communication', '', ''],
          ['RISK-007', 'Money laundering through platform', 'Compliance', '5', '2', 'AML monitoring, SAR filing, KYC verification', '', ''],
        ]
      }
    },
    {
      id: 'timeline-resourcing',
      title: 'Timeline & Resourcing',
      description: 'Project milestones, dependencies, and team allocation',
      fieldType: 'table',
      required: true,
      helpText: 'Include compliance review time - regulatory sign-off cannot be rushed',
      learnContentId: 'estimation',
      tableSchema: {
        columns: ['Milestone', 'Target Date', 'Duration', 'Dependencies', 'Owner', 'Status', 'Notes'],
        rows: [
          ['PRD Approved', '', '1 week', 'None', 'Product', '', ''],
          ['Design Complete', '', '2 weeks', 'PRD Approved', 'Design', '', ''],
          ['Engineering Start', '', 'Day 1', 'Design Complete', 'Engineering', '', ''],
          ['Compliance Review', '', '2 weeks', 'Feature complete', 'Compliance', '', 'Cannot be rushed'],
          ['Security Review', '', '1 week', 'Feature complete', 'Security', '', ''],
          ['Penetration Test', '', '1 week', 'Security review', 'Security', '', 'External vendor'],
          ['QA Complete', '', '2 weeks', 'Engineering complete', 'QA', '', ''],
          ['Alpha Launch', '', '1 week', 'QA Complete', 'Product', '', ''],
          ['Beta Launch', '', '2 weeks', 'Alpha success', 'Product', '', ''],
          ['GA Launch', '', '1 week', 'All approvals', 'Product', '', ''],
        ]
      }
    },
    {
      id: 'team-structure',
      title: 'Team Structure & Roles',
      description: 'Team members and responsibilities',
      fieldType: 'table',
      required: true,
      helpText: 'Clear ownership for each area',
      learnContentId: 'stakeholder-management',
      tableSchema: {
        columns: ['Role', 'Name', 'Responsibility', 'Time Allocation', 'Contact'],
        rows: [
          ['Product Lead', '', 'Overall product strategy, PRD ownership', '50%', ''],
          ['Engineering Lead', '', 'Technical architecture, delivery', '75%', ''],
          ['Design Lead', '', 'UX/UI design, user research', '50%', ''],
          ['Compliance Lead', '', 'Regulatory compliance, approvals', '25%', ''],
          ['Security Lead', '', 'Security architecture, reviews', '25%', ''],
          ['Data Analyst', '', 'Metrics definition, analysis', '25%', ''],
          ['QA Lead', '', 'Test planning, quality assurance', '50%', ''],
          ['Support Lead', '', 'Support readiness, documentation', '10%', ''],
        ]
      }
    },
    {
      id: 'post-launch-plan',
      title: 'Post-Launch Plan',
      description: 'Monitoring, alerting, and iteration plan',
      fieldType: 'table',
      required: true,
      helpText: 'Monitor fraud and transaction metrics in real-time - financial issues cannot wait',
      learnContentId: 'post-launch',
      tableSchema: {
        columns: ['Activity', 'Timeline', 'Owner', 'Alert Threshold', 'Response', 'Notes'],
        rows: [
          ['Fraud monitoring', 'Real-time', 'Risk Team', 'Fraud rate >0.1%', 'Immediate review, adjust rules', 'Critical metric'],
          ['Transaction success rate', 'Real-time', 'Engineering', 'Success rate <99%', 'Investigate failures', 'Customer impact'],
          ['System health', 'Real-time', 'Engineering', 'Error rate >1%', 'Page on-call', 'Infrastructure'],
          ['Day 1 check', 'Day 1', 'Product', 'No P0 issues', 'Go/No-Go decision', 'All teams'],
          ['Week 1 review', 'Week 1', 'Product', 'Metrics on track', 'Adjust if needed', 'All teams'],
          ['Month 1 impact', 'Month 1', 'Product', 'Hit success targets', 'Continue/iterate', 'Executive review'],
          ['Quarterly business review', 'Quarter 1', 'Product', 'OKR progress', 'Strategic decisions', 'Leadership'],
        ]
      }
    },
    {
      id: 'monitoring-dashboards',
      title: 'Monitoring Dashboards',
      description: 'Key dashboards and alerting configuration',
      fieldType: 'markdown',
      required: true,
      helpText: `**Real-Time Dashboards:**

| Dashboard | Purpose | Owner | Link |
|-----------|---------|-------|------|
| Transaction Health | Volume, success rate, latency | Engineering | [Grafana link] |
| Fraud Monitoring | Fraud rate, flagged transactions | Risk | [Dashboard link] |
| Business Metrics | Activation, conversion, revenue | Product | [Looker link] |
| System Health | Error rates, latency, uptime | Engineering | [Datadog link] |

**Alert Configuration:**
| Alert | Threshold | Severity | Channel | Owner |
|-------|-----------|----------|---------|-------|
| Fraud rate spike | >0.1% in 1 hour | Critical | PagerDuty | Risk |
| Transaction failures | >1% in 5 min | Critical | PagerDuty | Engineering |
| Latency spike | p99 >10s | High | Slack | Engineering |
| System down | 0 transactions in 5 min | Critical | PagerDuty | Engineering |

**On-Call Rotation:**
- Primary: [Name/Team]
- Secondary: [Name/Team]
- Escalation: [Name/Team]`,
      learnContentId: 'post-launch',
    },
    {
      id: 'appendices',
      title: 'Appendices',
      description: 'Supporting documentation and references',
      fieldType: 'markdown',
      required: false,
      helpText: `**Appendix A: Glossary**
| Term | Definition |
|------|------------|
| [Term] | [Definition] |

**Appendix B: Research Findings**
- User interview summary: [Link]
- Competitive analysis: [Link]
- Market research: [Link]

**Appendix C: Technical Diagrams**
- System architecture: [Link]
- Data flow diagram: [Link]
- API documentation: [Link]

**Appendix D: Compliance Documentation**
- Regulatory analysis: [Link]
- Legal review memo: [Link]
- Privacy impact assessment: [Link]

**Appendix E: Customer Support Scripts**
- Common questions: [Link]
- Escalation procedures: [Link]
- Refund policy: [Link]`,
      learnContentId: 'documentation',
    },
  ],
};
