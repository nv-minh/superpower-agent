---
name: deploy
description: Orchestrate production-safe deployment with parallel readiness checks, rollback planning, and gated execution.
argument-hint: "<environment> [scope or release note]"
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
Execute deployment as a gated workflow, not a single command.
</objective>

<context>
Input: $ARGUMENTS

References:
- @CLAUDE.md
- @.claude/rules/security.md
- @.claude/rules/testing.md
- @.claude/rules/git-workflow.md
- @.claude/commands/security-scan.md
- @.claude/commands/health-check.md
- @.claude/commands/setup-monitoring.md
- @.claude/commands/incident-response.md
- @.claude/commands/rollback.md
- @.claude/memory/LOOP-STATE.md
- @.planning/pm/current/RISK-IMPACT.md
- @.planning/pm/current/QC-REPORT.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
</context>

<process>
1. Parse target environment and release scope.
2. Validate release risk gate:
   - block deployment if unresolved `critical` risk remains in scope,
   - block deployment if QC report gate is FAIL.
3. Run readiness checks in parallel (non-overlapping):
   - quality gate: tests/build/lint status and regression risk
   - security gate: run `security-scan` and confirm no blocking findings
   - rollout gate: migration, backward compatibility, rollback path
   - health gate (pre-deploy): run `health-check`
   - monitoring gate: verify `.claude/config/monitoring.json` exists or run `setup-monitoring`
4. Summarize blockers first. Stop if any gate fails.
5. If all gates pass, run project deploy sequence.
6. Post-deploy verification:
   - smoke checks
   - run `health-check` again (post-deploy)
   - if post-check fails, trigger `incident-response` immediately and evaluate `rollback`.
7. Update `.claude/memory/LOOP-STATE.md` with:
   - environment
   - release id/scope
   - gate results (quality/security/health)
   - final status and next action
8. Write deployment audit log in `.planning/audit/` using `AUDIT-STEP-TEMPLATE`.
</process>
