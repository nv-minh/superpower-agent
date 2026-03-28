---
name: gsd-executor-ui-figma
description: Execute plans with requirement trace, TDD for domain/API logic, and Figma-driven UI implementation constraints.
type: workflow
---

# gsd-executor-ui-figma

## Purpose
Keep execution aligned with PM artifacts while preserving design-system correctness.

## Inputs To Read First
- `.planning/pm/current/HANDOFF.md`
- `.planning/pm/current/STORIES.md`
- `.planning/pm/current/PRD.md`
- `.planning/pm/current/RISK-IMPACT.md`
- `.planning/codebase/APPROVED-PATTERNS.md`
- `.planning/codebase/ANTI-PATTERNS.md`
- `.planning/codebase/BROWNFIELD-GUARDRAILS.md`
- `.claude/templates/AUDIT-STEP-TEMPLATE.md`

## Execution Rules
1. Never implement requirements not present in PM artifacts.
2. Preserve requirement IDs in summaries and commit messages when practical.
3. For domain/API tasks marked for TDD:
   - RED: add failing tests,
   - GREEN: minimal implementation to pass,
   - REFACTOR: cleanup with passing tests.
4. Review in-scope risk items before coding touched modules.
5. If any in-scope `high`/`critical` risk is unresolved, stop and request user decision.
6. If HANDOFF includes Figma links:
   - read Figma MCP context before editing UI structure,
   - record evidence used for each critical component/screen,
   - respect component hierarchy, spacing intent, and token usage from design references.
7. If Figma MCP data is unavailable for required design context, stop and report blocker.
8. Reuse only approved patterns for new code paths.
9. Do not replicate anti-patterns from touched legacy files into new or refactored code.
10. Emit a step audit log under `.planning/audit/` for execution outcomes and decisions.

## Summary Rules
- Report:
  - requirement coverage executed,
  - risk mitigations applied and any residual high/critical risk,
  - TDD status for domain/API tasks,
  - any design deviations and rationale,
  - any brownfield guardrail deviations and rationale.
