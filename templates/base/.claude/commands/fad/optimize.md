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
1. Resolve scope from argument or changed files.
2. Read latest review findings and risk-impact notes for this scope.
3. Run optimization-only edits:
   - remove duplication and dead branches,
   - improve naming and module boundaries,
   - reduce complexity in high-risk paths,
   - apply low-risk performance fixes (N+1, unnecessary loops, obvious allocations).
4. Do not change behavior/requirements during optimization.
   - if behavior change is needed, stop and request a new scoped task.
5. Re-run verification:
   - targeted tests for touched modules,
   - `code-quality-gate` for the full repository or impacted package.
6. Write audit log:
   - `python3 .claude/scripts/audit_log.py --step fad-optimize --command "fad:optimize" --status done --goal "$ARGUMENTS" --artifact .planning/pm/current/RISK-IMPACT.md`
7. Return compact output:
   - optimized areas
   - unchanged behavior guarantee
   - quality gate result
   - residual technical debt
</process>
