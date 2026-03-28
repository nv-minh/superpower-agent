---
name: pm-prioritize
description: Run prioritization advisor workflow from local PM skills.
argument-hint: "<backlog or decision context>"
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
Pick and apply prioritization logic for current delivery constraints.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/pm/commands/prioritize.md
- @.claude/pm/skills/prioritization-advisor/SKILL.md
</context>

<process>
1. Ask context questions needed to choose prioritization frame.
2. Recommend one framework and explain tradeoffs.
3. Output ranked backlog with rationale.
</process>

