---
name: discovery-ui-handoff
description: Unified requirement-to-handoff flow for greenfield and brownfield without Figma input.
argument-hint: "<requirement text, ticket link, or initiative>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - AskUserQuestion
  - WebFetch
  - mcp__figma__*
---

<objective>
Run a structured path from simple requirement -> brainstorming -> UI proposal -> UI contract -> build/QC handoff.
</objective>

<context>
Input: $ARGUMENTS

References:
- @.claude/commands/pm-intake.md
- @.claude/commands/brownfield-map-style.md
- @.claude/commands/pm-to-build.md
- @.claude/commands/qc-verify-ui.md
- @.claude/commands/gen-doc-sheet.md
- @.claude/scripts/atlassian_cli.py
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
- @.planning/discovery/current/
</context>

<process>
1. Resolve the working language:
   - detect the dominant language from the latest user message,
   - if `.planning/discovery/current/LANGUAGE.md` exists, reuse it unless the user explicitly asks to switch,
   - keep all questions, summaries, and generated discovery artifacts in that working language.
2. Parse input and detect URLs. If Jira/Confluence links are present, fetch context via `.claude/scripts/atlassian_cli.py fetch --url <link>` and add a short source summary to discovery context.
3. Determine project mode:
   - greenfield: run full discovery flow,
   - brownfield with no Figma link: also run full discovery flow,
   - brownfield with Figma link: prioritize existing Figma-driven constraints.
4. Run conversation-first brainstorming before writing final artifacts:
   - ask short clarifying questions about goals, users, constraints, success criteria, and assumptions,
   - challenge weak premises,
   - generate 2-3 alternatives with explicit tradeoffs,
   - recommend one direction, but do not finalize PM artifacts yet.
5. Present a brainstorm checkpoint in the working language:
   - problem framing,
   - target users and success criteria,
   - alternatives + tradeoffs,
   - recommended direction,
   - open questions or risks.
6. Ask the user to approve, revise, or stop.
   - do not continue until the user confirms the chosen direction,
   - if the user only wants brainstorming/discussion, stop here after saving only lightweight discovery notes.
7. After approval, write discovery artifacts:
   - `.planning/discovery/current/LANGUAGE.md`
   - `.planning/discovery/current/IDEA-BRIEF.md`
   - `.planning/discovery/current/PREMISE-CHECK.md`
   - `.planning/discovery/current/ALTERNATIVES.md`
   - `.planning/discovery/current/UI-CONCEPT.md`
   - `.planning/discovery/current/UI-CONTRACT.md`
8. UI contract gate:
   - if Figma link exists, require Figma MCP evidence in the UI contract,
   - if no Figma link, derive UI contract from requirement + DS constraints + acceptance criteria.
9. Present a UI checkpoint in the working language:
   - chosen UI direction,
   - DS constraints,
   - Figma evidence or inferred contract basis,
   - what the user should verify next.
10. Ask the user whether the UI direction is approved.
   - only after approval, generate/update PM handoff artifacts,
   - if the user wants to stop after UI contract, recommend `pm-intake` or `pm-to-build` as the next step and stop.
11. Generate/update PM handoff artifacts (`PRD`, `SPRINT`, `STORIES`, `HANDOFF`, `RISK-IMPACT`) in the same working language using the approved discovery direction.
12. Ask whether to export spreadsheet document:
   - if yes, run `gen-doc-sheet`,
   - if no, mark `doc_export = skipped`.
13. End with a staged handoff checkpoint:
   - summarize which files were created or updated,
   - state whether handoff is ready for build,
   - recommend the next command,
   - explicitly ask whether to continue to `pm-to-build` now or stop.
14. Write audit log under `.planning/audit/` with:
   - input links + extracted context,
   - selected direction + rejected alternatives,
   - working language,
   - checkpoint approvals,
   - UI contract gate status,
   - document export decision,
   - recommended next step.
</process>
