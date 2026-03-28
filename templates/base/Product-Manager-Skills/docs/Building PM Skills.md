# Building PM Skills

This guide explains how we turn real-world PM frameworks and source materials into agent-ready skills in this repo.

Anthropic's [Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf) is a useful companion reference for trigger design, testing, and packaging expectations. Use this repo's standards first, then use Anthropic's guide as an external quality check.

## Local Clone Quickstart

For contributors working directly from a local clone:

```bash
# 1) Clone and enter repo
git clone https://github.com/deanpeters/Product-Manager-Skills.git
cd Product-Manager-Skills

# 2) Build a skill (guided wizard)
./scripts/build-a-skill.sh

# 3) Or generate from source content
./scripts/add-a-skill.sh research/your-framework.md

# 4) Validate strict conformance
./scripts/test-a-skill.sh --skill your-skill-name --smoke

# 5) Optional: Build Claude upload ZIP
./scripts/zip-a-skill.sh --skill your-skill-name
```

Then update `README.md` catalog entries if you added a new skill.

## Three Approaches

**1. Automated (Recommended for most use cases)**
Use `scripts/add-a-skill.sh` to automatically convert raw PM content into formalized skills. The utility analyzes your content, suggests structure, generates files, validates metadata, and updates documentation.

```bash
./scripts/add-a-skill.sh research/your-framework.md
```

See [`Add-a-Skill Utility Guide.md`](Add-a-Skill%20Utility%20Guide.md) for complete guide.

**2. Guided Wizard (Build-a-Bear style)**
Use `scripts/build-a-skill.sh` for a multi-turn interactive flow. It prompts for frontmatter and each required section in order, then writes a compliant skill and validates it.

```bash
./scripts/build-a-skill.sh
```

**3. Manual (This guide)**
Follow the steps below to manually create skills when you need full control over structure and content, or when iterating on existing skills.

## Supporting Utilities

Use these to speed up discovery and quality checks:

```bash
# Find existing skills before creating a new one
./scripts/find-a-skill.sh --keyword pricing --type interactive

# Test one skill with strict conformance + smoke checks
./scripts/test-a-skill.sh --skill your-skill-name --smoke

# Audit trigger wording and sample test prompts
python3 scripts/check-skill-triggers.py skills/your-skill-name/SKILL.md --show-cases
```

## What Counts As A Skill

A skill is a reusable framework that produces a clear outcome and can be applied across companies or products.

| If it is... | Then it is... |
| --- | --- |
| A repeatable framework with a concrete output | A skill |
| One-off advice or tips | A prompt |
| Long-form context or theory | Research |

## Choose The Skill Type

Pick the smallest type that fits the job.

- Component: A single deliverable template or artifact. Use for PRD sections, user stories, statements, or canvases.
- Interactive: A guided decision flow with 3-5 questions and 3-5 numbered recommendations.
- Workflow: A multi-phase process that orchestrates other skills and includes decision points.

## Distill The Source

Use source material (posts, books, internal playbooks) to extract the minimum that makes the framework work.

- Outcome: What does the skill help produce.
- Audience: Who the output is for and what they care about.
- Steps: The smallest reliable sequence that gets to the output.
- Decisions: Key forks and what to do in each branch.
- Pitfalls: The common failure modes the framework prevents.
- Definitions: Jargon the reader might not know.
- Examples: At least one strong example and one explicit anti-pattern.

## Draft The Skill File

Create a new folder in `skills/<skill-name>/SKILL.md` with lowercase kebab-case naming. Every skill must use the standard section order and frontmatter fields.

```markdown
---
name: skill-name
description: What it does + when to use it in user language. Prefer "Use when..." and keep it ≤ 200 chars for Claude web uploads.
intent: Longer repo-facing summary of the skill's purpose and why it exists.
type: component
---

## Purpose

## Key Concepts

## Application

## Examples

## Common Pitfalls

## References
```

## Quality Bar

- Keep language opinionated and practical.
- Use short paragraphs and concrete instructions.
- Include a clear example and an explicit anti-pattern.
- Define jargon on first use.
- Make tradeoffs explicit.
- If you plan to upload to Claude web custom skills, keep `name` <= 64 chars and `description` <= 200 chars.
- Treat the description like trigger metadata, not marketing copy. It should say what the skill does and when Claude should load it.
- Use `intent` for the richer repo-facing explanation. It should expand on the purpose without replacing the short trigger-oriented `description`.

## Optional Scripts (Deterministic Helpers)

Some skills benefit from small deterministic helpers (calculators, template generators). If you add one:
- Place it in `skills/<skill-name>/scripts/`.
- Keep it deterministic (no network calls, no external dependencies).
- Document usage in the skill file under Application.

## Example: Substack Post To Product Demo Skill

Assume the source is a post about demo regret and stage fright. The goal is to help PMs design a demo that lands with the audience and avoids common traps.

**Decision:** This is likely a workflow if you want multi-phase execution (briefing, narrative, rehearsal, contingency). If you only want a short Q and A flow that outputs a demo outline, make it interactive.

Sample workflow frontmatter and structure:

```markdown
---
name: product-demo
description: Plan and run product demos that land with the audience, avoid demo regret, and include rehearsal and contingency planning. Use when preparing a demo for stakeholders, customers, or executives.
intent: Turn demo prep into a repeatable workflow that sharpens the story, reduces delivery risk, and keeps the audience's decision in view.
type: workflow
---

## Purpose
Define the demo goal, anchor the story to the audience, and reduce risk before presenting.

## Key Concepts
- Demo regret: When a demo shows features but fails to prove value.
- Stage fright: Performance anxiety that affects delivery and clarity.
- Aha moment: The single proof point the demo must land.

## Application
1. Intake: audience, goal, time, decision at stake.
2. Narrative: problem, constraint, proof, payoff.
3. Flow: 5-7 minute core path, optional branches.
4. Rehearsal: 2 dry runs, one with interruptions.
5. Contingency: offline backup, screenshots, and failure plan.

## Examples
- Good: 8-minute enterprise demo that anchors on a single outcome and shows proof in the first 2 minutes.
- Anti-pattern: Feature tour with no stated decision or success criterion.

## Common Pitfalls
- Overstuffed flow that can only succeed if the demo is perfect.
- No backup path when the system fails.

## References
- Stage fright is real. So is product demo regret. (source post)
```

## Repo Checklist

- Add the skill under `skills/<skill-name>/SKILL.md` with correct frontmatter.
- Update the catalog counts and tables in `README.md`.
- Link related skills where appropriate.
- Run a quick scan with `rg "<skill-name>"` to ensure references are correct.
