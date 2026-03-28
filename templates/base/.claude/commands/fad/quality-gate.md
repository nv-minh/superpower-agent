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
1. Resolve the working language from `.planning/pm/current/LANGUAGE.md` or `.planning/discovery/current/LANGUAGE.md` when available.
2. Resolve repository root from argument (default current workspace).
3. Run strict code-quality gate:
   - `python3 .claude/scripts/code_quality_gate.py --repo-root <root> --strict-missing --out .planning/pm/current/FAD-CODE-QUALITY-GATE.json --pretty`
4. Run security gate:
   - `python3 .claude/scripts/security_scan.py --repo-root <root> --fail-on high --out .planning/pm/current/FAD-SECURITY-SCAN.json --md-out .planning/pm/current/FAD-SECURITY-SCAN.md --pretty`
   - `python3 .claude/scripts/secrets_scan.py --repo-root <root> --out .planning/pm/current/FAD-SECRETS-SCAN.json --md-out .planning/pm/current/FAD-SECRETS-SCAN.md --pretty`
5. Run review confirmation:
   - execute `review` for changed scope,
   - treat unresolved blocker/high findings as gate failures.
6. Risk gate:
   - inspect `.planning/pm/current/RISK-IMPACT.md`,
   - block on unresolved in-scope `high`/`critical` risks.
7. Write one gate summary artifact:
   - `.planning/pm/current/FAD-QUALITY-GATE.md` with PASS/BLOCKED decision and failing evidence paths.
8. Write audit log:
   - `python3 .claude/scripts/audit_log.py --step fad-quality-gate --command "fad:quality-gate" --status done --goal "$ARGUMENTS" --artifact .planning/pm/current/FAD-QUALITY-GATE.md`
9. Return a final gate checkpoint in the working language:
   - `DONE` only if all strict checks pass,
   - otherwise `BLOCKED` with exact failing check and fix order,
   - what the user should verify,
   - recommended next command (`fad:pr-branch`/`fad:ship` if DONE, fix flow if BLOCKED).
10. Explicitly ask whether to continue to finish, go back for fixes, or stop.
</process>
