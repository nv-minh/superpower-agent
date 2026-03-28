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
1. Resolve the working language from:
   - `.planning/pm/current/LANGUAGE.md`,
   - `.planning/discovery/current/LANGUAGE.md`,
   - otherwise infer from the latest user message.
   Keep all build summaries and reports in that language.
2. Validate PM inputs exist and requirement IDs are consistent across files.
3. Re-evaluate `.planning/pm/current/RISK-IMPACT.md` against current codebase for the target phase:
   - update impacted modules/files,
   - confirm severity for each in-scope risk.
4. Risk gate:
   - if any in-scope `high` or `critical` risk is unresolved, stop execution,
   - discuss options with user, request explicit decision, and update `RISK-IMPACT.md` before continuing.
5. Validate brownfield guardrail artifacts exist.
   - if missing or placeholder-only, run `/brownfield-map-style` first and stop this flow.
6. Before code changes, present a build-entry checkpoint:
   - target phase,
   - in-scope stories/requirements,
   - major risks,
   - modules likely to change,
   - what the user should verify before implementation starts.
7. Ask the user to approve, revise, or stop.
   - only continue after explicit approval.
8. Build or update phase context so planner can consume PM artifacts.
9. UI context gate:
   - if HANDOFF includes Figma links:
     - require Figma MCP evidence before UI structure implementation,
     - refresh evidence if missing/stale and append to `HANDOFF.md`,
   - else require `.planning/discovery/current/UI-CONTRACT.md` and use it as design source.
10. Run the local planning -> execution loop for the target phase using the PM sprint pack and requirement trace.
11. Enforce policy while planning/executing:
   - every task traces requirement IDs
   - domain/API tasks use TDD
   - UI tasks respect HANDOFF/UI-CONTRACT design constraints
   - tasks include mitigation actions for in-scope risks
   - new code follows approved patterns and avoids anti-patterns
12. Run a local build-exit check:
   - run `code-quality-gate`,
   - report failures or skipped checks,
   - do not silently continue if the build is obviously broken.
13. Write a step audit log in `.planning/audit/` using `AUDIT-STEP-TEMPLATE`:
   - include working language, risk decisions, Figma evidence, execution gates, and blockers.
14. Produce a short build checkpoint report:
   - phase status
   - requirement coverage summary
   - risk gate status
   - local code-quality-gate summary
   - failing checks and blockers
   - what the user should verify now
   - recommended next command to run (`qc-verify-ui` or `review`, depending on scope)
15. Explicitly ask whether to continue to the next step, revise the build work, or stop.
</process>
