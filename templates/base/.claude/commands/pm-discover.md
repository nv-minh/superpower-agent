---
name: pm-discover
description: Run PM discovery workflow from local PM skills pack.
argument-hint: "<problem, opportunity, or requirement>"
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
Run a structured discovery loop using PM skills before committing to implementation scope.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/pm/commands/discover.md
- @.claude/pm/skills/discovery-process/SKILL.md
- @.claude/pm/skills/problem-statement/SKILL.md
- @.claude/pm/skills/opportunity-solution-tree/SKILL.md
</context>

<process>
1. Use the discovery command and referenced skills to gather evidence.
2. Capture assumptions, risks, and validation plan.
3. End with recommendation:
   - proceed to PRD
   - gather more evidence
   - stop/defer
</process>

