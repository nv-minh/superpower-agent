---
name: pm-delivery-loop
description: Compatibility wrapper for the unified FAD pipeline.
argument-hint: "<phase-number> | <requirement text> [pipeline flags]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - AskUserQuestion
---

<objective>
Preserve legacy entrypoint while routing execution to the strict unified `/fad:pipeline`.
</objective>

<context>
Argument: $ARGUMENTS

Commands:
- @.claude/commands/fad/pipeline.md
- @.claude/scripts/audit_log.py
- @.claude/memory/DECISIONS.md
- @.claude/memory/BLOCKERS.md
</context>

<process>
1. Announce compatibility routing:
   - "`pm-delivery-loop` is supported, but `/fad:pipeline` is now the primary entrypoint."
2. Execute the same request through `fad:pipeline` using `$ARGUMENTS`.
3. Ensure memory files are updated after pipeline completion:
   - append finalized decisions to `.claude/memory/DECISIONS.md`,
   - append unresolved blockers to `.claude/memory/BLOCKERS.md`.
4. Append one wrapper-level audit entry:
   - `python3 .claude/scripts/audit_log.py --step pm-delivery-loop-wrapper --command "pm-delivery-loop -> fad:pipeline" --status done --goal "$ARGUMENTS"`.
5. Return only:
   - routed command
   - pipeline status
   - run_id and audit path
   - blocker summary
</process>
