# v0.75 — Pedagogic-First: Restoring What This Repo Is Actually For

**Released:** March 17, 2026

---

## What Happened

A contributor recently submitted a well-intentioned improvement to a skill. They took time, spent tokens, and followed the structural rules. The result was a tighter, more efficient skill — and a worse one. The learning scaffolding was gone. The anti-patterns were compressed into a footnote. The examples showed outputs instead of reasoning.

It wasn't their fault. The docs they read — `CONTRIBUTING.md`, `CLAUDE.md`, `AGENTS.md` — told them how to format a skill, how to structure it, what sections to include. None of them clearly stated what the skill is actually *for*.

That was our fault. We fixed it.

---

## What This Repo Is Actually For

As much as this repo is for adding skills to your agent, it's equally tasked to **help product managers become more awesome at their craft — and to help them send the ladder down to others.**

Skills here serve both goals simultaneously. They equip AI agents to do PM work at a professional level, and they teach the human PM the *why* behind the framework — so they can explain it, adapt it, and pass it on. When a PM hands a skill to a colleague, that person should be able to learn from it, not just copy it. When they hand it to an agent, they should understand what the agent is doing and be able to explain why it works.

---

## ABC — Always Be Coaching

**ABC: Always Be Coaching** is a key governing principle for every skill, every contribution, and every agent working in this repo.

What that means in practice:
- Explanation is load-bearing, not decorative
- Anti-patterns are as important as correct patterns — they teach the reader what to watch for in the wild
- Examples show reasoning, not just outputs
- Interactive skills coach through discovery — they don't just collect answers
- Stripping learning scaffolding to tighten copy is a defect, not an improvement

If you're making an edit and you're unsure whether you're cutting fluff or cutting the lesson: leave it in.

---

## What Changed in v0.75

### `README.md`
- Mission statement updated: "Help product managers become more awesome at their craft — and help them send the ladder down to others."
- New **Design Philosophy** section added, naming the equal-footing mission and ABC explicitly
- "What This Is" section rewritten to name both audiences: human PMs building judgment and AI agents executing the work
- Command layer rationale updated to name both audiences

### `CONTRIBUTING.md`
- New **Design Philosophy — Read This First** section added immediately after the intro
- Names the most common contribution mistake explicitly: trimming explanation to tighten copy
- Added **Pedagogic** as the first item in the Quality Checklist
- Added to **What We Won't Accept**: efficiency edits that strip pedagogic value

### `CLAUDE.md`
- New **Design Philosophy** section added before **Your Role**
- **Your Role** updated: "pedagogic collaborator and skill extraction partner"
- Added "push back when explanation is stripped in favor of brevity" to the agent's mandate
- **Meta-Reminder** updated to include ABC and the human learner as the mission
- Project status updated to v0.75

### `AGENTS.md`
- New **Operating Philosophy** section added at the top, before all structural mechanics
- Names the failure mode explicitly: optimizing for brevity at the cost of explanation is broken behavior
- **Skill Quality Expectations** updated: pedagogic-first listed first, anti-patterns marked as non-optional

---

## Why Now

This wasn't a planned release. It was triggered by a contribution that revealed a gap. The pedagogic philosophy existed in the repo — in `STREAMLIT_INTERFACE.md`, in `docs/Add-a-Skill Utility Guide.md`, in `MARKETPLACE_STRATEGY.md` — but it was absent from the docs that agents and contributors read before touching anything.

A principle that isn't in the governance docs isn't a principle. It's a hope.

It's in the governance docs now.

---

## LinkedIn Blurb

> I built this PM skills repo to send the ladder down.
>
> This repo does two things in equal measure: it adds battle-tested skills to your AI agent, and it helps product managers understand *why* the frameworks work — so they can teach the reasoning to colleagues, explain it to stakeholders, and build real judgment, not just faster outputs.
>
> A contributor recently made a well-intentioned improvement that stripped out the learning scaffolding in favor of tighter copy. It wasn't their fault — our docs never clearly said that preserving that value is non-negotiable. I owe them an apology, and I'll work with them to bring in the efficiencies while keeping the teaching.
>
> So we fixed the docs. v0.75 adds an explicit Design Philosophy to CONTRIBUTING.md, CLAUDE.md, AGENTS.md, and README.md. A key governing principle: **ABC — Always Be Coaching.**
>
> A skill that makes you faster but leaves you no smarter is a prompt. We're building something better than that.
>
> 👇 Repo link in comments.

---

*Release authored by Dean Peters with Claude Code.*
