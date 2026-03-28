# Putting It Together: How PMs Use Finance Metrics in Real Decisions

You now know 30+ finance metrics. Here's how to actually use them together to make better product decisions.

---

## The Core Truth: Metrics Work in Systems, Not in Isolation

**Bad PM thinking**: "Our CAC is $500, which seems reasonable."

**Good PM thinking**: "Our CAC is $500, LTV is $2,000, payback is 8 months, and NRR is 115%. That's a 4:1 LTV:CAC ratio with fast payback and strong expansion - we should scale this channel."

Every metric tells part of the story. The art is knowing which metrics to combine for which decision.

---

## Decision Framework #1: Should We Build This Feature?

**The Question Flow:**

### 1. What's the revenue connection?
- **Direct monetization** (new tier, add-on, usage charges)?
  → Estimate revenue impact using current customer base × adoption rate × price
- **Indirect monetization** (improves retention, conversion, expansion)?
  → Estimate churn reduction or conversion lift, then calculate LTV impact

### 2. What's the cost structure?
- **Development cost**: One-time investment (size the team × time)
- **Ongoing COGS**: Does it require expensive infrastructure (AI, video, real-time)?
- **Support/OpEx**: Will it create ongoing support burden?
- **Calculate contribution margin**: Revenue - all variable costs

### 3. What's the ROI?
- **For direct monetization**: 
  - Revenue impact / Development cost = Simple ROI
  - Factor in gross margin: (Revenue × Margin) / Development cost
- **For retention features**:
  - LTV impact across customer base / Development cost
  - Example: Reducing 5% → 4% churn on 10K customers = $5M LTV impact

### 4. What's the strategic value?
- Does it reduce CAC (makes acquisition channels viable)?
- Does it increase LTV (enables higher CAC channels)?
- Does it reduce concentration risk (diversifies revenue)?
- Does it create competitive moat?

### 5. The Decision

**Build if:**
- ROI >3x in year one (for direct monetization), OR
- LTV impact >10x development cost (for retention), OR
- Strategic value is high enough to override short-term ROI

**Don't build if:**
- Negative contribution margin even with optimistic adoption
- Payback period exceeds average customer lifetime
- Ignores higher-ROI alternatives

---

## Decision Framework #2: Should We Invest in This Acquisition Channel?

**The Question Flow:**

### 1. What's the unit economics?
- **CAC**: What does it cost to acquire one customer?
- **LTV**: What's the lifetime value of customers from this channel?
- **LTV:CAC ratio**: Is it >3:1?

### 2. What's the cash efficiency?
- **Payback period**: CAC / (Monthly ARPU × Gross Margin)
- Is it <12 months? <18 months?
- Do you have the cash to sustain this payback timing?

### 3. What's the customer quality?
- **Cohort retention**: Do customers from this channel stick around?
- **NRR by channel**: Do they expand or contract?
- **Churn rate**: Higher or lower than other channels?

### 4. What's the scalability?
- **Magic Number contribution**: (New MRR from channel × 4) / Channel S&M spend
- Is the channel >0.75 efficiency?
- Can it scale to the volume you need?

### 5. The Decision

**Scale the channel if:**
- LTV:CAC >3:1 AND
- Payback <18 months AND
- Customer quality (retention, NRR) meets or beats other channels AND
- Magic Number >0.75

**Test the channel if:**
- LTV:CAC 2-3:1 AND
- You have specific hypotheses to improve efficiency

**Kill the channel if:**
- LTV:CAC <1.5:1 AND
- No clear path to improvement

---

## Decision Framework #3: Should We Change Pricing?

**The Question Flow:**

### 1. What's the current state?
- **ARPU/ARPA**: Current revenue per user/account
- **Gross margin**: Are we already monetizing well?
- **NRR**: Are customers expanding or contracting?
- **Churn rate**: How price-sensitive are current customers?

### 2. What's the proposed change?
- **Price increase** (raises ARPU, might hurt conversion/retention)
- **New tier** (expansion opportunity, more packaging complexity)
- **Usage-based** (aligns price with value, more variable revenue)
- **Annual discount** (better payback, less MRR per customer)

### 3. What's the expected impact?

**For price increases:**
- **Revenue impact**: Current ARPU × % increase × customer base
- **Churn impact**: Estimate incremental churn from price sensitivity
- **Net impact**: Revenue gain - Revenue lost to churn

**For new tiers:**
- **Adoption estimate**: What % of customers will upgrade?
- **Revenue per upgrade**: Price delta × adopters
- **Development cost**: Cost to build tier differentiation

