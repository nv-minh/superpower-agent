---
name: fad:optimize
description: Mandatory post-review optimization pass before finishing a branch.
argument-hint: "[--run-id <id>] [optional scope]"
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
Improve maintainability and performance signals without changing product behavior.
</objective>

<context>
Scope: $ARGUMENTS

References:
- @.claude/commands/review.md
- @.claude/commands/code-quality-gate.md
- @.claude/rules/code-style.md
- @.claude/rules/project-structure.md
- @.planning/pm/current/RISK-IMPACT.md
- @.claude/scripts/audit_log.py
</context>

<process>
1. Resolve the working language from `.planning/pm/current/LANGUAGE.md` or `.planning/discovery/current/LANGUAGE.md` when available.
2. Resolve scope from argument or changed files.
3. Read latest review findings and risk-impact notes for this scope.
4. Run optimization-only edits:
   - remove duplication and dead branches,
   - improve naming and module boundaries,
   - reduce complexity in high-risk paths,
   - apply low-risk performance fixes (N+1, unnecessary loops, obvious allocations).
5. Do not change behavior/requirements during optimization.
   - if behavior change is needed, stop and request a new scoped task.
6. Re-run verification:
   - targeted tests for touched modules,
   - `code-quality-gate` for the full repository or impacted package.
7. Write audit log:
   - `python3 .claude/scripts/audit_log.py --step fad-optimize --command "fad:optimize" --status done --goal "$ARGUMENTS" --artifact .planning/pm/current/RISK-IMPACT.md`
8. Return an optimization checkpoint:
   - optimized areas
   - unchanged behavior guarantee
   - quality gate result
   - residual technical debt
   - what the user should verify
   - recommended next command (`fad:quality-gate`)
9. Explicitly ask whether to continue to strict gate, revise optimization work, or stop.
</process>
