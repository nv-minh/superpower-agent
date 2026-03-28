# Finance Suite Summary

**7 Skills for SaaS Finance & Unit Economics**

**Release Date:** February 8, 2026
**Suite Version:** 1.0 (repo v0.3)
**Total Skills:** 7 (3 Component + 4 Interactive)
**Total Lines:** 4,290
**Coverage:** 32 SaaS finance metrics

---

## Overview

The Finance Suite provides product managers with comprehensive tools to understand, calculate, and apply SaaS finance metrics for better decision-making. The suite covers revenue & growth metrics, unit economics, capital efficiency, and provides interactive advisors for feature prioritization, channel evaluation, pricing decisions, and business health diagnostics.

**What's included:**
- **Foundation layer:** Deep metric understanding (32 metrics across revenue, economics, efficiency)
- **Reference layer:** Fast lookup for formulas and benchmarks
- **Decision layer:** Interactive advisors for feature, channel, and pricing decisions
- **Diagnostic layer:** Comprehensive business health assessment

**What's NOT included (future Phase 8):**
- Comprehensive pricing strategy (value-based pricing, WTP research)
- Packaging architecture design
- Pricing psychology and behavioral tactics
- Monetization model selection frameworks

---

## Suite Architecture

### Foundation Layer (Skills #1-3)

**Purpose:** Learn and calculate metrics

**Skills:**
1. `saas-revenue-growth-metrics` — Revenue, retention, growth metrics
2. `saas-economics-efficiency-metrics` — Unit economics, capital efficiency
3. `finance-metrics-quickref` — Fast lookup reference

### Decision Layer (Skills #4-6)

**Purpose:** Apply metrics to PM decisions

**Skills:**
4. `feature-investment-advisor` — Build/don't build feature decisions
5. `acquisition-channel-advisor` — Scale/test/kill channel decisions
6. `finance-based-pricing-advisor` — Go/no-go pricing change decisions

### Diagnostic Layer (Skill #7)

**Purpose:** Holistic business assessment

**Skills:**
7. `business-health-diagnostic` — Comprehensive health scorecard

---

## Skill Details

### Skill #1: `saas-revenue-growth-metrics` (Component)

**Purpose:** Master revenue and retention metrics to understand SaaS business momentum.

**Coverage (13 metrics):**
- Revenue
- ARPU (Average Revenue Per User)
- ARPA (Average Revenue Per Account)
- ARPA/ARPU Analysis
- ACV (Annual Contract Value)
- MRR/ARR (Monthly/Annual Recurring Revenue)
- Gross vs. Net Revenue
- Churn Rate
- NRR (Net Revenue Retention)
- Expansion Revenue
- Quick Ratio (SaaS)
- Revenue Mix Analysis
- Cohort Analysis

**Key Concepts:**
- Revenue metrics family
- Retention & expansion metrics family
- Analysis frameworks (cohort, revenue mix)
- Anti-patterns (vanity metrics, logo vs. revenue churn)

**Supporting Files:**
- `template.md` — Fill-in calculator for all metrics
- `examples/healthy-saas.md` — Healthy metrics example
- `examples/warning-signs.md` — Leaky bucket scenario with fixes

**Size:** 619 lines

---

### Skill #2: `saas-economics-efficiency-metrics` (Component)

**Purpose:** Determine whether your SaaS business model is fundamentally viable and capital-efficient.

**Coverage (17 metrics):**

**Unit Economics (8):**
- Gross Margin
- CAC (Customer Acquisition Cost)
- LTV (Lifetime Value)
- LTV:CAC Ratio
- Payback Period
- Contribution Margin
- Gross Margin Payback
- CAC Payback by Channel

**Capital Efficiency (5):**
- Burn Rate
- Runway
- Operating Expenses (OpEx)
- Net Income (Profit Margin)
- Working Capital Impact

**Efficiency Ratios (4):**
- Rule of 40
- Magic Number
- Operating Leverage
- Unit Economics

**Key Concepts:**
- Unit economics family (CAC, LTV, payback, margins)
- Capital efficiency family (burn, runway, OpEx)
- Efficiency ratios (Rule of 40, magic number)
- Anti-patterns (ignoring payback, celebrating high LTV without checking cash flow)

**Supporting Files:**
- `template.md` — Comprehensive unit economics calculator
- `examples/healthy-unit-economics.md` — Profitable scaling example
- `examples/cash-trap.md` — Good LTV:CAC but terrible payback warning

**Size:** 684 lines

---

### Skill #3: `finance-metrics-quickref` (Component)

