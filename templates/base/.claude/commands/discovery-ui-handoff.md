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
- @.claude/commands/gsd/new-project.md
- @.claude/commands/gsd/ui-phase.md
- @.claude/commands/pm-to-build.md
- @.claude/commands/qc-verify-ui.md
- @.claude/commands/gen-doc-sheet.md
- @.claude/scripts/atlassian_cli.py
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
- @.planning/discovery/current/
</context>

<process>
1. Parse input and detect URLs. If Jira/Confluence links are present, fetch context via `.claude/scripts/atlassian_cli.py fetch --url <link>` and add a short source summary to discovery artifacts.
2. Determine project mode:
   - greenfield: run full discovery flow,
   - brownfield with no Figma link: also run full discovery flow,
   - brownfield with Figma link: prioritize existing Figma-driven constraints.
3. Run structured brainstorming with explicit gates:
   - clarify goals/users/constraints,
   - challenge premises,
   - generate 2-3 alternatives,
   - lock chosen direction.
4. Write discovery artifacts:
   - `.planning/discovery/current/IDEA-BRIEF.md`
   - `.planning/discovery/current/PREMISE-CHECK.md`
   - `.planning/discovery/current/ALTERNATIVES.md`
   - `.planning/discovery/current/UI-CONCEPT.md`
   - `.planning/discovery/current/UI-CONTRACT.md`
5. UI contract gate:
   - if Figma link exists, require Figma MCP evidence in the UI contract,
   - if no Figma link, derive UI contract from requirement + DS constraints + acceptance criteria.
6. Generate/update PM handoff artifacts (`PRD`, `SPRINT`, `STORIES`, `HANDOFF`, `RISK-IMPACT`) using the selected discovery direction.
7. Ask whether to export spreadsheet document:
   - if yes, run `gen-doc-sheet`,
   - if no, mark `doc_export = skipped`.
8. Continue to build/QC steps or recommend next command:
   - `pm-to-build <phase>`
   - `qc-verify-ui <phase>`
9. Write audit log under `.planning/audit/` with:
   - input links + extracted context,
   - selected direction + rejected alternatives,
   - UI contract gate status,
   - document export decision.
</process>
