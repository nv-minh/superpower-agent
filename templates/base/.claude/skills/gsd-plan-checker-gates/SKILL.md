---
name: gsd-plan-checker-gates
description: Verify align-and-TDD planning gates before execution starts.
type: workflow
---

# gsd-plan-checker-gates

## Purpose
Block weak plans before code execution.

## Inputs To Read First
- `.planning/pm/current/PRD.md`
- `.planning/pm/current/SPRINT.md`
- `.planning/pm/current/STORIES.md`
- `.planning/pm/current/HANDOFF.md`
- `.planning/pm/current/RISK-IMPACT.md`
- `.planning/codebase/APPROVED-PATTERNS.md`
- `.planning/codebase/ANTI-PATTERNS.md`
- `.planning/codebase/BROWNFIELD-GUARDRAILS.md`
- Target phase PLAN files
- `.claude/templates/AUDIT-STEP-TEMPLATE.md`

## Blocker Conditions
1. Any in-scope requirement ID missing from all plans.
2. Any task missing `files`, `action`, `verify`, or `done`.
3. Domain/API scope without explicit TDD intent.
4. UI tasks missing DS/acceptance verification clauses.
5. Plan introduces out-of-scope or deferred requirements.
6. Plan tasks clearly rely on anti-patterns or violate brownfield guardrails.
7. Any in-scope `high`/`critical` risk is unresolved without explicit user decision.
8. UI task requires design context but no Figma MCP evidence clause exists.

## Warning Conditions
1. Overly broad tasks that combine unrelated stories.
2. Verification commands are present but not outcome-oriented.
3. Missing risk handling for high-impact dependencies.
4. Plan references approved patterns too vaguely to be actionable.
5. Risk-impact artifact is stale relative to changed scope.

## Verdict Contract
- `PASS` only when all blocker conditions are clear.
- `FAIL` with concrete, file-level fix hints when blockers exist.
- Always produce or update one audit log entry under `.planning/audit/` with verdict rationale.
