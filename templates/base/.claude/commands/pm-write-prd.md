---
name: pm-write-prd
description: Generate a decision-ready PRD using local PM workflow assets.
argument-hint: "<feature, initiative, or requirement>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
  - mcp__figma__*
---

<objective>
Produce or refine PRD artifacts using the local PM skill pack.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/pm/commands/write-prd.md
- @.claude/pm/skills/prd-development/SKILL.md
- @.claude/pm/skills/problem-statement/SKILL.md
- @.claude/pm/skills/user-story/SKILL.md
- @.claude/templates/RISK-IMPACT-TEMPLATE.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
</context>

<process>
1. Run PRD flow and ask clarifying questions where needed.
2. Ensure scope boundaries and measurable success criteria are explicit.
3. If requirement contains Figma links, call Figma MCP and capture evidence summary.
4. Update `.planning/pm/current/RISK-IMPACT.md` with initial risk hypotheses tied to requirement IDs.
5. Output should be ready to feed into `.planning/pm/current/PRD.md`.
6. Write a PM audit log entry in `.planning/audit/`.
</process>
