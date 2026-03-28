---
name: qc-verify-ui
description: Run QC gate with browser automation for functional flow and DS-critical checks.
argument-hint: "<phase-number>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - AskUserQuestion
  - mcp__browser__*
  - mcp__figma__*
---

<objective>
Verify implemented work against PM acceptance criteria and design-system critical constraints.
</objective>

<context>
Phase: $ARGUMENTS

Inputs:
- @.planning/pm/current/PRD.md
- @.planning/pm/current/STORIES.md
- @.planning/pm/current/HANDOFF.md
- @.planning/pm/current/RISK-IMPACT.md
- @.planning/pm/current/QC-REPORT.md
- @.planning/discovery/current/UI-CONTRACT.md
- @.claude/scripts/atlassian_cli.py
- @.claude/templates/QA-ISSUE-TAXONOMY.md
- @.claude/templates/QA-REPORT-TEMPLATE.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
</context>

<process>
1. Resolve the working language from `.planning/pm/current/LANGUAGE.md` or `.planning/discovery/current/LANGUAGE.md` when available.
2. Build verification checklist from story acceptance criteria, release gate, and QA-ISSUE-TAXONOMY.
3. Use Browser MCP to run functional flow checks for critical user journeys.
4. Validate high/critical risk mitigations from `RISK-IMPACT.md` via targeted checks.
5. If design links exist in HANDOFF:
   - Figma MCP must be called for DS-critical assertions,
   - QC output must include explicit Figma evidence per critical screen/component.
6. If no Figma design source exists, use `.planning/discovery/current/UI-CONTRACT.md` for DS-critical assertions.
7. Classify every issue with:
   - severity (critical/high/medium/low)
   - category (visual-ui/functional/ux/content/performance/console-errors/accessibility)
8. Mark each check as PASS/FAIL with evidence and reproduction steps.
9. Write QC report using QA-REPORT-TEMPLATE to `.planning/pm/current/QC-REPORT.md` in the working language.
10. Write a QC audit file in `.planning/audit/` using `AUDIT-STEP-TEMPLATE`.
11. Gate rule:
   - PASS only if all critical functional checks pass and no DS-critical violation remains.
12. If a Jira issue key is linked in handoff and gate is PASS, suggest transition via `atlassian_cli.py suggest` and require explicit user confirmation before any apply step.
13. Output a QC checkpoint:
    - final gate decision,
    - exact blockers to fix,
    - what the user should verify,
    - recommended next command (`review` if PASS, `pm-to-build`/fix flow if FAIL).
14. Explicitly ask whether to continue to the next step, revise/fix first, or stop.
</process>
