import { Template } from '@/types';

export const prdEcommerceTemplate: Template = {
  id: 'prd-ecommerce-feature-launch',
  name: 'E-commerce Feature Launch PRD (Comprehensive)',
  description: 'Complete product requirements document for e-commerce features with conversion optimization, merchandising, and operational excellence',
  industryId: 'ecommerce',
  scenarioId: 'feature-launch',
  frameworkIds: ['rice', 'jtbd', 'okrs'],
  outputFormat: 'markdown',
  estimatedCompletionTime: '3-4 hours',
  version: '1.0.0',
  sections: [
    {
      id: 'document-meta',
      title: 'Document Metadata',
      description: 'Track document ownership, version control, and launch approvals',
      fieldType: 'table',
      required: true,
      helpText: 'Include merchandising, operations, and customer service stakeholders',
      learnContentId: 'doc-versioning',
      tableSchema: {
        columns: ['Field', 'Value'],
        rows: [
          ['Document Owner', ''],
          ['Product Lead', ''],
          ['Engineering Lead', ''],
          ['Design Lead', ''],
          ['Merchandising Lead', ''],
          ['Operations Lead', ''],
          ['Customer Service Lead', ''],
          ['Status', 'Draft / In Review / Approved / Launched'],
          ['Last Updated', ''],
          ['Version', '1.0'],
          ['Target Launch Date', ''],
          ['Blackout Dates', 'Holiday/peak periods to avoid'],
        ]
      }
    },
    {
      id: 'change-log',
      title: 'Change Log',
      description: 'Track all significant changes to this document for stakeholder alignment',
      fieldType: 'table',
      required: true,
      helpText: 'Critical for coordinating across merchandising, marketing, and operations',
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
      description: 'All stakeholders who must approve before launch',
      fieldType: 'table',
      required: true,
      helpText: 'Include merchandising and operations - they own the customer experience',
      learnContentId: 'stakeholder-management',
      tableSchema: {
        columns: ['Role', 'Name', 'Department', 'Status', 'Date Approved', 'Comments'],
        rows: [
          ['Product', '', '', 'Pending', '', ''],
          ['Engineering', '', '', 'Pending', '', ''],
          ['Design', '', '', 'Pending', '', ''],
          ['Merchandising', '', '', 'Pending', '', ''],
          ['Operations', '', '', 'Pending', '', ''],
          ['Marketing', '', '', 'Pending', '', ''],
          ['Customer Service', '', '', 'Pending', '', ''],
        ]
      }
    },
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      description: 'BLUF (Bottom Line Up Front) - One-paragraph overview with commerce context',
      fieldType: 'markdown',
      required: true,
      helpText: `**Include:**
- What we're building and the shopping friction it removes
- Target customer segment and market opportunity
- Expected impact on GMV, conversion, and AOV
- Key success metrics
- Major risks and mitigations
- Launch timeline and peak period considerations

**TL;DR:** [1-2 sentence summary]

**30-Second Read:**
- Shopping Problem: [What customer friction]
- Solution: [What we're building]
- Business Impact: [GMV, conversion, AOV impact]
- Launch Window: [Target date, blackout considerations]
- Ask: [What approval/resources needed]`,
      learnContentId: 'executive-communication',
    },
    {
      id: 'commerce-opportunity',
      title: 'Commerce Opportunity',
      description: 'What shopping friction are we removing? Tie to conversion and revenue impact.',
      fieldType: 'markdown',
      required: true,
      helpText: `**Problem Definition:**
Describe the specific shopping experience problem:
- Current customer journey and drop-off points
- Cart abandonment rate (if applicable)
- Impact on conversion and GMV
- Competitive disadvantage (if competitors have better experience)
- Seasonal considerations (peak shopping periods)

**Funnel Analysis:**
| Funnel Stage | Current Rate | Industry Benchmark | Gap | Opportunity |
|--------------|--------------|-------------------|-----|-------------|
| Product Page View | - | - | - | - |
| Add to Cart | - | - | - | - |
| Checkout Start | - | - | - | - |
| Checkout Complete | - | - | - | - |

**Revenue Impact:**
- Monthly GMV at risk: $[X]
- Conversion rate impact: [X] percentage points
- AOV impact: $[X] increase/decrease
- Customer lifetime value impact: $[X]

**Cost of Inaction:**
- Monthly revenue loss: $[X]
- Customers lost to competitors: [X]%
- Peak season risk: [Description]
- SEO/traffic impact: [Description]`,
      learnContentId: 'problem-definition',
    },
    {
      id: 'shopper-personas',
      title: 'Shopper Segments & Personas',
      description: 'Target customer segments with purchase behavior and preferences',
      fieldType: 'table',
      required: true,
      helpText: 'Consider purchase behavior, loyalty status, and channel preferences',
      learnContentId: 'persona-definition',
      tableSchema: {
        columns: ['Persona Name', 'Segment', 'Annual Spend', 'Purchase Frequency', 'AOV', 'Channel Preference', 'Loyalty Status', 'Priority'],
        rows: [
          ['Bargain Hunter', 'Price-sensitive', '$200-500', '2-4/year', '$50-100', 'Mobile, deals', 'Standard', 'P1'],
          ['Convenience Shopper', 'Time-poor', '$500-1000', '6-12/year', '$75-150', 'Mobile app', 'VIP', 'P0'],
          ['Brand Loyalist', 'High engagement', '$1000-5000', '12+/year', '$100-200', 'Desktop/Mobile', 'VIP', 'P0'],
          ['Occasional Buyer', 'Low engagement', '$100-200', '1-2/year', '$50-100', 'Desktop', 'Standard', 'P2'],
          ['Gift Buyer', 'Seasonal', '$200-1000', '2-4/year', '$50-250', 'Mobile', 'Standard', 'P1'],
          ['Cart Abandoner', 'At-risk', 'Varies', 'Varies', 'Varies', 'Varies', 'Varies', 'P1'],
        ]
      }
    },
    {
      id: 'persona-deep-dive',
      title: 'Persona Deep Dive',
      description: 'Detailed shopper profiles with shopping behavior and motivations',
      fieldType: 'markdown',
      required: true,
      helpText: `**Primary Persona: [Persona Name]**

**Demographics:**
- Age: [Range]
- Income: [Range]
- Location: [Urban/Suburban/Rural]
- Occupation: [Role/Industry]
- Family Status: [Single, married, children]

**Shopping Behavior:**
| Attribute | Description |
|-----------|-------------|
| Shopping Frequency | [Times per month] |
| Average Order Value | $[X] |
| Preferred Categories | [Categories] |
| Device Preference | [Mobile/Desktop/Tablet] |
| Payment Preference | [Card, PayPal, BNPL] |
| Shipping Preference | [Standard, expedited, BOPIS] |

**Day in the Life (Shopping Journey):**
| Time | Activity | Touchpoint | Motivation | Friction |
|------|----------|------------|------------|----------|
| [Time] | [Activity] | [App/Email/Search] | [Why shopping] | [What frustrates] |

**Motivations & Barriers:**
- Primary motivation: [Price, convenience, selection, experience]
- Deal-breakers: [Shipping cost, slow delivery, poor returns]
- Loyalty drivers: [Rewards, exclusive access, personalization]
- Trust factors: [Reviews, free returns, customer service]

**Validation Checklist:**
- [ ] Surveyed 100+ customers matching this persona
- [ ] Analyzed behavioral data for this segment
- [ ] Conducted 5+ user interviews
- [ ] Validated AOV and frequency assumptions`,
      learnContentId: 'persona-definition',
    },
    {
      id: 'jtbd',
      title: 'Jobs To Be Done',
      description: 'Frame the shopping need with purchase context',
      fieldType: 'markdown',
      required: true,
      helpText: `**Primary Job Story:**
"When [shopping situation/trigger], I want to [shopping action], so I can [desired outcome/feeling]."

**Example:** "When I need to find the perfect gift for my mom's birthday, I want to easily filter by her interests and see gift-wrapping options, so I can feel confident I've chosen something special."

**Related Jobs:**
| Job Type | Job Statement | Importance (1-10) | Satisfaction (1-10) | Opportunity |
|----------|---------------|-------------------|--------------------|-------------|
| Functional | [Find product, complete purchase] | | | |
| Emotional | [Feel confident, reduce anxiety] | | | |
| Social | [Look thoughtful, gain approval] | | | |

**Shopping Occasions:**
| Occasion | Frequency | Urgency | Price Sensitivity | Our Opportunity |
|----------|-----------|---------|-------------------|-----------------|
| Birthday gift | [X/year] | High | Low | Gift finder, wrapping |
| Personal purchase | [X/year] | Medium | Medium | Recommendations |
| Holiday shopping | [X/year] | High | Low | Gift guides, bundles |
| Replenishment | [X/month] | Low | High | Subscribe & save |

**Alternatives Analysis:**
| Current Alternative | Why It Falls Short | Our Advantage |
|---------------------|--------------------|---------------|
| [Competitor site] | [Gap in selection/price/UX] | [Differentiation] |
| [Physical store] | [Inconvenient, limited selection] | [Convenience, variety] |
| [Do nothing/DIY] | [Time-consuming, uncertain] | [Curated, confident] |`,
      learnContentId: 'jtbd-framework',
    },
    {
      id: 'success-metrics',
      title: 'Commerce Success Metrics',
      description: 'E-commerce KPIs focused on conversion, revenue, and customer experience',
      fieldType: 'table',
      required: true,
      helpText: 'Focus on conversion funnel - balance growth with profitability',
      learnContentId: 'success-metrics',
      tableSchema: {
        columns: ['Metric Category', 'Metric Name', 'Definition', 'Baseline', 'Target', 'Timeline', 'Owner', 'Current'],
        rows: [
          ['Conversion', 'Overall Conversion Rate', 'Sessions to order %', '', '+15%', '3 months', '', ''],
          ['Conversion', 'Add to Cart Rate', 'Sessions with ATC %', '', '+10%', '3 months', '', ''],
          ['Conversion', 'Checkout Completion Rate', 'Checkout start to order %', '', '+20%', '3 months', '', ''],
          ['Revenue', 'Average Order Value (AOV)', 'Revenue / orders', '$[X]', '+10%', '3 months', '', ''],
          ['Revenue', 'Gross Merchandise Value (GMV)', 'Total sales value', '$[X]', '+25%', 'Quarter', '', ''],
          ['Revenue', 'Revenue per Visitor (RPV)', 'Revenue / sessions', '$[X]', '+20%', '3 months', '', ''],
          ['Retention', 'Customer Lifetime Value (CLV)', 'Total customer value', '$[X]', '+15%', '6 months', '', ''],
          ['Retention', 'Repeat Purchase Rate', '% customers with 2+ orders', '', '+10%', '6 months', '', ''],
          ['Retention', 'Subscription Retention', 'Monthly retention %', '', '>90%', 'Ongoing', '', ''],
          ['Engagement', 'Product Page Views per Session', 'Pages viewed', '', '+20%', '3 months', '', ''],
          ['Engagement', 'Search to Product Click Rate', 'Search conversion %', '', '+15%', '3 months', '', ''],
          ['Operations', 'Cart Abandonment Rate', 'ATC without purchase %', '', '-15%', '3 months', '', ''],
          ['Operations', 'Return Rate', 'Orders returned %', '', '<10%', 'Ongoing', '', ''],
          ['Experience', 'NPS', 'Net Promoter Score', '', '>50', '6 months', '', ''],
          ['Experience', 'CSAT', 'Customer Satisfaction', '', '>4.5/5', '3 months', '', ''],
        ]
      }
    },
    {
      id: 'okrs',
      title: 'OKRs (Objectives & Key Results)',
      description: 'Quarterly objectives with measurable commerce key results',
      fieldType: 'table',
      required: true,
      helpText: 'Align team on revenue, conversion, and customer experience outcomes',
      learnContentId: 'okrs',
      tableSchema: {
        columns: ['Objective', 'Key Result', 'Baseline', 'Target', 'Progress', 'Owner'],
        rows: [
          ['Increase conversion rate', 'Improve checkout completion rate from X% to Y%', 'X%', 'Y%', '', ''],
          ['Drive higher order value', 'Increase AOV from $X to $Y', '$X', '$Y', '', ''],
          ['Launch [Feature] successfully', 'Achieve X% adoption within 30 days of launch', '0%', 'X%', '', ''],
          ['Improve customer satisfaction', 'Achieve NPS of X+ among feature users', 'N/A', 'X+', '', ''],
        ]
      }
    },
    {
      id: 'solution-overview',
      title: 'Solution Overview',
      description: 'High-level solution with shopping flow and system architecture',
      fieldType: 'markdown',
      required: true,
      helpText: `**Solution Summary:**
[2-3 paragraph description of what we're building and how it improves the shopping experience]

**Shopping Flow Diagram:**
\`\`\`
[Browse/Search] → [Product Page] → [Add to Cart] → [Checkout] → [Payment] → [Confirmation]
      ↓              ↓                 ↓              ↓           ↓            ↓
[Recommendations] [Reviews, Images] [Upsell]    [Shipping]  [Multiple]   [Email, SMS]
                                         [Tax]      [Methods]     [Tracking]
\`\`\`

**System Components:**
| Component | Purpose | Owner | SLA | Peak Capacity |
|-----------|---------|-------|-----|---------------|
| [Product Service] | Product data, inventory | [Team] | 99.99% | [X] req/sec |
| [Cart Service] | Cart management | [Team] | 99.99% | [X] req/sec |
| [Checkout Service] | Checkout flow | [Team] | 99.99% | [X] req/sec |
| [Payment Service] | Payment processing | [Team] | 99.99% | [X] req/sec |
| [Recommendation Engine] | Personalization | [Team] | 99.9% | [X] req/sec |
| [Search Service] | Product search | [Team] | 99.9% | [X] req/sec |

**Key Technical Decisions:**
| Decision | Option A | Option B | Chosen | Rationale |
|----------|----------|----------|--------|-----------|
| [Architecture choice] | [Pros/Cons] | [Pros/Cons] | [A/B] | [Scalability, cost] |
| [Third-party vs build] | [Pros/Cons] | [Pros/Cons] | [A/B] | [Time to market] |

**Dependencies:**
- [ ] [Team/Service] - [What they need to deliver] - Due: [Date]
- [ ] [Payment Provider] - [Integration requirements] - Due: [Date]
- [ ] [Fulfillment Partner] - [Shipping integration] - Due: [Date]`,
      learnContentId: 'solution-design',
    },
    {
      id: 'user-stories',
      title: 'User Stories',
      description: 'Detailed user stories with commerce acceptance criteria',
      fieldType: 'table',
      required: true,
      helpText: 'Include edge cases for checkout, payment, and fulfillment',
      learnContentId: 'user-stories',
      tableSchema: {
        columns: ['Story ID', 'User Story', 'Acceptance Criteria', 'Commerce Notes', 'Priority', 'Estimate'],
        rows: [
          ['US-001', 'As a shopper, I want to [shopping action], so I can [outcome]', 'Given/When/Then format', '[Payment, shipping notes]', 'P0', ''],
          ['US-002', 'As a shopper, I want to see product reviews', '1. Display star rating and count 2. Show verified purchase badge 3. Allow filtering by rating', 'Review moderation required', 'P0', ''],
          ['US-003', 'As a shopper, I want to apply a promo code', '1. Enter code at checkout 2. Validate code 3. Show discount applied 4. Show error if invalid', 'Stackability rules apply', 'P0', ''],
          ['US-004', 'As a shopper, I want to track my order', '1. View order status 2. See tracking number 3. Get delivery estimate', 'Carrier integration required', 'P1', ''],
        ]
      }
    },
    {
      id: 'functional-requirements',
      title: 'Functional Requirements',
      description: 'Detailed requirements with platform considerations (mobile-first)',
      fieldType: 'table',
      required: true,
      helpText: 'Mobile-first design - most e-commerce traffic is mobile',
      learnContentId: 'requirements-writing',
      tableSchema: {
        columns: ['Req ID', 'Requirement Description', 'Priority', 'Platform', 'User Story Ref', 'Acceptance Criteria', 'Notes'],
        rows: [
          ['FR-001', 'System shall display real-time inventory availability', 'P0', 'Mobile/Desktop', 'US-001', 'Show "In Stock" or "Out of Stock" with quantity', 'Inventory sync critical'],
          ['FR-002', 'System shall persist cart across devices and sessions', 'P0', 'All', 'US-002', 'Logged-in users see cart everywhere', 'Cart recovery'],
          ['FR-003', 'System shall validate promo codes and apply discounts correctly', 'P0', 'All', 'US-003', 'Validate eligibility, exclusions, stackability', 'Revenue impact'],
          ['FR-004', 'System shall calculate shipping costs and delivery dates accurately', 'P0', 'All', '', 'Real-time carrier rates, cut-off times', 'Customer expectation'],
          ['FR-005', 'System shall support multiple payment methods', 'P0', 'All', '', 'Credit card, PayPal, Apple Pay, BNPL', 'Conversion impact'],
          ['FR-006', 'System shall support guest checkout', 'P0', 'All', '', 'No account required, offer account creation post-purchase', 'Reduce friction'],
        ]
      }
    },
    {
      id: 'promotions-pricing',
      title: 'Promotions & Pricing Rules',
      description: 'Discount logic, promo codes, and pricing rules with edge cases',
      fieldType: 'table',
      required: true,
      helpText: 'Define all edge cases - promotions can make or break margins',
      learnContentId: 'requirements-writing',
      tableSchema: {
        columns: ['Rule ID', 'Rule Type', 'Condition', 'Discount Value', 'Stackable', 'Exclusions', 'Priority', 'Status'],
        rows: [
          ['PROMO-001', 'Percentage Off', 'Min $50 purchase', '10% off', 'No', 'Clearance items', 'High', ''],
          ['PROMO-002', 'Fixed Amount', 'First-time customer', '$20 off $100+', 'No', 'All customers', 'High', ''],
          ['PROMO-003', 'Free Shipping', 'Orders over $75', 'Free standard shipping', 'Yes', 'Oversized items', 'Medium', ''],
          ['PROMO-004', 'BOGO', 'Buy X, Get Y', 'Buy 1 Get 1 50% off', 'No', 'Specific SKUs', 'Medium', ''],
          ['PROMO-005', 'Bundle Discount', 'Purchase bundle', '15% off bundle', 'No', 'Bundle items only', 'Low', ''],
          ['PROMO-006', 'Loyalty Reward', 'VIP members', 'Extra 5% off', 'Yes', 'Sale items', 'High', ''],
        ]
      }
    },
    {
      id: 'pricing-edge-cases',
      title: 'Pricing Edge Cases',
      description: 'Handle pricing changes, cart updates, and checkout scenarios',
      fieldType: 'markdown',
      required: true,
      helpText: `**Price Change Scenarios:**

| Scenario | Handling | User Communication |
|----------|----------|-------------------|
| Price increases while in cart | Show updated price, require confirmation | "Price has changed. Continue?" |
| Price decreases while in cart | Auto-apply lower price | "Good news! Price dropped." |
| Promotion expires while in cart | Remove discount, show notification | "Promo code expired" |
| Item goes out of stock | Show OOS, suggest alternatives | "Item unavailable. Try these:" |
| Cart item quantity exceeds stock | Limit quantity, show available | "Only X remaining" |

**Checkout Edge Cases:**
- [ ] Payment fails after order placed → Hold order, retry payment, notify customer
- [ ] Shipping address undeliverable → Show error, suggest corrections
- [ ] Tax calculation error → Show estimate, reconcile post-order
- [ ] Inventory sells out during checkout → Apologize, offer alternatives, refund
- [ ] Session expires during checkout → Preserve cart, allow resume
- [ ] Multiple discount codes entered → Apply best single code, explain policy

**Post-Order Edge Cases:**
- [ ] Customer requests cancellation → Honor if not shipped, explain policy
- [ ] Item damaged in shipping → Initiate return/replacement immediately
- [ ] Wrong item shipped → Apologize, send correct item, prepaid return
- [ ] Partial shipment → Communicate status, tracking for remaining items`,
      learnContentId: 'edge-case-thinking',
    },
    {
      id: 'integrations',
      title: 'Commerce Integrations',
      description: 'Payment processors, shipping carriers, inventory, and fulfillment systems',
      fieldType: 'table',
      required: true,
      helpText: 'Map all touchpoints - any integration can break the checkout flow',
      learnContentId: 'dependency-management',
      tableSchema: {
        columns: ['Integration', 'Provider', 'Purpose', 'API/Method', 'Fallback', 'Owner', 'Status'],
        rows: [
          ['Payment Gateway', 'Stripe/Adyen/Braintree', 'Process payments', 'REST API', 'Secondary processor', '', ''],
          ['PayPal', 'PayPal', 'Alternative payment', 'SDK', 'Skip if unavailable', '', ''],
          ['Buy Now Pay Later', 'Affirm/Klarna/Afterpay', 'Financing option', 'REST API', 'Hide if unavailable', '', ''],
          ['Sales Tax', 'Avalara/TaxJar', 'Tax calculation', 'REST API', 'Estimate, true-up later', '', ''],
          ['Shipping Rates', 'Shippo/EasyPost', 'Carrier rates', 'REST API', 'Flat rate fallback', '', ''],
          ['Address Validation', 'Loqate/SmartyStreets', 'Verify addresses', 'REST API', 'Warn user, allow override', '', ''],
          ['Inventory Management', 'NetSuite/SKUVault', 'Stock levels', 'Real-time API', 'Cache with TTL', '', ''],
          ['Order Management', 'OMS', 'Order routing', 'REST API', 'Queue for retry', '', ''],
          ['Fulfillment/WMS', '3PL/WMS', 'Pick, pack, ship', 'API/EDI', 'Manual processing', '', ''],
          ['Email Service', 'SendGrid/Klaviyo', 'Order confirmations', 'REST API', 'Queue for retry', '', ''],
          ['SMS Service', 'Twilio', 'Shipping notifications', 'REST API', 'Email fallback', '', ''],
          ['Reviews Platform', 'Yotpo/Bazaarvoice', 'Product reviews', 'REST API', 'Hide reviews section', '', ''],
        ]
      }
    },
    {
      id: 'ux-requirements',
      title: 'UX/UI Requirements',
      description: 'Design specifications for all states and screen sizes',
      fieldType: 'table',
      required: true,
      helpText: 'Mobile-first design - optimize for thumb zones and small screens',
      learnContentId: 'ux-specification',
      tableSchema: {
        columns: ['Screen/Component', 'State', 'Description', 'Behavior', 'Mobile Considerations', 'Design Link'],
        rows: [
          ['Product Page', 'Default', 'Images, title, price, ATC', 'Image zoom, variant selection', 'Thumb-friendly ATC button', ''],
          ['Product Page', 'Out of Stock', 'OOS message, notify option', 'Disable ATC, show notify form', 'Clear OOS messaging', ''],
          ['Product Page', 'Low Stock', 'Scarcity indicator', 'Show "Only X left"', 'Urgency without being pushy', ''],
          ['Cart', 'Default', 'Cart items, subtotal', 'Editable quantities, promo code', 'Sticky checkout button', ''],
          ['Cart', 'Empty', 'Empty cart message', 'Show recommendations, continue shopping', 'Clear CTA', ''],
          ['Checkout', 'Step 1', 'Shipping info', 'Address validation, auto-complete', 'Large input fields', ''],
          ['Checkout', 'Step 2', 'Shipping method', 'Carrier options, delivery dates', 'Clear pricing, date range', ''],
          ['Checkout', 'Step 3', 'Payment', 'Multiple payment options', 'Apple Pay/Google Pay prominent', ''],
          ['Checkout', 'Confirmation', 'Order confirmation', 'Order number, tracking, next steps', 'Save to wallet option', ''],
        ]
      }
    },
    {
      id: 'edge-cases',
      title: 'Edge Cases & Error Handling',
      description: 'Anticipate and handle all commerce edge cases',
      fieldType: 'table',
      required: true,
      helpText: 'Commerce edge cases directly impact revenue - be thorough',
      learnContentId: 'edge-case-thinking',
      tableSchema: {
        columns: ['Scenario', 'Category', 'Likelihood', 'Revenue Impact', 'Handling', 'User Message'],
        rows: [
          ['Payment fails after order confirmation', 'Payment', 'Medium', 'High', 'Hold order, retry, email customer', "We're having trouble processing your payment. Please update your payment method."],
          ['Inventory sells out during checkout', 'Inventory', 'Medium', 'High', 'Cancel item, offer alternatives, refund', "Sorry, this item sold out. We recommend these alternatives..."],
          ['Shipping address undeliverable', 'Fulfillment', 'Low', 'Medium', 'Show error, suggest corrections', "We can't ship to this address. Please verify or choose a different address."],
          ['Price changes during checkout', 'Pricing', 'Low', 'Medium', 'Honor cart price or show update', "Price has updated. Your new total is $X."],
          ['Promo code invalid/expired', 'Promotions', 'High', 'Medium', 'Show clear error, suggest valid codes', "This code is expired. Try these active offers..."],
          ['Session timeout during checkout', 'Technical', 'Medium', 'High', 'Preserve cart, allow resume', "Your session expired. Your cart is saved."],
          ['Carrier service disruption', 'Fulfillment', 'Low', 'Medium', 'Show delay notice, offer alternatives', "Shipping delays in your area. Expected delivery: X-X days."],
          ['Fraud detection triggered', 'Security', 'Low', 'High', 'Hold order, manual review', "Your order is under review. We'll contact you within 24 hours."],
        ]
      }
    },
    {
      id: 'rollout-plan',
      title: 'Rollout Plan',
      description: 'Phased launch strategy considering traffic patterns and peak periods',
      fieldType: 'table',
      required: true,
      helpText: 'Avoid peak traffic periods and major shopping holidays',
      learnContentId: 'rollout-strategy',
      tableSchema: {
        columns: ['Phase', 'User Segment', '% Traffic', 'Duration', 'Success Criteria', 'Go/No-Go Owner', 'Blackout Dates'],
        rows: [
          ['Internal', 'Employees only', '100%', '3 days', 'No P0 bugs, flow validated', 'Product Lead', 'None'],
          ['Beta', 'Loyal/VIP customers', '5%', '1 week', 'Conversion stable, no revenue impact', 'Product Lead', 'Avoid weekends'],
          ['Expanded', 'All users', '25% → 50%', '1 week each', 'Metrics within 5% of control', 'Product Lead', 'None'],
          ['GA', 'All users', '100%', 'Ongoing', 'Conversion hit target, GMV impact', 'Executive Sponsor', 'Avoid holidays'],
        ]
      }
    },
    {
      id: 'blackout-calendar',
      title: 'Launch Blackout Calendar',
      description: 'Peak periods and holidays to avoid for launch',
      fieldType: 'markdown',
      required: true,
      helpText: `**Major Shopping Holidays (DO NOT LAUNCH):**
| Holiday | Blackout Window | Notes |
|---------|-----------------|-------|
| Black Friday/Cyber Monday | Nov 20 - Dec 2 | Peak season - code freeze |
| Christmas | Dec 15 - Jan 5 | Holiday shipping deadlines |
| Prime Day (July) | TBD | Competitor event, high traffic |
| Mother's Day | May 1-14 | High gift shopping volume |
| Valentine's Day | Feb 7-15 | Gift shopping peak |

**Recommended Launch Windows:**
- **Best:** Tuesday-Thursday, 10am-2pm (post-holiday lull)
- **Good:** Mid-week, avoid Monday (catch-up) and Friday (weekend prep)
- **Avoid:** Weekends (lower traffic = harder to detect issues)

**Code Freeze Periods:**
- Black Friday/Cyber Monday: 2 weeks prior
- Christmas: 3 weeks prior
- Any major sale event: 1 week prior`,
      learnContentId: 'rollout-strategy',
    },
    {
      id: 'gtm-alignment',
      title: 'Marketing & Promotions Plan',
      description: 'Campaign planning, channel strategy, and promotional calendar',
      fieldType: 'table',
      required: true,
      helpText: 'Coordinate with marketing on campaigns and promotions',
      learnContentId: 'gtm-basics',
      tableSchema: {
        columns: ['Channel', 'Campaign/Message', 'Owner', 'Launch Date', 'Budget', 'Status', 'Notes'],
        rows: [
          ['Email', 'Feature announcement to VIP list', 'CRM Marketing', '', '$X', '', 'Segment by persona'],
          ['Email', 'Cart abandonment campaign', 'CRM Marketing', '', '$X', '', 'Trigger-based'],
          ['Social Media', 'Instagram/TikTok showcase', 'Social Marketing', '', '$X', '', 'Influencer seeding'],
          ['Paid Search', 'Branded + category keywords', 'Performance Marketing', '', '$X', '', 'SEM campaigns'],
          ['On-site', 'Homepage banner, PDP badges', 'Site Merchandising', '', 'N/A', '', 'Placement TBD'],
          ['Push Notification', 'App users feature announcement', 'CRM Marketing', '', 'N/A', '', 'Opt-in users only'],
        ]
      }
    },
    {
      id: 'merchandising-plan',
      title: 'Merchandising Plan',
      description: 'Product placement, curation, and inventory planning',
      fieldType: 'table',
      required: true,
      helpText: 'Coordinate with merchandising on featured products and inventory',
      learnContentId: 'gtm-basics',
      tableSchema: {
        columns: ['Activity', 'Products/Categories', 'Owner', 'Timeline', 'Status'],
        rows: [
          ['Featured Products', 'Hero SKUs for launch', 'Merchandising', '', ''],
          ['Inventory Planning', 'Stock levels for launch', 'Operations', '', ''],
          ['Pricing Strategy', 'Launch pricing, promotions', 'Merchandising', '', ''],
          ['Visual Assets', 'Product photography, lifestyle images', 'Creative', '', ''],
          ['Content', 'Product descriptions, copy', 'Content Marketing', '', ''],
        ]
      }
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Revenue, operational, technical, and reputational risks',
      fieldType: 'table',
      required: true,
      helpText: 'Revenue-impacting risks are highest priority in e-commerce',
      learnContentId: 'risk-management',
      tableSchema: {
        columns: ['Risk ID', 'Risk Description', 'Category', 'Severity (1-5)', 'Likelihood (1-5)', 'Revenue Impact', 'Mitigation Strategy', 'Owner'],
        rows: [
          ['RISK-001', 'Checkout flow breaks, blocking purchases', 'Technical', '5', '2', 'Critical - 100% loss', 'Staged rollout, monitoring, quick rollback', ''],
          ['RISK-002', 'Payment processing failures', 'Technical', '5', '3', 'Critical - lost sales', 'Multiple payment processors, fallback', ''],
          ['RISK-003', 'Incorrect pricing displayed', 'Operational', '4', '3', 'High - margin loss', 'Price validation, manual review', ''],
          ['RISK-004', 'Inventory oversell (sell more than stock)', 'Operational', '4', '3', 'High - fulfillment issues', 'Real-time inventory sync, buffer', ''],
          ['RISK-005', 'Promo code abuse/fraud', 'Fraud', '3', '3', 'Medium - margin erosion', 'Usage limits, fraud detection', ''],
          ['RISK-006', 'Site crash during peak traffic', 'Technical', '5', '2', 'Critical - lost sales + PR', 'Load testing, auto-scaling, CDN', ''],
          ['RISK-007', 'Negative reviews/social media backlash', 'Reputational', '4', '2', 'High - long-term impact', 'Customer service escalation, quick response', ''],
        ]
      }
    },
    {
      id: 'timeline-resourcing',
      title: 'Timeline & Resourcing',
      description: 'Project milestones considering retail calendar and peak periods',
      fieldType: 'table',
      required: true,
      helpText: 'Work backwards from key shopping dates - Q4 planning is critical',
      learnContentId: 'estimation',
      tableSchema: {
        columns: ['Milestone', 'Target Date', 'Duration', 'Dependencies', 'Owner', 'Status', 'Retail Calendar Notes'],
        rows: [
          ['PRD Approved', '', '1 week', 'None', 'Product', '', ''],
          ['Design Complete', '', '2-3 weeks', 'PRD Approved', 'Design', '', ''],
          ['Engineering Start', '', 'Day 1', 'Design complete', 'Engineering', '', ''],
          ['QA Complete', '', '2 weeks', 'Engineering complete', 'QA', '', ''],
          ['Load Testing', '', '1 week', 'QA complete', 'Engineering', '', 'Critical for peak'],
          ['Beta Launch', '', '1 week', 'QA complete', 'Product', '', 'Avoid weekends'],
          ['GA Launch', '', '1 week', 'All approvals', 'Product', '', 'Avoid holidays'],
          ['Post-Launch Review', '', '1 week', 'GA + 2 weeks', 'Product', '', ''],
        ]
      }
    },
    {
      id: 'team-structure',
      title: 'Team Structure & Roles',
      description: 'Cross-functional team members and responsibilities',
      fieldType: 'table',
      required: true,
      helpText: 'Clear ownership across product, engineering, merchandising, and ops',
      learnContentId: 'stakeholder-management',
      tableSchema: {
        columns: ['Role', 'Name', 'Responsibility', 'Department', 'Time Allocation'],
        rows: [
          ['Product Lead', '', 'Overall product strategy', 'Product', '50%'],
          ['Engineering Lead', '', 'Technical architecture, delivery', 'Engineering', '75%'],
          ['Design Lead', '', 'UX/UI design', 'Design', '50%'],
          ['Merchandising Lead', '', 'Product curation, pricing', 'Merchandising', '25%'],
          ['Operations Lead', '', 'Fulfillment, customer service', 'Operations', '25%'],
          ['Marketing Lead', '', 'Campaigns, promotions', 'Marketing', '25%'],
          ['Data Analyst', '', 'Metrics, A/B test analysis', 'Analytics', '25%'],
          ['QA Lead', '', 'Testing, quality assurance', 'Engineering', '50%'],
        ]
      }
    },
    {
      id: 'post-launch-plan',
      title: 'Post-Launch Plan',
      description: 'Monitoring, optimization, and iteration plan',
      fieldType: 'table',
      required: true,
      helpText: 'Monitor conversion and revenue metrics in real-time',
      learnContentId: 'post-launch',
      tableSchema: {
        columns: ['Activity', 'Timeline', 'Owner', 'Alert Threshold', 'Response', 'Notes'],
        rows: [
          ['Conversion monitoring', 'Real-time', 'Product/Analytics', 'Drop >5%', 'Investigate immediately', 'Revenue impact'],
          ['Error rate monitoring', 'Real-time', 'Engineering', 'Error rate >1%', 'Page on-call', 'Checkout blockers'],
          ['Payment failure rate', 'Real-time', 'Engineering', '>2% failure', 'Check payment processor', 'Critical'],
          ['Day 1 check', 'Day 1', 'Product', 'No P0 issues', 'Go/No-Go decision', 'All teams'],
          ['Week 1 review', 'Week 1', 'Product', 'Metrics stable', 'Continue/iterate', 'All teams'],
          ['Month 1 impact', 'Month 1', 'Product', 'Hit targets', 'Scale/expand', 'Executive review'],
          ['A/B Test Analysis', '2-4 weeks', 'Analytics', 'Stat significance', 'Implement winner', 'Optimization'],
        ]
      }
    },
    {
      id: 'monitoring-dashboards',
      title: 'Monitoring Dashboards',
      description: 'Real-time dashboards and alerting configuration',
      fieldType: 'markdown',
      required: true,
      helpText: `**Real-Time Dashboards:**

| Dashboard | Purpose | Owner | Link |
|-----------|---------|-------|------|
| Revenue Tracker | GMV, orders, AOV | Product/Finance | [Looker link] |
| Conversion Funnel | Browse → ATC → Checkout → Purchase | Product | [Amplitude link] |
| System Health | Error rates, latency, uptime | Engineering | [Datadog link] |
| Payment Health | Success rate by method | Engineering | [Dashboard link] |
| Customer Service | Ticket volume, top issues | CS Lead | [Zendesk link] |

**Alert Configuration:**
| Alert | Threshold | Severity | Channel | Owner |
|-------|-----------|----------|---------|-------|
| Conversion drop | >5% vs baseline | Critical | PagerDuty | Product |
| Checkout errors | >1% error rate | Critical | PagerDuty | Engineering |
| Payment failures | >2% failure rate | Critical | PagerDuty | Engineering |
| Site down | 0 orders in 5 min | Critical | PagerDuty | Engineering |
| High CS ticket volume | >2x normal | High | Slack | CS Lead |

**On-Call Rotation:**
- Primary: [Name/Team]
- Secondary: [Name/Team]
- Escalation: [Name/Team]`,
      learnContentId: 'post-launch',
    },
    {
      id: 'customer-service-plan',
      title: 'Customer Service Plan',
      description: 'Support readiness, training, and escalation procedures',
      fieldType: 'markdown',
      required: true,
      helpText: `**Support Readiness:**
- [ ] Support team trained on new feature
- [ ] FAQ documentation published
- [ ] Macros/templates created for common issues
- [ ] Escalation procedures defined
- [ ] Staffing levels adjusted for launch

**Common Issues & Responses:**
| Issue | Template/Macro | Escalation Path |
|-------|---------------|-----------------|
| Promo code not working | [Macro name] | Supervisor → Product |
| Order not received | [Macro name] | Operations |
| Payment charged twice | [Macro name] | Finance |
| Item cancelled | [Macro name] | Merchandising |
| Shipping delay | [Macro name] | Fulfillment |

**Self-Service Resources:**
- [ ] Help center article published
- [ ] Video tutorial created (if applicable)
- [ ] Chatbot flows updated
- [ ] Order tracking page updated`,
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
| GMV | Gross Merchandise Value - total sales value |
| AOV | Average Order Value - revenue per order |
| ATC | Add to Cart |
| BOPIS | Buy Online, Pick Up In Store |
| BNPL | Buy Now, Pay Later |

**Appendix B: Research Findings**
- Customer survey results: [Link]
- User testing summary: [Link]
- Competitive analysis: [Link]
- Funnel analysis: [Link]

**Appendix C: Technical Documentation**
- API documentation: [Link]
- Architecture diagram: [Link]
- Runbook: [Link]

**Appendix D: Design Assets**
- Figma designs: [Link]
- Asset library: [Link]
- Brand guidelines: [Link]

**Appendix E: Operational Playbooks**
- Fulfillment playbook: [Link]
- Customer service playbook: [Link]
- Incident response: [Link]`,
      learnContentId: 'documentation',
    },
  ],
};
