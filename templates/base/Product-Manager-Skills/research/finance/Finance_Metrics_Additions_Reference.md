# Finance Metrics - Common Mistakes & When to Use Reference

This document contains the "Common Mistakes PMs Make" and "When to Use This Metric" sections to add to each metric in the Finance for Product Managers guide.

## How to Use This Document

For each metric below:
1. Find the **SEARCH FOR** text in your file
2. Add the **ADD AFTER** content immediately following it
3. The search strings are unique and should appear only once

---

## 1. REVENUE

**SEARCH FOR:**
```
So: **$5M** (B) dwarfs **$20k per month of new cohorts** (A). Feature A is nice. Feature B is "move the whole ocean one inch."

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Using simplistic LTV formulas**: ARPU × lifetime ignores expansion, margin, and discount rates - sophisticated models matter for big decisions.
- **Forgetting LTV varies by segment**: Your blended LTV of $5K might hide $500 SMB and $50K enterprise customers - segment matters.
- **Ignoring time value of money**: $10K over 5 years isn't worth $10K today - discount future cash flows for long LTV periods.
- **Celebrating high LTV without checking CAC payback**: $100K LTV means nothing if it takes 4 years to recover a $20K CAC and customers churn at 3 years.

### When to Use This Metric

- **Use this when**: Evaluating acquisition channel ROI, prioritizing retention vs. acquisition investments, setting pricing strategy, comparing customer segments.
- **Don't use this when**: Making decisions without CAC context (always use LTV:CAC ratio), for early-stage products without retention data, or when churn patterns are still unstable.
```

---

## 2. CHURN RATE

**SEARCH FOR:**
```
If you want the option list to be "correct," change option 2 to **"Around $280K"**.

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Treating all churn equally**: Losing a $50/month SMB customer is different from losing a $50K/year enterprise account - weight churn by revenue impact.
- **Ignoring cohort trends**: Blended 4% churn can hide 2% for old cohorts and 8% for new ones - your product might be degrading.
- **Celebrating gross churn without tracking net revenue retention**: Customers might stay but downgrade heavily - logo churn doesn't tell the revenue story.
- **Confusing monthly and annual churn rates**: 3% monthly churn ≠ 36% annual churn due to compounding (it's actually ~31% annual).

### When to Use This Metric

- **Use this when**: Evaluating product-market fit, prioritizing retention features, assessing customer success effectiveness, calculating LTV.
- **Don't use this when**: Making short-term tactical decisions (use daily/weekly engagement), evaluating new products with <12 months of data, or comparing across wildly different business models.
```

---

## 3. ARPU (Average Revenue Per User)

**SEARCH FOR:**
```
So **A adds more ARR**, but **B is more efficient/profitable per dollar spent** (and usually cleaner operationally, too).

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Confusing ARPU with ARPA (Average Revenue Per Account)**: In B2B with multi-seat pricing, ARPU can look terrible while ARPA looks great - know which you're measuring.
- **Celebrating ARPU growth from mix shift**: If ARPU rises because you lost all your small customers, that's not product improvement.
- **Ignoring ARPU by cohort**: Blended ARPU hides whether new customers are less valuable than old ones.
- **Forgetting gross margin**: $100 ARPU at 30% margin is worse than $80 ARPU at 80% margin.

### When to Use This Metric

- **Use this when**: Evaluating pricing changes, assessing upsell/cross-sell effectiveness, comparing customer segments, measuring monetization improvement.
- **Don't use this when**: Your pricing is pure usage-based (use unit economics instead), comparing across business models, or making decisions without considering acquisition costs.
```

---

## 4. ARPA/ARPU (Average Revenue Per Account/User)

