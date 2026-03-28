---
name: gen-doc-sheet
description: Optional spreadsheet export for PM/build/QC artifacts with EN/JA output.
argument-hint: "<context> [--lang en|ja|both]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---

<objective>
Generate one fixed-template `.xlsx` delivery workbook. Export language can be EN, JA, or both.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/templates/DOC-SHEET-TEMPLATE.md
- @.claude/skills/gsd-doc-export-spreadsheet/SKILL.md
- @.planning/pm/current/PRD.md
- @.planning/pm/current/SPRINT.md
- @.planning/pm/current/STORIES.md
- @.planning/pm/current/HANDOFF.md
- @.planning/pm/current/RISK-IMPACT.md
- @.planning/pm/current/QC-REPORT.md
- @.planning/discovery/current/
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
</context>

<process>
1. Resolve language mode from argument flag:
   - `--lang en`
   - `--lang ja`
   - `--lang both` (default)
2. Build content from PM/discovery artifacts following fixed section order from DOC-SHEET-TEMPLATE.
3. Generate workbook at:
   - `.planning/exports/<run-id>-delivery.xlsx`
4. Sheet contract:
   - always include `DELIVERY_EN`,
   - include `DELIVERY_JA` when `--lang ja` or `--lang both`.
5. Keep IDs unchanged across languages (`REQ-*`, `RISK-*`, `DEC-*`, story IDs).
6. If required source artifacts are missing, stop with blocker + missing files list.
7. Write export evidence to audit log:
   - chosen language mode
   - output file path
   - source artifacts used
</process>
