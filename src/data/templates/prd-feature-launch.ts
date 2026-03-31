import { Template } from '@/types';

// COMPREHENSIVE FEATURE LAUNCH PRD TEMPLATE
// This is the USP - every possible detail a PM could need

export const prdFeatureLaunchTemplate: Template = {
  id: 'prd-feature-launch-v1',
  name: 'Feature Launch PRD (Comprehensive)',
  description: 'Complete Product Requirements Document for feature launches with every detail covered',
  industryId: 'saas', // Default, adaptable to all industries
  scenarioId: 'feature-launch',
  frameworkIds: ['rice', 'jtbd', 'okrs'],
  outputFormat: 'markdown',
  estimatedCompletionTime: '2-4 hours',
  version: '1.0.0',
  sections: [
    // ============================================
    // SECTION 1: DOCUMENT META
    // ============================================
    {
      id: 'document-meta',
      title: 'Document Metadata',
      description: 'Track document ownership and versioning',
      fieldType: 'markdown',
      required: true,
      helpText: 'This ensures accountability and traceability',
      learnContentId: 'doc-versioning',
      placeholder: `| Field | Value |
|-------|-------|
| Document Owner | |
| Engineering Lead | |
| Design Lead | |
| Status | Draft / In Review / Approved / Launched |
| Last Updated | |
| Version | 1.0 |
| Target Launch Date | |`,
    },
    {
      id: 'change-log',
      title: 'Change Log',
      description: 'Track all significant changes to this document',
      fieldType: 'markdown',
      required: true,
      helpText: 'Critical for stakeholder alignment and audit trails',
      learnContentId: 'change-management',
      placeholder: `| Version | Date | Author | Changes | Reviewers |
|---------|------|--------|---------|-----------|
| 1.0 | YYYY-MM-DD | | Initial draft | |`,
    },
    {
      id: 'approvers',
      title: 'Required Approvals',
      description: 'List all stakeholders who must approve before development begins',
      fieldType: 'markdown',
      required: true,
      helpText: 'Identify approvers early to avoid delays',
      learnContentId: 'stakeholder-management',
      placeholder: `| Role | Name | Status | Date Approved |
|------|------|--------|---------------|
| Product | | Pending | |
| Engineering | | Pending | |
| Design | | Pending | |
| Security (if applicable) | | Pending | |
| Legal/Compliance (if applicable) | | Pending | |
| Data/Privacy (if applicable) | | Pending | |`,
    },

    // ============================================
    // SECTION 2: EXECUTIVE SUMMARY
    // ============================================
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      description: 'One-paragraph overview that any executive can read in 30 seconds',
      fieldType: 'textarea',
      required: true,
      helpText: 'If an executive reads only one thing, it should be this',
      learnContentId: 'executive-communication',
      placeholder: `[Feature Name] enables [target users] to [key action] resulting in [primary benefit]. This addresses [problem/opportunity size] and aligns with [company/ product goal]. We expect [key metric] to improve by [X%] within [timeframe].`,
    },
    {
      id: 'tl-dr',
      title: 'TL;DR Summary',
      description: '5 bullet points maximum - the absolute essentials',
      fieldType: 'textarea',
      required: true,
      helpText: 'Force yourself to be brutally concise',
      placeholder: `• WHAT: One sentence on what we\'re building
• WHO: Target user segment
• WHY: Primary problem or opportunity
• IMPACT: Expected business outcome
• WHEN: Target timeline`,
    },

    // ============================================
    // SECTION 3: PROBLEM STATEMENT
    // ============================================
    {
      id: 'problem-statement',
      title: 'Problem Statement',
      description: 'Clearly articulate the problem you\'re solving',
      fieldType: 'markdown',
      required: true,
      helpText: 'A well-defined problem is half-solved. Be specific.',
      learnContentId: 'problem-definition',
      placeholder: `### Current State
[Describe the current situation and pain points]

### Problem Impact
- **Affected Users:** [Who experiences this problem? How many?]
- **Frequency:** [How often does this occur?]
- **Severity:** [What\'s the impact on users? On the business?]
- **Workarounds:** [What are users doing today to cope?]

### Evidence
[Data, user research, support tickets, or other evidence validating this problem]

### Cost of Inaction
[What happens if we don\'t solve this? Quantify if possible]`,
    },
    {
      id: 'user-personas',
      title: 'Target User Personas',
      description: 'Who specifically are we building this for?',
      fieldType: 'markdown',
      required: true,
      helpText: 'Be specific - "everyone" is not a persona',
      learnContentId: 'persona-definition',
      placeholder: `### Primary Persona
**Name:** [Give them a name]
**Role:** [Job title / user type]
**Segment:** [Enterprise/SMB/Consumer, etc.]
**Goals:** [What are they trying to accomplish?]
**Frustrations:** [What annoys them about current solutions?]
**Technical Proficiency:** [Beginner/Intermediate/Advanced]
**Context:** [When/where/how do they use our product?]

### Secondary Persona (if applicable)
[Repeat above]

### Users NOT Targeted
[Explicitly call out who this is NOT for - prevents scope creep]`,
    },

    // ============================================
    // SECTION 4: JOBS TO BE DONE
    // ============================================
    {
      id: 'jtbd',
      title: 'Jobs To Be Done',
      description: 'Frame the user need using JTBD framework',
      fieldType: 'textarea',
      required: true,
      helpText: 'Focus on the outcome, not the solution',
      learnContentId: 'jtbd-framework',
      placeholder: `Main Job Statement:
"When [situation/context], I want to [motivation/action], so I can [expected outcome/benefit]"

Related Jobs:
• Functional Job: [The practical task they need to complete]
• Emotional Job: [How they want to feel]
• Social Job: [How they want to be perceived]

Current Alternatives:
• [What are users using today to get this job done?]
• [Why are those alternatives inadequate?]`,
    },

    // ============================================
    // SECTION 5: SUCCESS METRICS
    // ============================================
    {
      id: 'success-metrics',
      title: 'Success Metrics & Goals',
      description: 'How will we know if this is successful?',
      fieldType: 'markdown',
      required: true,
      helpText: 'Define metrics BEFORE discussing solutions',
      learnContentId: 'success-metrics',
      placeholder: `### North Star Metric
[The one metric that matters most for this feature]

### Primary Key Results
| Metric | Baseline | Target | Timeline | Owner |
|--------|----------|--------|----------|-------|
| | Current value | Goal | When | Who |

### Secondary Metrics (Guardrails)
[Metrics we\'ll watch to ensure we\'re not breaking anything]
| Metric | Current | Acceptable Range | Alert Threshold |
|--------|---------|------------------|-----------------|
| | | | |

### Leading Indicators
[Early signals that we\'re on track before lagging metrics move]
• [e.g., Feature adoption rate in first week]
• [e.g., User engagement in first session]

### Definition of Success
[Clear statement: "We will consider this successful if..."]`,
    },

    // ============================================
    // SECTION 6: SOLUTION OVERVIEW
    // ============================================
    {
      id: 'solution-overview',
      title: 'Solution Overview',
      description: 'High-level description of what you\'re building',
      fieldType: 'markdown',
      required: true,
      helpText: 'Stay high-level here - details come in requirements',
      learnContentId: 'solution-design',
      placeholder: `### Proposed Solution
[2-3 paragraphs describing the solution in plain language]

### Key User Flows
[Brief description of main user journeys]

### Design Principles
[Guiding principles for the solution - e.g., "Progressive disclosure", "Defaults over configuration"]

### Out of Scope (Explicitly)
[What are we NOT building? This prevents scope creep]
• [Item 1]
• [Item 2]`,
    },
    {
      id: 'user-stories',
      title: 'User Stories',
      description: 'Detailed user stories with acceptance criteria',
      fieldType: 'markdown',
      required: true,
      helpText: 'Use INVEST criteria: Independent, Negotiable, Valuable, Estimable, Small, Testable',
      learnContentId: 'user-stories',
      placeholder: `### Epic: [Epic Name]

#### Story 1: [Story Title]
**As a** [user type]
**I want to** [action]
**So that** [benefit]

**Acceptance Criteria:**
- [ ] Given [context], When [action], Then [expected result]
- [ ] Given [context], When [action], Then [expected result]
- [ ] Given [context], When [action], Then [expected result]

**Edge Cases:**
- [What happens when...?]

**Design Mockups:**
[Link to Figma/designs]

---

#### Story 2: [Repeat format]`,
    },

    // ============================================
    // SECTION 7: FUNCTIONAL REQUIREMENTS
    // ============================================
    {
      id: 'functional-requirements',
      title: 'Functional Requirements',
      description: 'Detailed functional requirements with priorities',
      fieldType: 'markdown',
      required: true,
      helpText: 'Use MoSCoW prioritization: Must have, Should have, Could have, Won\'t have',
      learnContentId: 'requirements-writing',
      placeholder: `### P0 - Must Have (Blocking Launch)
| ID | Requirement | Priority | Complexity | Notes |
|----|-------------|----------|------------|-------|
| FR-001 | | P0 | | |
| FR-002 | | P0 | | |

### P1 - Should Have (Expected at Launch)
| ID | Requirement | Priority | Complexity | Notes |
|----|-------------|----------|------------|-------|
| FR-003 | | P1 | | |

### P2 - Could Have (Nice to Have)
| ID | Requirement | Priority | Complexity | Notes |
|----|-------------|----------|------------|-------|
| FR-004 | | P2 | | |

### P3 - Won\'t Have (Future Consideration)
[Features explicitly deferred to avoid scope creep]`,
    },

    // ============================================
    // SECTION 8: NON-FUNCTIONAL REQUIREMENTS
    // ============================================
    {
      id: 'non-functional-requirements',
      title: 'Non-Functional Requirements',
      description: 'Performance, security, scalability, and quality attributes',
      fieldType: 'markdown',
      required: true,
      helpText: 'These are often forgotten but critical for production readiness',
      learnContentId: 'non-functional-requirements',
      placeholder: `### Performance
| Metric | Requirement | Measurement |
|--------|-------------|-------------|
| Page Load Time | | |
| API Response Time (p50/p95/p99) | | |
| Time to Interactive | | |
| Concurrent Users Supported | | |

### Scalability
- [ ] Expected load: [requests/day, users/hour]
- [ ] Peak load handling: [Black Friday, end-of-month, etc.]
- [ ] Growth projection: [Expected scale in 6/12/24 months]

### Security
- [ ] Authentication requirements
- [ ] Authorization/permission model
- [ ] Data encryption (at rest, in transit)
- [ ] Audit logging requirements
- [ ] Vulnerability scanning
- [ ] Penetration testing required: Yes/No
- [ ] Compliance: [SOC2, HIPAA, PCI-DSS, etc.]

### Reliability
- [ ] Target uptime: [e.g., 99.9%]
- [ ] RTO (Recovery Time Objective): [Max acceptable downtime]
- [ ] RPO (Recovery Point Objective): [Max acceptable data loss]
- [ ] Monitoring and alerting requirements

### Accessibility
- [ ] WCAG 2.1 Level: [A / AA / AAA]
- [ ] Screen reader compatibility
- [ ] Keyboard navigation
- [ ] Color contrast requirements

### Internationalization
- [ ] Supported locales/languages
- [ ] RTL language support
- [ ] Date/time/currency formatting
- [ ] Cultural considerations`,
    },

    // ============================================
    // SECTION 9: DATA REQUIREMENTS
    // ============================================
    {
      id: 'data-requirements',
      title: 'Data Requirements',
      description: 'Data model, tracking, and analytics requirements',
      fieldType: 'markdown',
      required: true,
      helpText: 'Define what data you need to capture and how',
      learnContentId: 'data-tracking',
      placeholder: `### Data Model Changes
[New tables, fields, or relationships]

### Event Tracking
| Event Name | Trigger | Properties | User Properties |
|------------|---------|------------|-----------------|
| | | | |

### Analytics Dashboards
[What dashboards need to be created/updated?]

### Data Retention
- [ ] How long is data retained?
- [ ] Deletion requirements (GDPR, CCPA)
- [ ] Archival strategy

### Reporting Requirements
[What reports need to be available? For whom? How often?]`,
    },

    // ============================================
    // SECTION 10: INTEGRATIONS & DEPENDENCIES
    // ============================================
    {
      id: 'integrations-dependencies',
      title: 'Integrations & Dependencies',
      description: 'External systems, APIs, and team dependencies',
      fieldType: 'markdown',
      required: true,
      helpText: 'Map all dependencies early to avoid blockers',
      learnContentId: 'dependency-management',
      placeholder: `### External Integrations
| System | Integration Type | API/Method | Owner | Status |
|--------|-----------------|------------|-------|--------|
| | | | | |

### Internal Dependencies
| Team | Dependency | Required By | Status |
|------|------------|-------------|--------|
| | | | |

### Third-Party Services
| Service | Purpose | Cost | Contract |
|---------|---------|------|----------|
| | | | |

### Technical Dependencies
[Libraries, frameworks, infrastructure changes needed]`,
    },

    // ============================================
    // SECTION 11: API SPECIFICATIONS (if applicable)
    // ============================================
    {
      id: 'api-specifications',
      title: 'API Specifications',
      description: 'API endpoints, request/response schemas',
      fieldType: 'markdown',
      required: false,
      helpText: 'Work with engineering to define these',
      learnContentId: 'api-design',
      placeholder: `### New Endpoints

#### POST /api/v1/[resource]
**Description:** [What this endpoint does]

**Request Body:**
\`\`\`json
{
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
}
\`\`\`

**Error Responses:**
| Code | Scenario | Message |
|------|----------|---------|
| 400 | | |
| 401 | | |
| 403 | | |
| 404 | | |
| 429 | | |
| 500 | | |

### Rate Limiting
[Requests per minute/hour limits]

### Versioning Strategy
[How will API changes be versioned?]`,
    },

    // ============================================
    // SECTION 12: UX/UI REQUIREMENTS
    // ============================================
    {
      id: 'ux-ui-requirements',
      title: 'UX/UI Requirements',
      description: 'Design specifications and interaction details',
      fieldType: 'markdown',
      required: true,
      helpText: 'Link to designs but also describe key interactions',
      learnContentId: 'ux-specification',
      placeholder: `### Design Links
- Figma: [Link]
- Prototype: [Link]
- Design System Components: [Link]

### Key Screens
[Describe each major screen/state]

### Interaction Details
- **Empty States:** [What shows when there\'s no data?]
- **Loading States:** [Skeleton screens? Spinners?]
- **Error States:** [How are errors communicated?]
- **Success States:** [Confirmation messages?]
- **Transitions:** [Animations between states?]

### Responsive Behavior
- Desktop: [Specifics]
- Tablet: [Specifics]
- Mobile: [Specifics]

### Microcopy
[Key button labels, error messages, tooltips]`,
    },

    // ============================================
    // SECTION 13: EDGE CASES & ERROR HANDLING
    // ============================================
    {
      id: 'edge-cases',
      title: 'Edge Cases & Error Handling',
      description: 'Anticipate and plan for edge cases',
      fieldType: 'markdown',
      required: true,
      helpText: 'PMs often forget this - don\'t be that PM',
      learnContentId: 'edge-case-thinking',
      placeholder: `### User Edge Cases
- [ ] What if user loses connection mid-action?
- [ ] What if user navigates away during operation?
- [ ] What if user tries to perform action twice?
- [ ] What if user has insufficient permissions?
- [ ] What if user\'s session expires?
- [ ] What if user has conflicting data?
- [ ] What if user is on a slow connection?
- [ ] What if user has accessibility needs?

### Data Edge Cases
- [ ] What if required data is missing?
- [ ] What if API returns unexpected format?
- [ ] What if there\'s a duplicate entry?
- [ ] What if data exceeds expected size?
- [ ] What if there\'s a race condition?

### Business Logic Edge Cases
- [ ] What if pricing changes during checkout?
- [ ] What if inventory changes during order?
- [ ] What if user qualifies for multiple discounts?
- [ ] What if timezone causes date issues?

### Error Messages
[Define user-friendly error messages for each scenario]`,
    },

    // ============================================
    // SECTION 14: ROLLOUT PLAN
    // ============================================
    {
      id: 'rollout-plan',
      title: 'Rollout & Launch Plan',
      description: 'Phased rollout strategy and launch activities',
      fieldType: 'markdown',
      required: true,
      helpText: 'Big bang launches are risky - consider phased rollouts',
      learnContentId: 'rollout-strategy',
      placeholder: `### Rollout Strategy
[ ] Internal testing (dogfooding)
[ ] Alpha: [User segment, size, duration]
[ ] Beta: [User segment, size, duration]
[ ] Canary: [% of traffic, success criteria]
[ ] GA: [Full launch date]

### Feature Flags
- Flag name: [name]
- Rollout percentages: [0% → 10% → 50% → 100%]
- Kill switch requirements: [How quickly can we turn this off?]

### Launch Checklist
- [ ] Engineering: Code complete
- [ ] Engineering: Tests passing
- [ ] Engineering: Monitoring configured
- [ ] Design: All states reviewed
- [ ] QA: Testing complete
- [ ] Product: Acceptance testing
- [ ] Marketing: Launch materials ready
- [ ] Support: Training complete
- [ ] Documentation: User docs updated
- [ ] Legal/Compliance: Approved (if needed)
- [ ] Security: Review complete (if needed)

### Rollback Plan
[If something goes wrong, how do we roll back?]
- Trigger conditions: [When do we roll back?]
- Rollback procedure: [Steps]
- Communication plan: [Who do we notify?]`,
    },

    // ============================================
    // SECTION 15: GO-TO-MARKET ALIGNMENT
    // ============================================
    {
      id: 'gtm-alignment',
      title: 'Go-to-Market Alignment',
      description: 'Marketing, sales, and support enablement',
      fieldType: 'markdown',
      required: true,
      helpText: 'Great features fail without proper GTM',
      learnContentId: 'gtm-basics',
      placeholder: `### Positioning
**Value Proposition:** [One sentence on why this matters]
**Messaging:** [Key messages for different audiences]
**Differentiation:** [How is this different from competitors?]

### Target Audience
[Which customer segments are we targeting first?]

### Marketing Activities
- [ ] Blog post
- [ ] Press release
- [ ] Social media campaign
- [ ] Email campaign
- [ ] Webinar/demo
- [ ] Case study
- [ ] Paid advertising

### Sales Enablement
- [ ] Sales deck
- [ ] Battle cards
- [ ] Demo environment
- [ ] Pricing guidance
- [ ] FAQ document
- [ ] Objection handling

### Customer Success Enablement
- [ ] Training session
- [ ] Help center articles
- [ ] In-app guidance
- [ ] Video tutorials
- [ ] Support FAQ`,
    },

    // ============================================
    // SECTION 16: RISK ASSESSMENT
    // ============================================
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Identify and mitigate risks',
      fieldType: 'markdown',
      required: true,
      helpText: 'Name the risks before they name you',
      learnContentId: 'risk-management',
      placeholder: `### Technical Risks
| Risk | Likelihood | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| | Low/Med/High | Low/Med/High | | |

### Business Risks
| Risk | Likelihood | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| | | | | |

### Market Risks
| Risk | Likelihood | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| | | | | |

### Compliance/Legal Risks
| Risk | Likelihood | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| | | | | |

### Assumptions
[List all assumptions being made - validate these!]
1. [Assumption 1]
2. [Assumption 2]

### Open Questions
[Questions that need answers before we proceed]
1. [Question 1] - Owner - Due Date
2. [Question 2] - Owner - Due Date`,
    },

    // ============================================
    // SECTION 17: TIMELINE & RESOURCING
    // ============================================
    {
      id: 'timeline-resourcing',
      title: 'Timeline & Resourcing',
      description: 'Project timeline, milestones, and team requirements',
      fieldType: 'markdown',
      required: true,
      helpText: 'Be realistic - pad estimates for the unknown',
      learnContentId: 'estimation',
      placeholder: `### Key Milestones
| Milestone | Target Date | Dependencies | Owner |
|-----------|-------------|--------------|-------|
| PRD Approved | | | |
| Design Complete | | | |
| Engineering Complete | | | |
| QA Complete | | | |
| Beta Launch | | | |
| GA Launch | | | |

### Team Requirements
| Role | FTE | Duration | Notes |
|------|-----|----------|-------|
| Engineering | | | |
| Design | | | |
| QA | | | |
| Data/Analytics | | | |
| Marketing | | | |

### Budget (if applicable)
[Third-party costs, infrastructure costs, etc.]

### Critical Path
[What\'s on the critical path that could delay launch?]`,
    },

    // ============================================
    // SECTION 18: POST-LAUNCH PLAN
    // ============================================
    {
      id: 'post-launch-plan',
      title: 'Post-Launch Plan',
      description: 'What happens after launch?',
      fieldType: 'markdown',
      required: true,
      helpText: 'Launch is not the end - plan for iteration',
      learnContentId: 'post-launch',
      placeholder: `### Monitoring Plan
- [ ] Dashboard created: [Link]
- [ ] Alerts configured: [What triggers alerts?]
- [ ] On-call rotation updated

### Success Review Timeline
- [ ] Day 1: [What to check?]
- [ ] Week 1: [What to review?]
- [ ] Month 1: [Formal success review]
- [ ] Quarter 1: [Long-term impact assessment]

### Iteration Backlog
[Known follow-up items for future sprints]
1. [Item 1]
2. [Item 2]

### Kill Criteria
[When would we sunset this feature?]
- [Adoption < X% after Y months]
- [Performance issues that can\'t be resolved]
- [Strategic pivot]

### Retrospective Scheduled
[Date for team retrospective to capture learnings]`,
    },

    // ============================================
    // SECTION 19: APPENDICES
    // ============================================
    {
      id: 'appendices',
      title: 'Appendices',
      description: 'Additional context, research, and references',
      fieldType: 'markdown',
      required: false,
      helpText: 'Put detailed research and references here',
      learnContentId: 'documentation',
      placeholder: `### Appendix A: User Research Summary
[Key findings from user interviews/surveys]

### Appendix B: Competitive Analysis
[How do competitors solve this?]

### Appendix C: Technical Deep Dive
[Engineering RFCs, architecture diagrams]

### Appendix D: Data Analysis
[SQL queries, data explorations, cohort analyses]

### Appendix E: Related Documents
- [Link to related PRDs]
- [Link to strategy docs]
- [Link to research docs]

### Appendix F: Glossary
[Define acronyms and domain-specific terms]`,
    },
  ],
};
