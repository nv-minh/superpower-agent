# Finance Metrics Quick Reference for PMs

**One-page lookup table for essential SaaS & product finance metrics**

---

| **Metric** | **Formula** | **What It Measures** | **Why PMs Care** | **Good/Bad Benchmarks** |
|------------|-------------|----------------------|------------------|------------------------|
| **Revenue** | Total sales before expenses | Top-line money earned | Every feature should connect to revenue (direct or indirect) | Growth rate matters more than absolute number; context-dependent |
| **Gross Margin** | (Revenue - COGS) / Revenue × 100 | % of revenue after direct costs | High-margin features are far more valuable than low-margin ones | SaaS: 70-85% good; <60% concerning |
| **CAC** | Total S&M Spend / New Customers | Cost to acquire one customer | Shapes entire go-to-market strategy and channel decisions | Varies by model: Enterprise $10K+ ok; SMB <$500 |
| **LTV** | ARPU × Avg Lifetime (or more complex) | Total revenue from one customer | Tells you what you can afford to spend on acquisition | Must be 3x+ CAC; varies by segment |
| **Churn Rate** | Customers Lost / Starting Customers | % of customers who cancel | Silent killer of SaaS; undermines all acquisition efforts | Monthly: <2% great, 5%+ crisis. Annual: <10% great, >30% crisis |
| **ARPU** | Total Revenue / Total Users | Average revenue per user | More revenue per customer often beats acquiring more customers | Varies wildly by model; track trend more than absolute |
| **ARPA** | MRR / Active Accounts | Average revenue per account | Evaluates account-level pricing and deal quality | B2B SaaS: $100-$10K+ depending on segment |
| **ARPA/ARPU** | Both metrics together | Account value vs. seat monetization | Prevents packaging mistakes with wrong denominator | High ARPA + low ARPU = undermonetized per seat |
| **ACV** | Annual recurring revenue per contract | Annualized contract value (excludes one-time fees) | Compares economics across different contract structures | SMB: $5K-$25K; Mid-market: $25K-$100K; Enterprise: $100K+ |
| **MRR/ARR** | MRR × 12 = ARR | Predictable recurring revenue | Heartbeat of subscription business; valued at 5-10x+ multiples | Growth rate and quality matter; track components (new, expansion, churn) |
| **Burn Rate** | Monthly Cash Spent - Revenue | Cash consumed per month | Determines what you can build and when you need funding | Net burn <$200K manageable; >$500K needs clear path to revenue |
| **Runway** | Cash Balance / Monthly Burn | Months until money runs out | Literal survival metric | 12+ months good; <6 months crisis mode |
| **OpEx** | Operating expenses (S&M, R&D, G&A) | Costs to run the business (not COGS) | Your team's salaries; where "efficiency" cuts happen | Should grow slower than revenue as you scale |
| **Net Income** | Revenue - All Expenses | Actual profit/loss | True bottom line; are you making money? | Early SaaS often negative; mature should be 10-20%+ margin |
| **LTV:CAC** | LTV / CAC | Unit economics efficiency | Is growth sustainable or buying revenue at a loss? | 3:1 healthy; <1:1 unsustainable; >5:1 might be underinvesting |
| **Payback Period** | CAC / (Monthly ARPU × Gross Margin %) | Months to recover CAC | Cash efficiency; faster = can reinvest sooner | <12 months great; 12-18 ok; >24 months concerning |
| **NRR** | (Start ARR + Expansion - Churn - Contraction) / Start ARR | Revenue retention + expansion | Holy grail: grow without new logos | >120% excellent; 100-120% good; <90% problem |
| **Contribution Margin** | (Revenue - All Variable Costs) / Revenue | True contribution after all variable costs | Gross margin + support/processing/variable costs | 60-80% good for SaaS; <40% concerning |
| **Expansion Revenue** | Upsells + Cross-sells + Usage Growth | Additional revenue from existing customers | Most capital-efficient revenue (no CAC) | Should drive NRR >100%; aim for 20-30% of total revenue |
| **Rule of 40** | Growth Rate % + Profit Margin % | Balance of growth vs. efficiency | Framework for growth/profitability trade-offs | >40 healthy; 25-40 acceptable; <25 concerning |
| **Gross vs. Net Revenue** | Net = Gross - Discounts - Refunds - Credits | What you actually keep | Discounts and refunds can hide bad acquisition quality | Refunds >10% is a red flag; track by channel |
| **Revenue Concentration** | Top N Customers / Total Revenue | Dependency on largest customers | Existential risk and roadmap distortion | Top customer <10%; Top 10 <40% ideal |
| **Magic Number** | (Q Revenue - Prev Q Revenue) × 4 / Prev Q S&M | Sales & marketing efficiency | Is your GTM engine working? | >0.75 efficient; 0.5-0.75 ok; <0.5 fix before scaling |
| **Quick Ratio (SaaS)** | (New MRR + Expansion MRR) / (Churned MRR + Contraction) | Revenue gains vs. losses | Are you building on solid ground or running on treadmill? | >4 excellent; 2-4 healthy; <2 leaky bucket |
| **Unit Economics** | Revenue per unit - Cost per unit | Profitability of each "unit" | Is the business model fundamentally viable? | Positive contribution required; aim for >$0 after all variable costs |
| **Revenue Mix** | Breakdown of revenue by product/segment | Portfolio composition | Which products fund the business; where to invest | Track trends; no single product >60% ideal |
| **Cohort Analysis** | Group customers by join date; track behavior | Whether business is improving or degrading over time | Blended metrics hide critical trends | Recent cohorts should perform same or better than old |
| **Segment Payback** | CAC / Monthly Contribution (by segment) | Payback period by customer segment | Different segments have different economics | Compare across segments to allocate resources |
| **Incrementality** | Revenue caused by action - What would have happened anyway | True impact of marketing/promo | Don't celebrate revenue that would have happened anyway | Measure with holdout tests when possible |
| **CAC Payback by Channel** | CAC / Monthly Contribution (by acquisition channel) | Which channels recover investment fastest | Not all channels are created equal | Optimize mix; don't just scale highest volume |
| **Gross Margin Payback** | CAC / (Monthly Price × Gross Margin %) | Payback using actual profit, not revenue | More accurate than simple CAC payback | Typically 1.5-2x longer than simple payback |

