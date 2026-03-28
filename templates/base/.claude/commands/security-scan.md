---
name: security-scan
description: Run local-first security scanning (dependency + optional SAST) and block on required findings.
argument-hint: "[--fail-on low|moderate|high|critical] [optional repo root]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Run an auditable security gate before build/deploy decisions.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/scripts/security_scan.py
- @.claude/commands/dependency-audit.md
- @.claude/commands/secrets-scan.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
- @.claude/rules/security.md
</context>

<process>
1. Resolve repo root (default current workspace) and severity threshold (`--fail-on`, default `high`).
2. Run dependency/SAST scan:
   - `python3 .claude/scripts/security_scan.py --repo-root <root> --fail-on <threshold> --out .planning/pm/current/SECURITY-SCAN.json --md-out .planning/pm/current/SECURITY-SCAN.md --pretty`
3. Run secrets scan:
   - `python3 .claude/scripts/secrets_scan.py --repo-root <root> --out .planning/pm/current/SECRETS-SCAN.json --md-out .planning/pm/current/SECRETS-SCAN.md --pretty`
4. Gate policy:
   - block if required dependency findings breach threshold,
   - block if any secret finding is detected.
5. Write one audit log in `.planning/audit/` with:
   - command args
   - scanner evidence paths
   - risk/impact updates
   - gate status and required actions
6. Return explicit status: `DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT`.
</process>