**SEARCH FOR:**
```
  - ARPU = $30,000 / 10,000 users = **$3**

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Using the wrong denominator**: Measuring per-user when you charge per-account (or vice versa) creates confusion and bad decisions.
- **Not tracking both metrics**: In B2B SaaS, you need both ARPA and ARPU to understand account value vs. seat monetization.
- **Ignoring expansion within accounts**: ARPA can grow even if ARPU stays flat if customers add more seats.
- **Comparing ARPU across different packaging models**: Flat account pricing vs. per-seat pricing makes ARPU incomparable without context.

### When to Use This Metric

- **Use this when**: Evaluating packaging strategy (account vs. seat pricing), assessing monetization by user vs. by account, comparing customer segments with different adoption patterns.
- **Don't use this when**: You have pure usage-based pricing, comparing single-user B2C products, or making decisions without considering margin and CAC.
```

---

## 5. ACV (Annual Contract Value)

**SEARCH FOR:**
```
- Forecasting (what's your annual recurring run rate by segment?)

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Confusing ACV with TCV (Total Contract Value)**: A 3-year $90K deal has $90K TCV but $30K ACV - using TCV inflates your pipeline metrics.
- **Including one-time fees in ACV**: Professional services, setup fees, and hardware don't recur - keep ACV focused on recurring revenue only.
- **Comparing ACV without considering contract length**: $24K annual ACV vs. $20K three-year ACV isn't apples-to-apples for cash flow planning.
- **Celebrating high ACV without checking retention**: $100K ACV means nothing if customers churn after year one.

### When to Use This Metric

- **Use this when**: Setting sales compensation, comparing deal economics across segments, forecasting ARR by segment, evaluating sales efficiency.
- **Don't use this when**: Planning cash flow (use TCV and payment terms), evaluating profitability (use margin metrics), or comparing across monthly vs. annual vs. multi-year contracts without normalization.
```

---

## 6. MRR/ARR (Monthly/Annual Recurring Revenue)

**SEARCH FOR:**
```
If this were a CFO bar fight, they'd still ask about cash timing and margins… but _in this quiz's ruleset_, recurring wins.

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Including non-recurring revenue in ARR**: Professional services, one-time setup fees, and variable usage fees that aren't contracted don't belong in ARR.
- **Confusing bookings with ARR**: A $100K three-year contract signed today is $100K in bookings but only $33K in ARR.
- **Ignoring ARR quality**: $10M ARR from 10,000 customers at $1K each is healthier than $10M from 10 customers at $1M each.
- **Not tracking ARR movement categories**: New, expansion, contraction, churn - you need the components, not just the total.

### When to Use This Metric

- **Use this when**: Reporting company health, setting growth targets, valuing the business, planning capacity and hiring.
- **Don't use this when**: Assessing profitability (use margin metrics), evaluating deal quality without considering retention, or making short-term cash decisions (MRR/ARR ≠ cash).
```

---

## 7. BURN RATE

**SEARCH FOR:**
```
Tiny nit (worth fixing in the quiz): after month 6, if the $50K MRR is real and gross margin is decent, burn could drop below baseline. But you still have to **survive the first 6 months** to enjoy that sequel.

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Ignoring runway when planning features**: Building an 8-month feature with 9 months of runway leaves zero margin for error or hiring delays.
- **Confusing gross burn with net burn**: Gross burn is total spend; net burn is spend minus revenue - net burn matters for runway.
- **Celebrating revenue growth without checking burn**: Growing from $500K to $800K MRR while burn goes from $200K to $600K is not progress.
- **Forgetting burn rate changes over time**: Hiring, scaling infrastructure, and seasonal costs mean burn isn't constant.

### When to Use This Metric

- **Use this when**: Planning roadmaps, evaluating feature scope, making hiring decisions, determining fundraising timing.
- **Don't use this when**: Evaluating feature value in isolation from costs, making long-term strategic decisions without growth assumptions, or comparing across companies of different stages/models.
```

---

## 8. OPERATING EXPENSES (OpEx)