**For usage-based pricing:**
- **Revenue variability**: How much does it swing month-to-month?
- **Expansion opportunity**: Do customers naturally grow usage?
- **Margin impact**: Does usage drive COGS?

### 4. The Decision

**Increase prices if:**
- NRR >110% (customers already see expanding value)
- Churn is low (<3% monthly)
- No close substitutes at lower prices
- You're underpriced vs. value delivered

**Add new tier if:**
- Clear customer segment willing to pay more
- Differentiation doesn't create product complexity
- >20% of base likely to adopt

**Move to usage-based if:**
- Usage correlates with value delivered
- Customers have wide usage variance
- You can afford revenue variability

---

## Decision Framework #4: Should We Scale Go-to-Market Spend?

**The Question Flow:**

### 1. What's the current efficiency?
- **Magic Number**: (Current Q Rev - Prior Q Rev) × 4 / Prior Q S&M
- Is it >0.75? >1.0?
- **LTV:CAC by channel**: Which channels are working?
- **Quick Ratio**: (New + Expansion MRR) / (Churn + Contraction MRR)
- Is it >2.0? >4.0?

### 2. What's the product readiness?
- **NRR**: >100% means product is creating expansion
- **Churn rate by cohort**: Are recent cohorts better or worse?
- **Payback period**: Can you recover CAC fast enough?

### 3. What's the cash situation?
- **Burn rate vs. runway**: Can you afford increased spend?
- **Payback period**: How long until you recover investment?
- **Revenue forecast**: When do you reach cash flow positive?

### 4. The Decision

**Scale spend if:**
- Magic Number >0.75 AND
- LTV:CAC >3:1 in target channels AND
- Quick Ratio >2.0 AND
- Payback period <12 months AND
- 12+ months runway after increased burn

**Fix product first if:**
- Magic Number <0.5 OR
- NRR <100% OR
- Recent cohort churn >2x old cohort churn OR
- Quick Ratio <1.5

**Proceed cautiously if:**
- Magic Number 0.5-0.75
- Set staged milestones before full scale

---

## Decision Framework #5: How Do We Prioritize Across the Portfolio?

**The Question Flow:**

### 1. Map the portfolio by economics
For each product/feature:
- **Revenue contribution**: % of total revenue
- **Growth rate**: YoY or QoQ growth
- **Gross margin**: Profitability per dollar
- **NRR**: Is it expanding or contracting?

### 2. Calculate investment efficiency
For each product:
- **Revenue per R&D dollar**: Revenue / R&D investment
- **Gross profit per R&D dollar**: (Revenue × Margin) / R&D investment
- **Strategic value**: Does it reduce CAC, enable new segments, create moat?

### 3. Apply the framework

**Invest (scale R&D) in products with:**
- High growth rate (>40% YoY) AND
- Strong margin (>70%) AND
- NRR >110%
- **Example**: Add-on with $2M ARR, 40% growth, 65% margin, 115% NRR

**Harvest (maintain, low investment) products with:**
- Mature/slow growth (<10% YoY) AND
- High margin (>75%) AND
- Stable customer base
- **Example**: Core platform with $8M ARR, 5% growth, 80% margin

**Fix or divest products with:**
- Declining revenue (<0% YoY) OR
- Low margin (<50%) OR
- NRR <90%
- **Example**: Legacy feature with declining ARR, 40% margin, 85% NRR

**Watch products with:**
- High growth (>100% YoY) BUT
- Low margin (<50%)
- **Decision**: Can you improve margin through pricing or efficiency? If not, may be strategic but unprofitable.

---

## Red Flag Combinations: When Metrics Tell You to Stop

Some metric combinations are alarm bells. Here's what to watch for:

### 🚨 The Death Spiral
- **Churn increasing** (3% → 5% → 7%)
- **CAC increasing** (saturating best channels)
- **LTV decreasing** (shorter lifetimes)
- **Magic Number declining** (<0.5)

**What it means**: Product-market fit is degrading while acquisition is getting harder. 

**What to do**: STOP scaling acquisition. Fix retention first. Run cohort analysis to understand what changed. Consider pivoting to better segment or improving core value prop.

### 🚨 The Unprofitable Growth
- **Revenue growing fast** (50%+ YoY)
- **Gross margin declining** (75% → 65% → 55%)
- **LTV:CAC declining** (4:1 → 2:1 → 1:1)
- **Burn rate accelerating**

**What it means**: You're buying revenue with unprofitable customers or low-margin products.

