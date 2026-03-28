---
name: freeze
description: Restrict file edits to a directory boundary.
argument-hint: "<directory-path>"
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
---

<objective>
Block Edit/Write outside a chosen directory boundary.
</objective>

<context>
Target path: $ARGUMENTS
</context>

<process>
1. Resolve the target path to an absolute directory.
2. If no argument is provided, ask user for directory path.
3. Validate directory exists.
4. Store boundary in `.claude/state/freeze-dir.txt` with trailing slash.
5. Confirm freeze boundary and explain that edits outside boundary will be denied.
</process>

