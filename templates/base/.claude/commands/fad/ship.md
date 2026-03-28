---
name: fad:ship
description: Final ship-readiness workflow after strict quality gate passes.
argument-hint: "[phase, milestone, or release name]"
allowed-tools:
  - Read
  - Bash
  - Grep
  - Glob
  - Write
  - AskUserQuestion
---

<objective>
Bridge strict-gate completion to PR creation and release readiness.
</objective>

<context>
Target: $ARGUMENTS

References:
- @.claude/commands/fad/quality-gate.md
- @.claude/commands/fad/pr-branch.md
- @.planning/pm/current/
- @.planning/audit/
</context>

<process>
1. Confirm strict gate is green and unresolved blocker/high items are closed.
2. Summarize ship packet:
   - scope delivered
   - tests/checks passed
   - risks accepted or mitigated
3. Offer shipping modes:
   - open/prepare PR
   - keep branch for more work
   - hand off to human for final release action
4. If PR is created, ensure branch strategy is review-safe.
5. Return:
   - ship readiness status
   - PR/release notes summary
   - remaining manual actions
</process>