**SEARCH FOR:**
```
If you wanted this quiz to have a single "pure" answer, you'd need one extra input: **LTV (or gross profit) per activated customer**. Without that, "A vs B" is missing the money-to-outcome bridge, and "A then B" is the pragmatic move.

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Treating all OpEx as bad**: R&D and S&M are investments in growth - cutting too deeply kills the business. G&A tends to have more waste.
- **Ignoring OpEx leverage**: OpEx should grow slower than revenue as you scale - if both grow at the same rate, you're not building leverage.
- **Not distinguishing fixed vs. variable OpEx**: Salaries are sticky; contractors and marketing spend are flexible - know which levers you can actually pull.
- **Celebrating low OpEx without checking growth**: Starving the business of investment feels efficient until growth stalls.

### When to Use This Metric

- **Use this when**: Evaluating automation vs. hiring decisions, assessing overall cost structure, planning for profitability, understanding unit economics.
- **Don't use this when**: Making product feature decisions (use margin and LTV), evaluating variable customer costs (use COGS), or comparing early-stage to mature companies.
```

---

## 9. NET INCOME (PROFIT MARGIN)

**SEARCH FOR:**
```
**"$100K net profit (5% margin) - gross margin looks great, net is meh."**

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Confusing EBITDA with net income**: EBITDA ignores real costs (interest, taxes, depreciation) - net income is the true bottom line.
- **Ignoring one-time items**: A quarter with big write-offs or one-time gains distorts net income - look at normalized/adjusted figures.
- **Celebrating profitability too early**: SaaS companies should invest in growth when young - premature profitability can mean underinvestment.
- **Forgetting net income varies by accounting method**: Cash vs. accrual, revenue recognition policies - compare carefully across companies.

### When to Use This Metric

- **Use this when**: Evaluating overall business health, assessing path to profitability, comparing mature companies, understanding true economic performance.
- **Don't use this when**: Evaluating early-stage companies (focus on unit economics and growth), making product decisions in isolation, or comparing across wildly different business models.
```

---

## 10. LTV:CAC RATIO

**SEARCH FOR:**
```
so the channel can meet the minimum efficiency threshold.

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Using LTV without considering payback period**: 10:1 LTV:CAC is great unless it takes 5 years to recover CAC and customers churn at 3 years.
- **Ignoring segment differences**: Blended 3:1 ratio might hide 1:1 SMB and 8:1 enterprise - segment economics matter.
- **Celebrating high ratios from underinvestment**: 8:1 LTV:CAC from spending $0 on sales isn't efficient growth, it's missing opportunity.
- **Forgetting the ratio changes over time**: Early cohorts often have better ratios than later ones as you saturate best channels.

### When to Use This Metric

- **Use this when**: Evaluating acquisition channel efficiency, deciding whether to scale spending, assessing business model sustainability, comparing customer segments.
- **Don't use this when**: Making decisions without considering payback period, evaluating mature vs. early cohorts, or comparing across very different business models.
```

---

## 11. PAYBACK PERIOD

**SEARCH FOR:**
```
This is the key nuance: **payback period is about recovering CAC**, and annual billing changes the timing of cash recovery dramatically, even if the underlying gross margin % stays the same.

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Confusing payback period with LTV:CAC**: 6-month payback is about cash timing; 3:1 LTV:CAC is about overall economics - both matter.
- **Using revenue instead of gross margin**: Payback based on revenue ignores that you keep only ~70-80% after COGS - use margin dollars.
- **Not discounting for annual prepay**: Giving 20% discount for annual billing might extend payback despite upfront cash.
- **Ignoring that payback period varies by segment**: Enterprise might have longer payback but higher LTV - optimize for the right metric.

### When to Use This Metric

- **Use this when**: Evaluating pricing models (monthly vs. annual), assessing cash efficiency by channel, deciding which customer segments to prioritize, planning working capital needs.
- **Don't use this when**: Making decisions without LTV context, comparing across segments without considering lifetime value, or evaluating profitability in isolation.
```

---

## 12. NRR (NET REVENUE RETENTION)