**Purpose:** Quick reference for any SaaS finance metric without deep teaching.

**Coverage:**
- All 32 metrics in one-page table format
- Formulas, benchmarks, what it measures, why PMs care
- 4 quick decision frameworks (feature, channel, pricing, health)
- Red flags table organized by category
- When-to-use guidance by decision type

**Key Features:**
- Optimized for scanning/searching
- No deep teaching (links to Skills #1-2 for details)
- Pure reference format
- Stage-specific benchmarks

**Size:** 256 lines

---

### Skill #4: `feature-investment-advisor` (Interactive)

**Purpose:** Guide PMs through evaluating whether to build a feature based on financial impact analysis.

**Interactive Flow (4 steps):**
1. **Revenue connection** — Direct monetization vs. indirect (retention/conversion/expansion)
2. **Cost structure** — Dev cost + COGS + OpEx impact
3. **Constraints** — Competitive threat, capacity limits, dependencies
4. **Recommendations** — Build now / Build for strategic reasons / Don't build / Build later

**Recommendation Patterns:**
- ✅ **Build now:** Strong ROI (>3:1 direct, >10:1 retention), positive margin
- ⚠️ **Build for strategic reasons:** Weak ROI but high strategic value
- 🚫 **Don't build:** Negative ROI, margin-diluting, no strategic value
- 🔄 **Build later:** High uncertainty, need validation first

**Key Features:**
- Adaptive branching based on revenue type
- Full ROI calculations with sensitivity analysis
- Margin impact analysis (contribution margin)
- Payback period calculations
- Comparison across features

**Supporting Files:**
- `examples/conversation-flow.md` — Complete time tracking add-on evaluation

**Size:** 615 lines

---

### Skill #5: `acquisition-channel-advisor` (Interactive)

**Purpose:** Guide PMs through evaluating whether to scale, test, or kill an acquisition channel.

**Interactive Flow (4 steps):**
1. **Unit economics** — CAC, LTV, LTV:CAC ratio, payback period by channel
2. **Customer quality** — Cohort retention, NRR, ICP fit by channel
3. **Scalability** — Magic number, addressable volume, CAC trend
4. **Recommendations** — Scale aggressively / Test & optimize / Kill or pause / Strategic investment

**Recommendation Patterns:**
- ✅ **Scale aggressively:** LTV:CAC >3:1, payback <12mo, high quality, magic number >0.75
- 🧪 **Test & optimize:** Marginal economics (2-3:1), fixable problems
- 🚫 **Kill or pause:** LTV:CAC <1.5:1, no path to improvement
- 🎯 **Strategic investment:** Poor economics but strategic value (cap spend)

**Key Features:**
- Multi-channel comparison tables
- Budget reallocation recommendations
- CAC trend analysis (improving, stable, degrading)
- Customer quality vs. quantity trade-offs
- Magic number efficiency scoring

**Supporting Files:**
- `examples/conversation-flow.md` — Content marketing channel evaluation (16:1 LTV:CAC)

**Size:** 619 lines

---

### Skill #6: `finance-based-pricing-advisor` (Interactive)

**Purpose:** Evaluate the financial impact of pricing changes using ARPU/ARPA analysis, conversion, churn risk, and NRR effects.

**Scope:**
- **What this is:** Financial impact evaluation for pricing decisions
- **What this is NOT:** Value-based pricing, WTP research, packaging architecture (see future Phase 8)

**Interactive Flow (4 steps):**
1. **Pricing change type** — Price increase, new tier, add-on, usage-based, discount, packaging
2. **Expected impact** — ARPU lift, conversion change, churn risk, expansion potential
3. **Current state** — Baseline metrics (MRR, ARPU, churn, NRR, CAC)
4. **Recommendations** — Implement broadly / Test first (A/B) / Modify approach / Don't change

**Recommendation Patterns:**
- ✅ **Implement broadly:** Clear positive net revenue, low churn risk
- 🧪 **Test first (A/B):** Uncertain impact, need validation before broad rollout
- ⚠️ **Modify approach:** Original proposal risky, better alternative exists
- 🚫 **Don't change:** Risks outweigh benefits, focus elsewhere

**Key Features:**
- Adaptive branching by pricing change type
- Churn modeling (net revenue after churn losses)
- CAC payback impact calculation
- Sensitivity analysis (optimistic/pessimistic/breakeven scenarios)
- Grandfathering strategy recommendations

**Size:** 739 lines

---

### Skill #7: `business-health-diagnostic` (Interactive)

**Purpose:** Diagnose overall SaaS business health by analyzing growth, retention, unit economics, and capital efficiency together.

**Interactive Flow (4 steps):**
1. **Growth & retention** — Revenue growth, NRR, churn, Quick Ratio, cohort trends
2. **Unit economics** — CAC, LTV, LTV:CAC, payback, gross margin
3. **Capital efficiency** — Burn rate, runway, Rule of 40, magic number, operating leverage
4. **Comprehensive diagnostic** — Health scorecard with prioritized recommendations

**Diagnostic Patterns:**
- ✅ **Healthy:** All dimensions strong, optimization opportunities identified
- ⚠️ **Moderate:** 1-2 fixable issues, clear 90-day action plan
- 🚨 **Concerning:** Multiple urgent issues, 90-day survival plan
- 🚨🚨 **Critical:** Existential crisis, emergency actions required

**Key Features:**
- Stage-specific benchmarks (Early / Growth / Scale)
- Red flag categorization (Critical / High / Medium priority)
- Prioritized actions (top 1-3 issues with timeline)
- Leading indicators (not just lagging metrics)
- Orchestrates all 32 metrics from Skills #1-3

**Size:** 758 lines

---

## Metrics Coverage Map

### Revenue & Growth (13 metrics)
**Source:** Skill #1

- Revenue
- ARPU / ARPA / ACV
- MRR / ARR
- Churn Rate
- NRR
- Expansion Revenue
- Quick Ratio
- Revenue Mix
- Cohort Analysis
- Gross vs. Net Revenue

### Unit Economics (8 metrics)
**Source:** Skill #2

- CAC
- LTV
- LTV:CAC Ratio
- Payback Period
- Gross Margin
- Contribution Margin
- Gross Margin Payback
- CAC Payback by Channel

### Capital Efficiency (9 metrics)
**Source:** Skill #2

- Burn Rate
- Runway
- OpEx
- Net Income
- Rule of 40
- Magic Number
- Operating Leverage
- Unit Economics
- Working Capital Impact

### Quick Reference (All 32 metrics)
**Source:** Skill #3

- Complete lookup table
- Formulas, benchmarks, red flags
- Decision frameworks
- When-to-use guidance

---

## Decision Frameworks

### Framework 1: Should We Build This Feature?
**Skill:** `feature-investment-advisor`

**Key Questions:**
1. Revenue connection? (Direct monetization or indirect retention/conversion/expansion)
2. Cost structure? (Dev cost, COGS, OpEx)
3. ROI calculation? (Revenue impact / Investment)
4. Strategic value? (Competitive moat, platform enabler, market positioning)

**Decision Criteria:**
- **Build if:** ROI >3:1 (direct) OR LTV impact >10:1 (retention) OR strategic value overrides
- **Don't build if:** Negative contribution margin, payback exceeds customer lifetime

**Metrics used:** Revenue, ARPU, Gross Margin, Contribution Margin, LTV

---

### Framework 2: Should We Scale This Channel?
**Skill:** `acquisition-channel-advisor`

**Key Questions:**
1. Unit economics? (CAC, LTV, LTV:CAC ratio, payback)
2. Customer quality? (Cohort retention, NRR by channel, ICP fit)
3. Scalability? (Magic Number, addressable volume, CAC trend)
4. Strategic fit? (Segment match, sales motion compatibility)

**Decision Criteria:**
- **Scale if:** LTV:CAC >3:1 AND payback <18mo AND quality good AND magic number >0.75
- **Kill if:** LTV:CAC <1.5:1 AND no clear path to improvement

**Metrics used:** CAC, LTV, LTV:CAC, Payback, NRR, Magic Number, Churn Rate

---

### Framework 3: Should We Change Pricing?
**Skill:** `finance-based-pricing-advisor`

**Key Questions:**
1. ARPU/ARPA impact? (Will revenue per customer increase?)
2. Conversion impact? (Help or hurt trial-to-paid conversion?)
3. Churn risk? (Will existing customers leave?)
4. NRR impact? (Enable expansion or create contraction?)
5. CAC payback impact? (Does pricing change affect unit economics?)

**Decision Criteria:**
- **Implement if:** Net revenue impact positive after churn risk, can test with segment first
- **Don't change if:** High churn risk without offsetting expansion, can't test hypothesis

**Metrics used:** ARPU, ARPA, Churn Rate, NRR, CAC Payback, Conversion Rate

---

### Framework 4: Is the Business Healthy?
**Skill:** `business-health-diagnostic`

**Key Questions:**
1. Growth & retention? (Revenue growth, NRR, churn, Quick Ratio)
2. Unit economics? (LTV:CAC, payback, gross margin)
3. Capital efficiency? (Rule of 40, magic number, runway)
4. Stage-appropriate benchmarks? (Early vs. Growth vs. Scale)

**Decision Criteria:**
- **Healthy:** All dimensions meet stage benchmarks, improving trends
- **Concerning:** Multiple red flags, urgent action required

**Metrics used:** All 32 metrics synthesized across 4 dimensions

---

## Stage-Specific Benchmarks

### Early Stage (Pre-$10M ARR)
**Focus:** Product-market fit, unit economics

| Metric | Benchmark |
|--------|-----------|
| Growth Rate | >50% YoY |
| LTV:CAC | >3:1 |
| Gross Margin | >70% |
| Runway | >12 months |
| Acceptable | Negative margins, high burn (if unit economics work) |

### Growth Stage ($10M-$50M ARR)
**Focus:** Scaling efficiently

| Metric | Benchmark |
|--------|-----------|
| Growth Rate | >40% YoY |
| NRR | >100% |
| Rule of 40 | >40 |
| Magic Number | >0.75 |
| Acceptable | Moderate burn if growth is strong |

### Scale Stage ($50M+ ARR)
**Focus:** Profitability, efficiency

| Metric | Benchmark |
|--------|-----------|
| Growth Rate | >25% YoY |
| NRR | >110% |
| Rule of 40 | >40 |
| Profit Margin | >10% |
| Required | Positive or near-positive cash flow |

---

## How to Use the Suite

### For Quarterly Business Reviews

**Workflow:**
1. Start with `business-health-diagnostic` — Get comprehensive health scorecard
2. Identify top 1-3 priorities from diagnostic
3. Use decision advisors to address priorities:
   - Retention problem? → Use `feature-investment-advisor` for retention features
   - Acquisition problem? → Use `acquisition-channel-advisor` for channel optimization
   - Monetization problem? → Use `finance-based-pricing-advisor` for pricing changes
4. Monitor with `saas-revenue-growth-metrics` and `saas-economics-efficiency-metrics` weekly/monthly

### For Feature Prioritization

**Workflow:**
1. Review `saas-revenue-growth-metrics` — Understand current ARPU, churn, NRR
2. Review `saas-economics-efficiency-metrics` — Understand LTV, contribution margin
3. Use `feature-investment-advisor` — Evaluate feature ROI
4. Compare features side-by-side using ROI calculations

### For Channel Budget Allocation

**Workflow:**
1. Calculate CAC, LTV, payback by channel using `saas-economics-efficiency-metrics`
2. Use `acquisition-channel-advisor` for each channel
3. Get multi-channel comparison table with recommendations
4. Reallocate budget from low-ROI to high-ROI channels

### For Board/Investor Meetings

**Workflow:**
1. Run `business-health-diagnostic` — Get comprehensive scorecard
2. Use `finance-metrics-quickref` — Prepare key metrics slides
3. Reference decision advisors for "What did you do this quarter?" narrative:
   - Features built → `feature-investment-advisor` ROI
   - Channels scaled → `acquisition-channel-advisor` efficiency
   - Pricing changes → `finance-based-pricing-advisor` impact

---

## Common Use Cases

### Use Case 1: "Should we build dark mode?"

**Skill:** `feature-investment-advisor`

**Steps:**
1. Revenue connection: Indirect (retention improvement hypothesized)
2. Cost structure: $80K dev cost
3. Evidence: 50 feature requests, no churn data
4. Recommendation: Build later — validate churn impact first

### Use Case 2: "Should we scale Google Ads spend 2x?"

**Skill:** `acquisition-channel-advisor`

**Steps:**
1. Unit economics: CAC $800, LTV $2,000 (2.5:1 ratio)
2. Customer quality: Higher churn in first 90 days
3. Scalability: Magic number 0.6 (marginal)
4. Recommendation: Test & optimize before scaling

### Use Case 3: "Should we raise prices 20%?"

**Skill:** `finance-based-pricing-advisor`

**Steps:**
1. Pricing change: 20% increase for new customers only
2. Expected impact: +20% ARPU, <5% conversion drop
3. Churn risk: Low (existing customers grandfathered)
4. Recommendation: Implement — net positive with low risk

### Use Case 4: "Is our business healthy?"

**Skill:** `business-health-diagnostic`

**Steps:**
1. Growth: 40% YoY, NRR 95%
2. Economics: LTV:CAC 3.5:1, payback 12 months
3. Efficiency: Rule of 40 = 38, runway 12 months
4. Diagnosis: Moderate — fix retention (NRR <100%) before scaling

---

## Red Flags Reference

### Critical Red Flags (Fix Immediately)
- Runway <6 months
- LTV:CAC <1.5:1
- Churn accelerating cohort-over-cohort
- NRR <90%
- Magic Number <0.3

### High Priority (Fix This Quarter)
- Rule of 40 <25
- Payback >24 months
- Quick Ratio <2
- Gross margin <60%
- Revenue concentration >50% in top 10 customers

### Medium Priority (Address Within 6 Months)
- NRR 90-100% (flat, not growing)
- Magic Number 0.3-0.5
- Operating leverage negative
- Churn rate stable but high (>5% monthly)

---

## Integration with Other Skills

### Cross-References

**Finance skills reference:**
- Discovery skills (`discovery-interview-prep`) — Validate pricing and feature assumptions
- Positioning skills (`positioning-statement`) — Align pricing with value proposition
- User story skills (`user-story`) — Tie features to revenue impact

**Other skills reference finance:**
- Roadmap planning — Uses `feature-investment-advisor` for prioritization
- Customer research — Validates assumptions used in financial models
- Go-to-market — Uses `acquisition-channel-advisor` for channel strategy

---

## Future Enhancements (Phase 8)

### Pricing & Monetization Strategy Suite (7 skills planned)

**Comprehensive pricing topics NOT covered in current suite:**

1. `value-based-pricing-framework` (Component) — Price based on value delivered
2. `willingness-to-pay-research` (Interactive) — WTP research methodologies
3. `packaging-architecture-advisor` (Interactive) — Good-better-best tier design
4. `pricing-psychology-guide` (Component) — Anchoring, decoys, framing
5. `price-testing-methodology` (Component) — A/B testing pricing, cohort tests
6. `competitive-pricing-analysis` (Component) — Market positioning via pricing
7. `monetization-model-advisor` (Interactive) — Seat vs. usage vs. outcome pricing

**Why separate?**
- Pricing is a massive domain (psychology, strategy, research, testing)
- Current suite focuses on financial impact analysis (evaluating proposed changes)
- Future suite will cover comprehensive pricing strategy (designing from scratch)

---

## Source Materials

**Research files used (3,014 lines total):**
1. `research/finance/Finance for Product Managers.md` (1,788 lines) — 32 metrics with quizzes
2. `research/finance/Finance_For_PMs.Putting_It_Together_Synthesis.md` (478 lines) — Decision frameworks
3. `research/finance/Finance_Metrics_Additions_Reference.md` (626 lines) — Common mistakes
4. `research/finance/Finance_QuickRef.md` (122 lines) — One-page lookup table

---

## Validation & Quality

**All 7 skills pass validation:**
```bash
$ python3 scripts/check-skill-metadata.py
All skills pass metadata checks. ✅
```

**Quality criteria met:**
- ✅ YAML frontmatter valid (name, description, intent, type)
- ✅ Names ≤64 chars (Claude web compatibility)
- ✅ Descriptions ≤200 chars (Claude web compatibility)
- ✅ Folder names match frontmatter names
- ✅ Standard anatomy followed (Purpose, Key Concepts, Application, Examples, Common Pitfalls, References)
- ✅ Cross-references work (all referenced skills exist)
- ✅ Interactive skills have 3-5 adaptive questions with enumerated options
- ✅ Examples are specific and actionable
- ✅ No generic fluff or hedge language

---

## Release Notes

**Suite Version:** 1.0 (repo v0.3)
**Release Date:** February 8, 2026
**License:** CC BY-NC-SA 4.0

**Included in release:**
- 7 skills (3 component, 4 interactive)
- 4,290 lines of content
- 32 SaaS finance metrics covered
- 6 calculator templates
- 8 example files (scenarios, conversation flows)
- Complete cross-referencing

**Known limitations:**
- Does not cover comprehensive pricing strategy (future Phase 8)
- Assumes baseline understanding of SaaS business models
- Benchmarks are industry averages (your mileage may vary)

---

## Support & Feedback

**Questions or issues?**
- See `docs/Using PM Skills with Claude.md` for usage guidance
- See `docs/Building PM Skills.md` for contribution guidelines
- Report issues: [GitHub repository URL]

**Future updates:**
- Additional conversation flow examples
- Sample dashboards and templates
- Calculator spreadsheets
- Video walkthroughs

---

**Last Updated:** February 8, 2026
**Maintainer:** Dean Peters
**Repository:** product-manager-skills
