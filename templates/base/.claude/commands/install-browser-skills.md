---
name: install-browser-skills
description: Install and verify browser testing skills (agent-browser + playwright template skill).
argument-hint: "[optional repo root]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Install required browser testing skills and verify they are available for QA workflows.
</objective>

<context>
Root: $ARGUMENTS (default `.`)

References:
- @.claude/scripts/install_browser_skills.sh
- @.claude/templates/AUDIT-STEP-TEMPLATE.md
</context>

<process>
1. Resolve target root (default current workspace).
2. Run `.claude/scripts/install_browser_skills.sh <root>`.
3. Verify:
   - `.claude/skills/agent-browser/SKILL.md` exists.
   - `.claude/skills/playwright/SKILL.md` exists.
4. Write an audit log in `.planning/audit/` with install commands, versions, and result.
5. Return a short readiness summary and next recommended command (`setup-doctor` or `qa-only`).
</process>