**SEARCH FOR:**
```
- New customers needed (at $10K avg) = **$6M / $10K = 600 customers**

**If NRR improves to 120% (Strategy B goal):**
- Existing base next year = **$10M × 1.20 = $12M**
- ARR gap to $15M = **$15M − $12M = $3M**
- New customers needed (at $10K avg) = **$3M / $10K = 300 customers**

So Strategy B cuts the "new logo burden" roughly in half. It doesn't eliminate new sales, but it makes the math (and execution) dramatically more achievable.

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Celebrating NRR >100% without checking if it's from price increases or real expansion**: Price hikes inflate NRR but don't prove product value.
- **Ignoring cohort-level NRR**: Blended 110% NRR might hide 90% for recent cohorts and 130% for old ones - your product might be degrading.
- **Confusing gross revenue retention with net revenue retention**: GRR caps at 100%; NRR includes expansion and can exceed 100%.
- **Not breaking NRR into components**: Expansion, contraction, churn - you need to understand the drivers, not just the headline number.

### When to Use This Metric

- **Use this when**: Evaluating product-market fit in existing customers, assessing expansion revenue potential, comparing land-and-expand effectiveness, setting growth strategy.
- **Don't use this when**: Evaluating new products without enough cohort history, comparing across early-stage vs. mature businesses, or making acquisition decisions (NRR doesn't replace new logos).
```

---

## 13. CONTRIBUTION MARGIN

**SEARCH FOR:**
```
Either way, contribution margin forces the right follow-up question: **what's driving that support cost, and can we reduce it without hurting revenue?**

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Confusing contribution margin with gross margin**: Contribution margin includes all variable costs (support, processing, etc.); gross margin typically only includes COGS.
- **Ignoring that contribution margin varies by product/segment**: Your blended 65% might hide 90% for Product A and 40% for Product B.
- **Not allocating variable costs correctly**: Support that "scales with customers" needs to be in contribution margin, not treated as fixed OpEx.
- **Celebrating contribution without checking if it covers fixed costs**: 50% contribution margin is useless if your fixed OpEx is 60% of revenue.

### When to Use This Metric

- **Use this when**: Evaluating true product profitability, deciding which products/features to invest in, assessing pricing strategy, understanding unit economics.
- **Don't use this when**: Making decisions about fixed costs, comparing across businesses with different cost structures, or evaluating early-stage products without scale.
```

---

## 14. EXPANSION REVENUE

**SEARCH FOR:**
```
The meta-lesson: if you can drive meaningful expansion in an installed base, it often beats acquisition-focused improvements unless acquisition volume is massive.

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Treating expansion and new revenue as equivalent**: Expansion has zero CAC and higher retention - it's typically far more valuable per dollar.
- **Not building expansion paths into the product**: If upgrade is just "contact sales," you're leaving money on the table.
- **Celebrating expansion without checking if you're just catching up to where customers should have started**: Usage-based expansion might mean you underpriced initially.
- **Ignoring expansion vs. upsell vs. cross-sell**: Different mechanics, different economics - measure them separately.

### When to Use This Metric

- **Use this when**: Prioritizing upsell/cross-sell features, evaluating product packaging strategy, assessing customer success effectiveness, calculating NRR.
- **Don't use this when**: Making decisions without considering initial pricing (expansion might mean you undermonetized at signup), comparing across pure consumption vs. seat-based models.
```

---

## 15. RULE OF 40

**SEARCH FOR:**
```
So the best framing is: **same score, different risk profile** - and **Strategy B carries more downside if growth doesn't materialize**.

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Treating Rule of 40 as a hard law**: It's a heuristic, not physics - some investors use Rule of X (where X varies by market conditions).
- **Gaming the metric with unsustainable tactics**: You can hit 40 by cutting R&D to boost margins, but you'll kill future growth.
- **Ignoring that the optimal mix depends on stage**: Early-stage should prioritize growth over margin; mature businesses should prioritize margin.
- **Not considering capital efficiency**: 50% growth at -20% margin is Rule of 40 compliant but might be burning unsustainable cash.

### When to Use This Metric

- **Use this when**: Evaluating overall business health, making growth vs. efficiency trade-offs, comparing SaaS companies, communicating to investors.
- **Don't use this when**: Making product decisions directly, evaluating non-SaaS businesses, or comparing across vastly different stages (seed vs. pre-IPO).
```

