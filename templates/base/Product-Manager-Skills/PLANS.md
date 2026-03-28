# Product Manager Skills — Development Roadmap

**Last Updated:** 2026-03-06
**Status:** Phase 1 COMPLETE ✅ | Phase 2 COMPLETE ✅ | Phase 3 COMPLETE ✅ | Phase 4 COMPLETE ✅ | Phase 5 COMPLETE ✅ | Phase 6 COMPLETE ✅ | Phase 7 PLANNED ⏳
**Version:** v0.6 (Released March 6, 2026)

---

## v0.6 Navigation + Commands Program (Phased)

Goal: make this repo as easy to navigate and run as possible at 60+ skills, without introducing plugins.

### Phase 1: Operating Model (Complete)
- [x] Keep current architecture: `skills/<skill-name>/SKILL.md` remains the core library.
- [x] Preserve local skill subtypes: `component`, `interactive`, `workflow`.
- [x] Add command architecture as orchestration wrappers over existing skills.

Exit criteria:
- A `commands/` directory exists with command definitions that reference existing skills.

### Phase 2: Navigation System (Complete)
- [x] Add generated catalog artifacts for skills and commands.
- [x] Add quick browse pages (`catalog/skills-by-type.md`, `catalog/commands.md`).
- [x] Add command discovery script (`scripts/find-a-command.sh`).

Exit criteria:
- Users can browse by type and search skills/commands from the terminal.

### Phase 3: Fast Onboarding (Complete)
- [x] Add a single-entry quick-start guide (`START_HERE.md`).
- [x] Add copy/paste "do this now" usage paths.
- [x] Wire quick-start into the root README.

Exit criteria:
- A new user can run a skill or command in under 60 seconds.

### Phase 4: Commands v1 (Complete)
- [x] Create high-value commands for common PM outcomes (`discover`, `strategy`, `write-prd`, `plan-roadmap`, `prioritize`, `leadership-transition`).
- [x] Ensure each command includes invocation guidance, workflow checkpoints, and next steps.
- [x] Ensure each command references only local skills.

Exit criteria:
- Command files pass metadata/reference validation.

### Phase 5: Tooling + Validation (Complete)
- [x] Add command metadata validator (`scripts/check-command-metadata.py`).
- [x] Add command-enabled launcher (`scripts/run-pm.sh`) for skill/command execution scaffolding.
- [x] Add library-level test runner (`scripts/test-library.sh`) and catalog generator (`scripts/generate-catalog.py`).

Exit criteria:
- One command can validate skills + commands + generated catalogs.

### Phase 6: Documentation Consolidation (Complete)
- [x] Add README quick-start section for skills + commands.
- [x] Extend platform-specific docs with command-first examples.
- [x] Publish v0.6 release note after docs sweep.

Exit criteria:
- README + primary usage docs present one consistent flow.

### Phase 7: Streamlit Command Mode (Planned)
- [ ] Add command browsing/execution mode to Streamlit beta.
- [ ] Show command step progress and per-step outputs.

Exit criteria:
- Streamlit users can run either a skill or a command intentionally.

---

## 🎉 v0.4 Release

Current state: 42 skills with standardized facilitation behavior across interactive and guided workflow usage.

**v0.4 updates:**
- Fixed a facilitation regression where brevity-focused rewrites could remove expected one-question-at-a-time walkthrough behavior
- Established `skills/workshop-facilitation/SKILL.md` as the facilitation source of truth
- Added protocol features: opening heads-up, context-dump bypass mode, best-guess mode, progress labels, and interruption handling
- Linked facilitation source-of-truth guidance across all interactive skills and facilitation-heavy workflow skills
- Codex diagnosed and implemented the cross-repo protocol fix

---

## 🎉 v0.3 Release

Current state: 42 skills with strict conformance checks and expanded onboarding documentation.

**v0.3 additions:**
- Added `skill-authoring-workflow` (workflow meta-skill for build/add/validate/doc update flow)
- Added operational onboarding docs:
  - `docs/Using PM Skills with ChatGPT.md`
  - `docs/PM Skills Rule-of-Thumb Guide.md`
  - `docs/PM Tooling Operations Charter.md`
- Added clearer GitHub ZIP install guidance for Claude Desktop/Web

**Foundation additions (Feb 8, 2026):**
- Phase 7 Finance suite (7 new skills)
- Automation tooling expansion: `add-a-skill`, `build-a-skill`, `find-a-skill`, `test-a-skill`
- Stricter metadata and structure conformance enforcement

> Note: Detailed phase tables below are preserved from earlier planning snapshots and may reference historical file naming conventions.

