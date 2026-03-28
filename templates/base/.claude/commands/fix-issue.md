---
name: fix-issue
description: Investigate and fix an issue with parallel triage, targeted implementation, and mandatory verification.
argument-hint: "<issue-id or bug description>"
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
Resolve issues reliably with root-cause discipline and regression protection.
</objective>

<context>
Issue: $ARGUMENTS

References:
- @CLAUDE.md
- @.claude/rules/error-handling.md
- @.claude/rules/testing.md
- @.planning/codebase/ANTI-PATTERNS.md
- @.planning/codebase/APPROVED-PATTERNS.md
- @.claude/templates/QA-ISSUE-TAXONOMY.md
- @.planning/pm/current/RISK-IMPACT.md
- @.claude/scripts/code_quality_gate.py
- @.claude/commands/security-scan.md
- @.claude/commands/fad/quality-gate.md
- @.claude/memory/BLOCKERS.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
</context>

<process>
1. Build issue packet:
   - symptom
   - expected behavior
   - current impact and severity
   - issue category from QA taxonomy
2. Run triage in parallel:
   - repro analysis
   - likely root-cause location mapping
   - regression-risk/test-gap scan
3. Propose minimal safe fix plan with requirement/test trace.
4. Implement fix using brownfield guardrails.
5. Verify with targeted tests and acceptance checks.
6. Run strict post-fix gate:
   - run `fad:quality-gate` for changed scope.
7. Security gate is included in strict gate; do not skip it.
8. Report:
   - root cause
   - fix summary
   - tests added/updated
   - strict quality gate summary
   - remaining risks
9. If blocked (missing context/env/dependency), append blocker details to `.claude/memory/BLOCKERS.md`.
10. Update risk register if issue changes risk profile and write fix audit log in `.planning/audit/`.
</process>