---

## 16. GROSS VS. NET REVENUE

**SEARCH FOR:**
```
So the promo didn't generate $200K of "real" revenue. It generated **$80K** net, and the **20% refund rate** is the headline: it suggests lots of low-intent buyers, worse fit, or bait-and-bounce behavior that can also inflate support costs and distort funnel metrics.

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Celebrating gross bookings without tracking net revenue**: Discounts, refunds, and credits can turn impressive gross numbers into mediocre net performance.
- **Ignoring refund rate as a quality signal**: High refunds don't just reduce revenue - they signal poor fit or misleading acquisition.
- **Not separating promotional vs. organic net revenue**: Discounted customers often have worse retention and expansion - track cohorts separately.
- **Forgetting that gross-to-net conversion varies by channel**: Paid social might have higher refunds than organic - measure by source.

### When to Use This Metric

- **Use this when**: Evaluating promotions, assessing acquisition channel quality, calculating true revenue contribution, planning cash flow.
- **Don't use this when**: Making high-level strategic decisions (use ARR/MRR), comparing across businesses with different refund policies, or evaluating long-term retention (refunds are early signals).
```

---

## 17. REVENUE CONCENTRATION RISK

**SEARCH FOR:**
```
In short: protect the near-term oxygen, then build an organization that doesn't need that oxygen tank forever.

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Not recognizing concentration risk until renewal time**: By then it's too late to diversify - monitor concentration continuously.
- **Building product roadmap around one customer's requests**: You're building custom software, not a scalable product.
- **Celebrating big logo wins without considering concentration risk**: Landing a customer worth 40% of ARR is a risk, not just a win.
- **Ignoring that concentration can increase even as you grow**: If your biggest customer grows faster than your business, concentration gets worse.

### When to Use This Metric

- **Use this when**: Setting product strategy, evaluating pricing and packaging, planning sales territories, assessing business risk for investors.
- **Don't use this when**: Making individual feature decisions, evaluating profitability, or comparing across B2B vs. B2C models (concentration dynamics differ).
```

---

## 18. MAGIC NUMBER

**SEARCH FOR:**
```
Otherwise you're just turning up the volume on a leaky speaker.

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Ignoring that Magic Number varies by business model**: Enterprise SaaS might have 0.5-0.75; SMB SaaS might need 1.0+ due to higher churn.
- **Not giving investments time to mature**: Q1 S&M spend often generates Q2-Q3 revenue - measure with appropriate lag.
- **Celebrating Magic Number improvement from cutting spend**: 1.5 Magic Number from spending $0 isn't efficiency, it's underinvestment.
- **Forgetting that the metric is backward-looking**: Strong historical Magic Number doesn't guarantee future efficiency as you scale.

### When to Use This Metric

- **Use this when**: Evaluating sales & marketing efficiency, deciding whether to scale spend, diagnosing growth problems, comparing quarters or channels.
- **Don't use this when**: Making product decisions, evaluating very early-stage businesses, or comparing across wildly different sales cycles.
```

---

## 19. QUICK RATIO (SaaS)

**SEARCH FOR:**
```
So yes: celebrate the gross adds if you want. But the decision implication is: **don't blindly double sales hiring until you understand and reduce the $250K of leakage.**

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Celebrating Quick Ratio >2 without examining absolute churn**: $250K churned per quarter is a crisis even if Quick Ratio is 2.0.
- **Not segmenting Quick Ratio by cohort**: Recent cohorts might have terrible ratios while old cohorts prop up the blended number.
- **Ignoring that Quick Ratio can be gamed**: Aggressive discounting inflates new MRR and temporarily boosts the ratio.
- **Forgetting Quick Ratio should improve over time**: As you mature, leakage should decrease and expansion should increase.

### When to Use This Metric

- **Use this when**: Evaluating growth quality, prioritizing retention vs. acquisition, diagnosing churn problems, tracking business health month-over-month.
- **Don't use this when**: Comparing across early-stage vs. mature businesses, making product decisions without understanding root causes, or evaluating profitability.
```

