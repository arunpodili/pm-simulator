import { Template } from '@/types';

export const prdSaaSTemplate: Template = {
  id: 'prd-saas-feature-launch',
  name: 'SaaS Feature Launch PRD (Comprehensive)',
  description: 'Complete product requirements document for SaaS feature launches with every detail covered',
  industryId: 'saas',
  scenarioId: 'feature-launch',
  frameworkIds: ['rice', 'jtbd', 'okrs'],
  outputFormat: 'markdown',
  estimatedCompletionTime: '4-6 hours',
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
      placeholder: `# DOCUMENT METADATA

| Field | Input |
|-------|-------|
| **Document Owner** | |
| **Engineering Lead** | |
| **Design Lead** | |
| **Product Manager** | |
| **Status** | Draft / In Review / Approved / Launched |
| **Last Updated** | |
| **Version** | 1.0 |
| **Target Launch Date** | |
| **Document Created** | |

---

## CHANGE LOG

| Version | Date | Author | Changes Summary | Reviewers |
|---------|------|--------|-----------------|-----------|
| 1.0 | YYYY-MM-DD | | Initial draft | |
| | | | | |

---

## REQUIRED APPROVALS

| Role | Name | Email | Status | Date Approved |
|------|------|-------|--------|---------------|
| Product | | | Pending | |
| Engineering | | | Pending | |
| Design | | | Pending | |
| Security | | | Pending | |
| Legal/Compliance | | | Pending | |`,
    },

    // ============================================
    // SECTION 2: EXECUTIVE SUMMARY
    // ============================================
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      description: 'One-paragraph overview that any executive can read in 30 seconds',
      fieldType: 'markdown',
      required: true,
      helpText: 'If an executive reads only one thing, it should be this',
      learnContentId: 'executive-communication',
      placeholder: `# EXECUTIVE SUMMARY

## 30-Second Summary

[Feature Name] enables [target users] to [key action] resulting in [primary benefit]. This addresses [problem/opportunity size] and aligns with [company/product goal]. We expect [key metric] to improve by [X%] within [timeframe].

---

## TL;DR Summary (5 Bullets Max)

- **WHAT:** One sentence on what we're building
- **WHO:** Target user segment
- **WHY:** Primary problem or opportunity
- **IMPACT:** Expected business outcome (with numbers)
- **WHEN:** Target timeline

---

## BLUF (Bottom Line Up Front)

> "This feature will [specific outcome] by [date], requiring [investment] and delivering [ROI]."

---

## Decision Required

| Question | Recommendation |
|----------|----------------|
| Should we build this? | Yes / No |
| Priority level | P0 / P1 / P2 |
| Investment required | $X / X engineer-weeks |
| Expected ROI | X% over Y months |`,
    },

    // ============================================
    // SECTION 3: PROBLEM STATEMENT
    // ============================================
    {
      id: 'problem-statement',
      title: 'Problem Statement',
      description: 'Clearly articulate the problem you are solving',
      fieldType: 'markdown',
      required: true,
      helpText: 'A well-defined problem is half-solved. Be specific.',
      learnContentId: 'problem-definition',
      placeholder: `# PROBLEM STATEMENT

## Current State

[Describe the current situation and pain points in detail]

---

## Problem Analysis

| Aspect | Details |
|--------|---------|
| **Affected Users** | Who experiences this? How many? |
| **Frequency** | How often does this occur? |
| **Severity** | What's the impact on users? On the business? |
| **Workarounds** | What are users doing today to cope? |
| **Duration** | How long has this been a problem? |

---

## Evidence

| Source | Type | Key Finding | Date |
|--------|------|-------------|------|
| Analytics | Quantitative | | |
| User Research | Qualitative | | |
| Support Tickets | Quantitative | | |
| Sales Feedback | Qualitative | | |
| NPS/CSAT | Quantitative | | |

---

## Cost of Inaction

| Impact Area | Current Cost | Projected Cost (6 months) |
|-------------|--------------|---------------------------|
| Revenue Loss | $/month | $ |
| Churn | X% of MRR | $ |
| Support Costs | $/month | $ |
| Opportunity Cost | $ | $ |
| **Total** | | |

> **If we don't solve this:** [What happens? Quantify if possible]

---

## Problem Validation Checklist

- [ ] We have quantitative data supporting this problem
- [ ] We have qualitative research (user interviews)
- [ ] Support/sales team confirms this is a pattern
- [ ] We can articulate the cost of inaction
- [ ] This problem aligns with company strategy`,
    },

    // ============================================
    // SECTION 4: USER PERSONAS
    // ============================================
    {
      id: 'user-personas',
      title: 'Target User Personas',
      description: 'Who specifically are we building this for?',
      fieldType: 'markdown',
      required: true,
      helpText: 'Be specific - "everyone" is not a persona',
      learnContentId: 'persona-definition',
      placeholder: `# TARGET USER PERSONAS

## Primary Persona

| Attribute | Details |
|-----------|---------|
| **Name** | [Give them a name] |
| **Role/Job Title** | |
| **Company Size** | |
| **Industry** | |
| **Segment** | Enterprise / SMB / Consumer |
| **Technical Proficiency** | Beginner / Intermediate / Advanced |
| **Goals** | What are they trying to accomplish? |
| **Frustrations** | What annoys them about current solutions? |
| **Context** | When/where/how do they use our product? |
| **Decision Power** | Can they buy on their own? |

### Day in the Life

| Time | Activity | Tools Used | Pain Points |
|------|----------|------------|-------------|
| Morning | | | |
| Afternoon | | | |
| End of Day | | | |

---

## Secondary Persona (if applicable)

| Attribute | Details |
|-----------|---------|
| **Name** | |
| **Role/Job Title** | |
| **Segment** | |
| **Goals** | |
| **Frustrations** | |

---

## Users NOT Targeted

> **Explicitly call out who this is NOT for - prevents scope creep**

| User Type | Why Not Targeted |
|-----------|------------------|
| | |
| | |

---

## Persona Validation

- [ ] Based on real user research (not assumptions)
- [ ] Has specific, observable behaviors
- [ ] Can be reached through known channels
- [ ] Has budget/authority to buy
- [ ] Problem is painful enough to pay for solution`,
    },

    // ============================================
    // SECTION 5: JOBS TO BE DONE
    // ============================================
    {
      id: 'jtbd',
      title: 'Jobs To Be Done',
      description: 'Frame the user need using JTBD framework',
      fieldType: 'markdown',
      required: true,
      helpText: 'Focus on the outcome, not the solution',
      learnContentId: 'jtbd-framework',
      placeholder: `# JOBS TO BE DONE

## Main Job Statement

> "When **[situation/context]**, I want to **[motivation/action]**, so I can **[expected outcome/benefit]**"

---

## Related Jobs

| Job Type | Statement |
|----------|-----------|
| **Functional Job** | The practical task they need to complete |
| **Emotional Job** | How they want to feel |
| **Social Job** | How they want to be perceived by others |

---

## Current Alternatives

| Alternative | Why They Use It | Why It's Inadequate |
|-------------|-----------------|---------------------|
| Competitor A | | |
| Spreadsheet | | |
| Manual Process | | |
| Nothing (status quo) | | |

---

## JTBD Interview Notes

| Question | Customer's Answer |
|----------|-------------------|
| "Tell me about the last time you needed this." | |
| "What happened right before you realized you needed it?" | |
| "What did you do instead?" | |
| "Who else was involved? What did they need?" | |
| "What would happen if you didn't have this?" | |
| "How do you currently solve this problem?" | |
| "What's frustrating about your current solution?" | |

---

## Job Validation Checklist

| Question | Yes/No | Evidence |
|----------|--------|----------|
| Is this a real job or a solution in disguise? | | |
| Can we observe customers actually doing this job? | | |
| Do customers currently spend money/time on this job? | | |
| Is this job important enough that they'll pay for a solution? | | |
| Is this job underserved by current solutions? | | |`,
    },

    // ============================================
    // SECTION 6: SUCCESS METRICS
    // ============================================
    {
      id: 'success-metrics',
      title: 'Success Metrics & Goals',
      description: 'How will we know if this is successful?',
      fieldType: 'markdown',
      required: true,
      helpText: 'Define metrics BEFORE discussing solutions',
      learnContentId: 'success-metrics',
      placeholder: `# SUCCESS METRICS & GOALS

## North Star Metric

| Metric | Current Baseline | Target | Timeline |
|--------|------------------|--------|----------|
| | | | |

---

## Primary Key Results (OKRs)

| Objective | Key Result | Baseline | Target | Timeline | Owner |
|-----------|------------|----------|--------|----------|-------|
| | | | | | |
| | | | | | |

---

## Secondary Metrics (Guardrails)

| Metric | Current | Acceptable Range | Alert Threshold | Owner |
|--------|---------|------------------|-----------------|-------|
| | | | | |
| | | | | |

---

## HEART Framework Metrics

| Metric Type | Metric | Baseline | Target | How Measured |
|-------------|--------|----------|--------|--------------|
| **H**appiness | NPS, CSAT, sentiment | | | |
| **E**ngagement | Frequency, depth | | | |
| **A**doption | New users, feature uptake | | | |
| **R**etention | Churn, repeat usage | | | |
| **T**ask Success | Completion, errors | | | |

---

## Leading Indicators

> **Early signals that we're on track before lagging metrics move**

| Indicator | Target | How to Track |
|-----------|--------|--------------|
| Feature adoption rate (Week 1) | X% | Analytics |
| User engagement (first session) | X min | Analytics |
| Support ticket volume | < X/week | Support tool |

---

## Definition of Success

> **"We will consider this successful if..."**

[Clear statement with specific numbers and timeline]

---

## Metrics Review Schedule

| Review | Date | Attendees | Decision |
|--------|------|-----------|----------|
| Week 1 | | | |
| Month 1 | | | |
| Quarter 1 | | | |`,
    },

    // ============================================
    // SECTION 7: SOLUTION OVERVIEW
    // ============================================
    {
      id: 'solution-overview',
      title: 'Solution Overview',
      description: 'High-level description of what you are building',
      fieldType: 'markdown',
      required: true,
      helpText: 'Stay high-level here - details come in requirements',
      learnContentId: 'solution-design',
      placeholder: `# SOLUTION OVERVIEW

## Proposed Solution

[2-3 paragraphs describing the solution in plain language]

---

## Key User Flows

| Flow Name | Trigger | Steps | Outcome |
|-----------|---------|-------|---------|
| | | 1. 2. 3. | |

---

## Design Principles

> **Guiding principles for the solution**

| Principle | What It Means | Example |
|-----------|---------------|---------|
| Progressive disclosure | | |
| Defaults over configuration | | |
| Mobile-first | | |

---

## Out of Scope (Explicitly)

> **What are we NOT building? This prevents scope creep.**

| Item | Why Out of Scope | Future Consideration? |
|------|------------------|----------------------|
| | | Yes / No |
| | | Yes / No |

---

## Solution Options Considered

| Option | Pros | Cons | Why Chosen/Rejected |
|--------|------|------|---------------------|
| Option A | | | |
| Option B | | | |
| **Selected** | | | |`,
    },

    // ============================================
    // SECTION 8: USER STORIES
    // ============================================
    {
      id: 'user-stories',
      title: 'User Stories',
      description: 'Detailed user stories with acceptance criteria',
      fieldType: 'markdown',
      required: true,
      helpText: 'Use INVEST criteria: Independent, Negotiable, Valuable, Estimable, Small, Testable',
      learnContentId: 'user-stories',
      placeholder: `# USER STORIES

## Epic: [Epic Name]

### Story 1: [Story Title]

**As a** [user type]
**I want to** [action]
**So that** [benefit]

### Acceptance Criteria

| # | Given | When | Then | Status |
|---|-------|------|------|--------|
| 1 | | | | Pass/Fail |
| 2 | | | | Pass/Fail |
| 3 | | | | Pass/Fail |

### Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| | |
| | |

### Design Mockups

- [ ] Figma link:
- [ ] Prototype link:

---

### Story 2: [Story Title]

**As a** [user type]
**I want to** [action]
**So that** [benefit]

### Acceptance Criteria

| # | Given | When | Then | Status |
|---|-------|------|------|--------|
| 1 | | | | Pass/Fail |
| 2 | | | | Pass/Fail |

---

## Story Mapping

| User Activity | Task | Story | Priority |
|---------------|------|-------|----------|
| | | | P0/P1/P2 |
| | | | P0/P1/P2 |

---

## INVEST Checklist

| Story | Independent | Negotiable | Valuable | Estimable | Small | Testable |
|-------|-------------|------------|----------|-----------|-------|----------|
| Story 1 | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ |
| Story 2 | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ |`,
    },

    // ============================================
    // SECTION 9: FUNCTIONAL REQUIREMENTS
    // ============================================
    {
      id: 'functional-requirements',
      title: 'Functional Requirements',
      description: 'Detailed functional requirements with priorities',
      fieldType: 'markdown',
      required: true,
      helpText: 'Use MoSCoW prioritization: Must have, Should have, Could have, Won\'t have',
      learnContentId: 'requirements-writing',
      placeholder: `# FUNCTIONAL REQUIREMENTS

## P0 - Must Have (Blocking Launch)

| ID | Requirement | Priority | Complexity | User Story | Notes |
|----|-------------|----------|------------|------------|-------|
| FR-001 | | P0 | | | |
| FR-002 | | P0 | | | |

---

## P1 - Should Have (Expected at Launch)

| ID | Requirement | Priority | Complexity | User Story | Notes |
|----|-------------|----------|------------|------------|-------|
| FR-003 | | P1 | | | |

---

## P2 - Could Have (Nice to Have)

| ID | Requirement | Priority | Complexity | User Story | Notes |
|----|-------------|----------|------------|------------|-------|
| FR-004 | | P2 | | | |

---

## P3 - Won't Have (Future Consideration)

> **Features explicitly deferred to avoid scope creep**

| ID | Requirement | Why Deferred | Future Priority |
|----|-------------|--------------|-----------------|
| | | | |

---

## Requirements Traceability

| Requirement | User Story | Test Case | Status |
|-------------|------------|-----------|--------|
| FR-001 | US-001 | TC-001 | |
| FR-002 | US-001 | TC-002 | |

---

## MoSCoW Summary

| Priority | Count | % of Total |
|----------|-------|------------|
| P0 (Must) | | % |
| P1 (Should) | | % |
| P2 (Could) | | % |
| P3 (Won't) | | % |`,
    },

    // ============================================
    // SECTION 10: NON-FUNCTIONAL REQUIREMENTS
    // ============================================
    {
      id: 'non-functional-requirements',
      title: 'Non-Functional Requirements',
      description: 'Performance, security, scalability, and quality attributes',
      fieldType: 'markdown',
      required: true,
      helpText: 'These are often forgotten but critical for production readiness',
      learnContentId: 'non-functional-requirements',
      placeholder: `# NON-FUNCTIONAL REQUIREMENTS

## Performance

| Metric | Requirement | Measurement | Current | Status |
|--------|-------------|-------------|---------|--------|
| Page Load Time | < 3 seconds | Lighthouse | | Pass/Fail |
| API Response Time (p50) | < 200ms | Monitoring | | Pass/Fail |
| API Response Time (p95) | < 500ms | Monitoring | | Pass/Fail |
| API Response Time (p99) | < 1000ms | Monitoring | | Pass/Fail |
| Time to Interactive | < 5 seconds | Lighthouse | | Pass/Fail |
| Concurrent Users Supported | X users | Load test | | Pass/Fail |

---

## Scalability

| Question | Answer |
|----------|--------|
| Expected load (requests/day) | |
| Peak load (Black Friday, etc.) | |
| Growth projection (6 months) | |
| Growth projection (12 months) | |
| Growth projection (24 months) | |

---

## Security

| Requirement | Status | Notes |
|-------------|--------|-------|
| Authentication requirements | ✓/✗ | |
| Authorization/permission model | ✓/✗ | |
| Data encryption (at rest) | ✓/✗ | |
| Data encryption (in transit) | ✓/✗ | |
| Audit logging requirements | ✓/✗ | |
| Vulnerability scanning | ✓/✗ | |
| Penetration testing required | Yes/No | |
| Compliance (SOC2, etc.) | | |

---

## Reliability

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Target uptime | 99.9% | | Pass/Fail |
| RTO (Recovery Time Objective) | | | Pass/Fail |
| RPO (Recovery Point Objective) | | | Pass/Fail |
| Monitoring and alerting | ✓/✗ | | Pass/Fail |

---

## Accessibility (WCAG 2.1)

| Requirement | Level | Status | Notes |
|-------------|-------|--------|-------|
| Keyboard navigation | AA | ✓/✗ | |
| Screen reader compatibility | AA | ✓/✗ | |
| Color contrast | AA | ✓/✗ | |
| Focus indicators | AA | ✓/✗ | |

---

## Internationalization

| Requirement | Status | Notes |
|-------------|--------|-------|
| Supported locales/languages | | |
| RTL language support | ✓/✗ | |
| Date/time/currency formatting | ✓/✗ | |
| Cultural considerations | | |`,
    },

    // ============================================
    // SECTION 11: DATA REQUIREMENTS
    // ============================================
    {
      id: 'data-requirements',
      title: 'Data Requirements',
      description: 'Data model, tracking, and analytics requirements',
      fieldType: 'markdown',
      required: true,
      helpText: 'Define what data you need to capture and how',
      learnContentId: 'data-tracking',
      placeholder: `# DATA REQUIREMENTS

## Data Model Changes

| Table | New/Modified | Fields | Relationships | Owner |
|-------|--------------|--------|---------------|-------|
| | New / Modified | | | |

---

## Event Tracking

| Event Name | Trigger | Properties | User Properties | Owner |
|------------|---------|------------|-----------------|-------|
| | | | | |
| | | | | |

---

## Analytics Dashboards

| Dashboard | Purpose | Audience | Update Frequency |
|-----------|---------|----------|------------------|
| | | | Daily / Weekly |

---

## Data Retention

| Question | Answer |
|----------|--------|
| How long is data retained? | |
| Deletion requirements (GDPR, CCPA) | |
| Archival strategy | |

---

## Reporting Requirements

| Report | Audience | Frequency | Format |
|--------|----------|-----------|--------|
| | | Daily / Weekly / Monthly | PDF / Dashboard / Email |`,
    },

    // ============================================
    // SECTION 12: INTEGRATIONS & DEPENDENCIES
    // ============================================
    {
      id: 'integrations-dependencies',
      title: 'Integrations & Dependencies',
      description: 'External systems, APIs, and team dependencies',
      fieldType: 'markdown',
      required: true,
      helpText: 'Map all dependencies early to avoid blockers',
      learnContentId: 'dependency-management',
      placeholder: `# INTEGRATIONS & DEPENDENCIES

## External Integrations

| System | Integration Type | API/Method | Owner | Status | Required By |
|--------|-----------------|------------|-------|--------|-------------|
| | REST / GraphQL / Webhook | | | Not Started / In Progress / Complete | |

---

## Internal Dependencies

| Team | Dependency | Required By | Status | Blockers |
|------|------------|-------------|--------|----------|
| | | | Not Started / In Progress / Complete | |

---

## Third-Party Services

| Service | Purpose | Cost | Contract | Owner |
|---------|---------|------|----------|-------|
| | | $/month | | |

---

## Technical Dependencies

| Dependency | Type | Version | Why Needed | Risk |
|------------|------|---------|------------|------|
| Library/Framework | | | | Low/Med/High |

---

## Dependency Risk Matrix

| Dependency | Likelihood of Delay | Impact | Mitigation |
|------------|---------------------|--------|------------|
| | Low/Med/High | Low/Med/High | |`,
    },

    // ============================================
    // SECTION 13: API SPECIFICATIONS
    // ============================================
    {
      id: 'api-specifications',
      title: 'API Specifications',
      description: 'API endpoints, request/response schemas',
      fieldType: 'markdown',
      required: false,
      helpText: 'Work with engineering to define these',
      learnContentId: 'api-design',
      placeholder: `# API SPECIFICATIONS

## New Endpoints

### POST /api/v1/[resource]

**Description:** [What this endpoint does]

**Request Body:**

\`\`\`json
{
  "field": "value"
}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "data": {}
}
\`\`\`

---

## Error Responses

| Code | Scenario | Message | Example |
|------|----------|---------|---------|
| 400 | Bad Request | | |
| 401 | Unauthorized | | |
| 403 | Forbidden | | |
| 404 | Not Found | | |
| 429 | Rate Limited | | |
| 500 | Server Error | | |

---

## Rate Limiting

| Limit | Value |
|-------|-------|
| Requests per minute | |
| Requests per hour | |
| Requests per day | |

---

## Versioning Strategy

| Version | Status | Deprecation Date |
|---------|--------|------------------|
| v1 | Current | |
| v2 | Planned | |`,
    },

    // ============================================
    // SECTION 14: UX/UI REQUIREMENTS
    // ============================================
    {
      id: 'ux-ui-requirements',
      title: 'UX/UI Requirements',
      description: 'Design specifications and interaction details',
      fieldType: 'markdown',
      required: true,
      helpText: 'Link to designs but also describe key interactions',
      learnContentId: 'ux-specification',
      placeholder: `# UX/UI REQUIREMENTS

## Design Links

- **Figma:** [Link]
- **Prototype:** [Link]
- **Design System Components:** [Link]

---

## Key Screens

| Screen | Purpose | User Action | Outcome |
|--------|---------|-------------|---------|
| | | | |

---

## Interaction Details

| State | Description | Behavior |
|-------|-------------|----------|
| **Empty States** | What shows when there's no data? | |
| **Loading States** | Skeleton screens? Spinners? | |
| **Error States** | How are errors communicated? | |
| **Success States** | Confirmation messages? | |
| **Transitions** | Animations between states? | |

---

## Responsive Behavior

| Breakpoint | Behavior | Notes |
|------------|----------|-------|
| Desktop (>1024px) | | |
| Tablet (768-1024px) | | |
| Mobile (<768px) | | |

---

## Microcopy

| Element | Copy | Character Limit |
|---------|------|-----------------|
| Button labels | | |
| Error messages | | |
| Tooltips | | |
| Empty state text | | |`,
    },

    // ============================================
    // SECTION 15: EDGE CASES
    // ============================================
    {
      id: 'edge-cases',
      title: 'Edge Cases & Error Handling',
      description: 'Anticipate and plan for edge cases',
      fieldType: 'markdown',
      required: true,
      helpText: 'PMs often forget this - dont be that PM',
      learnContentId: 'edge-case-thinking',
      placeholder: `# EDGE CASES & ERROR HANDLING

## User Edge Cases

| Edge Case | Likelihood | Impact | Handling |
|-----------|------------|--------|----------|
| User loses connection mid-action | | | |
| User navigates away during operation | | | |
| User tries to perform action twice | | | |
| User has insufficient permissions | | | |
| User's session expires | | | |
| User has conflicting data | | | |
| User is on slow connection | | | |
| User has accessibility needs | | | |

---

## Data Edge Cases

| Edge Case | Likelihood | Impact | Handling |
|-----------|------------|--------|----------|
| Required data is missing | | | |
| API returns unexpected format | | | |
| Duplicate entry | | | |
| Data exceeds expected size | | | |
| Race condition | | | |

---

## Business Logic Edge Cases

| Edge Case | Likelihood | Impact | Handling |
|-----------|------------|--------|----------|
| Pricing changes during checkout | | | |
| Inventory changes during order | | | |
| User qualifies for multiple discounts | | | |
| Timezone causes date issues | | | |

---

## Error Messages

| Scenario | User-Friendly Message | Technical Details |
|----------|----------------------|-------------------|
| | | |
| | | |`,
    },

    // ============================================
    // SECTION 16: ROLLOUT PLAN
    // ============================================
    {
      id: 'rollout-plan',
      title: 'Rollout & Launch Plan',
      description: 'Phased rollout strategy and launch activities',
      fieldType: 'markdown',
      required: true,
      helpText: 'Big bang launches are risky - consider phased rollouts',
      learnContentId: 'rollout-strategy',
      placeholder: `# ROLLOUT & LAUNCH PLAN

## Rollout Strategy

| Phase | User Segment | % of Traffic | Duration | Success Criteria | Go/No-Go Owner |
|-------|--------------|--------------|----------|------------------|----------------|
| Internal (dogfooding) | Employees | 100% | 1-2 weeks | No P0 bugs | |
| Alpha | Friendly customers | 5% | 2 weeks | Positive feedback | |
| Beta | Selected users | 25% | 2-4 weeks | Metrics stable | |
| Canary | All users | 50% → 100% | 1 week | No metric degradation | |
| GA | All users | 100% | - | Success metrics hit | |

---

## Feature Flags

| Flag Name | Purpose | Default | Kill Switch |
|-----------|---------|---------|-------------|
| | | On/Off | Yes/No |

---

## Launch Checklist

### Engineering
- [ ] Code complete
- [ ] Tests passing (unit, integration, e2e)
- [ ] Monitoring configured
- [ ] Alerts configured
- [ ] Runbook documented

### Product
- [ ] Design review complete
- [ ] All states reviewed (empty, loading, error, success)
- [ ] Acceptance testing complete

### QA
- [ ] Testing complete
- [ ] Regression testing complete
- [ ] Performance testing complete

### Go-to-Market
- [ ] Marketing launch materials ready
- [ ] Support training complete
- [ ] Documentation updated
- [ ] Legal/Compliance approved (if needed)
- [ ] Security review complete (if needed)

---

## Rollback Plan

| Trigger | Action | Owner | Communication |
|---------|--------|-------|---------------|
| Error rate > X% | | | |
| Latency p99 > Y ms | | | |
| Conversion drop > Z% | | | |
| P0 bug discovered | | | |`,
    },

    // ============================================
    // SECTION 17: GTM ALIGNMENT
    // ============================================
    {
      id: 'gtm-alignment',
      title: 'Go-to-Market Alignment',
      description: 'Marketing, sales, and support enablement',
      fieldType: 'markdown',
      required: true,
      helpText: 'Great features fail without proper GTM',
      learnContentId: 'gtm-basics',
      placeholder: `# GO-TO-MARKET ALIGNMENT

## Positioning

| Element | Description |
|---------|-------------|
| **Value Proposition** | One sentence on why this matters |
| **Target Audience** | Which customer segments |
| **Messaging** | Key messages for different audiences |
| **Differentiation** | How is this different from competitors? |

---

## Marketing Activities

| Activity | Channel | Owner | Due Date | Status | Budget |
|----------|---------|-------|----------|--------|--------|
| Blog post | Website | | | Not Started / In Progress / Complete | $ |
| Press release | PR | | | | $ |
| Social media campaign | Twitter/LinkedIn | | | | $ |
| Email campaign | Email | | | | $ |
| Webinar/demo | Events | | | | $ |
| Case study | Content | | | | $ |
| Paid advertising | Ads | | | | $ |

---

## Sales Enablement

| Asset | Owner | Due Date | Status |
|-------|-------|----------|--------|
| Sales deck | | | |
| Battle cards | | | |
| Demo environment | | | |
| Pricing guidance | | | |
| FAQ document | | | |
| Objection handling | | | |

---

## Customer Success Enablement

| Asset | Owner | Due Date | Status |
|-------|-------|----------|--------|
| Training session | | | |
| Help center articles | | | |
| In-app guidance | | | |
| Video tutorials | | | |
| Support FAQ | | | |

---

## Launch Timeline

| Week | Activity | Owner | Status |
|------|----------|-------|--------|
| -4 | Finalize messaging | | |
| -3 | Sales training | | |
| -2 | Support training | | |
| -1 | Press embargo briefings | | |
| 0 | Public launch | | |
| +1 | Performance review | | |`,
    },

    // ============================================
    // SECTION 18: RISK ASSESSMENT
    // ============================================
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Identify and mitigate risks',
      fieldType: 'markdown',
      required: true,
      helpText: 'Name the risks before they name you',
      learnContentId: 'risk-management',
      placeholder: `# RISK ASSESSMENT

## Technical Risks

| Risk | Likelihood | Impact | Mitigation | Owner | Status |
|------|------------|--------|------------|-------|--------|
| | Low/Med/High | Low/Med/High | | | |

---

## Business Risks

| Risk | Likelihood | Impact | Mitigation | Owner | Status |
|------|------------|--------|------------|-------|--------|
| | Low/Med/High | Low/Med/High | | | |

---

## Market Risks

| Risk | Likelihood | Impact | Mitigation | Owner | Status |
|------|------------|--------|------------|-------|--------|
| | Low/Med/High | Low/Med/High | | | |

---

## Compliance/Legal Risks

| Risk | Likelihood | Impact | Mitigation | Owner | Status |
|------|------------|--------|------------|-------|--------|
| | Low/Med/High | Low/Med/High | | | |

---

## Assumptions

| # | Assumption | How to Validate | Owner | Due Date | Status |
|---|------------|-----------------|-------|----------|--------|
| 1 | | | | | |
| 2 | | | | | |

---

## Open Questions

| # | Question | Owner | Due Date | Answer | Status |
|---|----------|-------|----------|--------|--------|
| 1 | | | | | Open / Answered |
| 2 | | | | | Open / Answered |`,
    },

    // ============================================
    // SECTION 19: TIMELINE & RESOURCING
    // ============================================
    {
      id: 'timeline-resourcing',
      title: 'Timeline & Resourcing',
      description: 'Project timeline, milestones, and team requirements',
      fieldType: 'markdown',
      required: true,
      helpText: 'Be realistic - pad estimates for the unknown',
      learnContentId: 'estimation',
      placeholder: `# TIMELINE & RESOURCING

## Key Milestones

| Milestone | Target Date | Dependencies | Owner | Status | Notes |
|-----------|-------------|--------------|-------|--------|-------|
| PRD Approved | | | | Not Started / In Progress / Complete | |
| Design Complete | | | | | |
| Engineering Complete | | | | | |
| QA Complete | | | | | |
| Beta Launch | | | | | |
| GA Launch | | | | | |

---

## Team Requirements

| Role | FTE | Duration | Notes |
|------|-----|----------|-------|
| Engineering | | engineer-weeks | |
| Design | | designer-weeks | |
| QA | | qa-weeks | |
| Data/Analytics | | | |
| Marketing | | | |

---

## Budget

| Category | Item | Cost | Notes |
|----------|------|------|-------|
| Third-party costs | | $ | |
| Infrastructure costs | | $ | |
| Marketing budget | | $ | |
| **Total** | | **$** | |

---

## Critical Path

> **What's on the critical path that could delay launch?**

| Milestone | Earliest Start | Latest Finish | Slack |
|-----------|----------------|---------------|-------|
| | | | days |

---

## Three-Point Estimates

| Task | Optimistic | Realistic | Pessimistic | Expected (PERT) |
|------|------------|-----------|-------------|-----------------|
| | | | | (O+4M+P)/6 |`,
    },

    // ============================================
    // SECTION 20: POST-LAUNCH PLAN
    // ============================================
    {
      id: 'post-launch-plan',
      title: 'Post-Launch Plan',
      description: 'What happens after launch?',
      fieldType: 'markdown',
      required: true,
      helpText: 'Launch is not the end - plan for iteration',
      learnContentId: 'post-launch',
      placeholder: `# POST-LAUNCH PLAN

## Monitoring Plan

| Dashboard | Link | Owner | Review Frequency |
|-----------|------|-------|------------------|
| | | | Real-time / Daily / Weekly |

---

## Alerts Configured

| Alert | Trigger | Channel | Owner | Response |
|-------|---------|---------|-------|----------|
| | | Slack / Email / PagerDuty | | |

---

## Success Review Timeline

| Review | Date | Attendees | Metrics Reviewed | Decision |
|--------|------|-----------|------------------|----------|
| Day 1 | | | No P0 issues | Go/No-Go |
| Week 1 | | | Initial adoption | Continue/Adjust |
| Month 1 | | | Success metrics | Hit/Miss |
| Quarter 1 | | | Long-term impact | Continue/Iterate/Kill |

---

## Iteration Backlog

| Priority | Item | Effort | Target Sprint |
|----------|------|--------|---------------|
| P0 | | | |
| P1 | | | |
| P2 | | | |

---

## Kill Criteria

> **When would we sunset this feature?**

| Criterion | Threshold | Review Date |
|-----------|-----------|-------------|
| Adoption | < X% after Y months | |
| Performance | Issues that can't be resolved | |
| Strategic | Pivot direction | |

---

## Retrospective Scheduled

| Date | Attendees | Facilitator | Notes |
|------|-----------|-------------|-------|
| | | | |

---

## Post-Launch Survey Plan

| Survey | Audience | Timing | Questions |
|--------|----------|--------|-----------|
| NPS | All users | 2 weeks post-launch | |
| Feature-specific | Feature users | 1 month post-launch | |`,
    },

    // ============================================
    // SECTION 21: APPENDICES
    // ============================================
    {
      id: 'appendices',
      title: 'Appendices',
      description: 'Additional context, research, and references',
      fieldType: 'markdown',
      required: false,
      helpText: 'Put detailed research and references here',
      learnContentId: 'documentation',
      placeholder: `# APPENDICES

## Appendix A: User Research Summary

| Participant | Role | Date | Key Insights |
|-------------|------|------|--------------|
| | | | |

---

## Appendix B: Competitive Analysis

| Competitor | Feature | Strengths | Weaknesses | Our Differentiation |
|------------|---------|-----------|------------|---------------------|
| | | | | |

---

## Appendix C: Technical Deep Dive

[Engineering RFCs, architecture diagrams]

---

## Appendix D: Data Analysis

[SQL queries, data explorations, cohort analyses]

---

## Appendix E: Related Documents

- [Link to related PRDs]
- [Link to strategy docs]
- [Link to research docs]

---

## Appendix F: Glossary

| Term | Definition |
|------|------------|
| | |`,
    },
  ],
};
