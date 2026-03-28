# Substack Draft (Savage + Technical) — Feb 8, 2026

## Title

Product Management Skills for Your Agents (Because "Prompt Better" Is Not a System)

## Subtitle

From prompt roulette to reusable operating systems for PM work.

## Draft

Let me save you some pain.

If your AI workflow is "open chat, type heroic prompt, pray," you do not have a workflow.
You have a slot machine.

That might be fine for toy tasks.
It is garbage for real Product Management work.

So I built this:
[Product Manager Skills](https://github.com/deanpeters/Product-Manager-Skills)

Not a prompt dump.
A skills system.

After 20 years in PM and 15 years prior as a software engineer, I care about one thing:
does it work when the calendar is on fire, stakeholders are impatient, and your team still needs a decision by noon?

My mission now is to send the ladder down to the next generation of PMs.
That is also why I am proud of the work I have done over the last 3.5 years at [Productside](https://productside.com/).

## How We Got Here (Version by Version)

- **v0.05 (February 1, 2026):** Rooted in **my prompting repo** and early chatbot workflow work with Claude.  
  [Product Manager Prompts](https://github.com/deanpeters/product-manager-prompts)
- **v0.1 (February 4, 2026):** Based on **my selected Substack posts**. Claude drafted first, Codex cleaned it up to pass muster for broader skills-market distribution.  
  [Dean Peters on Substack](https://deanpeters.substack.com/)
- **v0.2 (February 8, 2026):** **Inspired** by the kinds of metrics we teach in Productside's Optimal Product Management and Digital Product Management courses, plus "build-a-whatever" / "test-a-whatever" activities/templates from AI Product Management class. Same pattern: Claude sketches, Codex ships.  
  [Productside Product Management Courses](https://productside.com/product-management-courses/)

## What This Repo Actually Is

Three layers:

- **Component skills:** reusable artifacts and templates
- **Interactive skills:** guided question flows for decisions
- **Workflow skills:** end-to-end orchestration

Translation:
less "write a PRD pls" and more "run a disciplined process with known tradeoffs."

## The Two-Agent Workflow (People Keep Asking)

This is the core method:

1. **Claude sketches** the structure, options, and first draft.
2. **Codex finalizes** the implementation, runs tests, patches edge cases, and enforces compliance.

Why split it this way?

- Claude is fast and generative for first-pass shape.
- Codex is surgical for file-level edits, verification, and standards enforcement.

Think: one agent for ideation velocity, one for production-grade finish.

In this repo, "done" means passing explicit gates, not "looks good in chat."

```bash
# Strict conformance for all skills
python3 scripts/check-skill-metadata.py

# Deep check for one skill
./scripts/test-a-skill.sh --skill finance-based-pricing-advisor --smoke
```

If it fails, it is not "mostly done."
It is not done.

## Technical Reality (No Hand-Waving)

You can now build, find, and test skills with deterministic helpers:

```bash
# Build a skill through a guided wizard
./scripts/build-a-skill.sh

# Find existing skills by type + keyword
./scripts/find-a-skill.sh --keyword pricing --type interactive

# Test one skill with conformance + smoke checks
./scripts/test-a-skill.sh --skill finance-based-pricing-advisor --smoke

# Convert raw content into skills (AI-assisted)
./scripts/add-a-skill.sh research/your-framework.md
```

And yes, there is strict conformance validation, because "close enough" is where quality goes to die.

## Minimal Example

Even the metadata is treated like a contract:

```yaml
---
name: feature-investment-advisor
description: Evaluate feature investments using revenue impact, cost structure, ROI, and strategic value.
type: interactive
---
```

If the structure is sloppy, it fails validation.
As it should.

## Practical Prompt Pattern

When using a skill with an agent, avoid vague asks.
Use an explicit operating context:

```text
Use skills/feature-investment-advisor/SKILL.md.
Run the interactive flow step-by-step.
Ask one question at a time.
At the end, give me:
1) recommendation
2) assumptions
3) key risks
4) what data would change the decision.
```

That one change alone kills a lot of "AI mush."

## Why This Matters

Most PMs are not underperforming because they lack effort.
They are under-supported by systems that are too fluffy, too generic, or too fragile.

Prompts are useful, but usually one-off sugar highs.
Skills are reusable operating systems.

If you are a newer PM, this should help you climb faster.
If you are experienced, I want your pushback and contributions.

No hype.
No PM cosplay.
Just frameworks that work.

Start here:
[Product Manager Skills](https://github.com/deanpeters/Product-Manager-Skills)