**What to do**: Segment revenue by margin and LTV:CAC. Cut low-quality revenue sources. Raise prices or improve margins before scaling further.

### 🚨 The Concentration Crisis
- **Top customer >30% of revenue**
- **Top 10 customers >60% of revenue**
- **Product roadmap dominated by top customer requests**
- **NRR in long-tail customers declining**

**What it means**: You're building custom software for a few customers, not a scalable product.

**What to do**: Immediately invest in diversification. Resist custom requests unless they generalize. Build features that serve the broader market.

### 🚨 The Leaky Bucket
- **Quick Ratio <2** (barely gaining more than losing)
- **NRR <100%** (customers shrinking)
- **Expansion revenue <5%** of new revenue
- **Cohort retention declining**

**What it means**: Growth is from pouring water into a leaky bucket, not building a solid base.

**What to do**: Pause acquisition scale. Fix retention and expansion first. Identify why customers aren't getting value.

### 🚨 The False Efficiency
- **Magic Number >1.5** (looks hyper-efficient)
- **But CAC increasing** quarter-over-quarter
- **And market share flat** or declining

**What it means**: You're underinvesting in growth. Competitors are scaling faster.

**What to do**: Invest in acquisition channels with good LTV:CAC even if they temporarily lower Magic Number. Efficiency is good; leaving opportunity on the table is not.

---

## The PM's Mental Model: How Metrics Connect

Think of your business as a system with three loops:

### Loop 1: The Acquisition Engine
**Input**: S&M spend  
**Process**: Leads → Trials → Customers  
**Output**: New MRR  
**Metrics**: CAC, Magic Number, Conversion rates  
**Efficiency measure**: LTV:CAC ratio

### Loop 2: The Retention & Expansion Engine  
**Input**: Product investment, Customer Success  
**Process**: Onboarding → Activation → Value Realization → Expansion  
**Output**: Retained + Expanded MRR  
**Metrics**: Churn, NRR, ARPU growth, Quick Ratio  
**Efficiency measure**: Cost to retain/expand vs. LTV impact

### Loop 3: The Profitability Engine
**Input**: Revenue (from loops 1 & 2)  
**Process**: Revenue → Gross Profit → Contribution Margin → Net Income  
**Output**: Cash flow, profit  
**Metrics**: Gross margin, Contribution margin, Net income, Burn rate  
**Efficiency measure**: Rule of 40 (growth + margin)

### How They Work Together

**Healthy business:**
- Loop 1 brings in customers efficiently (CAC < LTV/3, Payback <12mo)
- Loop 2 retains and expands them (NRR >110%, Quick Ratio >4)
- Loop 3 converts to profit (Gross margin >75%, positive contribution margin)
- Cash flows from Loop 3 fund Loops 1 & 2

**Broken business:**
- Loop 1 is inefficient (LTV:CAC <2:1) OR
- Loop 2 is leaking (NRR <90%, Churn >5%) OR
- Loop 3 can't support growth (Negative contribution margin)

**Your job as a PM:**
- **Strengthen Loop 2**: Build features that reduce churn, drive expansion
- **Enable Loop 1**: Build features that reduce CAC, increase conversion
- **Optimize Loop 3**: Build efficiently, maintain margins, control costs
- **Connect the loops**: Every feature should improve at least one loop without breaking the others

---

## Common Scenarios & Metric Combinations to Use

### Scenario: "Should we offer a free tier?"

**Metrics to model:**
- **Unit economics of free users**: Cost to serve - Ad/virality revenue
- **Conversion rate**: % of free → paid
- **Payback on converted users**: Does the paid LTV justify the free COGS?
- **CAC reduction**: Does free reduce paid CAC enough to offset free costs?

**The math:**
- Free users: 100K at -$2 cost per user = -$200K annual cost
- Conversion: 5% convert = 5K paid customers
- If paid LTV is $2K each = $10M lifetime value
- If CAC without free tier would be $500 per customer = $2.5M saved on CAC
- Net impact: $10M LTV - $200K free cost - $0 CAC vs. $10M LTV - $2.5M CAC = Freemium adds $2.3M value

### Scenario: "Should we move upmarket to enterprise?"

**Metrics to model:**
- **Enterprise CAC**: Likely $10K-$50K (long sales cycle, sales team)
- **Enterprise ACV**: Need >$50K to justify economics
- **Gross margin**: Will enterprise require dedicated infrastructure?
- **Payback period**: CAC / (Monthly ACV × Gross Margin)
- **NRR by segment**: Do enterprise customers expand more?

