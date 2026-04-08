# PM Simulator Best Practices

## Writing Effective Product Briefs

The quality of your simulation results depends heavily on the product brief. Here are proven techniques for getting actionable insights.

### The Brief Formula

A strong brief answers:
1. **What**: Product name + one-sentence description
2. **Who**: 2-3 specific target user segments
3. **Problem**: The pain point you're solving (not the solution)
4. **Differentiation**: What makes you 10x better than alternatives

### Examples: Weak vs Strong

**Weak Brief:**
> "A project management tool that helps teams be more productive with AI features."

*Why it fails:* Too vague, no specific user, "AI features" is meaningless

**Strong Brief:**
> "Tasque (task management for remote async teams). Target: Engineering managers at 50-200 person startups who currently use a mix of Slack, Notion, and standups but struggle with visibility. Problem: No one knows what others are working on without constant status meetings. Differentiation: AI automatically generates weekly async updates by analyzing work patterns and Git commits."

*Why it works:* Specific persona, clear problem, concrete differentiation

### Industry-Specific Tips

#### SaaS Products
- Include pricing model (per seat, usage-based, freemium)
- Mention integration ecosystem (Slack, Salesforce, etc.)
- Define activation metrics (what's an "active" user?)

#### FinTech
- Specify regulatory context (B2B vs consumer, geography)
- Include trust/safety features in brief
- Mention compliance requirements (SOC2, PCI-DSS)

#### Health/MedTech
- Define HIPAA/regulatory requirements
- Specify clinical validation level needed
- Include workflow integration details

#### E-commerce
- Mention SKU count and category complexity
- Include logistics/fulfillment approach
- Define customer acquisition channels

#### AI/ML
- Clarify model training approach (proprietary, fine-tuned, API)
- Include accuracy/performance requirements
- Specify inference cost targets

## Building Accurate Personas

### The 5-Persona Limit

You're limited to 5 personas per simulation. Use them strategically:

1. **Primary User** (40% of focus): Your ideal customer profile
2. **Budget Authority** (30% of focus): Who approves the purchase
3. **Skeptic** (15% of focus): Vocal critic who might block adoption
4. **Power User** (10% of focus): Advanced user with complex needs
5. **Edge Case** (5% of focus): Unexpected use case

### Pain Level Calibration

| Score | Meaning | Example |
|-------|---------|---------|
| 1 | Nice-to-have | "Would be cool if..." |
| 2 | Minor annoyance | Workaround exists but clunky |
| 3 | Significant friction | Regular complaints, actively searching |
| 4 | Critical blocker | Work stopped, escalating to management |
| 5 | Existential crisis | Company/role at risk without solution |

### Tech Savviness Calibration

| Score | Profile | Adoption Pattern |
|-------|---------|------------------|
| 1 | Digital avoider | Needs training, prefers phone calls |
| 2 | Reluctant user | Uses technology when forced |
| 3 | Average adopter | Comfortable with common tools |
| 4 | Early adopter | Seeks new tools, provides feedback |
| 5 | Power user | Builds integrations, writes scripts |

### Purchase Urgency Calibration

| Score | Timeline | Budget Status |
|-------|----------|---------------|
| 1 | 12+ months | No budget allocated |
| 2 | 6-12 months | Considering options |
| 3 | 3-6 months | Budget approved, evaluating vendors |
| 4 | 1-3 months | Shortlist created, pilot planned |
| 5 | Immediate | Emergency purchase, budget available |

## Interpreting Simulation Results

### Understanding Metrics

#### Conversion Rate (Free → Paid)

| Rate | Interpretation | Action |
|------|---------------|--------|
| <1% | Poor product-market fit | Revisit core value proposition |
| 1-3% | Needs optimization | Focus on onboarding and activation |
| 3-5% | Healthy | Scale marketing efforts |
| 5-10% | Strong | Aggressive growth investment |
| >10% | Exceptional | May indicate niche too small |

#### Net Promoter Score (NPS)

| Score | Meaning | Benchmark |
|-------|---------|-----------|
| <0 | Detractors dominate | Major issues to address |
| 0-30 | Passive majority | Needs delight improvements |
| 30-50 | Good | Above average for SaaS |
| 50-70 | Excellent | Top quartile |
| 70+ | World-class | Rare, cult-like following |

Industry benchmarks:
- B2B SaaS average: 31
- Consumer apps average: 23
- FinTech average: 35
- Healthcare average: 28

#### Churn Rate (Monthly)

| Rate | Health | Stage Appropriate? |
|------|--------|-------------------|
| <2% | Excellent | Any stage |
| 2-5% | Good | Post-PMF |
| 5-10% | Concerning | Early stage only |
| >10% | Critical | Needs immediate attention |

#### Satisfaction Score (CSAT)

| Score | Meaning |
|-------|---------|
| <3.5 | Users tolerate you (switching barrier) |
| 3.5-4.0 | Neutral to satisfied |
| 4.0-4.5 | Satisfied, some advocates |
| 4.5-5.0 | Delighted, strong word-of-mouth |

### Reading Agent Timelines

The simulation tracks 1000 agents through these states:

1. **Unaware → Aware**: Marketing effectiveness
2. **Aware → Signed Up**: Landing page + offer appeal
3. **Signed Up → Active**: Onboarding quality
4. **Active → Engaged**: Core value delivery
5. **Engaged → Advocate** or **Churned**: Long-term stickiness

**What to look for:**

- **Drop-off at Unaware→Aware**: Weak marketing/positioning
- **Drop-off at Aware→Signed Up**: Landing page issues or wrong audience
- **Drop-off at Signed Up→Active**: Poor onboarding, too complex
- **Drop-off at Active→Engaged**: Core product not delivering value
- **High Churn from Engaged**: Missing features, bugs, or better alternatives

## Iterative Simulation Strategy

### The 3-Simulation Workflow

**Simulation 1: Baseline**
- Write initial brief
- Run rule-based mode
- Review results and identify gaps

**Simulation 2: Refined**
- Update brief based on insights
- Add specific personas
- Re-run rule-based mode

**Simulation 3: Deep Dive**
- Brief is now validated
- Run LLM mode for qualitative insights
- Export comprehensive report

### A/B Testing Briefs

Compare positioning by changing one variable:

```
Simulation A: "AI-powered email assistant"
Simulation B: "Inbox zero in 10 minutes daily"

Keep constant:
- Same features
- Same target audience
- Same pricing

Compare:
- Conversion rates
- NPS scores
- Agent sentiment in LLM mode
```

## Using Hints Effectively

### Framework Application

The structured fields map to classic PM frameworks:

| Field | Framework | Key Question |
|-------|-----------|--------------|
| **What** | Value Proposition | What concrete capability do you deliver? |
| **Who** | Target Customer | Who has the urgent, frequent, expensive problem? |
| **Why** | Problem Statement | What job are they hiring you to do? |
| **Impact** | Success Metrics | How will you know you've succeeded? |
| **When** | Go-to-Market | What's your launch sequence? |

### Hint Sources

**"Inspired" by Marty Cagan:**
- Product team organization
- Discovery vs delivery
- Opportunity assessment

**"The Lean Startup" by Eric Ries:**
- MVP definition
- Build-measure-learn loops
- Pivot vs persevere decisions

**"The Mom Test" by Rob Fitzpatrick:**
- Customer interview techniques
- Avoiding false positives
- Finding real pain

### When to Apply Hints

1. **Before running simulation**: Strengthen your brief
2. **During persona creation**: Ensure realistic profiles
3. **After results review**: Identify improvement areas
4. **Before stakeholder presentation**: Frame insights

## Export Best Practices

### Choosing Export Format

| Format | Best For | Avoid When |
|--------|----------|------------|
| **PDF** | Executive summary, board decks | Need to edit content |
| **Docx** | Detailed analysis, collaborative editing | Sharing externally |
| **Notion** | Team wiki, living documents | External stakeholders |
| **Google Docs** | Collaboration, comments | Formal presentations |

### What to Include

**Executive Summary:**
- Key metrics (conversion, NPS, churn)
- Top 3 insights
- Recommended next steps

**Full Report:**
- Complete metrics breakdown
- Agent timeline analysis
- All personas with rationale
- Framework sections
- Change log showing iteration
- Raw data export (CSV)

### Presentation Tips

1. **Start with the user**: Show personas before results
2. **Tell the story**: Walk through agent timeline
3. **Be honest**: Include negative insights and risks
4. **Show iteration**: Change log demonstrates rigor
5. **End with action**: Specific recommendations

## Common Pitfalls

### Brief Mistakes

1. **Feature lists** → Focus on problems solved
2. **Jargon** → Use customer's language
3. **Everything to everyone** → Narrow target
4. **Solution-first** → Problem-first narrative

### Persona Mistakes

1. **Demographics without behavior** → Include attitudes, goals
2. **All high scores** → Include skeptics and low-urgency
3. **Fictional perfect users** → Based on real research
4. **Too many personas** → Max 5, ideally 3-4

### Interpretation Mistakes

1. **Chasing perfect NPS** → 40+ is excellent for most
2. **Ignoring churn** → 5% monthly = 46% annual
3. **Not segmenting** → Different personas have different metrics
4. **One simulation** → Iterate based on insights

## Advanced Techniques

### Stress Testing

Test edge cases:
- **Price increase simulation**: Double your price, see impact
- **Feature removal**: Remove key feature, measure churn
- **Competitor entry**: Simulate well-funded competitor

### Sensitivity Analysis

Find which variables matter most:
1. Vary pain_level by ±1 for primary persona
2. Re-run simulation
3. Measure impact on conversion
4. Focus on high-impact variables

### Cohort Analysis

Track different agent cohorts:
- Early adopters vs late majority
- High-budget vs low-budget
- Technical vs non-technical

Compare how each cohort progresses through the timeline.

## Resources

### Books
- "Inspired" by Marty Cagan
- "The Lean Startup" by Eric Ries
- "The Mom Test" by Rob Fitzpatrick
- "Crossing the Chasm" by Geoffrey Moore
- "Hooked" by Nir Eyal

### Templates
- [Brief Template](templates/brief-template.md)
- [Persona Worksheet](templates/persona-worksheet.md)
- [Results Review Checklist](templates/results-checklist.md)

### Community
- [Product Management Slack](https://productmanagerhq.com)
- [Indie Hackers](https://indiehackers.com)
- [r/ProductManagement](https://reddit.com/r/productmanagement)
