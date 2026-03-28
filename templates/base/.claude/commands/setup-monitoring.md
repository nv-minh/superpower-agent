---
name: setup-monitoring
description: Configure provider-agnostic monitoring adapters, alert rules, and dashboard inventory.
argument-hint: "[provider=custom|datadog|grafana|cloudwatch]"
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
Establish continuous monitoring baseline so deploy health is observable after release.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/config/monitoring.json.example
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
- @.claude/commands/health-check.md
- @.claude/commands/incident-response.md
</context>

<process>
1. Resolve monitoring provider mode (default `custom`).
2. Create or update `.claude/config/monitoring.json` from example schema with:
   - service inventory
   - critical SLIs/SLO hints
   - alert rules and thresholds
   - dashboard URLs and ownership.
3. Verify that each critical flow has:
   - at least one availability signal,
   - one latency or performance signal,
   - one error-rate signal.
4. Link monitoring signals to `health-check` config where possible.
5. Write audit log in `.planning/audit/` including provider mode, configured alerts, and open gaps.
6. Return explicit status: `DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT`.
</process>