**The decision:**
- Model: $20K CAC, $60K ACV, 70% margin, 24-month average lifetime
- LTV = $60K × 2 years × 70% = $84K
- LTV:CAC = 4.2:1 (good)
- Payback = $20K / ($5K/mo × 70%) = 5.7 months (acceptable)
- **But**: Does it distract from SMB/mid-market that's working? Will enterprise requests dominate roadmap?

### Scenario: "Our churn is increasing - what do we do?"

**Metrics to analyze:**
- **Cohort churn**: Is it all cohorts or just recent ones?
- **Churn by segment**: Which customer types are churning?
- **Churn reasons**: Exit surveys, support tickets
- **Time to churn**: When do they typically leave?
- **NRR impact**: Is revenue churn higher than logo churn? (downgrades)

**The diagnosis tree:**
- **All cohorts churning more** → Product degraded (bugs, downtime, missing features)
- **Only recent cohorts** → Acquisition quality changed or ICP drift
- **Specific segment** → Product-market fit issue for that segment
- **Early churn (<3 months)** → Onboarding or activation problem
- **Late churn (>12 months)** → Value delivery or competitive issue

### Scenario: "We're growing revenue but burning more cash"

**Metrics to analyze:**
- **Revenue growth rate**: What % are we growing?
- **Gross margin trend**: Is margin improving or degrading?
- **LTV:CAC by channel**: Are new channels less efficient?
- **Payback period**: How fast are we recovering CAC?
- **OpEx growth rate**: Is OpEx growing faster than revenue?

**The diagnosis:**
- **If margin is degrading**: You're adding low-quality revenue (fix pricing or product mix)
- **If LTV:CAC is declining**: Acquisition channels are less efficient (fix or find better channels)
- **If payback is lengthening**: New customers aren't monetizing as well (ICP drift or pricing issue)
- **If OpEx is outpacing revenue**: You're scaling team faster than output (hiring problem or efficiency issue)

---

## The Meta-Lesson: Metrics Are Means, Not Ends

**Bad PM behavior:**
- "We need to hit $10M ARR this quarter" → Discounts heavily, acquires bad customers, celebrates top line while destroying unit economics

**Good PM behavior:**
- "We need sustainable $10M ARR" → Focuses on LTV:CAC >3:1, NRR >110%, payback <12mo, and gets to $10M with healthy economics

**The principle:**  
Every metric can be gamed. The art is optimizing for the *right combination* of metrics that represent true business health.

**What "good" looks like:**
- Revenue growing >30% YoY
- NRR >110%
- LTV:CAC >3:1 across all channels
- Payback period <12 months
- Gross margin >75%
- Quick Ratio >4
- Churn <3% monthly
- Rule of 40 score >40
- Top customer <10% of revenue
- Magic Number >0.75

You won't hit all of these all the time. But knowing which ones matter most for your stage and model - and tracking how they move together - is what separates great PMs from mediocre ones.

---

## Your Action Plan: How to Actually Use This Guide

### Week 1: Baseline Your Metrics
1. Calculate your current state for core metrics: Revenue, MRR/ARR, CAC, LTV, Churn, NRR, Gross Margin
2. Identify which metrics you don't have visibility into
3. Set up dashboards or recurring reports to track them

### Week 2-4: Add Context
4. Break core metrics down by segment, channel, cohort
5. Calculate combined metrics: LTV:CAC, Payback Period, Quick Ratio, Magic Number, Rule of 40
6. Identify your biggest gap: Is it acquisition efficiency? Retention? Margin?

### Month 2: Apply to Decisions
7. For every feature request, ask: "What's the revenue/LTV/CAC impact?"
8. For every pricing discussion, model: ARPU impact, churn risk, NRR impact
9. For every go-to-market proposal, check: Magic Number, LTV:CAC, Payback Period

### Month 3+: Operate with Metrics as a Habit
10. Include metrics in every roadmap prioritization exercise
11. Use metrics to diagnose problems, not just track performance
12. Educate your team to think in systems of metrics, not single numbers

---

## Final Thought

**You don't need to memorize every metric.**  
**You need to know which questions each metric answers.**

When you're making a decision and feel uncertain, ask yourself:
- "What am I actually trying to understand here?"
- "Which metrics tell me if this is working or not?"
- "What would change my mind?"

Then go find those metrics, calculate them honestly, and make the call.

That's what great PMs do.

---

**End of Guide**

*For questions, clarifications, or to suggest additions to this guide, contact your friendly neighborhood finance team. They're nicer than you think, and they actually want you to understand this stuff.*
