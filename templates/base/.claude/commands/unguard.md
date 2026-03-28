---
name: unguard
description: Disable full safety mode (remove careful and freeze states).
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
Clear safety state files and return to normal execution mode.
</objective>

<process>
1. Remove `.claude/state/careful.enabled` if present.
2. Remove `.claude/state/freeze-dir.txt` if present.
3. Confirm that careful/freeze hooks remain installed but are inactive without state files.
</process>

