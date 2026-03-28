---
name: qa-only
description: Browser-based QA report only (no code changes).
argument-hint: "<url-or-phase-context>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
  - mcp__browser__*
  - mcp__figma__*
---

<objective>
Run QA and produce an actionable report without applying fixes.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/templates/QA-ISSUE-TAXONOMY.md
- @.claude/templates/QA-REPORT-TEMPLATE.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
- @.planning/pm/current/HANDOFF.md
</context>

<process>
1. Execute browser-based QA across critical flows and UI checks.
2. If HANDOFF includes Figma links, require Figma MCP evidence for DS-critical checks.
3. Classify all findings by severity and category.
4. Do not modify source code.
5. Output a full report in `.planning/pm/current/QC-REPORT.md` plus prioritized fix recommendations.
6. Write QA audit log in `.planning/audit/` using `AUDIT-STEP-TEMPLATE`.
</process>
