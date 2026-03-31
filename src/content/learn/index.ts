import { LearnContent } from '@/types';

export const learnContent: LearnContent[] = [
  // ============================================
  // DOCUMENT MANAGEMENT
  // ============================================
  {
    id: 'doc-versioning',
    title: 'Document Versioning Best Practices',
    section: 'Document Metadata',
    category: 'best-practice',
    readTime: 2,
    content: `## Why Version Control Matters

A PRD is a living document. Proper versioning prevents confusion and ensures everyone is working from the same source of truth.

### Key Principles

1. **Increment versions for meaningful changes** - Don't bump version for typos. Use major.minor format (1.0 → 1.1 → 2.0)

2. **Document every change** - Future you (and your team) will thank you when debugging "when did we decide this?"

3. **Keep approvers current** - If requirements change significantly, re-approve. Don't let stale approvals haunt you.

### From the Trenches

> "I once had engineering build to v1.2 while I was reviewing v1.4. Cost us 3 weeks. Now I hyper-obsess on version control."
> — Senior PM, 15 years experience

### Pro Tips

- Use Google Doc version history or Git for PRDs
- Tag versions in your project management tool
- Send changelog emails for major version bumps
- Archive old versions, don't delete them`,
  },
  {
    id: 'change-management',
    title: 'Managing Requirement Changes',
    section: 'Change Log',
    category: 'how-to',
    readTime: 3,
    content: `## The Art of Changing Your Mind

Requirements WILL change. The question is: how do you manage it without losing trust?

### When to Update the Change Log

✅ New requirements discovered during development
✅ Scope changes due to technical constraints
✅ Priority shifts from leadership
✅ User research invalidates assumptions
✅ Competitive response needed

❌ Typos and clarifications (just update)
❌ Reordering within same section

### How to Document Changes

1. **Be specific** - "Added SSO requirement" not "Updated requirements"
2. **Note the why** - "Security audit requirement" gives context
3. **List reviewers** - Who signed off on this change?
4. **Assess impact** - Does this change timeline? Scope?

### The Trust Equation

Every change erodes engineering trust slightly. Rebuild it by:
- Acknowledging the change cost
- Explaining the business reason
- Not making the same mistake twice

### Red Flags

🚩 More than 3 major changes = re-baseline the document
🚩 Changing approved requirements without discussion = trust crisis
🚩 "Just a small change" said 5 times = scope creep alert`,
  },
  {
    id: 'stakeholder-management',
    title: 'Stakeholder Approval Strategy',
    section: 'Required Approvals',
    category: 'best-practice',
    readTime: 4,
    content: `## Getting Approvals Without Losing Your Mind

### The Approval Matrix

| Stakeholder | Why They Approve | What They Care About |
|-------------|------------------|---------------------|
| Engineering Lead | Feasibility, effort | Technical risk, resourcing |
| Design Lead | UX consistency | User experience, design system |
| Security | Risk assessment | Data protection, compliance |
| Legal | Liability, terms | Regulatory exposure |
| Data/Privacy | Data handling | GDPR, CCPA, consent |

### Pro Tips from Hard Experience

1. **Get informal buy-in first** - Never surprise someone in the approval doc. Walk them through it 1:1 first.

2. **Set a deadline** - "Need approval by EOD Friday" not "whenever you get a chance"

3. **Escalate early** - If someone blocks for 3+ days without reason, loop in their manager politely

4. **Conditional approvals are okay** - "Approved pending security review" keeps things moving

### The "Silent Veto" Problem

Some stakeholders think not responding = leverage. Don't fall for it.

**Script:** *"I need your approval by [date]. If I don't hear back, I'll assume you're comfortable moving forward and will note that we didn't receive objections."*

### Industry-Specific Notes

- **FinTech/Health**: Legal and compliance approvals are NON-NEGOTIABLE. Build in 2+ weeks.
- **Enterprise SaaS**: Security review can take 4-6 weeks. Start early.
- **Consumer**: Faster cycles, but don't skip privacy review.`,
  },

  // ============================================
  // PROBLEM DEFINITION
  // ============================================
  {
    id: 'executive-communication',
    title: 'Writing for Executives',
    section: 'Executive Summary',
    category: 'how-to',
    readTime: 3,
    content: `## The 30-Second Test

Executives scan. They don't read. Your summary must work in 30 seconds.

### The BLUF Method (Bottom Line Up Front)

**Bad:** "After extensive research and analysis of market trends..."
**Good:** "This feature will reduce churn by 15% within Q2."

### The Executive Checklist

- [ ] Can they understand it in 30 seconds?
- [ ] Is the business impact clear?
- [ ] Is the ask/decision obvious?
- [ ] Are numbers specific (not "improve metrics")?
- [ ] Is the timeline clear?

### Template That Works

> "[Product/Feature] enables [who] to [do what] resulting in [business outcome]. We expect [metric] to improve by [X%] by [date]. This requires [investment] and aligns with [company priority]."

### What Executives Actually Care About

1. **Revenue impact** - Will this make/saves money?
2. **Risk** - What could go wrong?
3. **Resource ask** - What do I need to approve?
4. **Strategic fit** - Does this align with company goals?
5. **Competitive context** - Are we behind?

### From "Inspired" by Marty Cagan

> "The best product leaders communicate in terms of outcomes, not outputs. They don't say 'we shipped X features.' They say 'we moved metric Y by Z%.'"`,
  },
  {
    id: 'problem-definition',
    title: 'Defining the Problem Right',
    section: 'Problem Statement',
    category: 'concept',
    readTime: 4,
    content: `## The Most Important Section

A vague problem = vague solution. Invest time here.

### The Problem Statement Formula

**Who** experiences **what problem** with **what frequency** resulting in **what impact**.

### Example Progression

❌ **Vague:** "Users find onboarding difficult"
✅ **Specific:** "New SMB customers take 14 days average to activate, with 40% dropping off before completing setup. This costs us ~$2M annually in lost ARR."

### Evidence Hierarchy

From strongest to weakest:
1. **Quantitative data** - Usage analytics, A/B tests
2. **User research** - Interviews, usability tests
3. **Support tickets** - Categorized, quantified
4. **Sales feedback** - Pattern across deals
5. **Anecdotal** - "I heard from a user..."

### The "Five Whys" Technique

Keep asking "why" to get to root cause:

1. Why are users dropping off? → They don't understand the setup
2. Why don't they understand? → Too many technical terms
3. Why technical terms? → We built for power users
4. Why power users? → We assumed SMB = sophisticated
5. Why that assumption? → **We never validated our persona** ← Root cause

### Cost of Inaction

If you can't articulate what happens if you DON'T solve this, why are you building it?

**Good:** "Every month we delay, we lose $500K in ARR from churn"
**Bad:** "Users will be unhappy"`,
  },
  {
    id: 'persona-definition',
    title: 'Creating Actionable Personas',
    section: 'Target User Personas',
    category: 'how-to',
    readTime: 3,
    content: `## Beyond Demographics

Personas aren't "Sarah, 34, marketing manager." They're about behavior and context.

### What Actually Matters

| Useful | Not Useful |
|--------|------------|
| Technical proficiency | Age |
| Goals and motivations | Gender |
| Current workarounds | Income (usually) |
| Decision-making context | Photo from stock images |
| Pain points with status quo | Fun names like "Marketing Mary" |

### The Minimum Viable Persona

1. **Role/Context:** "IT admin at 500-person company"
2. **Goal:** "Needs to deploy software to 200 employees"
3. **Constraint:** "Has 2 hours per week for this project"
4. **Frustration:** "Current tool requires manual CSV uploads"

### Primary vs. Secondary

- **Primary:** If they're not happy, the feature fails
- **Secondary:** Nice if they're happy, but not critical

### Explicitly Out of Scope

This is CRITICAL. Every feature disappoints someone. Be intentional.

> "This dashboard is built for analysts, not executives. Execs get summary reports elsewhere."

### From "The Mom Test" by Rob Fitzpatrick

> "You're not allowed to ask if they like your idea. You're only allowed to ask about their life."

Apply this to personas: Don't ask what they want. Observe what they do.`,
  },

  // ============================================
  // FRAMEWORKS
  // ============================================
  {
    id: 'jtbd-framework',
    title: 'Jobs To Be Done Framework',
    section: 'Jobs To Be Done',
    category: 'concept',
    readTime: 5,
    content: `## What is JTBD?

People don't buy products. They "hire" them to do a job.

### The Job Statement Formula

> "When **[situation]**, I want to **[motivation]**, so I can **[expected outcome]**"

### Real Examples

**McDonald's Milkshake Study** (Clayton Christensen):
- Job: "When I have a long commute, I want something filling that lasts, so I don't get hungry before lunch"
- Competitors: Not other milkshakes. Bananas, bagels, protein bars.

**Slack:**
- Job: "When my team is distributed, I want to stay in sync without meetings, so I can focus on deep work"
- Competitors: Not chat apps. Email, phone calls, status meetings.

### Types of Jobs

1. **Functional:** The practical task
2. **Emotional:** How they want to feel
3. **Social:** How they want to be perceived

### Example: Project Management Tool

- **Functional:** "Track project progress"
- **Emotional:** "Feel in control"
- **Social:** "Look competent to my boss"

### Common Mistakes

❌ Making the job about your product
❌ Too specific (one solution) or too vague (meaningless)
❌ Confusing the job with a feature

### From "Competing Against Luck" by Clayton Christensen

> "The job is not the customer. The customer is the person who hires the product to do the job."

### How to Use This in Your PRD

1. Write the job statement
2. List current "hires" (competitors + workarounds)
3. Identify where current solutions fall short
4. Design your solution to do the job better`,
  },
  {
    id: 'success-metrics',
    title: 'Defining Success Metrics',
    section: 'Success Metrics',
    category: 'how-to',
    readTime: 4,
    content: `## Metrics That Matter

### Lagging vs. Leading Indicators

**Lagging:** Revenue, churn (tell you what happened)
**Leading:** Feature adoption, activation rate (predict what will happen)

You need both.

### The HEART Framework (Google)

| Metric | What It Measures | Example |
|--------|-----------------|---------|
| **H**appiness | NPS, CSAT, sentiment | "How satisfied are users?" |
| **E**ngagement | Frequency, depth | "Sessions per week" |
| **A**doption | New users, feature uptake | "% who complete onboarding" |
| **R**etention | Churn, repeat usage | "D30 retention" |
| **T**ask Success | Completion, errors | "% who finish checkout" |

### Guardrail Metrics

These ensure you don't "win" while breaking something.

- Performance (page load time)
- Support ticket volume
- Other feature usage (cannibalization?)
- Cost per user

### Baseline Before You Build

You can't measure improvement without a baseline.

**Before:** "We want to improve activation"
**After:** "Activation is currently 45%. Target: 65%."

### Attribution Windows

Define when you'll measure:
- **Immediate:** Day 1-7 (did it launch okay?)
- **Short-term:** Week 2-4 (initial adoption)
- **Long-term:** Month 2-3 (sustained impact)

### From "Measure What Matters" by John Doerr

> "Ideas are easy. Execution is everything. Metrics tell you if you executed."`,
  },

  // ============================================
  // REQUIREMENTS
  // ============================================
  {
    id: 'user-stories',
    title: 'Writing User Stories That Work',
    section: 'User Stories',
    category: 'how-to',
    readTime: 4,
    content: `## The Anatomy of a Good User Story

**Format:** As a [user], I want to [action], so that [benefit]

### The INVEST Criteria

- **I**ndependent - Can be built separately
- **N**egotiable - Details can be discussed
- **V**aluable - Delivers user/business value
- **E**stimable - Team can size it
- **S**mall - Fits in a sprint
- **T**estable - Has clear acceptance criteria

### Good vs. Bad Examples

❌ "As a user, I want a login button, so that I can log in"
✅ "As a returning customer, I want to quickly access my account, so I can resume my order"

❌ "As an admin, I want a report, so I can see data"
✅ "As a compliance officer, I want to export all user actions in the last 90 days, so I can prepare for SOC 2 audit"

### Acceptance Criteria Format

Use Given/When/Then:

    Given [context]
    When [action]
    Then [expected result]

### Example with Edge Cases

**Story:** As a shopper, I want to apply a discount code, so I can save money

**Acceptance Criteria:**
- Given I have items in cart, when I enter a valid code, then discount is applied
- Given I enter an expired code, when I click apply, then I see "This code has expired"
- Given my cart is $50, when I enter a "$100 minimum" code, then I see "Add $50 more to use this code"
- Given I already have a discount, when I add another code, then I'm told only one code allowed

### Pro Tips

1. Write stories with engineers, not for them
2. If a story is too big, split by workflow step
3. The "so that" is the most important part - don't skip it
4. Acceptance criteria = test cases. Write them together.`,
  },
  {
    id: 'requirements-writing',
    title: 'Functional Requirements That Don\'t Suck',
    section: 'Functional Requirements',
    category: 'how-to',
    readTime: 4,
    content: `## MoSCoW Prioritization

### Must Have (P0)
- Non-negotiable for launch
- Product doesn't work without it
- Legal/compliance requirements

### Should Have (P1)
- Important but not blocking
- Workaround exists but is painful
- Expected by users

### Could Have (P2)
- Nice to have
- Low impact on core experience
- Can wait 1-2 sprints

### Won't Have (P3)
- Explicitly out of scope
- Prevents scope creep
- May become future P2

### Writing Clear Requirements

❌ **Vague:** "The system should be fast"
✅ **Clear:** "Search results load in <2 seconds for 95% of queries"

❌ **Vague:** "Users can upload files"
✅ **Clear:** "Users can upload files up to 50MB in .pdf, .docx, or .xlsx format"

### The Requirement Triad

Every requirement should have:
1. **What** - The functionality
2. **Why** - The user/business value
3. **How we'll know** - Acceptance criteria

### Traceability

Link requirements back to user stories:
- FR-001 → Story-1, Story-3
- FR-002 → Story-2

This helps when requirements change - you know what's affected.

### Common Mistakes

🚩 Requirements that describe UI instead of function
🚩 Mixing multiple requirements in one
🚩 No priority assigned
🚩 "TBD" or "TBD later" as answers`,
  },
  {
    id: 'non-functional-requirements',
    title: 'Non-Functional Requirements',
    section: 'NFRs',
    category: 'checklist',
    readTime: 5,
    content: `## The Forgotten Requirements

Functional = what it does. Non-functional = how it performs.

### Performance

| Metric | Typical Target |
|--------|---------------|
| Page Load | <3 seconds |
| API p50 | <200ms |
| API p95 | <500ms |
| API p99 | <1000ms |
| Time to Interactive | <5 seconds |

### Security Checklist

- [ ] Authentication required?
- [ ] Role-based access control?
- [ ] Data encrypted at rest?
- [ ] Data encrypted in transit (HTTPS)?
- [ ] Audit logging for sensitive actions?
- [ ] Rate limiting on APIs?
- [ ] Input validation (XSS, SQL injection)?
- [ ] Secrets management?

### Accessibility (WCAG 2.1)

- [ ] Keyboard navigation works?
- [ ] Screen reader compatible?
- [ ] Color contrast meets AA (4.5:1)?
- [ ] Focus indicators visible?
- [ ] Alt text on images?
- [ ] Form labels present?

### Scalability Questions

1. What's the expected QPS (queries per second)?
2. What's peak vs. average load?
3. What happens at 10x load?
4. Is there a circuit breaker?
5. What's the database growth rate?

### Reliability Targets

- **Uptime:** 99.9% = ~9 hours downtime/year
- **RTO:** How fast must we recover?
- **RPO:** How much data loss is acceptable?

### Industry-Specific Notes

- **Health:** 99.99%+ uptime for critical systems
- **FinTech:** Data integrity > availability
- **E-commerce:** Black Friday load testing required
- **AI/ML:** Inference latency budgets critical`,
  },

  // ============================================
  // EDGE CASES
  // ============================================
  {
    id: 'edge-case-thinking',
    title: 'Thinking Through Edge Cases',
    section: 'Edge Cases',
    category: 'checklist',
    readTime: 4,
    content: `## The Edge Case Checklist

### User Behavior Edge Cases

- [ ] User clicks button twice rapidly
- [ ] User navigates away mid-action
- [ ] User loses internet connection
- [ ] User's session expires
- [ ] User has browser back button open
- [ ] User has multiple tabs open
- [ ] User is on slow/poor connection
- [ ] User has JavaScript disabled
- [ ] User has ad blocker enabled
- [ ] User is on mobile with spotty signal

### Data Edge Cases

- [ ] Required field is empty
- [ ] Data exceeds max length
- [ ] Special characters in input
- [ ] Unicode/emoji in text fields
- [ ] SQL injection attempt
- [ ] Duplicate submission
- [ ] Conflicting data state
- [ ] Data from deleted user
- [ ] Timezone mismatches
- [ ] Leap year / DST issues

### Permission Edge Cases

- [ ] User loses permission mid-workflow
- [ ] User has partial permissions
- [ ] Admin demotes user while active
- [ ] Shared account conflicts

### Business Logic Edge Cases

- [ ] Pricing changes during checkout
- [ ] Inventory sells out during order
- [ ] User qualifies for multiple discounts
- [ ] Refund after subscription cancelled
- [ ] Trial expires during use

### The "What If" Game

Gather your team and ask:
1. "What if this API returns 500?"
2. "What if the user is in China (Great Firewall)?"
3. "What if this runs at 100x expected load?"
4. "What if someone tries to abuse this?"

### From Experience

> "I once forgot to consider what happens when a user's credit card expires during a trial. Cost us 2 weeks of angry customers. Now I have a 'payment edge cases' checklist."`,
  },

  // ============================================
  // ROLLOUT & LAUNCH
  // ============================================
  {
    id: 'rollout-strategy',
    title: 'Phased Rollout Strategy',
    section: 'Rollout Plan',
    category: 'how-to',
    readTime: 4,
    content: `## Why Phased Rollouts?

Big bang launches = big bang failures.

### The Phased Approach

    Internal → Alpha → Beta → Canary → GA

### Internal (Dogfooding)
- **Who:** Your company
- **Goal:** Catch obvious bugs
- **Duration:** 1-2 weeks
- **Success:** No P0 bugs found

### Alpha
- **Who:** 5-10 friendly customers
- **Goal:** Real-world usage feedback
- **Duration:** 2-4 weeks
- **Success:** Users can complete core tasks

### Beta
- **Who:** 50-100 users or 5-10% of traffic
- **Goal:** Scale testing, performance
- **Duration:** 2-4 weeks
- **Success:** Metrics stable, no P1 bugs

### Canary
- **Who:** 1-5% of all traffic
- **Goal:** Final safety check
- **Duration:** 1 week
- **Success:** No metric degradation

### GA (General Availability)
- **Who:** Everyone
- **Goal:** Full launch
- **Duration:** Ongoing
- **Success:** Success metrics achieved

### Feature Flags Are Your Friend

- Deploy code anytime, toggle visibility separately
- Kill switch for instant rollback
- A/B testing capability
- Gradual rollout control

### Rollback Triggers

Define BEFORE launch:
- Error rate > X%
- Latency p99 > Y ms
- Conversion drop > Z%
- P0 bug discovered

### Communication Plan

| Phase | Who Gets Notified | How |
|-------|-------------------|-----|
| Internal | Engineering, Product | Slack |
| Alpha | Beta participants | Email |
| Beta | Support, Sales | Slack + doc |
| Canary | Leadership | Email summary |
| GA | All stakeholders | Company-wide |`,
  },
  {
    id: 'gtm-basics',
    title: 'Go-to-Market Basics for PMs',
    section: 'GTM Alignment',
    category: 'concept',
    readTime: 4,
    content: `## Why PMs Need to Care About GTM

Great product + no distribution = failure.

### The PM's GTM Responsibilities

1. **Positioning** - Why this matters
2. **Messaging** - How to talk about it
3. **Enablement** - Equipping customer-facing teams

### Positioning Formula

> "For [target customer] who [need/opportunity], [product] is [category] that [key benefit]. Unlike [alternative], we [differentiation]."

### Messaging Hierarchy

1. **Primary message** - One sentence
2. **Supporting points** - 3 key benefits
3. **Proof points** - Data, testimonials

### Sales Enablement Checklist

- [ ] One-pager on value prop
- [ ] Competitive battle cards
- [ ] Demo script/environment
- [ ] Pricing and packaging
- [ ] Objection handling FAQ
- [ ] Customer personas refresher

### Marketing Enablement Checklist

- [ ] Launch announcement draft
- [ ] Blog post with use cases
- [ ] Social media assets
- [ ] Email copy for campaigns
- [ ] Landing page requirements

### Support Enablement Checklist

- [ ] How-to documentation
- [ ] Troubleshooting guide
- [ ] Known issues list
- [ ] Escalation path
- [ ] Training session recording

### Launch Timeline

| Week | Activity |
|------|----------|
| -4 | Finalize messaging |
| -3 | Sales training |
| -2 | Support training |
| -1 | Press embargo briefings |
| 0 | Public launch |
| +1 | Performance review |`,
  },

  // ============================================
  // RISK & ESTIMATION
  // ============================================
  {
    id: 'risk-management',
    title: 'Risk Management for PMs',
    section: 'Risk Assessment',
    category: 'concept',
    readTime: 4,
    content: `## Risk = Uncertainty × Impact

### Risk Categories

**Technical:**
- New technology we haven't used
- Integration with unreliable third party
- Performance at scale unknowns

**Business:**
- Cannibalizing existing revenue
- Dependence on one customer segment
- Competitive response

**Market:**
- Timing (too early? too late?)
- Customer adoption slower than expected
- Regulatory changes

**Operational:**
- Key person dependency
- Vendor lock-in
- Support burden underestimated

### Risk Matrix

| Likelihood | Impact | Action |
|------------|--------|--------|
| High | High | Avoid or mitigate immediately |
| High | Low | Mitigate (reduce likelihood) |
| Low | High | Contingency plan |
| Low | Low | Accept and monitor |

### Mitigation Strategies

1. **Avoid** - Don't do the risky thing
2. **Mitigate** - Reduce likelihood or impact
3. **Transfer** - Insurance, contracts
4. **Accept** - Document and monitor

### The Pre-Mortem Exercise

Before launch, imagine it's 6 months later and the project FAILED.

Ask: "What went wrong?"

This surfaces risks you're too optimistic to see otherwise.

### Assumptions Log

Every assumption is a risk. List them:

1. "Customers will pay $X" → Validate with LOIs
2. "We can integrate in 2 weeks" → Spike first
3. "Legal will approve" → Engage early

### Red Flags

🚩 "We'll figure it out"
🚩 "That's an engineering problem"
🚩 "No one has ever failed at this before" (or has everyone failed silently?)`,
  },
  {
    id: 'estimation',
    title: 'Estimation and Timeline Planning',
    section: 'Timeline',
    category: 'how-to',
    readTime: 4,
    content: `## Estimation Reality Check

### Why Estimates Are Wrong

1. **Optimism bias** - Everything goes perfectly (never true)
2. **Unknown unknowns** - We don't know what we don't know
3. **Scope creep** - "Just one more small thing"
4. **Context switching** - Team is on 3 other projects
5. **Dependencies** - Waiting on other teams

### The Three-Point Estimate

For each task, estimate:
- **Optimistic (O):** Everything goes perfectly
- **Realistic (M):** Normal conditions
- **Pessimistic (P):** Everything goes wrong

**Expected = (O + 4M + P) / 6**

This is the PERT formula. It's more realistic than single-point estimates.

### Buffer Guidelines

| Project Size | Buffer |
|--------------|--------|
| < 2 weeks | 20% |
| 2-8 weeks | 30% |
| 2-4 months | 40% |
| 4+ months | 50%+ (consider breaking down) |

### Critical Path Method

1. List all tasks
2. Identify dependencies
3. Find the longest path (critical path)
4. Any delay on critical path = project delay

### Communicating Timelines

**Bad:** "We'll launch March 15"
**Better:** "Targeting March 15, with 80% confidence"
**Best:** "Targeting March 15. Key risks: [X, Y]. If [risk] materializes, slips to March 30."

### The Hofstadter Rule

> "It always takes longer than you expect, even when you take into account Hofstadter's Law."

### Pro Tips

1. Pad YOUR timeline, don't pad ENGINEERING estimates
2. Track estimate vs. actual to improve
3. Break big tasks into <1 week pieces
4. Account for holidays, team events
5. Never commit to a date you got from an estimate without buffer`,
  },

  // ============================================
  // POST-LAUNCH
  // ============================================
  {
    id: 'post-launch',
    title: 'Post-Launch: The Real Work Begins',
    section: 'Post-Launch Plan',
    category: 'how-to',
    readTime: 4,
    content: `## Launch Is Not the End

It's the beginning of learning.

### Week 1: Triage Mode

**Daily check:**
- Error rates
- Support tickets
- User feedback (social, reviews, direct)
- Key metrics (any major drops?)

**Be ready to:**
- Hotfix bugs same-day
- Update documentation
- Respond to feedback publicly

### Month 1: Pattern Recognition

**Analyze:**
- Adoption curve (who's using it?)
- Feature usage (which parts?)
- Support themes (what's confusing?)
- Performance trends (any degradation?)

**Decide:**
- What to double down on
- What to fix
- What to kill

### Quarter 1: Success Review

**Formal review against PRD goals:**

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| [Metric 1] | | | ✅/❌ |
| [Metric 2] | | | ✅/❌ |

**If you hit goals:** Celebrate, document, share learnings
**If you missed:** Understand why, decide: pivot or persevere?

### The Retrospective

Gather the team and ask:
1. What went well?
2. What didn't go well?
3. What should we do differently next time?

**Document and share** - Don't let learnings die.

### Kill Criteria

Decide upfront when you'll sunset:
- Adoption < 10% after 6 months?
- Performance issues that can't be fixed?
- Strategic direction changed?

**Sunk cost fallacy** kills more features than failure.

### From "Escaping the Build Trap" by Melissa Perri

> "The value is not in the output. The value is in the outcome."`,
  },
];

export const getLearnContentById = (id: string): LearnContent | undefined => {
  return learnContent.find((content) => content.id === id);
};

export const getLearnContentBySection = (section: string): LearnContent[] => {
  return learnContent.filter((content) =>
    content.section.toLowerCase().includes(section.toLowerCase())
  );
};
