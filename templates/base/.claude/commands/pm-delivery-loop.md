---
name: pm-delivery-loop
description: End-to-end loop from requirement intake to build and QC gate.
argument-hint: "<phase-number> | <requirement text>"
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
Execute the standard PM -> Build -> QC loop with consistent artifacts and gates.
</objective>

<context>
Argument: $ARGUMENTS

Commands:
- @.claude/commands/brownfield-map-style.md
- @.claude/commands/pm-intake.md
- @.claude/commands/discovery-ui-handoff.md
- @.claude/commands/pm-to-build.md
- @.claude/commands/qc-verify-ui.md
- @.claude/commands/security-scan.md
- @.claude/commands/gen-doc-sheet.md
- @.claude/scripts/atlassian_cli.py
- @.claude/memory/DECISIONS.md
- @.claude/memory/BLOCKERS.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
- @.planning/audit/README.md
</context>

<process>
1. If brownfield guardrails are missing or stale, run `brownfield-map-style`.
2. Intake routing:
   - if input is simple/raw requirement OR brownfield without Figma link, run `discovery-ui-handoff`,
   - otherwise run `pm-intake`.
3. Ensure `.planning/pm/current/RISK-IMPACT.md` exists and has no unresolved in-scope high/critical risks.
4. Run `pm-to-build` for the target phase.
5. Run `qc-verify-ui` for the same phase.
6. Run minimum security gate before release lane:
   - run `security-scan` (includes dependency and secrets checks),
   - block progression if security gate is blocked.
7. Optional document export:
   - ask user if spreadsheet export is needed,
   - if yes run `gen-doc-sheet`,
   - if no mark `doc_export=skipped`.
8. If input came from Jira ticket and QC/build/security gates pass:
   - suggest transition using `.claude/scripts/atlassian_cli.py suggest`,
   - ask explicit user confirmation before calling transition API.
9. Update memory state:
   - append finalized decisions to `.claude/memory/DECISIONS.md`,
   - append unresolved blockers to `.claude/memory/BLOCKERS.md`.
10. Write loop audit summary in `.planning/audit/` with links to sub-step logs.
11. Return a one-page status:
   - artifacts health
   - risk gate status
   - build status
   - code quality gate status
   - QC gate status
   - security gate status
   - document export status
   - Jira transition status
   - recommended next action
</process>
