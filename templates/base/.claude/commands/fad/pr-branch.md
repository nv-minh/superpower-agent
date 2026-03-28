---
name: fad:pr-branch
description: Prepare a review-safe PR branch with planning noise filtered out.
argument-hint: "[target branch, default: main]"
allowed-tools:
  - Bash
  - Read
  - AskUserQuestion
---

<objective>
Create a clean branch for review so code reviewers are not forced through planning-only artifacts.
</objective>

<context>
Target: $ARGUMENTS

References:
- @.planning/setup/context-index.json
- @.planning/audit/
- @docs/FAD_PIPELINE.md
</context>

<process>
1. Resolve target branch (default `main`).
2. Inspect current branch and identify changes that belong to:
   - code/product behavior
   - planning/audit-only artifacts
3. Prepare a review-safe path:
   - if code and planning are already separated, keep current branch,
   - otherwise propose a dedicated PR branch that carries only review-relevant changes.
4. Do not silently drop user-authored artifacts.
5. Return:
   - recommended branch strategy
   - exact git steps to apply
   - files intentionally left out of review branch
</process>
