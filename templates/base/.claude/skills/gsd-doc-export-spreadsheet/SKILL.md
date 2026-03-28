---
name: gsd-doc-export-spreadsheet
description: Generate fixed-template delivery workbooks (.xlsx) for PM/build/QC artifacts with EN/JA support.
type: workflow
---

# gsd-doc-export-spreadsheet

## Purpose
Create a reliable spreadsheet export lane for delivery artifacts when users explicitly request document generation.

## Inputs To Read First
- `.claude/templates/DOC-SHEET-TEMPLATE.md`
- `.planning/pm/current/PRD.md`
- `.planning/pm/current/SPRINT.md`
- `.planning/pm/current/STORIES.md`
- `.planning/pm/current/HANDOFF.md`
- `.planning/pm/current/RISK-IMPACT.md`
- `.planning/pm/current/QC-REPORT.md`
- `.planning/discovery/current/IDEA-BRIEF.md`
- `.planning/discovery/current/UI-CONTRACT.md`
- `.claude/templates/AUDIT-STEP-TEMPLATE.md`

## Export Rules
1. Only run when user opts in for document export.
2. Output format is `.xlsx` with fixed section order from DOC-SHEET-TEMPLATE.
3. Default language mode is `both` (`DELIVERY_EN` + `DELIVERY_JA`).
4. Keep IDs and traceability keys unchanged across languages.
5. Include risk and gate summaries, not only product summaries.
6. Never silently skip missing source artifacts. Return explicit blocker.

## Tooling Guidance
- Prefer `openpyxl` for workbook creation and formatting.
- Use deterministic row/section layout to keep diffs stable across runs.
- Keep one output workbook per run under `.planning/exports/`.

## Quality Gate
- Fail export if:
  - required source artifact is missing,
  - required sheet is missing for selected language mode,
  - IDs are inconsistent with PM artifacts.

## Output
- `.planning/exports/<run-id>-delivery.xlsx`
- One audit entry under `.planning/audit/` with export mode, output path, and source list.
