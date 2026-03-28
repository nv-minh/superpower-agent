# v0.4 Release Announcement (Feb 10, 2026)

## Post Metadata

- **Post Title:** Product Manager Skills v0.4 — Facilitation Protocol Fix
- **Post Subtitle:** We found a guided-flow bug, traced the root cause, and standardized the fix.
- **Opening (first 160 chars):** v0.4 is live. We fixed a facilitation regression that weakened guided question flows, then standardized interaction behavior across skills.
- **Primary Link:** [Product Manager Skills repo](https://github.com/deanpeters/Product-Manager-Skills)

---

## Short Promotional Post

v0.4 is live.

We found a bug in how some guided skills behaved versus how they were supposed to behave.

Expected:
- One-question-at-a-time facilitation
- Progressive context handling
- Clear recommendation decision points

Observed:
- A brevity-focused rewrite path could strip parts of the original facilitation modality (especially guided walkthrough behavior)

Fix:
- Established `workshop-facilitation` as source of truth
- Linked that protocol across interactive skills and facilitation-heavy workflow skills
- Added heads-up start, context-dump bypass, best-guess mode, progress labels, and interruption handling

Codex diagnosed the issue and implemented the repo-wide fix.

Release: [Product Manager Skills v0.4](https://github.com/deanpeters/Product-Manager-Skills)

---

## Long-Form Draft

### Title
Product Manager Skills v0.4: Fixing Facilitation Drift

### Subtitle
How we found a guided interaction regression and turned one fix into a protocol standard

### Article Body

v0.4 is a reliability release.

We uncovered a mismatch between expected and actual behavior in guided skills. The intended mode was structured facilitation: one question at a time, progressive context capture, and explicit decision moments.

In some paths, that behavior drifted. A brevity-focused rewrite stripped parts of the facilitation modality, which made flows feel abrupt and harder to follow.

So we treated it like a product bug:

1. Reproduced the behavior gap
2. Identified root cause (facilitation instructions were not consistently preserved)
3. Fixed the immediate skill behavior
4. Standardized the protocol at the system level to prevent recurrence

What changed in v0.4:
- `skills/workshop-facilitation/SKILL.md` is now the facilitation source of truth
- Interactive skills now reference that protocol for consistency
- Facilitation-heavy workflow skills now reference it too
- Protocol includes:
  - session heads-up before starting
  - entry modes (`Guided`, `Context dump`, `Best guess`)
  - clear progress labels
  - interruption and pause/resume handling
  - decision-point recommendations with numbered choices

Credit where due: Codex traced the issue and rolled out the fix across the repo.

This is the kind of update that matters long-term: fewer brittle interactions, more predictable guided outcomes, and a cleaner baseline for experimentation.
