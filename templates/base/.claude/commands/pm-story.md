---
name: pm-story
description: Generate user stories and splitting decisions using local PM skills.
argument-hint: "<feature or epic context>"
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
Create implementation-ready user stories with acceptance criteria and split strategy.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/pm/skills/user-story/SKILL.md
- @.claude/pm/skills/user-story-splitting/SKILL.md
- @.claude/pm/skills/user-story-mapping/SKILL.md
- @.planning/pm/current/RISK-IMPACT.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
</context>

<process>
1. Draft stories in usable engineering format.
2. Split oversized stories.
3. Attach linked risk IDs and mitigation notes to each story where relevant.
4. Highlight acceptance criteria gaps and open questions.
5. Write story-generation audit log entry in `.planning/audit/`.
</process>
