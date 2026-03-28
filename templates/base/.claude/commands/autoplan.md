---
name: autoplan
description: Run a full plan-review pipeline automatically (PM + architecture + design + testability) and surface only high-leverage decisions.
argument-hint: "<feature or requirement context>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - AskUserQuestion
  - mcp__figma__*
---

<objective>
Reduce review overhead by automating plan review stages and escalating only taste/strategy tie-breakers.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/commands/pm-intake.md
- @.claude/commands/discovery-ui-handoff.md
- @.claude/commands/brownfield-map-style.md
- @.claude/commands/pm-plan-roadmap.md
- @.claude/commands/review.md
- @.claude/instructions/ORCHESTRATION.md
- @.planning/pm/current/RISK-IMPACT.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
- @.planning/audit/README.md
</context>

<process>
1. Ensure intake artifacts are current:
   - for greenfield or brownfield without Figma input, prefer `discovery-ui-handoff`,
   - otherwise use `pm-intake`.
2. Ensure risk-impact artifact is current and contains explicit high/critical handling decisions.
3. Ensure brownfield guardrails are current.
4. If requirement/handoff includes Figma links, require Figma MCP evidence before closing design/system review.
5. Run plan review pipeline sequentially:
   - product/requirement clarity
   - risk and brownfield impact completeness
   - architecture and dependency sanity
   - design/system constraints
   - testability and verification completeness
6. Auto-resolve mechanical decisions where confidence is high.
7. Surface only unresolved high-leverage decisions in one consolidated AskUserQuestion.
8. Write an audit log file in `.planning/audit/` using `AUDIT-STEP-TEMPLATE`.
9. Output:
   - reviewed plan status
   - risk gate status
   - blockers
   - explicit next action (execute-phase, revise-plan, or defer)
</process>