---

## Quick Decision Framework

**When evaluating a feature investment:**
1. **Revenue impact**: Direct (pricing, add-on) or indirect (retention, conversion)?
2. **Margin impact**: What's the COGS? Does it dilute margins?
3. **CAC impact**: Does it reduce acquisition cost or enable new channels?
4. **LTV impact**: Does it reduce churn or drive expansion?
5. **The trade-off**: What's the ROI? Revenue / Cost or LTV impact / Investment?

**When evaluating a pricing change:**
1. **ARPU/ARPA impact**: Does it increase revenue per customer?
2. **Conversion impact**: Does it help or hurt trial-to-paid conversion?
3. **Churn impact**: Does it create churn risk or reduce it?
4. **NRR impact**: Does it enable expansion or create contraction?
5. **CAC impact**: Does it change payback period or channel viability?

**When evaluating a go-to-market investment:**
1. **CAC**: What does it cost to acquire a customer through this channel?
2. **LTV**: Are the customers acquired high-quality (retention, expansion)?
3. **Payback**: How fast do you recover the investment?
4. **Magic Number**: Is the overall S&M spend efficient (>0.75)?
5. **Scalability**: Can this channel sustain the growth you need?

**When evaluating business health:**
1. **Growth rate**: Are you growing fast enough for your stage?
2. **NRR**: Are existing customers expanding or shrinking?
3. **Quick Ratio**: Are you gaining more than you're losing?
4. **Rule of 40**: Are you balancing growth and efficiency?
5. **Burn vs. Runway**: Can you reach next milestone before running out of cash?

---

## Red Flags to Watch For

| **Red Flag** | **What It Means** | **What To Do** |
|-------------|-------------------|----------------|
| Churn increasing cohort-over-cohort | Product-market fit degrading | Stop scaling acquisition; fix retention first |
| LTV:CAC <1.5 | Buying revenue at a loss | Reduce CAC or increase LTV before scaling |
| Payback period >18 months | Cash-inefficient growth | Improve conversion, reduce CAC, or increase pricing |
| NRR <90% | Customers shrinking, not expanding | Fix product value before investing in acquisition |
| Magic Number <0.5 | S&M spend very inefficient | Fix product, ICP, or sales process before increasing spend |
| Top customer >30% of revenue | Existential concentration risk | Diversify immediately; don't build only for them |
| Gross margin <60% (SaaS) | Cost structure problem | Raise prices, reduce COGS, or reconsider the feature |
| Quick Ratio <2 | Leaky bucket problem | Plug the leaks (retention) before pouring in more (acquisition) |
| Refund rate >10% | Acquisition quality problem | Fix messaging, targeting, or onboarding |
| Revenue growth with margin collapse | Unprofitable growth | Evaluate margin by product/segment; cut low-margin revenue |

---

## Common PM Traps

1. **Optimizing the wrong metric**: CAC looks great, but LTV is terrible → optimize LTV:CAC, not CAC alone
2. **Celebrating vanity metrics**: Revenue up 50%, but churn also up 50% → net progress is zero
3. **Ignoring segment differences**: Blended metrics hide that half your business is unprofitable
4. **Confusing correlation and causation**: New feature launched, revenue went up → was it the feature or seasonality?
5. **Not tracking cohorts**: Your business might be degrading underneath stable blended metrics
6. **Premature scaling**: Scaling an inefficient engine (low Magic Number) just burns cash faster
7. **Underinvesting in retention**: Acquisition feels productive; retention is invisible until churn crisis
8. **Forgetting time value of money**: $10K over 5 years ≠ $10K today
9. **Treating all revenue equally**: $1M from 1 customer ≠ $1M from 1,000 customers
10. **Building features your biggest customer wants**: Concentration risk + you're building custom software, not a product

---

## Metrics to Pair Together (Never Use Alone)

- **CAC** → always pair with **LTV** (use LTV:CAC ratio)
- **Revenue growth** → always pair with **margin** and **burn rate**
- **Churn rate** → always pair with **cohort analysis**
- **MRR/ARR** → always pair with **NRR** (quality > quantity)
- **Gross margin** → always pair with **contribution margin** (includes variable costs)
- **Magic Number** → always pair with **CAC payback** (efficiency + cash timing)
- **NRR** → always pair with **expansion vs. contraction breakdown**
- **LTV** → always pair with **payback period** (total value + cash timing)
- **Unit economics** → always pair with **CAC** (per-unit + acquisition)
- **Revenue Mix** → always pair with **margin by product** (composition + quality)

---

**Print this. Pin it to your wall. Reference it in every business review.**
