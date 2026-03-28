---
name: fad-verifier-qc
description: Enforce release gate using functional checks and DS-critical verification with browser automation.
type: workflow
---

# fad-verifier-qc

## Purpose
Guarantee that release criteria are validated, not assumed.

## Inputs To Read First
- `.planning/pm/current/PRD.md`
- `.planning/pm/current/STORIES.md`
- `.planning/pm/current/HANDOFF.md`
- `.planning/pm/current/RISK-IMPACT.md`
- `.planning/pm/current/QC-REPORT.md`
- Phase verification artifacts
- `.claude/templates/AUDIT-STEP-TEMPLATE.md`

## Verification Rules
1. Validate critical user flows from story acceptance criteria.
2. Use Browser MCP for interaction verification where runtime checks are required.
3. Validate high/critical risk mitigations with explicit verification checks.
4. If design reference exists, use Figma MCP to anchor DS-critical checks:
   - spacing/layout contract,
   - token-consistent styling,
   - key component structure.
5. Mark any DS-critical violation as gate failure.
6. If required Figma evidence is unavailable, treat gate as FAIL.

## Gate Policy
- PASS:
  - critical functional flows pass,
  - no DS-critical violations remain,
  - no unresolved release-blocking risk verification gap.
- FAIL:
  - any critical flow breaks,
  - or any DS-critical issue is unresolved,
  - or risk mitigation evidence is missing.

## Output
- Update `.planning/pm/current/QC-REPORT.md` with:
  - checks run,
  - evidence,
  - pass/fail per check,
  - blockers and required fixes.
- Write one verifier audit log entry under `.planning/audit/`.
