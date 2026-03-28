---
name: fad:pipeline
description: Unified FAD delivery pipeline from requirement intake to finish, with strict review/optimize gates.
argument-hint: "<requirement-or-phase> [--mode brownfield|greenfield] [--with-figma auto|off] [--strict] [--doc-export off|en|ja]"
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
  - mcp__browser__*
---

<objective>
Run one end-to-end pipeline with explicit phases, strict quality gates, and complete audit trace.
</objective>

<context>
Input: $ARGUMENTS

Phase commands:
- @.claude/commands/discovery-ui-handoff.md
- @.claude/commands/pm-intake.md
- @.claude/commands/pm-to-build.md
- @.claude/commands/qc-verify-ui.md
- @.claude/commands/review.md
- @.claude/commands/fad/optimize.md
- @.claude/commands/fad/quality-gate.md
- @.claude/commands/fad/ship.md
- @.claude/commands/fad/pr-branch.md
- @.claude/commands/gen-doc-sheet.md

Audit/logging:
- @.claude/scripts/audit_log.py
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
- @.planning/audit/README.md

Artifacts:
- @.planning/pm/current/
- @.planning/discovery/current/
</context>

<process>
1. Parse the input and resolve run options:
   - `mode`: brownfield or greenfield (infer from context if missing),
   - `with-figma`: `auto` by default,
   - `strict`: enabled by default.
2. Generate a run ID and first audit record:
   - run `python3 .claude/scripts/audit_log.py --step fad-pipeline-start --command "fad:pipeline" --goal "$ARGUMENTS" --status done --pretty`,
   - capture `run_id` and reuse it for every phase log.
3. Brainstorm + design phase:
   - if input is raw/simple or no Figma design exists, run `discovery-ui-handoff`,
   - otherwise run `pm-intake`.
4. Workspace and planning/execution phase:
   - ensure brownfield guardrail artifacts are present (`brownfield-map-style` if needed),
   - run `pm-to-build` for selected phase/sprint with requirement trace + TDD policy.
5. Verification phase:
   - run `qc-verify-ui` for functional, interaction, and DS-critical checks,
   - require Figma MCP evidence when Figma links are present.
6. Review phase (strict):
   - run `review`,
   - block pipeline on unresolved blocker-level findings.
7. Optimize phase (mandatory before finish):
   - run `fad:optimize --run-id <run_id>`,
   - keep behavior stable while reducing complexity/debt/perf hotspots.
8. Quality gate phase (strict):
   - run `fad:quality-gate --run-id <run_id> --strict`,
   - block on lint/typecheck/test/security failures or unresolved high/critical risks.
9. Optional document export:
   - run `gen-doc-sheet` only when user explicitly requests export,
   - support `en` or `ja` output mode.
10. Finish branch phase:
   - if all gates pass, offer:
     - create clean PR branch (`fad:pr-branch`),
     - open PR / ship flow (`fad:ship`),
     - keep branch for more work.
11. For each phase above, append one markdown log under `.planning/audit/runs/<run_id>/` via `audit_log.py`.
12. Return one concise pipeline report:
   - run_id
   - phase statuses
   - gate results
   - blockers/risks
   - recommended next command
</process>
