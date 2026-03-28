---
name: guard
description: Activate full safety mode (careful + freeze) in one command.
argument-hint: "<directory-path>"
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
---

<objective>
Enable destructive-command warnings and directory-scoped edit lock together.
</objective>

<context>
Target freeze path: $ARGUMENTS
</context>

<process>
1. Enable careful mode by creating `.claude/state/careful.enabled`.
2. Resolve freeze boundary from argument or ask user.
3. Validate directory exists and write `.claude/state/freeze-dir.txt`.
4. Confirm both protections are active and show current boundary.
</process>

