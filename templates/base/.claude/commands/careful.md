---
name: careful
description: Enable destructive-command warning mode for this project session.
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
Activate careful mode so Bash destructive operations trigger confirmation warnings.
</objective>

<process>
1. Create `.claude/state/` if missing.
2. Write `.claude/state/careful.enabled` with current timestamp.
3. Confirm status and list protected command families (rm -rf, DROP/TRUNCATE, force-push/reset, kubectl delete, docker prune/rm -f).
</process>

