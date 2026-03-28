---
name: feature-swarm
description: Execute a feature as coordinated parallel workstreams with integration and verification gates.
argument-hint: "<feature objective>"
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
Operate at feature level by delegating independent workstreams to parallel agents.
</objective>

<context>
Feature: $ARGUMENTS

References:
- @.claude/rules/project-structure.md
- @.claude/rules/testing.md
- @.planning/pm/current/PRD.md
- @.planning/pm/current/STORIES.md
- @.planning/pm/current/RISK-IMPACT.md
- @.claude/scripts/code_quality_gate.py
- @.claude/commands/security-scan.md
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
</context>

<process>
1. Decompose feature into independent workstreams (API, UI, tests, docs, integration).
2. Spawn parallel agents for disjoint write scopes.
3. Keep one integration lane that only merges/reconciles outputs.
4. Gate merge by:
   - requirement coverage
   - test pass
   - risk mitigation coverage
   - brownfield guardrail compliance
5. Run post-merge quality gate:
   - `python3 .claude/scripts/code_quality_gate.py --out .planning/pm/current/CODE-QUALITY-GATE.json --pretty`
6. Run post-merge security gate:
   - run `security-scan`,
   - block release lane if gate is blocked.
7. Publish a unified implementation summary and next-step checklist.
8. Write swarm execution audit log in `.planning/audit/`.
</process>
