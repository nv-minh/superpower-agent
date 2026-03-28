---
name: review
description: Run severity-first code review with parallel analyzers and actionable findings.
argument-hint: "[optional: file path, module, or change scope]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - AskUserQuestion
---

<objective>
Perform review as a risk-detection workflow, not a style checklist.
</objective>

<context>
Scope: $ARGUMENTS

References:
- @CLAUDE.md
- @.claude/rules/security.md
- @.claude/rules/testing.md
- @.claude/rules/api-conventions.md
- @.claude/templates/REVIEW-CHECKLIST.md
- @.claude/templates/DESIGN-CHECKLIST-LITE.md
- @.planning/pm/current/RISK-IMPACT.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
</context>

<process>
1. Resolve the working language from `.planning/pm/current/LANGUAGE.md` or `.planning/discovery/current/LANGUAGE.md` when available.
2. Determine review scope from staged changes or provided path/module.
3. Load `RISK-IMPACT.md` when present and prioritize checks around high/critical impacted modules.
4. Run two-pass review from REVIEW-CHECKLIST:
   - Pass 1 critical
   - Pass 2 informational
5. If frontend files changed, run DESIGN-CHECKLIST-LITE.
6. Run parallel review passes:
   - correctness and regression risk
   - security and data handling
   - test adequacy and observability
7. Apply fix-first heuristic:
   - mechanical low-risk findings -> AUTO-FIXED
   - ambiguous/high-risk findings -> NEEDS INPUT
8. Write a review audit file in `.planning/audit/` using `AUDIT-STEP-TEMPLATE`:
   - include analyzed scope, top risks, and unresolved decisions.
9. Return findings only, ordered by severity:
   - blocker
   - warning
   - info
10. For each finding, include:
   - file/path reference
   - failure mode
   - concrete fix direction
11. If no findings, state that explicitly and list residual risks.
12. End with a review checkpoint in the working language:
    - whether review is blocking,
    - what the user should verify,
    - recommended next command (`fad:optimize` if clear, fix flow if blocked).
13. Explicitly ask whether to continue, revise/fix first, or stop.
</process>
