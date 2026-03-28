---
name: gsd:pr-branch
description: Compatibility shim routing legacy PR-branch requests to `/fad:pr-branch`.
argument-hint: "[target branch, default: main]"
allowed-tools:
  - Bash
  - Read
  - AskUserQuestion
---

<objective>
Preserve legacy PR-branch entrypoint while routing to the FAD branch-cleanup workflow.
</objective>

<process>
Execute the equivalent behavior defined by `/fad:pr-branch` using the same arguments.
</process>
