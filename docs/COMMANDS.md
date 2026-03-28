# Commands Reference

This package installs command contracts under `.claude/commands`.

Decision guides:

- [`COMMAND_DECISION_GUIDE.en.md`](./COMMAND_DECISION_GUIDE.en.md)
- [`COMMAND_DECISION_GUIDE.vi.md`](./COMMAND_DECISION_GUIDE.vi.md)

## Namespace

- Primary command namespace: `/fad:*`
- `full` bundle adds extended `/fad:*` planning and workstream commands

## CLI Visibility

| Command | Primary Use |
|---|---|
| `superpower-agent estimate --bundle <bundle>` | Estimate bundle footprint before install |
| `superpower-agent inspect --dir <target>` | Inspect an installed project and its context index |

## FAD Unified Pipeline

| Command | Primary Use |
|---|---|
| `fad:pipeline` | End-to-end workflow: brainstorm -> plan/build -> review -> optimize -> quality gate -> finish |
| `fad:help` | Primary branded entrypoint and command map |
| `fad:map-codebase` | Brownfield mapping without full legacy vendor dependency |
| `fad:pr-branch` | Prepare a review-safe branch |
| `fad:ship` | Ship-readiness workflow after strict gate passes |
| `fad:optimize` | Mandatory post-review optimization pass (no behavior changes) |
| `fad:quality-gate` | Strict branch gate combining lint/typecheck/test + security + unresolved-risk checks |

Reference docs:
- [`BUNDLES.md`](./BUNDLES.md)
- [`RUNTIME_ADAPTERS.md`](./RUNTIME_ADAPTERS.md)
- [`FAD_PIPELINE.md`](./FAD_PIPELINE.md)
- [`AUDIT_LOGGING.md`](./AUDIT_LOGGING.md)

## PM / Discovery

| Command | Primary Use |
|---|---|
| `pm-intake` | Requirement discussion and PM handoff pack generation |
| `discovery-ui-handoff` | Structured discovery for raw/greenfield/no-figma input |
| `pm-discover` | PM discovery process entrypoint |
| `pm-write-prd` | PRD generation |
| `pm-plan-roadmap` | Roadmap/sprint sequencing |
| `pm-prioritize` | Prioritization workflow |
| `pm-strategy` | Strategy framing workflow |
| `pm-story` | User story generation/splitting |
| `brownfield-map-style` | Approved/anti pattern curation for brownfield |
| `autoplan` | Automated plan-review pipeline |

## Build / Review / QC

| Command | Primary Use |
|---|---|
| `pm-to-build` | Convert PM pack to execution |
| `feature-swarm` | Parallelized feature implementation |
| `fix-issue` | Root-cause-first issue remediation |
| `review` | Severity-first code review |
| `qc-verify-ui` | Browser and DS-critical QC gate |
| `qa-only` | Report-only QA mode (no code mutation) |
| `pr-feedback-loop` | GitHub PR comments -> fix -> re-verify |
| `code-quality-gate` | Standalone lint/typecheck/test gate |

## Ops / Security / Reliability

| Command | Primary Use |
|---|---|
| `setup-doctor` | Setup diagnostics for CLI/MCP/credentials |
| `setup-monitoring` | Provider-agnostic monitoring baseline |
| `security-scan` | Security gate (dependency + optional SAST + secrets flow) |
| `dependency-audit` | Dependency-focused vulnerability check |
| `secrets-scan` | Secret leakage detection |
| `health-check` | Deep health diagnostics |
| `deploy` | Gated deployment workflow |
| `incident-response` | Incident triage and recovery |
| `rollback` | Rollback readiness + execution workflow |

## Orchestration / Safety

| Command | Primary Use |
|---|---|
| `pm-delivery-loop` | Legacy wrapper that routes to `fad:pipeline` |
| `autopilot-loop` | Bounded autonomous cycles |
| `gen-doc-sheet` | Optional EN/JA spreadsheet export |
| `careful` / `freeze` / `guard` | Session safety controls |
| `unfreeze` / `unguard` | Safety control release |

## Skill/Environment utility

| Command | Primary Use |
|---|---|
| `install-browser-skills` | Install `agent-browser` + `playwright` skill bundles |
