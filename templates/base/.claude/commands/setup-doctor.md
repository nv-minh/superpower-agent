---
name: setup-doctor
description: Run one-shot preflight checks for CLI, MCP, and key configuration.
argument-hint: "[optional repo root]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Give users one command to identify missing setup requirements and fix steps for PM, build, QC, and ops workflows.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/scripts/setup_doctor.py
- @docs/SETUP_ONBOARDING.md
- @docs/OPS_HARDENING_RUNBOOK.md
</context>

<process>
1. Resolve target root (default current workspace).
2. Run:
   - `python3 .claude/scripts/setup_doctor.py --repo-root <root> --pretty`
3. Review generated outputs:
   - `.planning/setup/setup-doctor.json`
   - `.planning/setup/setup-doctor.md`
4. If required failures exist, stop and ask user to resolve checklist items.
5. If setup is healthy, recommend next command:
   - `install-browser-skills`
   - `setup-monitoring`
   - `security-scan`
   - `health-check`
   - `pm-delivery-loop`
   - `pr-feedback-loop`
</process>