**Latest Additions (Feb 5, 2026):**
- `pol-probe` (Component) — Template for defining Proof of Life validation experiments
- `pol-probe-advisor` (Interactive) — Decision framework for choosing which of 5 prototype types to use
- `ai-shaped-readiness-advisor` (Interactive) — Assess AI maturity across 5 competencies (Context Design, Agent Orchestration, Outcome Acceleration, Team-AI Facilitation, Strategic Differentiation)
- `context-engineering-advisor` (Interactive) — Diagnose context stuffing vs. engineering; guide memory architecture, retrieval strategies, and Research→Plan→Reset→Implement cycle

Based on Dean Peters' Substack articles:
- [*Vibe First, Validate Fast, Verify Fit*](https://deanpeters.substack.com/p/vibe-first-validate-fast-verify-fit)
- [*AI-First Is Cute. AI-Shaped Is Survival.*](https://deanpeters.substack.com/p/ai-first-is-cute-ai-shaped-is-survival)
- [*Context Stuffing Is Not Context Engineering*](https://deanpeters.substack.com/p/context-stuffing-is-not-context-engineering)

**Major Structural Change (Feb 5, 2026):**
- Restructured from TYPE-based directories to flat skill-name directories
- All skill files renamed from `name.md` to `SKILL.md`
- Added YAML frontmatter to every skill (name, description, type)
- Updated all documentation to reflect new structure

**Old Structure:**
```
skills/
├── components/user-story.md
├── interactive/positioning-workshop.md
└── workflows/product-strategy-session.md
```

**New Structure (Anthropic-Compliant):**
```
skills/
├── user-story/SKILL.md
├── positioning-workshop/SKILL.md
└── product-strategy-session/SKILL.md
```

**Each SKILL.md includes:**
```yaml
---
name: skill-name
description: Brief description
type: component|interactive|workflow
---
```

This enables compatibility with `~/.claude/skills/` directory and standard Anthropic skills tooling.

---

<a id="future-skill-candidates"></a>
## 🔮 Future Skill Candidates (Detailed)

Detailed expansion of the short list in [`README.md`](README.md#future-skills).

### Dangerous Animals of Product Management
**Type:** Workflow skill

Feature hostage negotiations and stakeholder shuttle diplomacy. Diagnose which animal you're dealing with (HiPPOs, RHiNOs, WoLFs, oh my!), then apply tactical patterns for containment, redirection, or strategic retreat. Sometimes the hardest part of product management is not building the thing; it's surviving the meeting where everyone wants different things.

### Pricing for Product Managers
**Type:** Interactive advisor

Navigating pricing decisions without the panic spiral and flop sweat. Covers value-based pricing, packaging strategy, pricing-page psychology, grandfather clause negotiations, and how to raise prices without triggering mass exodus. Nothing makes a PM panic quite like "so what should we charge for this?"

### Classic Business Strategy Frameworks
**Type:** Component skills suite

Oldie-but-not-moldie strategy tools in agent-ready form: Ansoff Matrix (growth strategies), BCG Matrix (portfolio prioritization), Porter's 5 Forces (competitive analysis), Blue Ocean Strategy (uncontested market space), and SWOT done right. The frameworks your MBA friends won't shut up about, now designed to drive decisions instead of decorating slides.

### Storytelling for Product Managers
**Type:** Interactive workshop

Teach PMs how to bring the drama without bringing drama. Covers narrative arc for roadmap presentations, stakeholder storytelling patterns, demo choreography, investor pitch structure, make-them-feel-the-customer-pain techniques, and Hakawati-style oration. Built on lessons from a pro-opera career: command a room, hit the high notes, and leave them wanting an encore.

### Prompt Building for Product Managers
**Type:** Component skills suite

Industrial-strength prompt engineering. Build team session starters that set context and guardrails, multi-turn workflow wizards that guide complex processes step-by-step, and reverse engineering templates that reconstruct artifacts like PRDs from messy inputs. Because one-off prompts are for amateurs; repeatable prompt systems are for professionals.

### Nightmares of Product Management
**Type:** Interactive diagnostic

For when things don't go as planned. Telemetry to detect early warning signs, triage protocols for severity assessment, and tactical playbooks for containment and recovery. Covers the classics: adoption theater, feature graveyards, metric manipulation, launch amnesia, and technical debt wildfires. Plus prevention strategies so you don't star in next quarter's horror story.

---

## Overview

This repository contains distilled PM skills extracted from Dean Peters' `product-manager-prompts` repo. Skills are organized into three types, forming a three-tier architecture:

```
┌─────────────────────────────────────────┐
│   Workflow Skills                       │
│   (Orchestrate multiple skills)         │
│   e.g., "product-strategy-session.md"   │
└─────────────────────────────────────────┘
              ↓ references
┌─────────────────────────────────────────┐
│   Interactive Skills                    │
│   (Multi-turn question flows)           │
│   e.g., "positioning-workshop.md"       │
└─────────────────────────────────────────┘
              ↓ uses
┌─────────────────────────────────────────┐
│   Component Skills                      │
│   (Templates/artifacts)                 │
│   e.g., "positioning-statement.md"      │
└─────────────────────────────────────────┘
```

---

## Skill Types Explained

### Component Skills
**What:** Individual deliverables or artifacts (user stories, epics, positioning statements, PRD sections, OKRs, etc.)

**Characteristics:**
- Self-contained, reusable building blocks
- Focuses on "how to create X well"
- Template + quality criteria + examples + pitfalls
- Gets referenced by workflow and interactive skills

**Example:** `user-story.md` — how to write a proper user story with acceptance criteria

---

### Interactive Skills
**What:** Multi-turn conversational flows that gather context through sequential questioning and offer intelligent next-step recommendations.

**Characteristics:**
- Asks questions one at a time (or in small batches)
- Bounded to 3-5 questions max
- Uses answers to inform subsequent questions
- Offers **enumerated, context-aware recommendations** (3-5 numbered options)
- Allows user to select by number ("1", "2 & 4") or provide custom input
- Adapts based on user choices
- Applies Component skills at the end

**Example:** `positioning-workshop.md` — guides user through discovery questions, then generates a positioning statement using the `positioning-statement.md` component

---

### Workflow Skills
**What:** Multi-step processes or frameworks (discovery interviews, roadmap planning, stakeholder analysis, etc.)

**Characteristics:**
- Orchestrates multiple activities
- References component skills and interactive skills
- Includes decision points and branching logic
- Focuses on "how to complete process Y"

**Example:** `product-strategy-session.md` — guides through positioning → problem statement → JTBD → roadmap (orchestrating multiple component and interactive skills)

---

## Phase 1: Core Component Skills (In Progress)

**Goal:** Build the atomic building blocks that all other skills reference.

**Status:** ✅ = Complete | 🚧 = In Progress | ⏳ = Planned

| # | Skill | Source Prompt | Status |
|---|-------|--------------|--------|
| 1 | `positioning-statement.md` | `positioning-statement.md` | ✅ |
| 2 | `problem-statement.md` | `framing-the-problem-statement.md` | ✅ |
| 3 | `user-story.md` | `user-story-prompt-template.md` | ✅ |
| 4 | `jobs-to-be-done.md` | `jobs-to-be-done.md` | ✅ |
| 5 | `proto-persona.md` | `proto-persona-profile.md` | ✅ |
| 6 | `epic-hypothesis.md` | `backlog-epic-hypothesis.md` | ✅ |

**Rationale:** These six skills are the foundation. They're widely used, well-understood, and referenced by most other PM artifacts.

---

## Phase 2: Extended Component Skills (Planned)

**Goal:** Build supporting artifacts that expand the toolkit.

| # | Skill | Source Prompt | Status |
|---|-------|--------------|--------|
| 7 | `press-release.md` | `visionary-press-release.md` | ✅ |
| 8 | `user-story-splitting.md` | `user-story-splitting-prompt-template.md` | ✅ |
| 9 | `user-story-mapping.md` | `user-story-mapping.md` | ✅ |
| 10 | `recommendation-canvas.md` | `recommendation-canvas-template.md` | ✅ |
| 11 | `storyboard.md` | `storyboard-storytelling-prompt.md` | ✅ |
| 12 | `eol-message.md` | `eol-for-a-product-message.md` | ✅ |

---

## Phase 3: Research & Analysis Component Skills (Planned)

**Goal:** Build specialized, less frequently used artifacts.

| # | Skill | Source Prompt | Status |
|---|-------|--------------|--------|
| 13 | `customer-journey-map.md` | `customer-journey-mapping-prompt-template.md` | ✅ |
| 14 | `pestel-analysis.md` | `pestel-analysis-prompt-template.md` | ✅ |
| 15 | `company-research.md` | `company-profile-executive-insights-research.md` | ✅ |

---

## Phase 4: Interactive Skills (Planned)

**Goal:** Build multi-turn discovery flows that gather context and apply Component skills.

| # | Skill | Purpose | Status |
|---|-------|---------|--------|
| 16 | `positioning-workshop.md` | Multi-turn flow to discover positioning context | ✅ |
| 17 | `discovery-interview-prep.md` | Guides prep for customer discovery interviews | ✅ |
| 18 | `prioritization-advisor.md` | Helps choose prioritization framework based on context | ✅ |
| 19 | `tam-sam-som-calculator.md` | Adaptive TAM/SAM/SOM projection with citations | ✅ |
| 20 | `epic-breakdown-advisor.md` | Guides epic splitting and story creation | ✅ |
| 21 | `opportunity-solution-tree.md` | Generates OST with opportunity/solution mapping and POC selection | ✅ |
| 22 | `user-story-mapping-workshop.md` | Guided flow for creating story maps with backbone and release slices | ✅ |
| 23 | `customer-journey-mapping-workshop.md` | Guided flow for mapping customer journeys with pain points and opportunities | ✅ |
| 24 | `problem-framing-canvas.md` | MITRE Problem Framing Canvas (Look Inward/Outward/Reframe) | ✅ |
| 25 | `lean-ux-canvas.md` | Jeff Gothelf Lean UX Canvas v2 (hypothesis-driven planning) | ✅ |

**Note:** Interactive skills should:
- Limit to 3-5 questions max
- Offer 3-5 enumerated options per decision point
- Allow number selection or custom input
- Provide real-world citations for data-driven skills

---

## Phase 5: Workflow Skills (Complete)

**Goal:** Orchestrate Component + Interactive skills into end-to-end processes.

| # | Skill | Purpose | Orchestrates | Status |
|---|-------|---------|--------------|--------|
| 26 | `product-strategy-session.md` | End-to-end product positioning to roadmap | Multiple component + interactive skills | ✅ |
| 27 | `discovery-process.md` | Full discovery cycle from problem to validation | Discovery, interviews, synthesis | ✅ |
| 28 | `roadmap-planning.md` | Strategic roadmap development | Epics, OKRs, stakeholder mapping | ✅ |
| 29 | `prd-development.md` | Structured PRD creation process | Problem, personas, stories, acceptance criteria | ✅ |

---

## Not Converting (Deprioritized)

These prompts from `product-manager-prompts` are **not** being converted into skills:

- `a-generative-AI-prompt-builder-for-product-professionals.md` (meta-prompt)
- `Dangerous Animals of Product Management Beast Generator.md` (legacy creative generator; superseded by the structured workflow candidate above)
- `Nightmares of Product Management Movie Title Generator Prompt.md` (fun/creative)
- `futuristic-product-faq.md` (highly specialized)
- `strategic-scrum-team-session-kickoff.md` (workflow—may revisit in Phase 5)
- `reverse-engineer-IEEE830srs-to-PRD-prompt-template.md` (niche)
- `reverse-engineer-ISO29148-to-PRD-prompt-template.md` (niche)

---

## Skill Dependency Graph (Preliminary)

```
positioning-statement.md
├─ references: problem-statement.md
├─ references: jobs-to-be-done.md
└─ references: proto-persona.md

user-story.md
├─ references: proto-persona.md
└─ references: problem-statement.md

epic-hypothesis.md
├─ references: jobs-to-be-done.md
└─ references: proto-persona.md

user-story-splitting.md
└─ references: user-story.md

positioning-workshop.md (interactive)
├─ uses: positioning-statement.md
├─ uses: proto-persona.md
└─ uses: jobs-to-be-done.md

opportunity-solution-tree.md (interactive)
├─ uses: problem-statement.md
├─ uses: jobs-to-be-done.md
├─ uses: epic-hypothesis.md
└─ uses: user-story.md

product-strategy-session.md (workflow)
├─ uses: positioning-workshop.md
├─ uses: problem-statement.md
├─ uses: jobs-to-be-done.md
└─ uses: roadmap-planning.md
```

---

## Success Criteria

### Phase 1 Complete When:
- [ ] All 6 core component skills drafted
- [ ] Skills follow CLAUDE.md structure (Purpose, Key Concepts, Application, Examples, Pitfalls, References)
- [ ] Cross-references added between related skills
- [ ] Dean approves quality and depth

### Phase 2 Complete When:
- [ ] Extended component skills drafted
- [ ] Skills integrate with Phase 1 components
- [ ] Story splitting skill applies to both stories and epics

### Phase 4 Complete When:
- [ ] Interactive skills use bounded multi-turn flows (3-5 questions)
- [ ] Enumerated options (3-5 per question)
- [ ] Gracefully handle number selection, multi-selection, custom input
- [ ] Apply component skills at the end of discovery flow

### Phase 5 Complete When:
- [ ] Workflow skills orchestrate component + interactive skills
- [ ] Decision points and branching logic documented
- [ ] End-to-end processes tested with real PM scenarios

---

## Notes for Future Development

### Skill Composition Patterns
- **Component skills** should never reference workflow or interactive skills (uni-directional dependency)
- **Interactive skills** can reference component skills but not workflows
- **Workflow skills** can reference both component and interactive skills

### Quality Standards
- All skills must pass the Quality Checklist from CLAUDE.md:
  - Agent-ready (no clarifying questions needed)
  - Self-contained (defines its own terms)
  - Practical (at least one concrete example)
  - Opinionated (takes a stance)
  - Skimmable (headings + bullets convey 80% of value)
  - Zero fluff (every word earns its keep)

### Metadata to Track
- Source prompt filename
- Date created
- Last updated
- Related skills (references, used by)
- External frameworks cited

---

## Timeline (Aspirational)

- **Phase 1:** February 2026 (6 skills) ✅
- **Phase 2:** March 2026 (6 skills) ✅
- **Phase 3:** April 2026 (3 skills) ✅
- **Phase 4:** May 2026 (10 interactive skills) ✅
- **Phase 5:** June 2026+ (4 workflow skills) ✅
- **Phase 6:** Future (AI PM Orchestrator Skills) 📋

---

## Phase 6: AI PM Orchestrator Skills (Future)

**Goal:** Build skills for the remaining AI PM disciplines identified in Teresa Torres' framework and the "Context Engineering for Product Managers" research.

**Status:** 📋 Planned (not yet started)

**Background:** The comprehensive research document identified **5 essential AI PM disciplines**:
1. ✅ **Context Engineering** — Completed (`context-engineering-advisor`)
2. 📋 **Orchestration** — Breaking complex goals into agentic workflows
3. 📋 **Observability** — Tracing and logging to debug AI reasoning
4. 📋 **Evals (Evaluation)** — Automated quality testing for AI outputs
5. 📋 **Maintenance** — Ongoing updates as models drift

### Planned Skills (Priority Order)

| # | Skill | Type | Purpose | Priority |
|---|-------|------|---------|----------|
| 34 | `agent-orchestration-advisor` | Interactive | Guide PMs through breaking complex tasks into multi-step agentic workflows (research → synthesis → critique → decision) | High |
| 35 | `ai-product-evals` | Component | Template for designing evaluation frameworks (Golden Datasets, Code Assertions, LLM-as-Judge, Human Evals) | High |
| 36 | `ai-observability-framework` | Component | Guide for implementing tracing, logging, and error analysis in AI products | Medium |
| 37 | `ai-maintenance-planning` | Component | Template for planning ongoing updates as models drift or user data changes | Medium |
| 38 | `ai-product-orchestrator` | Workflow | Complete end-to-end process: Discovery → Context Design → Orchestration → Evals → Maintenance (2-4 weeks) | Low |

### Rationale for Priority

**High Priority (Orchestration + Evals):**
- **Orchestration** complements Context Engineering (how to structure multi-step AI workflows)
- **Evals** are critical for production AI products (quality measurement)
- Both are immediate needs for PMs building AI features

**Medium Priority (Observability + Maintenance):**
- **Observability** is more technical but helps PMs debug AI systems
- **Maintenance** is long-term concern (addresses model drift over months)
- Both support operational excellence after launch

**Low Priority (Workflow):**
- **AI Product Orchestrator** workflow should wait until component/interactive skills are battle-tested
- Would orchestrate all 5 disciplines into complete process

### Dependencies

```
context-engineering-advisor (✅ Complete)
    ↓ enables
agent-orchestration-advisor (📋 Planned)
    ↓ requires
ai-product-evals (📋 Planned)
    ↓ supported by
ai-observability-framework (📋 Planned)
    ↓ maintained via
ai-maintenance-planning (📋 Planned)
    ↓ all orchestrated by
ai-product-orchestrator (📋 Planned, workflow)
```

### Source Materials

All Phase 6 skills will draw from:
- **Research Document:** `/research/Context Engineering for Product Managers.md`
- **Teresa Torres:** *Continuous Discovery Habits* (5 AI PM disciplines)
- **Marty Cagan:** *Empowered* (4 big risks in AI era)
- **Google/Anthropic:** Technical whitepapers on context engineering, RAG, memory systems

### Notes

- **Agent Orchestration** is closely related to `ai-shaped-readiness-advisor` Competency #2 (Agent Orchestration maturity levels)
- **Evals** framework connects to `pol-probe-advisor` (validation experiments) and `discovery-process` (quality measurement)
- **Observability** and **Maintenance** are more technical but essential for production AI products

---

**Ready to distill.** 🚀
