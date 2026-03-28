---
name: brownfield-map-style
description: Map architecture and coding conventions, then curate approved patterns and anti-patterns for coding agents.
argument-hint: "[optional focus area, e.g. auth, api, billing]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - AskUserQuestion
---

<objective>
Create a safe brownfield coding baseline so agents reuse only good project patterns and avoid legacy bad code.
</objective>

<context>
Focus: $ARGUMENTS

References:
- @.claude/commands/fad/map-codebase.md
- @.planning/codebase/CONVENTIONS.md
- @.planning/codebase/ARCHITECTURE.md
- @.planning/codebase/CONCERNS.md

Outputs:
- `.planning/codebase/APPROVED-PATTERNS.md`
- `.planning/codebase/ANTI-PATTERNS.md`
- `.planning/codebase/BROWNFIELD-GUARDRAILS.md`
</context>

<process>
1. Ensure codebase map exists:
   - if `.planning/codebase/` docs are missing, run `/fad:map-codebase` first.
2. Read architecture, conventions, testing, and concerns documents.
3. Curate approved patterns:
   - patterns to follow for structure, naming, error handling, testing, and module boundaries.
   - each pattern must include at least one file-path example.
4. Curate anti-patterns:
   - known bad patterns in current codebase that must not be copied.
   - include migration-safe alternatives where possible.
5. Write guardrails file with explicit do/don't rules for coding agents.
6. Report readiness:
   - mapping status
   - curation status
   - unresolved ambiguities requiring human decision
</process>
