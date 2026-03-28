---
name: fad:quality-gate
description: Strict merge gate combining code quality, security, and unresolved-risk checks.
argument-hint: "[--run-id <id>] [optional repo root]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - Task
---

<objective>
Provide one strict go/no-go decision before finishing or shipping a branch.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/commands/code-quality-gate.md
- @.claude/commands/security-scan.md
- @.claude/commands/review.md
- @.claude/scripts/code_quality_gate.py
- @.claude/scripts/security_scan.py
- @.claude/scripts/secrets_scan.py
- @.planning/pm/current/RISK-IMPACT.md
- @.claude/scripts/audit_log.py
</context>

<process>
1. Resolve repository root from argument (default current workspace).
2. Run strict code-quality gate:
   - `python3 .claude/scripts/code_quality_gate.py --repo-root <root> --strict-missing --out .planning/pm/current/FAD-CODE-QUALITY-GATE.json --pretty`
3. Run security gate:
   - `python3 .claude/scripts/security_scan.py --repo-root <root> --fail-on high --out .planning/pm/current/FAD-SECURITY-SCAN.json --md-out .planning/pm/current/FAD-SECURITY-SCAN.md --pretty`
   - `python3 .claude/scripts/secrets_scan.py --repo-root <root> --out .planning/pm/current/FAD-SECRETS-SCAN.json --md-out .planning/pm/current/FAD-SECRETS-SCAN.md --pretty`
4. Run review confirmation:
   - execute `review` for changed scope,
   - treat unresolved blocker/high findings as gate failures.
5. Risk gate:
   - inspect `.planning/pm/current/RISK-IMPACT.md`,
   - block on unresolved in-scope `high`/`critical` risks.
6. Write one gate summary artifact:
   - `.planning/pm/current/FAD-QUALITY-GATE.md` with PASS/BLOCKED decision and failing evidence paths.
7. Write audit log:
   - `python3 .claude/scripts/audit_log.py --step fad-quality-gate --command "fad:quality-gate" --status done --goal "$ARGUMENTS" --artifact .planning/pm/current/FAD-QUALITY-GATE.md`
8. Return explicit result:
   - `DONE` only if all strict checks pass,
   - otherwise `BLOCKED` with exact failing check and fix order.
</process>
