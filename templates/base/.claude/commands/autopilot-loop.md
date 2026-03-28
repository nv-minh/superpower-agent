---
name: autopilot-loop
description: Run a bounded autonomous delivery loop with memory updates and blocker-based stop conditions.
argument-hint: "[max-cycles]"
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
Reduce operator bottleneck by running multiple delivery cycles safely.
</objective>

<context>
Cycles: $ARGUMENTS

References:
- @.claude/memory/LOOP-STATE.md
- @.claude/memory/BLOCKERS.md
- @.claude/memory/DECISIONS.md
- @.claude/commands/fad/pipeline.md
- @.claude/commands/fad/quality-gate.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
- @.claude/scripts/audit_log.py
- @.planning/audit/README.md
</context>

<process>
1. Determine cycle budget (default 3 if omitted).
2. For each cycle:
   - run one strict delivery loop via `fad:pipeline`,
   - enforce post-cycle gate with `fad:quality-gate`,
   - update memory files with outcomes and blockers,
   - write one cycle audit file in `.planning/audit/runs/<run_id>/` using `audit_log.py`.
3. Stop early when:
   - blocker is unresolved,
   - human decision is required,
   - risk gate is blocked by unresolved high/critical items,
   - gate failure repeats without progress.
4. Return compact cycle report:
   - completed cycles
   - outputs produced
   - audit files generated
   - document export decisions
   - blockers and required human input
</process>
