---
name: pm-to-build
description: Convert PM handoff artifacts into FAD planning and execution.
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
  - WebFetch
  - mcp__figma__*
---

<objective>
Take the PM sprint pack and run the implementation loop with strict requirement trace and TDD policy.
</objective>

<context>
Phase: $ARGUMENTS

Required inputs:
- @.planning/pm/current/PRD.md
- @.planning/pm/current/SPRINT.md
- @.planning/pm/current/STORIES.md
- @.planning/pm/current/HANDOFF.md
- @.planning/pm/current/RISK-IMPACT.md
- @.planning/discovery/current/UI-CONTRACT.md
- @.planning/codebase/APPROVED-PATTERNS.md
- @.planning/codebase/ANTI-PATTERNS.md
- @.planning/codebase/BROWNFIELD-GUARDRAILS.md
- @.planning/config.json
- @CLAUDE.md
- @.claude/rules/code-style.md
- @.claude/rules/project-structure.md
- @.claude/rules/testing.md
- @.claude/rules/security.md
- @.claude/scripts/code_quality_gate.py
- @.claude/commands/security-scan.md
- @.claude/commands/review.md
- @.claude/commands/fad/optimize.md
- @.claude/commands/fad/quality-gate.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md

Planning references:
- @docs/FAD_PIPELINE.md
- @.planning/pm/current/SPRINT.md
- @.planning/pm/current/STORIES.md
</context>

<process>
1. Validate PM inputs exist and requirement IDs are consistent across files.
2. Re-evaluate `.planning/pm/current/RISK-IMPACT.md` against current codebase for the target phase:
   - update impacted modules/files,
   - confirm severity for each in-scope risk.
3. Risk gate:
   - if any in-scope `high` or `critical` risk is unresolved, stop execution,
   - discuss options with user, request explicit decision, and update `RISK-IMPACT.md` before continuing.
4. Validate brownfield guardrail artifacts exist.
   - if missing or placeholder-only, run `/brownfield-map-style` first and stop this flow.
5. Build or update phase context so planner can consume PM artifacts.
6. UI context gate:
   - if HANDOFF includes Figma links:
     - require Figma MCP evidence before UI structure implementation,
     - refresh evidence if missing/stale and append to `HANDOFF.md`,
   - else require `.planning/discovery/current/UI-CONTRACT.md` and use it as design source.
7. Run the local planning -> execution -> verification loop for the target phase using the PM sprint pack and requirement trace.
8. Enforce policy while planning/executing:
   - every task traces requirement IDs
   - domain/API tasks use TDD
   - UI tasks respect HANDOFF/UI-CONTRACT design constraints
   - tasks include mitigation actions for in-scope risks
   - new code follows approved patterns and avoids anti-patterns
9. Run mandatory review and optimization phases:
   - run `review` for changed scope,
   - run `fad:optimize` for post-review hardening.
10. Run strict quality gate:
   - run `fad:quality-gate`,
   - block phase completion if strict gate is blocked.
11. Write a step audit log in `.planning/audit/` using `AUDIT-STEP-TEMPLATE`:
   - include risk decisions, Figma evidence, execution gates, and blockers.
12. Produce a short build report:
   - phase status
   - requirement coverage summary
   - risk gate status
   - review status
   - optimize status
   - strict quality gate summary
   - failing checks and blockers
   - next command to run
</process>
