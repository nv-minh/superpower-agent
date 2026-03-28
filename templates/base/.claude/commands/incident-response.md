---
name: incident-response
description: Execute incident triage, containment, recovery, and post-incident logging.
argument-hint: "<incident summary or alert id>"
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
Handle incidents with a deterministic playbook and auditable decisions.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/commands/health-check.md
- @.claude/commands/rollback.md
- @.planning/pm/current/RISK-IMPACT.md
- @.claude/memory/BLOCKERS.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
</context>

<process>
1. Create an incident packet:
   - trigger source
   - impacted scope
   - current severity (sev0/sev1/sev2)
   - user/business impact.
2. Run immediate diagnostics via `health-check`.
3. Containment decision:
   - if user-impacting and blast radius is expanding, prioritize rollback/feature-off path,
   - otherwise contain via targeted mitigation.
4. If rollback candidate is needed, run `rollback` and request explicit user confirmation before executing project rollback actions.
5. Update:
   - `.claude/memory/BLOCKERS.md` with active incident blocker,
   - `.planning/pm/current/RISK-IMPACT.md` with new/changed risks.
6. Write incident audit log in `.planning/audit/` including:
   - timeline
   - diagnostics evidence
   - containment/recovery decision
   - owner and next checkpoint
7. End with explicit status: `DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT`.
</process>
