# Audit Log Directory

This directory stores per-step markdown audit logs for PM -> Build -> QC -> Deploy workflows.
It also stores logs for discovery/ui-handoff and optional document export steps.
It also stores PR feedback loop and code quality gate evidence.
It also stores security/health/incident/rollback operational evidence.

## Naming Convention
- `{timestamp}-{step}.md`
- Example: `2026-03-28T02-15-30Z-pm-intake.md`

## Required Fields
- metadata (run ID, step ID, status, timestamps)
- input references
- source-link ingest evidence (Jira/Confluence/Figma)
- MCP/tool evidence
- operational gate evidence (security scan, health check, rollback readiness)
- risk/impact state and decisions
- document export decision/output
- outputs and next action

Use template: `.claude/templates/AUDIT-STEP-TEMPLATE.md`.
