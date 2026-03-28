# FAD Pipeline Guide

`/fad:pipeline` is the primary end-to-end command for delivery orchestration.

![FAD Pipeline Overview](./assets/fad-pipeline-overview.svg)

It standardizes one strict path:

1. Brainstorm and requirement shaping
2. Build planning and execution
3. Review (severity-first)
4. Optimize (no behavior drift)
5. Strict quality gate
6. Finish branch / ship readiness

The intended behavior is staged, not fire-and-forget:

- brainstorm or intake should discuss with the user first,
- every major phase should end with a concise summary,
- the user should be asked to confirm before the pipeline moves to the next phase.

## Command

```bash
/fad:pipeline "<requirement-or-phase>" [--mode brownfield|greenfield] [--with-figma auto|off] [--strict] [--doc-export off|en|ja]
```

## Phase Contract

| Phase | Primary Command/Action | Block Condition |
|---|---|---|
| Brainstorm | `discovery-ui-handoff` or `pm-intake` | Missing requirement clarity |
| Build | `pm-to-build` | High/Critical unresolved in-scope risk |
| QC Verify | `qc-verify-ui` | Functional/DS-critical failure |
| Review | `review` | Blocker findings unresolved |
| Optimize | `fad:optimize` | Behavior-changing refactor request |
| Strict Gate | `fad:quality-gate` | lint/type/test/security/risk failure |
| Finish | `fad:pr-branch` or `fad:ship` | Any strict gate still red |

## Interactive Checkpoints

Each major phase should end with:

- what changed,
- what the user should verify,
- blockers or open decisions,
- the recommended next command.

The pipeline should then explicitly ask whether to:

- continue,
- revise the current step,
- stop after the current step.

The pipeline should not auto-generate later artifacts while the current phase is still unapproved.

## Brownfield and Greenfield

- Brownfield:
  - Requires approved/anti-pattern mapping before execution.
  - Risk/impact updates are mandatory in `.planning/pm/current/RISK-IMPACT.md`.
- Greenfield:
  - Discovery lane generates UI concept + UI contract before build.
  - Optional document export can be triggered by user.

## Figma and External Inputs

- If Figma links are present, Figma evidence is required before UI implementation and QC closure.
- Jira/Confluence links can be ingested through Atlassian helper scripts.
- PR URL/number feedback loops should route through `pr-feedback-loop` and then re-enter strict gate.

## Strict Gate Policy

`/fad:quality-gate` is a mandatory stop/go checkpoint:

- `code_quality_gate.py` with strict missing-script policy
- `security_scan.py` (`--fail-on high`)
- `secrets_scan.py`
- unresolved high/critical risk checks
- review blocker/high confirmation

Result must be explicit:

- `DONE`: all strict checks passed
- `BLOCKED`: at least one strict check failed

## Language Behavior

- Working artifacts should use the same language as the user conversation by default.
- Discovery and PM lanes should lock the working language in `LANGUAGE.md`.
- Optional document export (`gen-doc-sheet`) can use `en` or `ja`, but that should not silently change the language of PRD, sprint, stories, handoff, or discovery artifacts.

## Example Runs

Brownfield feature:

```bash
/fad:pipeline "Add invoice approval flow with audit trail" --mode brownfield --strict
```

Greenfield from rough idea:

```bash
/fad:pipeline "Build a minimalist expense tracker for freelancers" --mode greenfield --doc-export en
```

## Compatibility and Migration

- `/pm-delivery-loop` remains available as a wrapper.
- `full` bundle adds deeper planning/workstream commands under the same `/fad:*` namespace.
- Branding and default entrypoint remain `/fad:*`.
