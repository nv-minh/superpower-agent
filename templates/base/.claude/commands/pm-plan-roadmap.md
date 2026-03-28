---
name: pm-plan-roadmap
description: Build roadmap and sprint sequencing from local PM workflows.
argument-hint: "<time horizon or initiative context>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---

<objective>
Convert strategy and requirement context into delivery sequencing.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/pm/commands/plan-roadmap.md
- @.claude/pm/skills/roadmap-planning/SKILL.md
- @.claude/pm/skills/epic-hypothesis/SKILL.md
- @.claude/pm/skills/epic-breakdown-advisor/SKILL.md
- @.planning/pm/current/RISK-IMPACT.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
</context>

<process>
1. Run roadmap planning flow.
2. Highlight dependencies, risk, and sequencing tradeoffs.
3. Ensure roadmap sequencing handles high/critical risks early with explicit mitigation/decision tasks.
4. Output should map cleanly to one-sprint-per-phase policy.
5. Write planning audit log entry in `.planning/audit/`.
</process>
