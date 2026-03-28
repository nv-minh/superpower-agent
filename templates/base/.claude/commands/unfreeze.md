---
name: unfreeze
description: Remove freeze edit boundary.
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
Disable directory edit lock and allow edits across repository again.
</objective>

<process>
1. If `.claude/state/freeze-dir.txt` exists, remove it.
2. Confirm previous boundary (if available) and current unlocked status.
</process>

