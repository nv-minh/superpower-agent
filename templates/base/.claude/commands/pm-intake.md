---
name: pm-intake
description: Discuss a requirement and generate the PM handoff pack (PRD, sprint, stories, engineering handoff).
argument-hint: "<requirement, feature request, or initiative>"
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
Run a PM discovery-to-spec flow and output a build-ready sprint pack.
</objective>

<context>
Requirement: $ARGUMENTS

Primary PM references:
- @.claude/pm/commands/write-prd.md
- @.claude/pm/commands/plan-roadmap.md
- @.claude/pm/skills/problem-statement/SKILL.md
- @.claude/pm/skills/prd-development/SKILL.md
- @.claude/pm/skills/user-story/SKILL.md
- @.claude/pm/skills/user-story-splitting/SKILL.md
- @.claude/rules/testing.md
- @.claude/templates/RISK-IMPACT-TEMPLATE.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
- @.claude/scripts/atlassian_cli.py
- @.claude/memory/DECISIONS.md

Output directory:
- @.planning/pm/current/
- @.planning/audit/
</context>

<process>
1. Ask clarifying questions until requirement scope, user segment, KPI, constraints, and timeline are concrete.
2. Parse external links from requirement context:
   - if Jira/Confluence links exist, fetch context via `.claude/scripts/atlassian_cli.py fetch`,
   - include extracted summary/acceptance details in PM discovery context.
3. Build requirement IDs using `REQ-<DOMAIN>-<NNN>`.
4. Extract all external design links from requirement context. If any link is Figma:
   - call Figma MCP for each unique link before finalizing artifacts,
   - capture evidence (`file/key`, page/frame names, key tokens/components used),
   - if Figma MCP fails, mark build readiness as blocked.
5. Produce a concise PRD with measurable success criteria and explicit non-goals.
6. Produce one sprint pack mapped to one implementation phase.
7. Generate implementation-ready stories and acceptance criteria with requirement trace.
8. Generate `.planning/pm/current/RISK-IMPACT.md` using `RISK-IMPACT-TEMPLATE`:
   - include risk register + brownfield impact map,
   - classify severity (`low/medium/high/critical`),
   - list required user decisions for unresolved high/critical risks.
9. Update `.claude/memory/DECISIONS.md` with:
   - key scope decisions,
   - accepted/rejected options,
   - unresolved decision owners.
10. Write these files:
   - `.planning/pm/current/PRD.md`
   - `.planning/pm/current/SPRINT.md`
   - `.planning/pm/current/STORIES.md`
   - `.planning/pm/current/HANDOFF.md`
   - `.planning/pm/current/RISK-IMPACT.md`
11. Write one step audit log in `.planning/audit/` using `AUDIT-STEP-TEMPLATE`:
   - include questions asked, requirement assumptions, link-ingest evidence, Figma MCP evidence, and risk gate state.
12. End with a short readiness report:
   - ready for build: yes/no
   - risk gate: pass/blocked
   - blockers
   - open questions
</process>
