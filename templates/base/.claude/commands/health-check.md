---
name: health-check
description: Run deep service health diagnostics from configurable checks (HTTP/TCP/command).
argument-hint: "[optional repo root] [--allow-empty]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Provide pre/post-deploy and incident-time diagnostics with strict evidence.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/scripts/health_check.py
- @.claude/config/health-check.json.example
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
</context>

<process>
1. Resolve repo root and health config path:
   - default config `.claude/config/health-check.json`
   - if missing, use `.claude/config/health-check.json.example` as setup reference.
2. Run:
   - `python3 .claude/scripts/health_check.py --repo-root <root> --out .planning/pm/current/HEALTH-CHECK.json --md-out .planning/pm/current/HEALTH-CHECK.md --pretty`
   - append `--allow-empty` only when command was explicitly called for exploratory diagnostics.
3. Gate policy:
   - `failed` => block deploy/release and trigger incident workflow.
   - `needs_action` => block until at least one actionable check is configured.
4. Write audit log entry with check inventory, failed signals, and mitigation actions.
5. Return explicit status: `DONE | DONE_WITH_CONCERNS | BLOCKED`.
</process>
