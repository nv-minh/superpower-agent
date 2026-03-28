# AI Delivery Pipeline (PM -> Build -> QC)

This repository is configured for a multi-agent workflow:

1. `brownfield-map-style` maps codebase and curates approved/anti patterns.
2. `discovery-ui-handoff` runs structured discovery -> UI concept -> UI contract -> handoff.
3. `pm-intake` captures requirement context and generates a PM handoff pack.
4. `pm-to-build` hands the pack to the FAD planning/execution lane.
5. `qc-verify-ui` runs browser-based functional and design-system critical checks.

High-leverage orchestration commands:
- `fad:pipeline` (unified brainstorming -> plan -> execute -> review -> optimize -> finish)
- `fad:optimize` (mandatory post-review optimization phase)
- `fad:quality-gate` (strict go/no-go gate before finish or ship)
- `feature-swarm` (parallel feature execution)
- `fix-issue` (parallel triage + targeted fix)
- `pr-feedback-loop` (GitHub PR comments -> fix -> QC retest)
- `review` (severity-first review workflow)
- `qa-only` (QA report without code changes)
- `code-quality-gate` (lint/typecheck/test gate with soft-skip policy)
- `setup-doctor` (one-shot setup checker for CLI/MCP/credentials)
- `install-browser-skills` (install agent-browser + playwright skills)
- `security-scan` (local-first security gate: dependency + secrets + optional SAST)
- `dependency-audit` (dependency-only vulnerability gate)
- `secrets-scan` (secret leakage detection gate)
- `health-check` (deep diagnostics from configurable checks)
- `setup-monitoring` (provider-agnostic alerts/dashboard baseline)
- `incident-response` (incident triage/containment/recovery workflow)
- `rollback` (rollback readiness + guarded rollback execution)
- `deploy` (gated release execution)
- `autopilot-loop` (bounded autonomous delivery cycles)
- `autoplan` (auto plan-review pipeline with consolidated decisions)
- `pm-delivery-loop` (legacy wrapper to `fad:pipeline`)
- `discovery-ui-handoff` (greenfield and brownfield-no-figma intake lane)
- `gen-doc-sheet` (optional spreadsheet export, EN/JA)
- `careful` / `freeze` / `guard` / `unfreeze` / `unguard` (safety controls)

## Artifact Contract

The PM handoff pack is always stored in `.planning/pm/current/`:

- `PRD.md` - product requirement with explicit requirement IDs.
- `SPRINT.md` - current sprint scope (one sprint maps to one phase).
- `STORIES.md` - implementation-ready user stories and acceptance criteria.
- `HANDOFF.md` - engineering constraints, design input, risk, test intent.
- `RISK-IMPACT.md` - risk register, brownfield impact map, mitigation decisions.
- `QC-REPORT.md` - QC gate output from browser verification.

Requirement ID format: `REQ-<DOMAIN>-<NNN>` (example: `REQ-AUTH-001`).

Discovery artifacts for structured intake are stored in `.planning/discovery/current/`:
- `IDEA-BRIEF.md`
- `PREMISE-CHECK.md`
- `ALTERNATIVES.md`
- `UI-CONCEPT.md`
- `UI-CONTRACT.md`

## Alignment Rules

- Every implementation plan task must reference requirement IDs.
- Every requirement ID in `PRD.md` must be covered by at least one task.
- Deferred/out-of-scope requirements must not appear in implementation tasks.
- New code must follow `.planning/codebase/APPROVED-PATTERNS.md`.
- Coding agents must avoid `.planning/codebase/ANTI-PATTERNS.md`.
- In-scope unresolved `high`/`critical` risks block execution until a user decision is recorded.

## TDD Rules

- TDD is mandatory for domain and API logic.
- Planner should mark relevant tasks with `tdd="true"`.
- UI-heavy tasks may use interaction/E2E verification instead of strict unit-first.

## Design + QC MCP Rules

- If requirement/handoff includes Figma links, agents must call Figma MCP before implementing/verifying UI structure.
- If brownfield requirement has no Figma input, run structured discovery/UI-contract lane before build.
- Figma MCP evidence must be written to handoff/audit artifacts; missing evidence is a gate failure.
- QC must use Browser MCP for interaction and DS-critical checks.
- Ship gate: functional pass + no DS-critical issues.

## External Link Ingest Rules

- If input contains Jira or Confluence links, ingest context using `.claude/scripts/atlassian_cli.py`.
- If input references a GitHub PR URL/number, ingest comments via `.claude/scripts/github_pr_feedback.py`.
- Link-ingest evidence must be recorded in audit logs.
- Jira status transition is optional and requires explicit user confirmation.

## Document Export Rules

- Spreadsheet export is optional and must be user-triggered.
- Use `.claude/commands/gen-doc-sheet.md` for `.xlsx` output.
- Default output mode is one workbook with `DELIVERY_EN` + `DELIVERY_JA`.

## Audit Logging Rules

- Every major step (`pm-intake`, `pm-to-build`, `autoplan`, `qc-verify-ui`, `review`, `fad:optimize`, `fad:quality-gate`, `deploy`, delivery/autopilot loops) must write one markdown audit log.
- Preferred layout: `.planning/audit/runs/<run-id>/` for each pipeline run (legacy flat logs still supported).
- Use `.claude/scripts/audit_log.py` as the default writer with `.claude/templates/AUDIT-STEP-TEMPLATE.md`.
- Minimum audit fields: metadata, inputs, MCP evidence, risk decisions, outputs, next action.

## Context Index Rules

- Install metadata lives in `.planning/setup/superpower-agent-install.json`.
- Local context inventory lives in `.planning/setup/context-index.json`.
- Prefer these indexed files before scanning the whole workspace tree.

## Code Quality Gate Rules

- After implementation (`pm-to-build`, `feature-swarm`, `fix-issue`), run `.claude/scripts/code_quality_gate.py`.
- Gate order: lint -> typecheck (if TS detected) -> test.
- Missing scripts are soft-skipped with audit evidence unless strict mode is explicitly requested.
- Failed quality gate blocks further release/QC progression until resolved.

## Security & Ops Gate Rules

- Before release lane, run `security-scan` (or `dependency-audit` + `secrets-scan`) and block on findings.
- Deploy requires passing `health-check` before and after rollout.
- Post-deploy health failure must trigger `incident-response` and rollback evaluation.
- Monitoring baseline should be configured through `setup-monitoring` using provider-agnostic adapters.
- Incident, rollback, and security outcomes must update `.planning/pm/current/RISK-IMPACT.md`.

## Expected External Assets

- Product skills vendor (synced local): `.claude/pm/`
- Source PM skills repo (for sync updates, `full` bundle only): `Product-Manager-Skills/`
- Legacy reference repo (`full` bundle only): `get-shit-done/`

## Rules

Global concern rules live in `.claude/rules/`:
- api-conventions
- code-style
- database
- error-handling
- git-workflow
- project-structure
- security
- testing
- agent-docs

## Agent Ops Assets

- `.claude/AGENTS.md` - operating contract for PM/build/QC/ops agents
- `.claude/instructions/ORCHESTRATION.md` - coordination logic
- `.claude/instructions/EXPERIMENTS.md` - instruction tuning log
- `.claude/memory/` - continuous loop memory state
- `.claude/templates/` - reusable review + QA checklists/report formats
- `.claude/state/` - careful/freeze state files used by hooks
- `.claude/config/health-check.json.example` - baseline health diagnostics schema
- `.claude/config/monitoring.json.example` - provider-agnostic monitoring schema