---

## 20. UNIT ECONOMICS

**SEARCH FOR:**
```
The safe conclusion is that the free tier needs either lower cost, higher ad revenue, or tighter limits to avoid scaling a loss engine.

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Assuming unit economics will "fix themselves at scale"**: If you lose money per unit now, scaling makes it worse unless you have a specific plan to improve.
- **Ignoring fixed costs in early analysis**: Unit economics look great if you ignore R&D, support infrastructure, and platform costs.
- **Not segmenting unit economics by channel/cohort**: Blended profitability might hide that Facebook ads lose money while organic is great.
- **Celebrating contribution margin without considering CAC**: $50 contribution per customer is useless if CAC is $200.

### When to Use This Metric

- **Use this when**: Evaluating business model viability, deciding whether to scale, assessing freemium vs. paid models, comparing customer segments.
- **Don't use this when**: Evaluating very early products (sample size too small), making decisions without considering acquisition costs, or comparing across vastly different business models.
```

---

## 21. REVENUE MIX

**SEARCH FOR:**
```
- **Add-on A (Analytics):** substantial base (**$2M ARR**), strong growth (**40%**), and solid margin (**65%**). It's large enough to matter, growing fast enough to compound, and profitable enough that growth is high-quality.

***
```

**ADD AFTER (before the `***`):**
```markdown

### Common Mistakes PMs Make

- **Not tracking revenue mix changes over time**: Shifts tell you which products are growing or dying - static mix hides dynamics.
- **Ignoring that different revenue types have different economics**: Subscription vs. usage vs. professional services have wildly different margin and retention.
- **Celebrating diversification without checking profitability**: Having 10 products each at 10% of revenue is useless if 8 lose money.
- **Not modeling how mix affects overall metrics**: If low-margin products grow faster, blended margin deteriorates even if each product is stable.

### When to Use This Metric

- **Use this when**: Setting portfolio strategy, allocating R&D investment, evaluating M&A opportunities, understanding business composition for investors.
- **Don't use this when**: Making individual feature decisions, evaluating early-stage single-product companies, or comparing across businesses with different structures.
```

---

## 22. COHORT ANALYSIS

**SEARCH FOR:**
```
[End of document - this is the last metric in the original file]
```

**ADD AFTER (at the end of the Cohort Analysis section, before any next metric or end of file):**
```markdown

### Common Mistakes PMs Make

- **Not running cohort analysis until there's a crisis**: By the time blended metrics look bad, cohort trends have been deteriorating for months.
- **Defining cohorts only by signup month**: Segment by acquisition channel, feature usage, pricing tier - different cohort definitions reveal different insights.
- **Ignoring that cohort behavior changes over time**: Product updates affect all cohorts, not just new ones - track how cohorts evolve.
- **Celebrating recent cohort improvements without data maturity**: 2-month-old cohorts haven't been tested by real lifecycle events yet.

### When to Use This Metric

- **Use this when**: Diagnosing retention problems, evaluating product changes over time, assessing go-to-market effectiveness, understanding LTV by segment.
- **Don't use this when**: Making very short-term decisions, evaluating brand new products (need 6-12+ months of data), or comparing across businesses with different lifecycles.
```

---

## END OF REFERENCE DOCUMENT

**Total Metrics Covered:** 22+

**Instructions:**
1. Use find-and-replace in your text editor
2. Search for each "SEARCH FOR" string
3. Add the corresponding "ADD AFTER" content
4. The sections should appear between the "Here's Why" explanation and the `***` divider before the next metric

**Notes:**
- All search strings are unique and should only appear once
- The content is formatted consistently for easy scanning
- Each metric gets both "Common Mistakes" and "When to Use" sections
