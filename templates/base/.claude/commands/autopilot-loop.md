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
- @.claude/commands/pm-delivery-loop.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
- @.planning/audit/README.md
</context>

<process>
1. Determine cycle budget (default 3 if omitted).
2. For each cycle:
   - run one delivery loop (`pm-delivery-loop` or equivalent step chain),
   - update memory files with outcomes and blockers,
   - write one cycle audit file in `.planning/audit/`.
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
