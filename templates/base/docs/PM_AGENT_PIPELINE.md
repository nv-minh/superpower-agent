# PM Agent Pipeline Runbook

## What Was Added
- Custom Claude commands in `.claude/commands/`:
  - `fad/pipeline`
  - `fad/optimize`
  - `fad/quality-gate`
  - `brownfield-map-style`
  - `feature-swarm`
  - `discovery-ui-handoff`
  - `install-browser-skills`
  - `setup-doctor`
  - `code-quality-gate`
  - `security-scan`
  - `dependency-audit`
  - `secrets-scan`
  - `health-check`
  - `setup-monitoring`
  - `incident-response`
  - `rollback`
  - `pr-feedback-loop`
  - `gen-doc-sheet`
  - `pm-intake`
  - `pm-discover`
  - `pm-write-prd`
  - `pm-plan-roadmap`
  - `pm-prioritize`
  - `pm-strategy`
  - `pm-story`
  - `pm-to-build`
  - `qc-verify-ui`
  - `qa-only`
  - `pm-delivery-loop`
  - `fix-issue`
  - `review`
  - `deploy`
  - `autoplan`
  - `autopilot-loop`
  - `careful`
  - `freeze`
  - `guard`
  - `unfreeze`
  - `unguard`
- Local PM framework vendor path: `.claude/pm/{commands,skills}` (curated subset in lean bundles, full sync source in `full`)
- FAD agent skill policies in `skills/` for planner, executor, checker, verifier.
- PM handoff artifact contract in `.planning/pm/current/`.
- FAD config with `agent_skills` mapping in `.planning/config.json`.

## Daily Flow
1. Run `/setup-monitoring` once per project/environment baseline.
2. Run `/fad:pipeline "<requirement or phase>"` as the default end-to-end flow.
3. Resolve any strict-gate blockers (`review`, `fad:optimize`, `fad:quality-gate`).
4. Optional: run `/gen-doc-sheet ...` only when document export is needed.
5. For PR-driven fix loop: run `/pr-feedback-loop <pr-url-or-number>`.
6. Run `/deploy <env>` only after strict gate passes.

## Artifact Set
- `.planning/pm/current/PRD.md`
- `.planning/pm/current/SPRINT.md`
- `.planning/pm/current/STORIES.md`
- `.planning/pm/current/HANDOFF.md`
- `.planning/pm/current/RISK-IMPACT.md`
- `.planning/pm/current/QC-REPORT.md`
- `.planning/discovery/current/*` (structured discovery + UI contract)
- `.planning/exports/*.xlsx` (optional export)
- `.planning/audit/runs/<run-id>/*.md` (per-step logs, preferred)

## New Runbooks

- `docs/BUNDLES.md`
- `docs/FAD_PIPELINE.md`
- `docs/AUDIT_LOGGING.md`

## High-Leverage Ops Flows
- `/feature-swarm <feature>` for parallel implementation across non-overlapping scopes.
- `/fix-issue <issue>` for root-cause-first remediation.
- `/pr-feedback-loop <pr>` for GitHub review-comment intake -> fix -> QC.
- `/code-quality-gate` for standalone lint/typecheck/test verification.
- `/security-scan` for release security gate with local-first scanners.
- `/health-check` for deep pre/post deploy diagnostics.
- `/incident-response <summary>` for incident containment and recovery logging.
- `/rollback [target]` for rollback readiness + guarded execution.
- `/review [scope]` for severity-first review output.
- `/deploy <env>` for gated release checks and rollout.
- `/autoplan <feature>` for automated review pipeline before execute.
- `/autopilot-loop [cycles]` for bounded autonomous delivery cycles.
- `/fad:pipeline <requirement>` for unified phase orchestration.
- `/fad:optimize [scope]` for mandatory post-review optimization.
- `/fad:quality-gate` for strict go/no-go before finish or ship.
- `/qa-only <context>` for report-only QA when no code mutation is desired.
- `/setup-doctor` for one-shot setup validation.
- `/install-browser-skills` to install browser QA skills.

## Prerequisites
- FAD commands installed and available in Claude Code.
- PM assets are available locally in `.claude/pm/`.
- Full source sync (`.claude/scripts/sync-pm-assets.sh`) is only relevant when the `full` bundle includes `Product-Manager-Skills`.
- MCP servers enabled:
  - `figma`
  - `browser`
- Atlassian API credentials for Jira/Confluence ingest and optional Jira transition:
  - `ATLASSIAN_BASE_URL`
  - `ATLASSIAN_EMAIL`
  - `ATLASSIAN_API_TOKEN`
- GitHub CLI authenticated (`gh auth status`) for PR feedback ingestion.
- Ops config templates copied:
  - `.claude/config/health-check.json`
  - `.claude/config/monitoring.json`

Current local settings include:
- `postgresql`
- `figma`
- `browser`

## Gate Definition
- Build/ship is considered ready only when:
  - brownfield guardrails are curated and current,
  - PM requirement trace is complete,
  - no unresolved in-scope high/critical risk remains,
  - if Figma links exist, Figma MCP evidence is captured,
  - if Jira/Confluence links were provided, ingest evidence is captured,
  - implementation verification passes,
  - code quality gate (`lint`, `typecheck` if TS, `test`) passes,
  - security gate (`security-scan`) is not blocked,
  - deploy-time health checks are configured and passing,
  - QC report has no functional or DS-critical blockers,
  - required audit logs are written per step.
