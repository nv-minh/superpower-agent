---
name: pm-strategy
description: Run strategy workflow from local PM commands and skills.
argument-hint: "<product strategy context>"
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
Generate strategic direction artifacts before roadmap and execution planning.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/pm/commands/strategy.md
- @.claude/pm/skills/product-strategy-session/SKILL.md
- @.claude/pm/skills/positioning-workshop/SKILL.md
</context>

<process>
1. Run strategy workflow.
2. Extract explicit outcomes and strategic constraints.
3. Prepare outputs for roadmap and PRD handoff.
</process>

