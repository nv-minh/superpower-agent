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
1. Resolve the working language:
   - detect the dominant language from the latest user message,
   - if `.planning/pm/current/LANGUAGE.md` exists, reuse it unless the user explicitly asks to switch,
   - keep all questions, summaries, and generated PM artifacts in that working language.
2. Start in conversation mode:
   - ask short clarifying questions until requirement scope, user segment, KPI, constraints, and timeline are concrete,
   - keep the question rounds compact and focused,
   - do not generate the full PM pack yet.
3. Parse external links from requirement context:
   - if Jira/Confluence links exist, fetch context via `.claude/scripts/atlassian_cli.py fetch`,
   - include extracted summary/acceptance details in PM discovery context.
4. Present an intake checkpoint in the working language:
   - scope summary,
   - intended users and success criteria,
   - constraints and timeline,
   - unresolved questions,
   - notable risks/assumptions.
5. Ask the user to approve, revise, or stop.
   - only continue after explicit approval,
   - if the user only wants requirement discussion, stop here.
6. Build requirement IDs using `REQ-<DOMAIN>-<NNN>`.
7. Extract all external design links from requirement context. If any link is Figma:
   - call Figma MCP for each unique link before finalizing artifacts,
   - capture evidence (`file/key`, page/frame names, key tokens/components used),
   - if Figma MCP fails, mark build readiness as blocked.
8. Produce the PM pack in the working language:
   - `.planning/pm/current/LANGUAGE.md`
   - a concise PRD with measurable success criteria and explicit non-goals,
   - one sprint pack mapped to one implementation phase,
   - implementation-ready stories and acceptance criteria with requirement trace.
9. Generate `.planning/pm/current/RISK-IMPACT.md` using `RISK-IMPACT-TEMPLATE`:
   - include risk register + brownfield impact map,
   - classify severity (`low/medium/high/critical`),
   - list required user decisions for unresolved high/critical risks.
10. Update `.claude/memory/DECISIONS.md` with:
   - key scope decisions,
   - accepted/rejected options,
   - unresolved decision owners.
11. Write these files:
    - `.planning/pm/current/LANGUAGE.md`
    - `.planning/pm/current/PRD.md`
    - `.planning/pm/current/SPRINT.md`
    - `.planning/pm/current/STORIES.md`
    - `.planning/pm/current/HANDOFF.md`
    - `.planning/pm/current/RISK-IMPACT.md`
12. Write one step audit log in `.planning/audit/` using `AUDIT-STEP-TEMPLATE`:
    - include questions asked, requirement assumptions, working language, checkpoint approval state, link-ingest evidence, Figma MCP evidence, and risk gate state.
13. End with a staged readiness report in the working language:
   - ready for build: yes/no
   - risk gate: pass/blocked
   - blockers
   - open questions
   - what the user should verify now
   - recommended next command
14. Explicitly ask whether to continue to `pm-to-build`, revise the PM pack, or stop.
</process>
