---
name: rollback
description: Generate rollback readiness plan and execute rollback workflow with data-safety checks.
argument-hint: "[target release/tag/sha]"
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
Reduce rollback risk by validating baseline, migration impact, and post-rollback verification before action.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/scripts/rollback_plan.py
- @.claude/commands/health-check.md
- @.planning/pm/current/RISK-IMPACT.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
</context>

<process>
1. Generate rollback readiness:
   - `python3 .claude/scripts/rollback_plan.py --repo-root . --target "$ARGUMENTS" --out .planning/pm/current/ROLLBACK-PLAN.json --md-out .planning/pm/current/ROLLBACK-PLAN.md --pretty`
2. Gate policy:
   - `readiness=blocked` => stop and escalate.
   - `readiness=needs_review` => request explicit user decision before executing rollback command.
   - `readiness=ready` => continue with project-specific rollback runbook.
3. Execute project rollback command sequence only after confirmation.
4. Run post-rollback `health-check`.
5. Update risk register and write rollback audit log with:
   - baseline target
   - migration/data safety notes
   - verification outcomes
   - residual risks
6. End with explicit status: `DONE | DONE_WITH_CONCERNS | BLOCKED`.
</process>
