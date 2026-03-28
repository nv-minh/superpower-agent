---
name: secrets-scan
description: Detect exposed credentials/secrets in repository content.
argument-hint: "[optional repo root]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Fail fast when secret leakage is detected and produce auditable evidence.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/scripts/secrets_scan.py
- @.claude/rules/security.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
</context>

<process>
1. Resolve repo root (default current workspace).
2. Run:
   - `python3 .claude/scripts/secrets_scan.py --repo-root <root> --out .planning/pm/current/SECRETS-SCAN.json --md-out .planning/pm/current/SECRETS-SCAN.md --pretty`
3. Gate policy:
   - findings > 0 => block and require rotation/remediation plan.
4. Write audit log entry with detector mode, findings, and remediation decisions.
5. Return explicit status: `DONE | BLOCKED`.
</process>
