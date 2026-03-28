---
name: code-quality-gate
description: Run lint, typecheck (if TS), and tests with soft-skip policy for missing scripts.
argument-hint: "[--strict-missing] [optional repo root]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Execute a consistent quality gate and output machine-readable evidence for build/QC decisions.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/scripts/code_quality_gate.py
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
- @.claude/rules/testing.md
</context>

<process>
1. Resolve repository root from argument (default current workspace).
2. Run:
   - `python3 .claude/scripts/code_quality_gate.py --repo-root <root> --out .planning/pm/current/CODE-QUALITY-GATE.json --pretty`
3. If `--strict-missing` is passed, append `--strict-missing` to the script call.
4. Treat script result as gate status:
   - `failed` => block build/deploy until resolved.
   - `passed` with skipped checks => continue but report `done_with_concerns`.
5. Write a markdown audit log in `.planning/audit/` with:
   - command executed
   - lint/typecheck/test status
   - skipped reasons
   - next action
6. Return concise gate summary and blockers.
</process>
