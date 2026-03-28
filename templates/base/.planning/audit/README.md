# Audit Log Directory

This directory stores per-step markdown audit logs for PM -> Build -> QC -> Deploy workflows.
It also stores logs for discovery/ui-handoff and optional document export steps.
It also stores PR feedback loop and code quality gate evidence.
It also stores security/health/incident/rollback operational evidence.
Unified FAD pipeline runs are grouped by run ID under `runs/<run-id>/`.

## Naming Convention
- `runs/<run-id>/{timestamp}-{step}.md`
- Example: `runs/20260328T052100Z-a1b2c3/2026-03-28T05-21-00Z-fad-pipeline-start.md`
- Legacy flat files in `.planning/audit/*.md` are still accepted for backward compatibility.

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
Recommended logger: `.claude/scripts/audit_log.py`.
