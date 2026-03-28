# GStack Extractions Applied

This workspace integrated selected high-value ideas from `gstack/` without copying its full stack.

## What Was Borrowed

1. Review discipline
- Two-pass severity-first review structure.
- Fix-first heuristic (auto-fix vs ask-user split).
- Frontend anti-slop design checklist.

2. QA system
- Issue taxonomy (severity + category model).
- Structured QA report template.
- Report-only QA mode (`/qa-only`).

3. Safety guardrails
- Careful/freeze/guard model adapted to local hooks.
- Session state files for safe enable/disable behavior.

4. Orchestration concepts
- Auto plan-review pipeline (`/autoplan`).
- Action-level workflows over line-level prompting.
- Completeness + search-before-build rules.

## Files Added/Updated

- Commands:
  - `.claude/commands/review.md`
  - `.claude/commands/qc-verify-ui.md`
  - `.claude/commands/fix-issue.md`
  - `.claude/commands/autoplan.md`
  - `.claude/commands/qa-only.md`
  - `.claude/commands/careful.md`
  - `.claude/commands/freeze.md`
  - `.claude/commands/guard.md`
  - `.claude/commands/unfreeze.md`
  - `.claude/commands/unguard.md`
- Hooks:
  - `.claude/hooks/check-careful.sh`
  - `.claude/hooks/check-freeze.sh`
- Templates:
  - `.claude/templates/REVIEW-CHECKLIST.md`
  - `.claude/templates/DESIGN-CHECKLIST-LITE.md`
  - `.claude/templates/QA-ISSUE-TAXONOMY.md`
  - `.claude/templates/QA-REPORT-TEMPLATE.md`
- Rules:
  - `.claude/rules/completeness-principle.md`
  - `.claude/rules/search-before-build.md`

## What Was Deliberately Not Copied

- gstack telemetry and analytics pipeline.
- gstack browser daemon/runtime binaries.
- host-specific preambles and contributor-mode machinery.
- full opinionated voice/persona blocks.

