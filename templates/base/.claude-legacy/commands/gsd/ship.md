---
name: gsd:ship
description: Compatibility shim routing legacy ship requests to `/fad:ship`.
argument-hint: "[phase, milestone, or release name]"
allowed-tools:
  - Read
  - Bash
  - Grep
  - Glob
  - Write
  - AskUserQuestion
---

<objective>
Preserve legacy ship entrypoint while routing to the FAD ship-readiness workflow.
</objective>

<process>
Execute the equivalent behavior defined by `/fad:ship` using the same arguments.
</process>
