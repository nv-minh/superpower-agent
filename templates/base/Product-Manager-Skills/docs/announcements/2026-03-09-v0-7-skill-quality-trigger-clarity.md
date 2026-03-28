# v0.7 Release Announcement (Mar 9, 2026) — Sharper Skills, Faster Discovery

## Post Metadata

- **Post Title:** Product Manager Skills v0.7 — Sharper Skill Triggering, Better Discovery, More Value on Day One
- **Post Subtitle:** The right PM skill is now easier to find, easier to trust, and easier to run when you're in the middle of real work.
- **Opening (first 160 chars):** v0.7 helps you find the right PM skill faster with clearer triggers, stronger metadata, and a simpler plain-English discovery flow.
- **Primary Link:** [Product Manager Skills repo](https://github.com/deanpeters/Product-Manager-Skills)

---

## Short Promotional Post

We are ceaselessly pushing this library to stay sharp as it grows.

v0.7 is about one thing:

Helping you get to the *right* PM skill faster.

## What's In It For You
- Less hunting
- Better activation
- Easier trust
- Friendlier discovery
- Start from the problem, not the taxonomy

## What Changed
- Sharper, trigger-oriented skill descriptions across the library
- New `intent` metadata so each skill can keep a clean trigger line *and* a richer repo-facing purpose
- Stronger validation for metadata quality, not just file structure
- Trigger-readiness audits built into the standard library checks
- New trigger-oriented mode in `find-a-skill.sh` so discovery can use real usage cues, not just keywords
- New Streamlit (beta) `Find My Skill` mode so you can describe what you're trying to do in plain English and get a recommended-first list of skills

## Why We Made This Release

Release: [Product Manager Skills v0.7](https://github.com/deanpeters/Product-Manager-Skills)

---

## Long-Form Draft

### Title
Product Manager Skills v0.7: Find the Right Skill Faster

### Subtitle
Why better triggers and better discovery matter more than just adding more skills

### Article Body

One of the easiest ways for a skills library to get worse over time is subtle drift.

Not dramatic breakage.
Not missing files.
Not obvious bugs.

Drift.

Descriptions that explain what a skill is, but not when to use it.
Great frameworks that are technically valid, but harder to discover.
Metadata that works for maintainers, but not for real people trying to solve a real PM problem quickly.
An app that can run skills, but still needs to do a better job helping someone answer the simplest question first:

"Which skill should I use here?"

v0.7 is about closing that gap.

We are ceaselessly working to keep this repo up to standard, not just bigger.
That matters because a 46-skill library only stays valuable if quality compounds alongside quantity.

This release focuses on five things:

1. **Sharper trigger clarity**
   - We rewrote skill descriptions so they do a better job answering:
     - What does this skill do?
     - When should you use it?
   - In practice, that means more `Use when...` style descriptions and fewer vague one-liners.
   - This matters because skill activation and discovery depend on clear trigger language, not just clever naming.

2. **A cleaner separation between trigger metadata and deeper meaning**
   - We added `intent` as a repo-standard frontmatter field.
   - `description` now stays short, clear, and trigger-oriented.
   - `intent` carries the richer repo-facing summary of what the skill is fundamentally for.
   - This gives users better discovery while preserving the deeper meaning contributors and maintainers need.

3. **Higher standards, enforced**
   - We expanded validation so the repo checks more than structure.
   - New audits now catch:
     - weak or vague trigger descriptions
     - clipped or risky descriptions
     - missing trigger examples in frontmatter
   - That means quality is less dependent on memory, taste, or luck.

4. **Better discovery as the library grows**
   - We added a trigger-oriented discovery mode to `scripts/find-a-skill.sh`.
   - It can now search across `description`, `best_for`, and `scenarios`, then show those cues back in the result list.
   - This is important because users rarely think in taxonomy terms. They think in situations:
     - "I need to decide whether to build this"
     - "I need to run discovery"
     - "I need a PRD"
     - "I need to test pricing"

5. **A friendlier Streamlit path for real humans**
   - We expanded the Streamlit (beta) app so it now separates `Learn`, `Find My Skill`, and `Run Skills`.
   - The new `Find My Skill` mode lets someone describe a situation in plain English, get a recommended first match, understand why it fits, and then preview or run it immediately.
   - That matters because most people do not start with a taxonomy. They start with a need:
     - "Help me create a PRD"
     - "I need to prioritize roadmap bets"
     - "Activation is dropping and I need to know what to do next"

What shipped in v0.7:
- Trigger-oriented description cleanup across the skill library
- New `intent` frontmatter field across all skills
- `scripts/check-skill-triggers.py` for trigger-readiness auditing
- Updated `scripts/test-library.sh` to include trigger auditing
- Updated skill-authoring docs and templates so future additions follow the tighter standard
- New `find-a-skill.sh --mode trigger` for discovery by real-world use case language
- Updated Streamlit (beta) app with `Learn`, `Find My Skill`, and `Run Skills` modes
- Added recommended-first skill suggestions and clearer preview/run actions in the Streamlit finder
- Cross-checked trigger improvements against Anthropic's [Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)

Why this matters to you:

- **You find the right skill faster**
  - Less browsing by file name
  - More matching by use case and situation
  - A simpler app path when you want to start from "what am I trying to do?"

- **You get more reliable activation**
  - Skills are described in ways that are easier for agents to select correctly

- **You can trust the library more**
  - Quality checks now reinforce the standard automatically

- **The repo gets stronger as it grows**
  - More skills does not have to mean more chaos
  - v0.7 is an investment in keeping scale from becoming entropy

If v0.65 was about helping more people get into the library, v0.7 is about making the library behave more cleanly once they're inside it.

This is the kind of release that pays off every time someone asks:

"Which skill should I use here?"

And gets a better answer, faster.

That is the bar.
