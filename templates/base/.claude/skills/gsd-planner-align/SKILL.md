---
name: gsd-planner-align
description: Enforce PM requirement trace, one-sprint-per-phase planning, and TDD scoping for domain and API tasks.
type: workflow
---

# gsd-planner-align

## Purpose
Force planning output to stay aligned with PM artifacts and avoid execution ambiguity.

## Inputs To Read First
- `.planning/pm/current/PRD.md`
- `.planning/pm/current/SPRINT.md`
- `.planning/pm/current/STORIES.md`
- `.planning/pm/current/HANDOFF.md`
- `.planning/pm/current/RISK-IMPACT.md`
- `.planning/codebase/APPROVED-PATTERNS.md`
- `.planning/codebase/ANTI-PATTERNS.md`
- `.planning/codebase/BROWNFIELD-GUARDRAILS.md`
- `.claude/templates/AUDIT-STEP-TEMPLATE.md`

## Planning Rules
1. Every plan must map tasks to explicit requirement IDs from `PRD.md`.
2. Every requirement ID in sprint scope must appear in at least one task.
3. One sprint maps to one phase. Do not mix unrelated scope into the phase.
4. Domain/API tasks must include TDD execution intent (`tdd="true"`).
5. UI tasks must include explicit verification tied to story acceptance criteria.
6. `verify` and `done` fields are mandatory and measurable.
7. Architecture-sensitive tasks must reference applicable approved patterns.
8. Plans must avoid tasks that replicate anti-patterns from legacy code.
9. Every task touching impacted modules must reference relevant risk IDs and mitigation actions.
10. Unresolved in-scope `high`/`critical` risks must create an explicit decision task before execution.
11. If HANDOFF includes Figma links, UI tasks must require Figma MCP evidence before implementation.
12. Planning step must emit an audit log entry under `.planning/audit/`.

## Output Quality Gate
- Fail planning if:
  - requirement IDs are missing,
  - out-of-scope work appears,
  - TDD is missing for domain/API work,
  - tasks are not independently executable,
  - task design conflicts with brownfield guardrails,
  - unresolved in-scope high/critical risk has no decision path,
  - UI task requires Figma context but has no MCP evidence clause.
