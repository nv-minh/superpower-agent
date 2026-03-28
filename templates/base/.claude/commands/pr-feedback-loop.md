---
name: pr-feedback-loop
description: Ingest GitHub PR comments, triage risk/impact, apply fixes, run quality gate, then QC retest.
argument-hint: "<pr-url-or-number>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - AskUserQuestion
  - mcp__browser__*
  - mcp__figma__*
---

<objective>
Close the loop from external PR feedback to verified fixes with auditable evidence.
</objective>

<context>
PR input: $ARGUMENTS

References:
- @.claude/scripts/github_pr_feedback.py
- @.claude/scripts/code_quality_gate.py
- @.claude/commands/security-scan.md
- @.claude/commands/fix-issue.md
- @.claude/commands/qc-verify-ui.md
- @.planning/pm/current/RISK-IMPACT.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
</context>

<process>
1. Fetch PR feedback:
   - run `python3 .claude/scripts/github_pr_feedback.py --pr "$ARGUMENTS" --pretty`
   - store outputs in:
     - `.planning/pm/current/PR-FEEDBACK.json`
     - `.planning/pm/current/PR-FEEDBACK.md`
2. Triage and classify:
   - separate issue comments, review comments, review summaries.
   - map each actionable item to module/file and estimate severity.
   - update `.planning/pm/current/RISK-IMPACT.md` if risk profile changes.
3. Discuss resolution strategy for unresolved high/critical feedback before implementation.
4. Implement fixes in brownfield-safe increments.
5. Run quality gate:
   - `python3 .claude/scripts/code_quality_gate.py --out .planning/pm/current/CODE-QUALITY-GATE.json --pretty`
6. Run security gate:
   - run `security-scan` for changed scope and block on findings.
7. Run QC retest policy:
   - targeted retest for changed scope,
   - plus smoke checks on critical flow.
   - if design links exist, include Figma/Browser MCP evidence.
8. Write audit log in `.planning/audit/` including:
   - PR source and fetched evidence,
   - fix decisions,
   - gate results,
   - remaining concerns/blockers.
9. End with explicit status: `DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT`.
</process>
